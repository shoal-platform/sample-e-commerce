import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      images: parseProductImages(product.images),
      sizes: parseProductSizes(product.sizes),
      colors: parseProductColors(product.colors),
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional().nullable(),
  images: z.array(z.string()).min(1).optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateProductSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.sizes) updateData.sizes = JSON.stringify(data.sizes);
    if (data.colors) updateData.colors = JSON.stringify(data.colors);

    const product = await db.product.update({
      where: { id: params.id },
      data: updateData,
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
    console.error("Product PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Soft delete by setting isActive to false
    await db.product.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
