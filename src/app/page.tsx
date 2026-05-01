import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";
import { db } from "@/lib/db";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

async function getFeaturedProducts(): Promise<Product[]> {
  const rawProducts = await db.product.findMany({
    where: { featured: true, isActive: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return rawProducts.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
    sizes: parseProductSizes(p.sizes),
    colors: parseProductColors(p.colors),
  }));
}

async function getCategories(): Promise<Category[]> {
  return db.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid categories={categories} />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
