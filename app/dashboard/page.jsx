import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Overview } from "@/components/dashboard/overview"
import { RecentUploads } from "@/components/dashboard/recent-uploads"
import { getRecentUploads } from "@/lib/db/documents"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const recentUploads = await getRecentUploads(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your knowledge repository and chatbot." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Overview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentUploads uploads={recentUploads} className="col-span-4" />
        <div className="col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-4">
              <h3 className="font-semibold text-lg">Chatbot Preview</h3>
              <div className="border rounded-lg p-4 h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Your chatbot will appear here once you add some content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
