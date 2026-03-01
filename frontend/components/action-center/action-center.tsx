"use client"

import { useState, useEffect } from "react"
import {
  Star,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ReviewStatus = "open" | "in-progress" | "resolved"
type Priority = "red" | "yellow" | "green"

interface Review {
  id: string
  author: string
  platform: string
  rating: number
  text: string
  branch: string
  time: string
  status: ReviewStatus
  priority: Priority
  tags: string[]
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

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        priority === "red" && "bg-coral/15 text-coral",
        priority === "yellow" && "bg-amber/15 text-amber",
        priority === "green" && "bg-emerald/15 text-emerald"
      )}
    >
      {priority === "red" && <AlertTriangle className="h-2.5 w-2.5" />}
      {priority === "yellow" && <Clock className="h-2.5 w-2.5" />}
      {priority === "green" && <CheckCircle2 className="h-2.5 w-2.5" />}
      {priority === "red" ? "Red Alert" : priority === "yellow" ? "Monitor" : "Resolved"}
    </span>
  )
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
        status === "open" && "bg-coral/10 text-coral",
        status === "in-progress" && "bg-amber/10 text-amber",
        status === "resolved" && "bg-emerald/10 text-emerald"
      )}
    >
      {status === "open" ? "Open" : status === "in-progress" ? "In Progress" : "Resolved"}
    </span>
  )
}

function ReviewCard({ review, onStatusChange }: { review: Review, onStatusChange: (id: string, status: ReviewStatus) => void }) {
  const [expanded, setExpanded] = useState(review.priority === "red" && review.status === "open")
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [isResolved, setIsResolved] = useState(review.status === "resolved")
  const [copied, setCopied] = useState(false)

  // Dynamic AI Replies that use the actual review data!
  const aiReplies: Record<string, string> = {
    Professional: `Dear ${review.author}, thank you for sharing your feedback about your visit to our ${review.branch} branch. We have noted your comments and our operations team is reviewing this to ensure better experiences in the future.`,
    Apologetic: `Hi ${review.author}, we are truly sorry about your experience. A rating of ${review.rating} stars is not our standard. We are investigating the issues you raised and will take immediate corrective action. Please reach out to us directly.`,
    Enthusiastic: `Thank you so much for the ${review.rating}-star review, ${review.author}! We are thrilled you had a great time at ${review.branch}. Your feedback is invaluable in helping us get better every day. We'd love to welcome you back soon!`,
  }

  const handleCopy = () => {
    if (selectedTone) {
      navigator.clipboard.writeText(aiReplies[selectedTone])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleResolveToggle = () => {
    const newStatus = isResolved ? "open" : "resolved"
    setIsResolved(!isResolved)
    onStatusChange(review.id, newStatus)
  }

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        review.priority === "red" && !isResolved
          ? "border-coral/30 bg-coral/5"
          : "border-border bg-card"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{review.author}</span>
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
              {review.platform}
            </span>
            <Stars rating={review.rating} />
            <PriorityBadge priority={review.priority} />
            <StatusBadge status={isResolved ? "resolved" : review.status} />
          </div>
          <p className={cn("text-sm text-muted-foreground", !expanded && "line-clamp-1")}>
            {review.text}
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60">{review.branch}</span>
            <span className="text-xs text-muted-foreground/60">{review.time}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* AI Replies */}
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              AI-Assisted Replies
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(aiReplies).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(selectedTone === tone ? null : tone)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                    selectedTone === tone
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Reply */}
          {selectedTone && (
            <div className="mb-4 rounded-lg bg-secondary/50 p-3 animate-in fade-in duration-200">
              <p className="text-xs leading-relaxed text-foreground/80">
                {aiReplies[selectedTone]}
              </p>
              <button
                onClick={handleCopy}
                className="mt-2 flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy to clipboard
                  </>
                )}
              </button>
            </div>
          )}

          {/* Resolve Toggle */}
          <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3">
            <span className="text-sm font-medium text-foreground">Mark as Resolved</span>
            <button
              onClick={handleResolveToggle}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                isResolved ? "bg-emerald" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform",
                  isResolved ? "translate-x-5.5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ActionCenter() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all")
  const [loading, setLoading] = useState(true)

  // Fetch real data and map it for the Action Center
  useEffect(() => {
    const fetchActionData = async () => {
      try {
        // Fetching from your existing dashboard route to get the reviews
        const response = await fetch('http://localhost:5000/api/dashboard-data')
        const data = await response.json()
        const fetchedReviews = data.recentReviews || []

        // Map database reviews into the Action Center format
        const mappedReviews = fetchedReviews.map((r: any) => {
          let priority: Priority = "green"
          let status: ReviewStatus = "resolved"
          
          if ((r.rating || 5) <= 2) { 
            priority = "red" 
            status = "open" 
          } else if (r.rating === 3) { 
            priority = "yellow" 
            status = "in-progress" 
          }

          // Generate some quick tags based on the text
          let tags = []
          const txt = (r.text || r.content || "").toLowerCase()
          if (txt.includes("food") || txt.includes("taste")) tags.push("#FoodQuality")
          if (txt.includes("wait") || txt.includes("slow")) tags.push("#WaitTime")
          if (txt.includes("staff") || txt.includes("rude")) tags.push("#StaffBehavior")
          if (tags.length === 0) tags.push("#GeneralFeedback")

          return {
            id: r._id,
            author: r.author || "Anonymous Customer",
            platform: r.platform || "Direct",
            rating: r.rating || 5,
            text: r.text || r.content || "",
            branch: r.branch || "General Branch",
            time: r.time || "Recently",
            status: status,
            priority: priority,
            tags: tags
          }
        })

        setReviews(mappedReviews)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching action center data:", error)
        setLoading(false)
      }
    }
    fetchActionData()
  }, [])

  // Update status locally so the top filters update when you hit the toggle
  const updateReviewStatus = (id: string, newStatus: ReviewStatus) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  const filteredReviews = filter === "all" ? reviews : reviews.filter((r) => r.status === filter)

  const counts = {
    all: reviews.length,
    open: reviews.filter((r) => r.status === "open").length,
    "in-progress": reviews.filter((r) => r.status === "in-progress").length,
    resolved: reviews.filter((r) => r.status === "resolved").length,
  }

  const filters: { label: string; value: "all" | ReviewStatus }[] = [
    { label: `All (${counts.all})`, value: "all" },
    { label: `Open (${counts.open})`, value: "open" },
    { label: `In Progress (${counts["in-progress"]})`, value: "in-progress" },
    { label: `Resolved (${counts.resolved})`, value: "resolved" },
  ]

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading Action Center...</p>
        ) : filteredReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews match this filter.</p>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onStatusChange={updateReviewStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}