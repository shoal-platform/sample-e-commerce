"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  searchQuery?: string;
}

const ratingOptions = [
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
  { value: "2", label: "2+ Stars" },
];

export function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  minRating,
  searchQuery,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [priceMin, setPriceMin] = useState(minPrice || "");
  const [priceMax, setPriceMax] = useState(maxPrice || "");

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page"); // Reset to page 1 on filter change
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleCategoryClick = (slug: string) => {
    updateParams({
      category: selectedCategory === slug ? undefined : slug,
    });
  };

  const handleRatingClick = (value: string) => {
    updateParams({
      minRating: minRating === value ? undefined : value,
    });
  };

  const handlePriceApply = () => {
    updateParams({ minPrice: priceMin, maxPrice: priceMax });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/products?${params.toString()}`);
    setPriceMin("");
    setPriceMax("");
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (minRating ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Clear all */}
      {activeFiltersCount > 0 && (
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters ({activeFiltersCount})
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            min="0"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            min="0"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-2"
          onClick={handlePriceApply}
        >
          Apply Price Filter
        </Button>
        {(minPrice || maxPrice) && (
          <button
            onClick={() => {
              updateParams({ minPrice: undefined, maxPrice: undefined });
              setPriceMin("");
              setPriceMax("");
            }}
            className="text-xs text-destructive hover:underline mt-1"
          >
            Clear price filter
          </button>
        )}
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRatingClick(option.value)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                minRating === option.value
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-accent"
              )}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  minRating === option.value
                    ? "fill-current"
                    : "fill-amber-400 text-amber-400"
                )}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Mobile filter panel */}
      {mobileOpen && (
        <div className="lg:hidden border rounded-xl p-4 mb-4 bg-card">
          {filterContent}
        </div>
      )}

      {/* Desktop filter panel */}
      <div className="hidden lg:block bg-card border rounded-xl p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <Badge>{activeFiltersCount} active</Badge>
          )}
        </div>
        {filterContent}
      </div>
    </>
  );
}
