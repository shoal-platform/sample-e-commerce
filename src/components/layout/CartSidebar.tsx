"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { formatPrice, getShippingCost } from "@/lib/utils";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();

  const subtotal = getTotalPrice();
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold text-lg">
              Shopping Cart ({items.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add items to get started
                </p>
              </div>
              <Button onClick={closeCart} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.product.images[0] || `https://picsum.photos/seed/${item.productId}/80/80`}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={closeCart}
                      className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <p className="font-bold text-sm mt-1 text-primary">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 border rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.size,
                              item.color
                            )
                          }
                          className="p-1 hover:bg-muted rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.size,
                              item.color
                            )
                          }
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.size, item.color)
                        }
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-500" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2 text-center">
                  Add {formatPrice(50 - subtotal)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={closeCart}
                asChild
              >
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button onClick={closeCart} asChild>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
