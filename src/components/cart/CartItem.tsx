"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemData {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface CartItemProps {
  item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const primaryImage =
    item.product.images[0] ||
    `https://picsum.photos/seed/${item.productId}/200/200`;

  return (
    <div className="flex gap-4 p-4 bg-card border rounded-xl">
      {/* Image */}
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-muted">
          <Image
            src={primaryImage}
            alt={item.product.name}
            width={112}
            height={112}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link href={`/products/${item.productId}`} className="flex-1 min-w-0">
            <h3 className="font-medium leading-tight hover:text-primary transition-colors truncate">
              {item.product.name}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => removeItem(item.productId, item.size, item.color)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {(item.size || item.color) && (
          <div className="flex gap-3 mt-1">
            {item.size && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Color: {item.color}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
              }
              disabled={item.quantity <= 1}
              className="px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 rounded-l-lg"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
              }
              disabled={item.quantity >= item.product.stock}
              className="px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 rounded-r-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-primary">
              {formatPrice(item.product.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.product.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
