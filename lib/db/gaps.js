import clientPromise from "@/lib/mongodb"

export async function addKnowledgeGap({ query, confidence, userId }) {
  const client = await clientPromise
  const db = client.db()

  return await db.collection("gaps").insertOne({
    query,
    confidence,
    userId,
    resolved: false,
    createdAt: new Date(),
  })
}

export async function getKnowledgeGaps(userId) {
  const client = await clientPromise
  const db = client.db()

  return await db.collection("gaps").find({ userId, resolved: false }).sort({ createdAt: -1 }).toArray()
}

export async function resolveKnowledgeGap(gapId, userId) {
  const client = await clientPromise
  const db = client.db()

  return await db.collection("gaps").updateOne({ _id: gapId, userId }, { $set: { resolved: true } })
}
