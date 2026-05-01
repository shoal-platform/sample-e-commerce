"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shopping Cart" },
  ];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbs} />
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingCart className="h-16 w-16 text-muted-foreground" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet. Start shopping to find great products!"
            action={
              <Link href="/products">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Shopping Cart ({items.reduce((t, i) => t + i.quantity, 0)} items)
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="pt-4">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
