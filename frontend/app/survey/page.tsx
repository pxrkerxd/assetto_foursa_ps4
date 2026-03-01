"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { MicroSurvey } from "@/components/survey/micro-survey"
import { useState, useEffect } from "react"

export default function SurveyPage() {
  const [serverStatus, setServerStatus] = useState("checking")

  useEffect(() => {
    // Check if Parijat's backend is actually awake
    fetch('http://localhost:5000/api/reviews/dashboard-data')
      .then(() => setServerStatus("online"))
      .catch(() => setServerStatus("offline"))
  }, [])

  return (
    <DashboardShell
      title="Customer Feedback Portal"
      subtitle="AI-Powered Sentiment Analysis Survey"
    >
      <div className="flex flex-col items-center justify-center py-8">
        {/* Visual cue for the judges that the system is live */}
        <div className={`mb-4 px-3 py-1 rounded-full text-xs font-bold border ${
          serverStatus === 'online' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-coral/10 text-coral border-coral/20'
        }`}>
          Backend Status: {serverStatus.toUpperCase()}
        </div>

        <div className="flex items-start justify-center w-full max-w-md">
          <MicroSurvey />
        </div>
      </div>
    </DashboardShell>
  )
}