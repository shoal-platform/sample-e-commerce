import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseProductImages, parseProductColors, parseProductSizes } from "@/lib/utils";
import { ProductImages } from "@/components/products/ProductImages";
import { ProductReviews } from "@/components/products/ProductReviews";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { AddToCartSection } from "@/components/products/AddToCartSection";
import { StarRating } from "@/components/products/StarRating";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Truck, Shield, RotateCcw, Package } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

async function getProduct(id: string) {
  const raw = await db.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!raw) return null;

  return {
    ...raw,
    images: parseProductImages(raw.images),
    sizes: parseProductSizes(raw.sizes),
    colors: parseProductColors(raw.colors),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const reviews = await db.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.category?.name || "Category", href: `/products?category=${product.category?.slug}` },
    { label: product.name },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <ProductImages images={product.images} name={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <Badge variant="secondary">{product.category.name}</Badge>
            )}
            {product.brand && (
              <Badge variant="outline">{product.brand}</Badge>
            )}
            {product.featured && (
              <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <Badge className="bg-red-500 hover:bg-red-600">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Add to Cart Section */}
          <AddToCartSection product={product} />

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product details */}
          {(product.sku || product.brand || product.weight) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <dl className="space-y-2 text-sm">
                {product.sku && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">SKU</dt>
                    <dd className="font-medium">{product.sku}</dd>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Brand</dt>
                    <dd className="font-medium">{product.brand}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Weight</dt>
                    <dd className="font-medium">{product.weight} kg</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Shipping info */}
          <div className="border-t pt-4 grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Free Returns</p>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-muted-foreground">Full coverage</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Secure Packaging</p>
                <p className="text-xs text-muted-foreground">Arrives safely</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ProductReviews
          reviews={reviews.map((r) => ({
            ...r,
            user: { name: r.user.name, image: r.user.image },
          }))}
          productId={product.id}
          averageRating={product.rating}
          totalReviews={product.reviewCount}
        />
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts
          categoryId={product.categoryId}
          excludeId={product.id}
        />
      </div>
    </div>
  );
}
