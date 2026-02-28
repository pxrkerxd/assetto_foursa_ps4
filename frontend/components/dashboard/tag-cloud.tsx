"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

const tags = [
  { label: "#FoodQuality", frequency: 94, sentiment: "positive" as const },
  { label: "#WaitTime", frequency: 78, sentiment: "negative" as const },
  { label: "#Ambience", frequency: 72, sentiment: "positive" as const },
  { label: "#StaffBehavior", frequency: 68, sentiment: "positive" as const },
  { label: "#Pricing", frequency: 61, sentiment: "neutral" as const },
  { label: "#Hygiene", frequency: 58, sentiment: "positive" as const },
  { label: "#Delivery", frequency: 55, sentiment: "negative" as const },
  { label: "#PortionSize", frequency: 48, sentiment: "neutral" as const },
  { label: "#Parking", frequency: 42, sentiment: "negative" as const },
  { label: "#SpecialDiet", frequency: 38, sentiment: "positive" as const },
  { label: "#Music", frequency: 35, sentiment: "positive" as const },
  { label: "#OrderAccuracy", frequency: 32, sentiment: "negative" as const },
  { label: "#Desserts", frequency: 28, sentiment: "positive" as const },
  { label: "#Reservations", frequency: 24, sentiment: "neutral" as const },
  { label: "#LateNight", frequency: 20, sentiment: "positive" as const },
]

type Filter = "all" | "positive" | "negative" | "neutral"

export function TagCloud() {
  const [filter, setFilter] = useState<Filter>("all")
  const [hoveredTag, setHoveredTag] = useState<string | null>(null)

  const filteredTags = filter === "all" ? tags : tags.filter((t) => t.sentiment === filter)

  const getSize = (frequency: number) => {
    if (frequency >= 80) return "text-xl font-bold"
    if (frequency >= 60) return "text-lg font-semibold"
    if (frequency >= 40) return "text-base font-medium"
    return "text-sm"
  }

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald/10 text-emerald hover:bg-emerald/20 border-emerald/20"
      case "negative":
        return "bg-coral/10 text-coral hover:bg-coral/20 border-coral/20"
      case "neutral":
        return "bg-amber/10 text-amber hover:bg-amber/20 border-amber/20"
      default:
        return "bg-secondary text-foreground"
    }
  }

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Positive", value: "positive" },
    { label: "Negative", value: "negative" },
    { label: "Neutral", value: "neutral" },
  ]

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          NLP Tag Cloud
        </h3>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 py-4">
        {filteredTags.map((tag) => (
          <button
            key={tag.label}
            onMouseEnter={() => setHoveredTag(tag.label)}
            onMouseLeave={() => setHoveredTag(null)}
            className={cn(
              "relative rounded-lg border px-3 py-1.5 transition-all duration-200",
              getSize(tag.frequency),
              getSentimentStyle(tag.sentiment),
              hoveredTag === tag.label && "scale-110"
            )}
          >
            {tag.label}
            {hoveredTag === tag.label && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-xs text-background">
                {tag.frequency} mentions
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald" />
          <span className="text-xs text-muted-foreground">Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-coral" />
          <span className="text-xs text-muted-foreground">Negative</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber" />
          <span className="text-xs text-muted-foreground">Neutral</span>
        </div>
      </div>
    </div>
  )
}
