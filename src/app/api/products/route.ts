import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "12");
    const featured = searchParams.get("featured");
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (featured === "true") {
      where.featured = true;
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "rating-desc":
        orderBy = { rating: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
    }

    const [rawProducts, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: perPage,
      }),
      db.product.count({ where }),
    ]);

    const products = rawProducts.map((p) => ({
      ...p,
      images: parseProductImages(p.images),
      sizes: parseProductSizes(p.sizes),
      colors: parseProductColors(p.colors),
    }));

    return NextResponse.json({
      data: products,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional().nullable(),
  images: z.array(z.string()).min(1),
  categoryId: z.string(),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createProductSchema.parse(body);

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now();

    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        images: JSON.stringify(data.images),
        categoryId: data.categoryId,
        stock: data.stock,
        featured: data.featured,
        sizes: data.sizes ? JSON.stringify(data.sizes) : null,
        colors: data.colors ? JSON.stringify(data.colors) : null,
        brand: data.brand,
        sku: data.sku,
        weight: data.weight,
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...product,
      images: parseProductImages(product.images),
      sizes: parseProductSizes(product.sizes),
      colors: parseProductColors(product.colors),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
