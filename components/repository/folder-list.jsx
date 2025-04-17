import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderIcon } from "lucide-react"
import Link from "next/link"

export function FolderList({ folders }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {folders.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <FolderIcon className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-1 text-center">
                <h3 className="font-medium text-lg">No folders yet</h3>
                <p className="text-sm text-muted-foreground">Create a folder to organize your knowledge base.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        folders.map((folder) => (
          <Link href={`/dashboard/repository/${folder._id}`} key={folder._id}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FolderIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  {folder.name}
                </CardTitle>
                <CardDescription>{folder.documentCount} documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{folder.description || "No description"}</p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
