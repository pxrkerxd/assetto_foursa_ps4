"use client"

import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const branches = [
  {
    rank: 1,
    name: "Koramangala",
    city: "Bangalore",
    score: 92,
    reviews: 487,
    trend: "up" as const,
    change: 3.1,
  },
  {
    rank: 2,
    name: "Bandra West",
    city: "Mumbai",
    score: 88,
    reviews: 412,
    trend: "up" as const,
    change: 1.8,
  },
  {
    rank: 3,
    name: "Connaught Place",
    city: "Delhi",
    score: 85,
    reviews: 356,
    trend: "stable" as const,
    change: 0.2,
  },
  {
    rank: 4,
    name: "T. Nagar",
    city: "Chennai",
    score: 79,
    reviews: 298,
    trend: "down" as const,
    change: -2.4,
  },
  {
    rank: 5,
    name: "Salt Lake",
    city: "Kolkata",
    score: 74,
    reviews: 231,
    trend: "up" as const,
    change: 5.6,
  },
  {
    rank: 6,
    name: "Jubilee Hills",
    city: "Hyderabad",
    score: 71,
    reviews: 189,
    trend: "down" as const,
    change: -1.1,
  },
]

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald" />
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-coral" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

function ScoreBar({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 85) return "bg-emerald"
    if (s >= 70) return "bg-amber"
    return "bg-coral"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{score}</span>
    </div>
  )
}

export function BranchLeaderboard() {
  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Branch Leaderboard
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">This Month</span>
      </div>

      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Branch</div>
          <div className="col-span-3">Score</div>
          <div className="col-span-2 text-right">Reviews</div>
          <div className="col-span-2 text-right">Trend</div>
        </div>

        {branches.map((branch) => (
          <div
            key={branch.rank}
            className={cn(
              "grid grid-cols-12 items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/50",
              branch.rank === 1 && "bg-secondary/30"
            )}
          >
            <div className="col-span-1">
              {branch.rank <= 3 ? (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    branch.rank === 1 && "bg-amber text-background",
                    branch.rank === 2 && "bg-muted-foreground/40 text-foreground",
                    branch.rank === 3 && "bg-coral/30 text-coral"
                  )}
                >
                  {branch.rank}
                </span>
              ) : (
                <span className="pl-1 text-xs text-muted-foreground">{branch.rank}</span>
              )}
            </div>
            <div className="col-span-4">
              <p className="text-sm font-medium text-foreground">{branch.name}</p>
              <p className="text-xs text-muted-foreground">{branch.city}</p>
            </div>
            <div className="col-span-3">
              <ScoreBar score={branch.score} />
            </div>
            <div className="col-span-2 text-right text-sm tabular-nums text-muted-foreground">
              {branch.reviews}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1">
              <TrendIcon trend={branch.trend} />
              <span
                className={cn(
                  "text-xs tabular-nums",
                  branch.trend === "up" && "text-emerald",
                  branch.trend === "down" && "text-coral",
                  branch.trend === "stable" && "text-muted-foreground"
                )}
              >
                {branch.change > 0 ? "+" : ""}
                {branch.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
