"use client"

import { Star, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const reviews = [
  {
    id: 1,
    author: "Priya S.",
    platform: "Google",
    rating: 5,
    text: "Amazing food and great ambience! Rahul was very attentive and made our anniversary special.",
    branch: "Koramangala",
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Amit K.",
    platform: "Zomato",
    rating: 2,
    text: "Food was okay but had to wait 45 minutes. Parking is a nightmare on weekends.",
    branch: "Connaught Place",
    time: "5 hours ago",
  },
  {
    id: 3,
    author: "Sneha R.",
    platform: "Google",
    rating: 4,
    text: "Loved the new dessert menu! The ambience is perfect for a casual dinner.",
    branch: "Bandra West",
    time: "8 hours ago",
  },
  {
    id: 4,
    author: "Vikram D.",
    platform: "Zomato",
    rating: 1,
    text: "Very disappointing. Order was wrong and staff was rude about fixing it.",
    branch: "T. Nagar",
    time: "12 hours ago",
  },
]

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

export function RecentReviews() {
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
        {reviews.map((review) => (
          <div
            key={review.id}
            className={cn(
              "rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30",
              review.rating <= 2 && "border-coral/20"
            )}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {review.author}
                </span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-medium",
                    review.platform === "Google"
                      ? "bg-emerald/10 text-emerald"
                      : "bg-coral/10 text-coral"
                  )}
                >
                  {review.platform}
                </span>
              </div>
              <Stars rating={review.rating} />
            </div>
            <p className="mb-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {review.text}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/70">{review.branch}</span>
              <span className="text-[10px] text-muted-foreground/70">{review.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
