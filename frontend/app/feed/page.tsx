"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Star, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const allReviews = [
  { id: 1, author: "Priya S.", platform: "Google", rating: 5, text: "Amazing food and great ambience! Rahul was very attentive and made our anniversary special. The dessert platter was outstanding.", branch: "Koramangala", time: "2 hours ago" },
  { id: 2, author: "Amit K.", platform: "Zomato", rating: 2, text: "Food was okay but had to wait 45 minutes. Parking is a nightmare on weekends. Will think twice before coming back.", branch: "Connaught Place", time: "5 hours ago" },
  { id: 3, author: "Sneha R.", platform: "Google", rating: 4, text: "Loved the new dessert menu! The ambience is perfect for a casual dinner. Service could be faster though.", branch: "Bandra West", time: "8 hours ago" },
  { id: 4, author: "Vikram D.", platform: "Zomato", rating: 1, text: "Very disappointing. Order was wrong and staff was rude about fixing it. Manager was not available to help.", branch: "T. Nagar", time: "12 hours ago" },
  { id: 5, author: "Karthik N.", platform: "Google", rating: 3, text: "Average experience. Nothing special about the food but the location is convenient. Pricing seems a bit high.", branch: "Jubilee Hills", time: "1 day ago" },
  { id: 6, author: "Meera P.", platform: "Google", rating: 5, text: "Best biryani in town! The chef really knows what they're doing. Will definitely be my go-to place.", branch: "Salt Lake", time: "1 day ago" },
  { id: 7, author: "Rohit S.", platform: "Zomato", rating: 4, text: "Good food and decent service. The new menu items are quite creative. Would recommend the mango lassi.", branch: "Koramangala", time: "2 days ago" },
  { id: 8, author: "Nisha T.", platform: "Zomato", rating: 2, text: "Ordered delivery and the food arrived cold. Packaging was also not great. The taste was fine but presentation was poor.", branch: "Bandra West", time: "2 days ago" },
]

export default function FeedPage() {
  const [platformFilter, setPlatformFilter] = useState<"all" | "Google" | "Zomato">("all")

  const filtered = platformFilter === "all"
    ? allReviews
    : allReviews.filter((r) => r.platform === platformFilter)

  return (
    <DashboardShell title="Aggregated Feed" subtitle="All reviews from Google and Zomato in one place">
      <div className="mb-6 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(["all", "Google", "Zomato"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              platformFilter === p
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {p === "all" ? "All Platforms" : p}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className={cn("glass rounded-xl p-4 transition-colors hover:bg-secondary/30", review.rating <= 2 && "border border-coral/20")}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{review.author}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", review.platform === "Google" ? "bg-emerald/10 text-emerald" : "bg-coral/10 text-coral")}>{review.platform}</span>
                <span className="text-xs text-muted-foreground">{review.branch}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-amber text-amber" : "text-muted-foreground/30")} />
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{review.text}</p>
            <p className="mt-2 text-xs text-muted-foreground/50">{review.time}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
