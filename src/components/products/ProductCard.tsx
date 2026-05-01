"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/products/StarRating";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const primaryImage =
    product.images[0] ||
    `https://picsum.photos/seed/${product.id}/400/300`;

  return (
    <div
      className="group relative bg-card border rounded-xl overflow-hidden card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-muted aspect-[4/3]">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover product-image-hover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                -{discount}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick actions overlay */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-9 p-0 rounded-full shadow-lg"
                title="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all ${
          inWishlist
            ? "bg-red-500 text-white"
            : "bg-white/90 dark:bg-gray-800/90 text-muted-foreground hover:text-red-500"
        }`}
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
      </button>

      {/* Info */}
      <div className="p-3 space-y-2">
        {product.category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category.name}
          </p>
        )}

        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="w-full gap-1.5 text-xs h-8"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
