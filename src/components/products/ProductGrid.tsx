import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { PackageX } from "lucide-react";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  totalPages?: number;
  currentPage?: number;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  totalPages = 1,
  currentPage = 1,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageX className="h-16 w-16 text-muted-foreground" />}
        title="No products found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
