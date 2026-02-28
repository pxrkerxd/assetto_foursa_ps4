"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

export function SentimentGauge({ score = 78 }: { score?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = 80
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 70) return "text-emerald"
    if (s >= 40) return "text-amber"
    return "text-coral"
  }

  const getStrokeColor = (s: number) => {
    if (s >= 70) return "oklch(0.72 0.19 163)"
    if (s >= 40) return "oklch(0.82 0.17 80)"
    return "oklch(0.65 0.2 25)"
  }

  const getLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 70) return "Great"
    if (s >= 50) return "Good"
    if (s >= 40) return "Fair"
    return "Needs Attention"
  }

  return (
    <div className="glass flex flex-col items-center gap-4 rounded-xl p-6 glow-emerald">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Global Sentiment Index
        </h3>
        <div className="flex items-center gap-1 text-xs text-emerald">
          <TrendingUp className="h-3 w-3" />
          <span>+4.2%</span>
        </div>
      </div>

      <div className="relative">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="oklch(0.25 0.005 260)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getStrokeColor(animatedScore)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={`text-4xl font-bold tabular-nums ${getColor(animatedScore)}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">out of 100</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className={`text-sm font-medium ${getColor(score)}`}>
          {getLabel(score)}
        </span>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>

      {/* Mini Stats */}
      <div className="grid w-full grid-cols-3 gap-3 border-t border-border pt-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">2,847</p>
          <p className="text-xs text-muted-foreground">Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald">4.3</p>
          <p className="text-xs text-muted-foreground">Avg Rating</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-coral">23</p>
          <p className="text-xs text-muted-foreground">Unresolved</p>
        </div>
      </div>
    </div>
  )
}
