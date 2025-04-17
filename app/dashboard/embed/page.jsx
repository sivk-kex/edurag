import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmbedCode } from "@/components/embed/embed-code"

export default async function EmbedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Embed" text="Get the code to embed your chatbot on your website." />
      <div className="grid gap-4">
        <EmbedCode userId={session.user.id} />
      </div>
    </DashboardShell>
  )
}
