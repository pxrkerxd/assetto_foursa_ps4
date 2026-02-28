"use client"

import { useState } from "react"
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
  id: number
  author: string
  platform: "Google" | "Zomato"
  rating: number
  text: string
  branch: string
  time: string
  status: ReviewStatus
  priority: Priority
  tags: string[]
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Vikram D.",
    platform: "Zomato",
    rating: 1,
    text: "Very disappointing experience. Waited 50 minutes for our order and when it arrived, two dishes were wrong. The staff was unapologetic and the manager was nowhere to be found. Will not be coming back.",
    branch: "T. Nagar, Chennai",
    time: "2 hours ago",
    status: "open",
    priority: "red",
    tags: ["#WaitTime", "#OrderAccuracy", "#StaffBehavior"],
  },
  {
    id: 2,
    author: "Meera P.",
    platform: "Google",
    rating: 2,
    text: "Food quality has gone down significantly. The paneer was rubber-like and the naan was stale. Only saving grace was the dal makhani. Very overpriced for what you get.",
    branch: "Connaught Place, Delhi",
    time: "5 hours ago",
    status: "open",
    priority: "red",
    tags: ["#FoodQuality", "#Pricing"],
  },
  {
    id: 3,
    author: "Rohit S.",
    platform: "Zomato",
    rating: 3,
    text: "Decent experience overall. The food was good but the air conditioning was not working properly. A bit warm inside. Service was okay, nothing exceptional.",
    branch: "Salt Lake, Kolkata",
    time: "8 hours ago",
    status: "in-progress",
    priority: "yellow",
    tags: ["#Ambience", "#StaffBehavior"],
  },
  {
    id: 4,
    author: "Priya S.",
    platform: "Google",
    rating: 5,
    text: "Amazing food and great ambience! Rahul was very attentive and made our anniversary special. The dessert platter was outstanding. Will definitely come back!",
    branch: "Koramangala, Bangalore",
    time: "12 hours ago",
    status: "resolved",
    priority: "green",
    tags: ["#FoodQuality", "#StaffBehavior", "#Ambience"],
  },
  {
    id: 5,
    author: "Karthik N.",
    platform: "Google",
    rating: 2,
    text: "Parking situation is terrible. Took 20 minutes to find a spot. The valet was nowhere in sight. Food was average at best. Not worth the hassle on weekends.",
    branch: "Jubilee Hills, Hyderabad",
    time: "1 day ago",
    status: "open",
    priority: "red",
    tags: ["#Parking", "#FoodQuality"],
  },
]

const aiReplies = {
  Professional:
    "Thank you for taking the time to share your feedback. We sincerely apologize for the inconvenience you experienced. Your concerns have been noted and escalated to our operations team. We would love the opportunity to make this right. Please reach out to us directly so we can resolve this.",
  Apologetic:
    "We are truly sorry about your experience. This is not the standard we strive for and we deeply regret falling short. We are investigating the issues you raised and will take immediate corrective action. We hope you'll give us another chance to serve you better.",
  Enthusiastic:
    "Thank you so much for your visit and for taking the time to write to us! We hear you and we're already working on improving. Your feedback is invaluable in helping us get better every day. We'd love to welcome you back soon!",
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

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(review.priority === "red" && review.status === "open")
  const [selectedTone, setSelectedTone] = useState<keyof typeof aiReplies | null>(null)
  const [isResolved, setIsResolved] = useState(review.status === "resolved")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (selectedTone) {
      navigator.clipboard.writeText(aiReplies[selectedTone])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
                  : "bg-coral/10 text-coral"
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
              {(Object.keys(aiReplies) as (keyof typeof aiReplies)[]).map((tone) => (
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
              onClick={() => setIsResolved(!isResolved)}
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
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all")

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter)

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
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
