import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group rounded-lg border bg-background p-5 transition hover:border-primary"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category._count?.products ?? 0} products
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="rounded-lg border border-dashed bg-background p-10 text-center text-muted-foreground sm:col-span-2 lg:col-span-3">
              Categories will appear here once your catalog is seeded.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
