"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { StaffProfile } from "@/components/staff/staff-profile"
import { StaffGrid } from "@/components/staff/staff-grid"

export default function StaffPage() {
  return (
    <DashboardShell
      title="Staff Rewards"
      subtitle="Track employee performance based on customer reviews"
    >
      <StaffGrid />
    </DashboardShell>
  )
}
