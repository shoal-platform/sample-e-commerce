import { db } from "@/lib/db";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";

interface RelatedProductsProps {
  categoryId: string;
  excludeId: string;
}

export async function RelatedProducts({
  categoryId,
  excludeId,
}: RelatedProductsProps) {
  const rawProducts = await db.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      isActive: true,
    },
    include: { category: true },
    take: 4,
    orderBy: { rating: "desc" },
  });

  const products = rawProducts.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
    sizes: parseProductSizes(p.sizes),
    colors: parseProductColors(p.colors),
  }));

  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
