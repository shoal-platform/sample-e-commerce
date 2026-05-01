import { Suspense } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";
import type { Product, ProductFilters as Filters } from "@/types";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: string;
}

async function getProducts(searchParams: SearchParams): Promise<{
  products: Product[];
  total: number;
  categories: { id: string; name: string; slug: string }[];
}> {
  const page = parseInt(searchParams.page || "1");
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const where: Record<string, unknown> = { isActive: true };

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
      { brand: { contains: searchParams.search } },
    ];
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {
      ...(searchParams.minPrice ? { gte: parseFloat(searchParams.minPrice) } : {}),
      ...(searchParams.maxPrice ? { lte: parseFloat(searchParams.maxPrice) } : {}),
    };
  }

  if (searchParams.minRating) {
    where.rating = { gte: parseFloat(searchParams.minRating) };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (searchParams.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "rating-desc":
      orderBy = { rating: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
  }

  const [rawProducts, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: perPage,
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products = rawProducts.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
    sizes: parseProductSizes(p.sizes),
    colors: parseProductColors(p.colors),
  }));

  return { products, total, categories };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { products, total, categories } = await getProducts(searchParams);
  const page = parseInt(searchParams.page || "1");
  const perPage = 12;
  const totalPages = Math.ceil(total / perPage);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products" },
  ];

  if (searchParams.category) {
    const cat = categories.find((c) => c.slug === searchParams.category);
    if (cat) {
      breadcrumbs[1] = { label: "Products", href: "/products" };
      breadcrumbs.push({ label: cat.name });
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters
            categories={categories}
            selectedCategory={searchParams.category}
            minPrice={searchParams.minPrice}
            maxPrice={searchParams.maxPrice}
            minRating={searchParams.minRating}
            searchQuery={searchParams.search}
          />
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {searchParams.search
                  ? `Search results for "${searchParams.search}"`
                  : searchParams.category
                  ? categories.find((c) => c.slug === searchParams.category)?.name || "Products"
                  : "All Products"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {total} product{total !== 1 ? "s" : ""} found
              </p>
            </div>
            <ProductSort currentSort={searchParams.sort} />
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-lg" />
                ))}
              </div>
            }
          >
            <ProductGrid
              products={products}
              totalPages={totalPages}
              currentPage={page}
              emptyMessage={
                searchParams.search
                  ? `No products found for "${searchParams.search}"`
                  : "No products found matching your filters"
              }
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
