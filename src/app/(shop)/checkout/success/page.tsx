import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ShoppingBag, Home } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

interface Props {
  searchParams: { orderId?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { orderId } = searchParams;

  let order = null;
  if (orderId) {
    order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center space-y-4 mb-10">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase. We&apos;ve received your order and it&apos;s
          being processed.
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground">
            Order ID:{" "}
            <span className="font-mono font-medium text-foreground">
              {orderId}
            </span>
          </p>
        )}
      </div>

      {order && (
        <div className="border rounded-xl overflow-hidden mb-8">
          <div className="bg-muted/30 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Order Summary</h2>
              <span className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                    {item.size && ` · Size: ${item.size}`}
                    {item.color && ` · Color: ${item.color}`}
                  </p>
                </div>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-muted/30 px-6 py-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* What happens next */}
      <div className="border rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-4">What happens next?</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-0.5">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Order Processing</p>
              <p className="text-xs text-muted-foreground">
                We&apos;re preparing your items for shipment (1-2 business days)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-0.5">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Shipping Confirmation</p>
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive a tracking number once shipped
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Package className="h-4 w-4" />
            View Orders
          </Button>
        </Link>
        <Link href="/">
          <Button className="w-full sm:w-auto gap-2">
            <Home className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
