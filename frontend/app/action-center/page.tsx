"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { ActionCenter } from "@/components/action-center/action-center"

export default function ActionCenterPage() {
  return (
    <DashboardShell
      title="Action Center"
      subtitle="Manage and respond to reviews from all platforms"
    >
      <ActionCenter />
    </DashboardShell>
  )
}
