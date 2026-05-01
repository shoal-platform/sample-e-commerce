"use client";

import Image from "next/image";
import type { CartItem } from "@/types";
import { calculateOrderTotal, formatPrice, getShippingCost } from "@/lib/utils";

interface OrderSummaryProps {
  items: CartItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = getShippingCost(subtotal);
  const { tax, total } = calculateOrderTotal(subtotal, shipping);

  return (
    <aside className="sticky top-24 overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/30 px-5 py-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      <div className="max-h-[360px] divide-y overflow-y-auto">
        {items.map((item) => {
          const image = item.product.images[0] || "/placeholder-product.jpg";

          return (
            <div key={item.id} className="flex gap-3 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={image}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.product.name}</p>
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <p>Qty: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                </div>
              </div>
              <div className="text-sm font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t p-5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600 dark:text-green-400" : ""}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between border-t pt-3 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}
