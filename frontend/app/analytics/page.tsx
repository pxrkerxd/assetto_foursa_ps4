"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "Aug", reviews: 320, positive: 248, negative: 72 },
  { month: "Sep", reviews: 380, positive: 298, negative: 82 },
  { month: "Oct", reviews: 410, positive: 328, negative: 82 },
  { month: "Nov", reviews: 445, positive: 365, negative: 80 },
  { month: "Dec", reviews: 520, positive: 436, negative: 84 },
  { month: "Jan", reviews: 485, positive: 402, negative: 83 },
  { month: "Feb", reviews: 287, positive: 238, negative: 49 },
]

const sentimentData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 75 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 80 },
  { day: "Fri", score: 78 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 82 },
]

const platformData = [
  { name: "Google", value: 58, color: "oklch(0.72 0.19 163)" },
  { name: "Zomato", value: 42, color: "oklch(0.65 0.2 25)" },
]

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
  return (
    <DashboardShell title="Analytics" subtitle="Deep dive into review trends and sentiment patterns">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Reviews */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Monthly Review Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
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
            <LineChart data={sentimentData}>
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
                <Pie data={platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {platformData.map((p) => (
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
            {[
              { tag: "Food Quality", count: 847, pct: 94 },
              { tag: "Wait Time", count: 612, pct: 78 },
              { tag: "Staff Behavior", count: 534, pct: 68 },
              { tag: "Ambience", count: 489, pct: 62 },
              { tag: "Pricing", count: 387, pct: 49 },
              { tag: "Hygiene", count: 312, pct: 40 },
            ].map((item) => (
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
