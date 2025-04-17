import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, defaultStyles } from "react-file-icon"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function RecentUploads({ uploads, className, ...props }) {
  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>You have uploaded {uploads.length} documents recently.</CardDescription>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No documents uploaded yet. Start by adding content to your repository.
          </p>
        ) : (
          <div className="space-y-8">
            {uploads.map((upload) => {
              const fileExtension = upload.filename.split(".").pop()
              return (
                <div className="flex items-center" key={upload._id}>
                  <div className="w-10 h-10 mr-4">
                    <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{upload.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {formatDistanceToNow(new Date(upload.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
