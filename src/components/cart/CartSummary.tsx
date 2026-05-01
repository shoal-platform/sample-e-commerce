"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { formatPrice, getShippingCost, calculateOrderTotal } from "@/lib/utils";
import { Shield, Truck, Tag } from "lucide-react";
import { useState } from "react";

export function CartSummary() {
  const { getTotalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = getTotalPrice();
  const shipping = getShippingCost(subtotal);
  const couponDiscount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const { tax, total } = calculateOrderTotal(
    subtotal - couponDiscount,
    shipping
  );

  const handleApplyCoupon = () => {
    // Demo coupon: SAVE10 gives 10% off
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: "SAVE10", discount: 0.1 });
    } else if (couponCode.toUpperCase() === "SAVE20") {
      setAppliedCoupon({ code: "SAVE20", discount: 0.2 });
    } else {
      alert("Invalid coupon code. Try SAVE10 or SAVE20");
    }
    setCouponCode("");
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden sticky top-24">
      <div className="px-5 py-4 border-b bg-muted/30">
        <h2 className="font-semibold text-lg">Order Summary</h2>
      </div>

      <div className="p-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600 dark:text-green-400" : ""}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between font-bold text-base border-t pt-3">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Coupon code */}
      <div className="px-5 pb-4">
        {!appliedCoupon ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
              Apply
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {appliedCoupon.code} applied!
            </span>
            <button
              onClick={() => setAppliedCoupon(null)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Try: SAVE10, SAVE20
        </p>
      </div>

      {/* Checkout button */}
      <div className="px-5 pb-5">
        <Link href="/checkout">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </div>

      {/* Trust badges */}
      <div className="border-t px-5 py-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-green-500 shrink-0" />
          <span>Secure 256-bit SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-4 w-4 text-blue-500 shrink-0" />
          <span>Free shipping on orders over $50</span>
        </div>
      </div>
    </div>
  );
}
