import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ChatInterface } from "@/components/chatbot/chat-interface"
import { getKnowledgeGaps } from "@/lib/db/gaps"

export default async function ChatbotPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const knowledgeGaps = await getKnowledgeGaps(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Chatbot" text="Test your AI assistant and identify knowledge gaps." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChatInterface userId={session.user.id} />
        </div>
        <div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-4">
              <h3 className="font-semibold text-lg">Knowledge Gaps</h3>
              {knowledgeGaps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No knowledge gaps identified yet. Start chatting to discover areas where your chatbot needs more
                  information.
                </p>
              ) : (
                <div className="space-y-4">
                  {knowledgeGaps.map((gap) => (
                    <div key={gap._id} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <p className="text-sm font-medium">{gap.query}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {gap.confidence}%</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
