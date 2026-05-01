import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container mx-auto px-4 py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">Handpicked products worth a closer look.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products?featured=true">View all</Link>
        </Button>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Featured products will appear here once they are added.
        </div>
      )}
    </section>
  );
}
