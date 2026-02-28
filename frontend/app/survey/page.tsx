"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { MicroSurvey } from "@/components/survey/micro-survey"

export default function SurveyPage() {
  return (
    <DashboardShell
      title="Micro-Survey"
      subtitle="Preview the customer feedback experience"
    >
      <div className="flex items-start justify-center py-8">
        <MicroSurvey />
      </div>
    </DashboardShell>
  )
}
