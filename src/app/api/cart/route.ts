import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ data: [] });
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { category: true } } },
    });

    return NextResponse.json({
      data: cartItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: parseProductImages(item.product.images),
          sizes: parseProductSizes(item.product.sizes),
          colors: parseProductColors(item.product.colors),
        },
      })),
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
  size: z.string().optional(),
  color: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, size, color } = addToCartSchema.parse(body);

    const existing = await db.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        size: size ?? null,
        color: color ?? null,
      },
    });

    if (existing) {
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json({ data: updated });
    }

    const item = await db.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
        size,
        color,
      },
    });

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (itemId) {
      await db.cartItem.deleteMany({
        where: { id: itemId, userId: session.user.id },
      });
    } else {
      // Clear all cart items
      await db.cartItem.deleteMany({ where: { userId: session.user.id } });
    }

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
