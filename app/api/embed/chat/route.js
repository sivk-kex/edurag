import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getRelevantDocuments } from "@/lib/rag/retrieval"

export async function POST(req) {
  try {
    const { message, userId } = await req.json()

    // Get relevant documents from the repository
    const relevantDocs = await getRelevantDocuments(message, userId)

    // Create context from relevant documents
    const context = relevantDocs.map((doc) => doc.content).join("\n\n")

    // Generate response using the AI model
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: `You are an educational assistant for a school/university. Answer questions based on the following context. If the answer cannot be found in the context, say "I don't have enough information about that" and suggest what information might be needed.
      
      Context:
      ${context || "No specific information available."}`,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Embed Chat API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
