"use client";

import Image from "next/image";
import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/types";

export function AdminProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [rows, setRows] = useState(products);

  async function deactivateProduct(productId: string) {
    setRows((current) => current.filter((product) => product.id !== productId));
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3 text-sm text-muted-foreground">
        {categories.length} categories available
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.images[0] || `https://picsum.photos/seed/${product.id}/120/120`}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sku ?? product.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{product.category?.name ?? "Uncategorized"}</td>
                <td className="px-4 py-3">
                  <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(product.createdAt)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => deactivateProduct(product.id)}
                  >
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
