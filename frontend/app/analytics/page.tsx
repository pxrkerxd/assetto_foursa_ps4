"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [data, setData] = useState({
    monthlyData: [] as any[],
    sentimentData: [] as any[],
    platformData: [] as any[],
    topTags: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🚀 HACKATHON SPEEDRUN: Hardcoded premium demo data instead of a backend fetch!
    const fetchAnalytics = async () => {
      // Simulate a quick 600ms network request to show off your loading animation
      await new Promise(resolve => setTimeout(resolve, 600));

      setData({
        monthlyData: [
          { month: "Oct", positive: 120, negative: 30 },
          { month: "Nov", positive: 140, negative: 45 },
          { month: "Dec", positive: 190, negative: 20 },
          { month: "Jan", positive: 160, negative: 35 },
          { month: "Feb", positive: 210, negative: 25 },
          { month: "Mar", positive: 245, negative: 15 }, // Current month looking great
        ],
        sentimentData: [
          { day: "Mon", score: 72 },
          { day: "Tue", score: 75 },
          { day: "Wed", score: 68 }, // Small dip to make it look real
          { day: "Thu", score: 81 },
          { day: "Fri", score: 85 },
          { day: "Sat", score: 88 },
          { day: "Sun", score: 86 },
        ],
        platformData: [
          { name: "Direct (QR)", value: 55, color: "#6366f1" }, // Indigo
          { name: "Google", value: 25, color: "#10b981" },      // Emerald
          { name: "Zomato", value: 12, color: "#f43f5e" },      // Rose
          { name: "Yelp", value: 8, color: "#f59e0b" },         // Amber
        ],
        topTags: [
          { tag: "Food Quality", pct: 85, count: 342 },
          { tag: "Service", pct: 65, count: 215 },
          { tag: "Wait Time", pct: 45, count: 184 },
          { tag: "Ambiance", pct: 30, count: 98 },
          { tag: "Hygiene", pct: 20, count: 65 },
        ]
      })
      setLoading(false)
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="Analytics" subtitle="Deep dive into review trends and sentiment patterns">
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading analytics engine...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Analytics" subtitle="Deep dive into review trends and sentiment patterns">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Reviews */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Monthly Review Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
              <XAxis dataKey="month" tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {/* Note: I swapped the colors so Positive is the main bright color */}
              <Bar dataKey="negative" stackId="a" fill="oklch(0.65 0.2 25)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="positive" stackId="a" fill="oklch(0.72 0.19 163)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trend */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Weekly Sentiment Score</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
              <XAxis dataKey="day" tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 90]} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="oklch(0.72 0.19 163)" strokeWidth={2} dot={{ fill: "oklch(0.72 0.19 163)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Platform Distribution</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={data.platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {data.platformData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {data.platformData.map((p: any) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.value}% of reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Tags */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Top NLP Categories</h3>
          <div className="space-y-3">
            {data.topTags.map((item: any) => (
              <div key={item.tag} className="flex items-center gap-3">
                <span className="w-28 text-sm text-foreground">{item.tag}</span>
                <div className="flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all duration-700 delay-300" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
                <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}