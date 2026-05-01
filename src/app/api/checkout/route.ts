import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getShippingCost, calculateOrderTotal } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  shipping: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, shipping } = checkoutSchema.parse(body);

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = getShippingCost(subtotal);
    const { tax, total } = calculateOrderTotal(subtotal, shippingCost);

    // Create payment intent with Stripe
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe uses cents
      currency: "usd",
      metadata: {
        userId: session?.user?.id || "guest",
        customerEmail: shipping.email,
        customerName: `${shipping.firstName} ${shipping.lastName}`,
      },
      receipt_email: shipping.email,
      shipping: {
        name: `${shipping.firstName} ${shipping.lastName}`,
        phone: shipping.phone,
        address: {
          line1: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.zip,
          country: shipping.country,
        },
      },
    });

    // Create pending order in database
    if (session?.user?.id) {
      const order = await db.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          subtotal,
          shipping: shippingCost,
          tax,
          total,
          stripePaymentId: paymentIntent.id,
          shippingName: `${shipping.firstName} ${shipping.lastName}`,
          shippingEmail: shipping.email,
          shippingPhone: shipping.phone,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingZip: shipping.zip,
          shippingCountry: shipping.country,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid checkout data", details: error.errors },
        { status: 400 }
      );
    }
    if (
      error instanceof Error &&
      error.message === "STRIPE_SECRET_KEY is not configured"
    ) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
