"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Star, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"

// 1. Tell TypeScript what a Review looks like
interface Review {
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

export default function FeedPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [platformFilter, setPlatformFilter] = useState<string>("all")

  // 2. Fetch Initial Data and Listen for Real-Time Updates
  useEffect(() => {
    // Fetch what is already in the database
    const fetchInitialReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-data')
        const data = await response.json()
        setReviews(data.recentReviews || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching feed data:", error)
        setLoading(false)
      }
    }
    fetchInitialReviews()

    // Connect to your Node.js WebSocket Server
    const socket = io('http://localhost:5000')

    // Listen for the 'new_review' event we created in server.js
    socket.on('new_review', (newReview: Review) => {
      console.log("Got a live review!", newReview)
      // Instantly add the new review to the top of the array!
      setReviews((prevReviews) => [newReview, ...prevReviews])
    })

    // Clean up the connection when leaving the page
    return () => {
      socket.disconnect()
    }
  }, [])

  const filtered = platformFilter === "all"
    ? reviews
    : reviews.filter((r) => (r.platform || "Direct") === platformFilter)

  return (
    <DashboardShell title="Aggregated Feed" subtitle="Live reviews from all platforms in one place">
      <div className="mb-6 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {/* Added "Direct" for your QR code submissions */}
        {(["all", "Google", "Zomato", "Direct"] as const).map((p) => (
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
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading live feed...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews found.</p>
        ) : (
          filtered.map((review) => (
            <div key={review._id} className={cn("glass rounded-xl p-4 transition-colors hover:bg-secondary/30", (review.rating || 5) <= 2 && "border border-coral/20")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{review.author || "Anonymous"}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", 
                    review.platform === "Google" ? "bg-emerald/10 text-emerald" : 
                    review.platform === "Zomato" ? "bg-coral/10 text-coral" : "bg-primary/10 text-primary")}
                  >
                    {review.platform || "Direct"}
                  </span>
                  <span className="text-xs text-muted-foreground">{review.branch || "General"}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < (review.rating || 0) ? "fill-amber text-amber" : "text-muted-foreground/30")} />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{review.text || review.content}</p>
              <p className="mt-2 text-xs text-muted-foreground/50">{review.time || "Just now"}</p>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  )
}