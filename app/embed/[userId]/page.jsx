import { ChatWidget } from "@/components/embed/chat-widget"
import { getUser } from "@/lib/db/users"

export default async function EmbedPage({ params }) {
  const user = await getUser(params.userId)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Invalid user ID</p>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <ChatWidget userId={params.userId} />
    </div>
  )
}
