"use client"

import { Star, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Tell TypeScript what your MongoDB review object looks like
export interface Review {
  _id: string;
  author?: string;
  platform?: string;
  rating?: number;
  text?: string;
  content?: string; 
  branch?: string;
  time?: string;
  createdAt?: string;
}

// 2. Define the props this component will receive from page.tsx
interface RecentReviewsProps {
  reviews?: Review[];
  loading?: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating ? "fill-amber text-amber" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

// 3. Update the component to accept the props
export function RecentReviews({ reviews = [], loading = false }: RecentReviewsProps) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recent Reviews
        </h3>
        <button className="flex items-center gap-1 text-xs text-primary hover:underline">
          View All <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {/* 4. Handle Loading and Empty States */}
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent reviews yet.</p>
        ) : (
          /* 5. Map through the REAL reviews */
          reviews.map((review) => (
            <div
              key={review._id} 
              className={cn(
                "rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30",
                (review.rating || 5) <= 2 && "border-coral/20"
              )}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {review.author || "Anonymous"}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      review.platform === "Google"
                        ? "bg-emerald/10 text-emerald"
                        : review.platform === "Zomato" 
                        ? "bg-coral/10 text-coral" 
                        : "bg-primary/10 text-primary" 
                    )}
                  >
                    {review.platform || "Direct"}
                  </span>
                </div>
                <Stars rating={review.rating || 0} />
              </div>
              <p className="mb-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {review.text || review.content} 
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/70">{review.branch || "General"}</span>
                <span className="text-[10px] text-muted-foreground/70">{review.time || "Just now"}</span> 
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}