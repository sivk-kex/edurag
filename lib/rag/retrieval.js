import clientPromise from "@/lib/mongodb"
import { embed } from "ai"
import { openai } from "@ai-sdk/openai"
import { cosineSimilarity } from "@/lib/utils"

export async function getRelevantDocuments(query, userId, limit = 5) {
  try {
    // Generate embedding for the query
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    })

    const client = await clientPromise
    const db = client.db()

    // Get all chunks for the user
    const chunks = await db.collection("chunks").find({ userId }).toArray()

    // Calculate similarity scores
    const scoredChunks = chunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(embedding, chunk.embedding),
    }))

    // Sort by similarity and take top results
    const topChunks = scoredChunks.sort((a, b) => b.similarity - a.similarity).slice(0, limit)

    // Get the full documents for these chunks
    const documentIds = [...new Set(topChunks.map((chunk) => chunk.documentId))]

    const documents = await db
      .collection("documents")
      .find({ _id: { $in: documentIds } })
      .toArray()

    // Combine document metadata with chunk content
    return topChunks.map((chunk) => {
      const document = documents.find((doc) => doc._id.equals(chunk.documentId))
      return {
        content: chunk.text,
        title: document?.title || "Unknown Document",
        similarity: chunk.similarity,
      }
    })
  } catch (error) {
    console.error("Error retrieving relevant documents:", error)
    return []
  }
}
