import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { SettingsForm } from "@/components/settings/settings-form"
import { getUser } from "@/lib/db/users"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await getUser(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings." />
      <div className="grid gap-4">
        <SettingsForm user={user} />
      </div>
    </DashboardShell>
  )
}
