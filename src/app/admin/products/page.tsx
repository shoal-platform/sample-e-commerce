import { db } from "@/lib/db";
import { parseProductImages } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  const [rawProducts, categories] = await Promise.all([
    db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products = rawProducts.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
    sizes: p.sizes ? JSON.parse(p.sizes) : [],
    colors: p.colors ? JSON.parse(p.colors) : [],
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
      </div>
      <AdminProductsClient products={products} categories={categories} />
    </div>
  );
}
