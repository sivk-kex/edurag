import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getFolders } from "@/lib/db/folders"
import { FolderList } from "@/components/repository/folder-list"
import { UploadButton } from "@/components/repository/upload-button"

export default async function RepositoryPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const folders = await getFolders(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Repository" text="Manage your knowledge base.">
        <div className="flex items-center space-x-2">
          <UploadButton />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </DashboardHeader>
      <div>
        <FolderList folders={folders} />
      </div>
    </DashboardShell>
  )
}
