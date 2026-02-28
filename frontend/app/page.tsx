"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { SentimentGauge } from "@/components/dashboard/sentiment-gauge"
import { BranchLeaderboard } from "@/components/dashboard/branch-leaderboard"
import { TagCloud } from "@/components/dashboard/tag-cloud"
import { RecentReviews } from "@/components/dashboard/recent-reviews"
import { ArrowUpRight, MessageSquare, Star, AlertTriangle, Users } from "lucide-react"

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  change: string
  icon: React.ElementType
  accent: string
}) {
  return (
    <div className="glass flex items-center gap-4 rounded-xl p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
      </div>
      <span className="flex items-center gap-0.5 text-xs text-emerald">
        <ArrowUpRight className="h-3 w-3" />
        {change}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Monitor your reviews and sentiment across all branches"
    >
      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reviews"
          value="2,847"
          change="+12%"
          icon={MessageSquare}
          accent="bg-emerald/10 text-emerald"
        />
        <StatCard
          label="Avg Rating"
          value="4.3"
          change="+0.2"
          icon={Star}
          accent="bg-amber/10 text-amber"
        />
        <StatCard
          label="Unresolved"
          value="23"
          change="-8%"
          icon={AlertTriangle}
          accent="bg-coral/10 text-coral"
        />
        <StatCard
          label="Active Staff"
          value="142"
          change="+5%"
          icon={Users}
          accent="bg-primary/10 text-primary"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column - Gauge + Recent */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <SentimentGauge score={78} />
          <RecentReviews />
        </div>

        {/* Center Column - Tag Cloud + Leaderboard */}
        <div className="flex flex-col gap-6 lg:col-span-9">
          <TagCloud />
          <BranchLeaderboard />
        </div>
      </div>
    </DashboardShell>
  )
}
