"use client"

import { useState, useEffect } from "react"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Tell TypeScript what to expect from the API
interface BranchData {
  rank: number;
  name: string;
  city: string;
  score: number;
  reviews: number;
  trend: "up" | "down" | "stable";
  change: number;
}

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
  // 2. Setup state to hold the fetched data
  const [branches, setBranches] = useState<BranchData[]>([])
  const [loading, setLoading] = useState(true)

  // 3. Fetch from your backend when the component loads
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard')
        const data = await response.json()
        setBranches(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Branch Leaderboard
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">All Time</span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
          Calculating rankings...
        </div>
      ) : branches.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No branch data available yet.
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Branch</div>
            <div className="col-span-3">Score</div>
            <div className="col-span-2 text-right">Reviews</div>
            <div className="col-span-2 text-right">Trend</div>
          </div>

          {/* Dynamic Rows */}
          {branches.map((branch) => (
            <div
              key={branch.name}
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
      )}
    </div>
  )
}