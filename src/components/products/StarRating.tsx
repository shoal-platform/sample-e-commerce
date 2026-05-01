import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = false,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
            className={cn(
              "relative",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              )}
            />
            {partial && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <Star className={cn(starSize, "fill-amber-400 text-amber-400")} />
              </div>
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
