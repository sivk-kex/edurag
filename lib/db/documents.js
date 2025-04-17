import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function addDocument({
  title,
  description,
  fileName,
  filePath,
  fileType,
  fileSize,
  content,
  chunks,
  folderId,
  userId,
}) {
  const client = await clientPromise
  const db = client.db()

  // Add document
  const result = await db.collection("documents").insertOne({
    title,
    description,
    fileName,
    filePath,
    fileType,
    fileSize,
    content,
    folderId: folderId ? new ObjectId(folderId) : null,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Add chunks with embeddings
  if (chunks.length > 0) {
    await db.collection("chunks").insertMany(
      chunks.map((chunk) => ({
        documentId: result.insertedId,
        text: chunk.text,
        embedding: chunk.embedding,
        userId,
        createdAt: new Date(),
      })),
    )
  }

  return result.insertedId
}

export async function getRecentUploads(userId) {
  const client = await clientPromise
  const db = client.db()

  return await db.collection("documents").find({ userId }).sort({ createdAt: -1 }).limit(5).toArray()
}

export async function getDocumentsByFolder(folderId, userId) {
  const client = await clientPromise
  const db = client.db()

  return await db
    .collection("documents")
    .find({ folderId: new ObjectId(folderId), userId })
    .sort({ createdAt: -1 })
    .toArray()
}
