"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Heart, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Wishlist" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          My Wishlist {items.length > 0 && `(${items.length} items)`}
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear wishlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Heart className="h-16 w-16 text-muted-foreground" />}
            title="Your wishlist is empty"
            description="Save your favorite products to your wishlist so you can find them easily later."
            action={
              <Link href="/products">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
