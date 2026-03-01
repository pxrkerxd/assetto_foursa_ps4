"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { SentimentGauge } from "@/components/dashboard/sentiment-gauge"
import { BranchLeaderboard } from "@/components/dashboard/branch-leaderboard"
import { TagCloud } from "@/components/dashboard/tag-cloud"
import { RecentReviews } from "@/components/dashboard/recent-reviews"
// Added Download to the lucide-react imports
import { MessageSquare, Star, AlertTriangle, Users, TrendingDown, Lock, ArrowRight, Sparkles, Download } from "lucide-react"

import { DemoTrafficButton } from "@/components/demo-traffic-button" 

export default function DashboardPage() {
  // ==========================================
  // 1. LOGIN STATE (The Gatekeeper)
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  // ==========================================
  // 2. DASHBOARD STATE
  // ==========================================
  const [stats, setStats] = useState({
    totalReviews: 0,
    recentReviews: [],
    avgSentiment: 0,
    avgRating: 0,
    anomalies: 0,
    isDownTrend: false,
    aiSummary: "Analyzing data streams..." 
  })
  const [loading, setLoading] = useState(true)

  const fetchRealIntelligence = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard-data');
      if (!response.ok) throw new Error("Server Error");
      
      const data = await response.json();
      setStats({
        totalReviews: data.totalReviews || 0,
        recentReviews: data.recentReviews || [],
        avgSentiment: data.avgSentiment || 0,
        avgRating: data.avgRating || 0,
        anomalies: data.anomalyCount || 0,
        isDownTrend: data.isDownTrend || false,
        aiSummary: data.aiSummary || "No insights generated yet." 
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRealIntelligence()
      const interval = setInterval(fetchRealIntelligence, 10000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated]) 

  // ==========================================
  // 3. LOGIN LOGIC
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "hackx2026") { 
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPassword("")
    }
  }

  // ==========================================
  // 4. LOGIN SCREEN UI 
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Manager Access</h1>
            <p className="mt-2 text-sm text-muted-foreground">Enter admin credentials to view the Intelligence Hub.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password (hint: hackx2026)"
                className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                  error ? "border-coral focus:ring-coral/20" : "border-border focus:border-primary focus:ring-primary/20"
                }`}
              />
              {error && <p className="mt-2 text-xs text-coral">Incorrect password. Please try again.</p>}
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              Access Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================
  // 5. SECURE DASHBOARD UI 
  // ==========================================
  return (
    <DashboardShell title="Intelligence Hub" subtitle="Real-time AI Sentiment Analysis">
      
      {/* 🖨️ ACTION BAR (Hides when printing to PDF!) */}
      <div className="mb-4 flex justify-end gap-3 print:hidden">
        
        {/* The New Export Button */}
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-secondary/80 active:scale-95 border border-border"
        >
          <Download className="h-4 w-4" />
          Export AI Report
        </button>

        {/* Your Existing Demo Button */}
        <DemoTrafficButton />
      </div>

      {/* ✨ AI VERDICT BOX (Now Print-Optimized) */}
      <div className="mb-6 relative overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6 shadow-[0_0_15px_rgba(99,102,241,0.1)] print:border-gray-300 print:shadow-none print:bg-transparent">
        <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl print:hidden" />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400 print:text-gray-600" />
            <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wider print:text-gray-800">AI Executive Verdict</h3>
          </div>
          <p className="text-foreground text-lg font-medium leading-relaxed print:text-black">
            {stats.aiSummary}
          </p>
        </div>
      </div>

      {stats.isDownTrend && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-coral/10 p-4 text-coral border border-coral/20">
          <TrendingDown className="h-5 w-5" />
          <p className="text-sm font-medium">Warning: Downward sentiment trend detected over the last 14 days.</p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reviews"
          value={loading ? "..." : stats.totalReviews.toLocaleString()} 
          change="+12%"
          icon={MessageSquare}
          accent="bg-emerald/10 text-emerald"
        />
        <StatCard
          label="Avg Rating"
          value={loading ? "..." : stats.avgRating.toFixed(1)}
          change="+0.2"
          icon={Star}
          accent="bg-amber/10 text-amber"
        />
        <StatCard
          label="Anomalies/Spam"
          value={loading ? "..." : stats.anomalies}
          change="Blocked"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <SentimentGauge 
            score={stats.avgSentiment} 
            reviews={stats.totalReviews} 
            rating={stats.avgRating.toFixed(1)} 
            loading={loading} 
          />
          <RecentReviews reviews={stats.recentReviews} loading={loading} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-9">
          <TagCloud />
          <BranchLeaderboard />
        </div>
      </div>
    </DashboardShell>
  )
}

function StatCard({ label, value, change, icon: Icon, accent }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-2 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{change}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
    </div>
  )
}