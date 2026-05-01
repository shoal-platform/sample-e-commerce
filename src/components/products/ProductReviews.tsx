"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StarRating } from "@/components/products/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  user?: { name?: string | null; image?: string | null };
}

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ProductReviews({
  reviews: initialReviews,
  productId,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const selectedRating = watch("rating");

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  const onSubmit = async (data: ReviewFormData) => {
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productId }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setReviews([
        {
          ...result.data,
          user: {
            name: session.user.name,
            image: session.user.image,
          },
        },
        ...reviews,
      ]);
      reset();
      setShowForm(false);
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
        variant: "default",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Customer Reviews ({totalReviews})
        </h2>
        {session && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-muted/30 rounded-xl">
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} size="md" />
          <p className="text-sm text-muted-foreground mt-1">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right">{star}</span>
              <StarRating rating={1} maxRating={1} size="sm" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-6 text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="border rounded-xl p-6 mb-6 bg-card">
          <h3 className="font-semibold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Rating *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setValue("rating", star)}
                    className="cursor-pointer"
                  >
                    <StarRating
                      rating={hoverRating >= star || selectedRating >= star ? 1 : 0}
                      maxRating={1}
                      size="lg"
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-destructive text-sm mt-1">Please select a rating</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Review Title (optional)
              </label>
              <Input
                placeholder="Summarize your review"
                {...register("title")}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Review *</label>
              <textarea
                {...register("body")}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              {errors.body && (
                <p className="text-destructive text-sm">{errors.body.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No reviews yet. Be the first to review this product!</p>
            {session && (
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                  {review.user?.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {review.user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-medium text-sm">
                        {review.user?.name || "Anonymous"}
                      </span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-medium mt-2">{review.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {review.body}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
