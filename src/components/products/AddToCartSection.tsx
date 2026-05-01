"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Minus, Plus, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartSectionProps {
  product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  );

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product.sizes?.length || selectedSize) {
      if (!product.colors?.length || selectedColor) {
        addItem(product, quantity, selectedSize, selectedColor);
        openCart();
        toast({
          title: "Added to cart!",
          description: `${product.name} (qty: ${quantity}) added to your cart.`,
          variant: "default",
        });
      }
    }
  };

  const handleWishlistToggle = () => {
    toggleItem(product);
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist!",
      description: product.name,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description.slice(0, 100),
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const canAddToCart =
    product.stock > 0 &&
    (!product.sizes?.length || selectedSize) &&
    (!product.colors?.length || selectedColor);

  return (
    <div className="space-y-4">
      {/* Size selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Size</label>
            {selectedSize && (
              <span className="text-sm text-muted-foreground">{selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-3 py-1.5 border rounded-lg text-sm font-medium transition-all",
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:border-primary hover:text-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Color</label>
            {selectedColor && (
              <span className="text-sm text-muted-foreground">{selectedColor}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-3 py-1.5 border rounded-lg text-sm font-medium transition-all",
                  selectedColor === color
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:border-primary hover:text-primary"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-sm font-medium block mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 rounded-l-lg"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 rounded-r-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock} available
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "gap-2 px-4",
            inWishlist &&
              "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20"
          )}
          onClick={handleWishlistToggle}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-5 w-5", inWishlist && "fill-current text-red-500")}
          />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-4"
          onClick={handleShare}
          title="Share product"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Validation messages */}
      {product.sizes?.length && !selectedSize && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Please select a size
        </p>
      )}
      {product.colors?.length && !selectedColor && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Please select a color
        </p>
      )}
    </div>
  );
}
