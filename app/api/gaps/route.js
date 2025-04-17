import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addKnowledgeGap } from "@/lib/db/gaps"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { query, confidence, userId } = await req.json()

    // Add knowledge gap to database
    await addKnowledgeGap({
      query,
      confidence,
      userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gaps API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
