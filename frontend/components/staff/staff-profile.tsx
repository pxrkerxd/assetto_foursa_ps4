"use client"

import { Award, TrendingUp, MessageSquare, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StaffMember {
  name: string
  role: string
  branch: string
  avatar: string
  kudosScore: number
  totalMentions: number
  avgSentiment: number
  recentMentions: { text: string; source: string; rating: number }[]
  sentimentTrend: number[]
}

export function StaffProfile({ staff }: { staff: StaffMember }) {
  const maxTrend = Math.max(...staff.sentimentTrend)
  const minTrend = Math.min(...staff.sentimentTrend)
  const range = maxTrend - minTrend || 1

  const getKudosColor = (score: number) => {
    if (score >= 80) return "text-emerald"
    if (score >= 60) return "text-amber"
    return "text-coral"
  }

  const getKudosBg = (score: number) => {
    if (score >= 80) return "bg-emerald/10 border-emerald/20"
    if (score >= 60) return "bg-amber/10 border-amber/20"
    return "bg-coral/10 border-coral/20"
  }

  return (
    <div className="glass overflow-hidden rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {staff.avatar}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{staff.name}</h3>
          <p className="text-xs text-muted-foreground">
            {staff.role} &middot; {staff.branch}
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col items-center rounded-xl border px-4 py-2",
            getKudosBg(staff.kudosScore)
          )}
        >
          <Award className={cn("mb-0.5 h-4 w-4", getKudosColor(staff.kudosScore))} />
          <span className={cn("text-xl font-bold tabular-nums", getKudosColor(staff.kudosScore))}>
            {staff.kudosScore}
          </span>
          <span className="text-[10px] text-muted-foreground">Kudos</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="flex flex-col items-center border-r border-border py-3">
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {staff.totalMentions}
          </span>
          <span className="text-[10px] text-muted-foreground">Mentions</span>
        </div>
        <div className="flex flex-col items-center border-r border-border py-3">
          <span className="text-lg font-semibold tabular-nums text-emerald">
            {staff.avgSentiment}%
          </span>
          <span className="text-[10px] text-muted-foreground">Positive</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <div className="flex items-center gap-0.5 text-emerald">
            <TrendingUp className="h-3 w-3" />
            <span className="text-lg font-semibold tabular-nums">+4.2</span>
          </div>
          <span className="text-[10px] text-muted-foreground">This Week</span>
        </div>
      </div>

      {/* 7-Day Sentiment Bar Chart */}
      <div className="border-b border-border p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          7-Day Sentiment Trend
        </p>
        <div className="flex items-end gap-1.5">
          {staff.sentimentTrend.map((val, i) => {
            const height = ((val - minTrend) / range) * 48 + 8
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] tabular-nums text-muted-foreground/60">{val}</span>
                <div
                  className={cn(
                    "w-full rounded-sm transition-all duration-500",
                    val >= 80
                      ? "bg-emerald"
                      : val >= 60
                        ? "bg-amber"
                        : "bg-coral"
                  )}
                  style={{ height: `${height}px` }}
                />
                <span className="text-[9px] text-muted-foreground/60">{days[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Mentions */}
      <div className="p-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          Recent Mentions
        </p>
        <div className="space-y-2">
          {staff.recentMentions.map((mention, i) => (
            <div key={i} className="rounded-lg bg-secondary/30 px-3 py-2">
              <p className="text-xs leading-relaxed text-foreground/80">
                {`"${mention.text}"`}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    mention.source === "Google" ? "text-emerald" : "text-coral"
                  )}
                >
                  {mention.source}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "h-2.5 w-2.5",
                        j < mention.rating ? "fill-amber text-amber" : "text-muted-foreground/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
