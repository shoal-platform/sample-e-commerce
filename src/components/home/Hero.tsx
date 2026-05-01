import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.7))]">
      <div className="container mx-auto grid min-h-[460px] items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_420px]">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-primary" />
            Free shipping on orders over $50
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            ShopNext
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover everyday essentials and fresh finds across electronics,
            apparel, books, home, and sports.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/products">
                Shop Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products?featured=true">View Featured</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {["Electronics", "Clothing", "Home", "Sports"].map((label, index) => (
            <Link
              key={label}
              href={`/products?category=${label.toLowerCase()}`}
              className="group flex aspect-square items-end overflow-hidden rounded-lg border bg-card p-4 transition hover:border-primary"
            >
              <div>
                <div className="mb-3 h-16 w-16 rounded-full bg-primary/10 transition group-hover:bg-primary/20" />
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground">
                  {index % 2 === 0 ? "New arrivals" : "Popular picks"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
