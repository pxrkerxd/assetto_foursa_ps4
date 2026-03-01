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
    monthlyData: [],
    sentimentData: [],
    platformData: [],
    topTags: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics')
        const result = await response.json()
        setData(result)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
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
              <Bar dataKey="positive" stackId="a" fill="oklch(0.72 0.19 163)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="negative" stackId="a" fill="oklch(0.65 0.2 25)" radius={[4, 4, 0, 0]} />
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
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${item.pct}%` }} />
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