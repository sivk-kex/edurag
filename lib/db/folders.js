import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function createFolder({ name, description, userId }) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("folders").insertOne({
    name,
    description,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return result.insertedId
}

export async function getFolders(userId) {
  const client = await clientPromise
  const db = client.db()

  const folders = await db.collection("folders").find({ userId }).sort({ name: 1 }).toArray()

  // Get document count for each folder
  const folderIds = folders.map((folder) => folder._id)
  const documentCounts = await db
    .collection("documents")
    .aggregate([{ $match: { folderId: { $in: folderIds } } }, { $group: { _id: "$folderId", count: { $sum: 1 } } }])
    .toArray()

  // Create a map of folder ID to document count
  const countMap = documentCounts.reduce((map, item) => {
    map[item._id.toString()] = item.count
    return map
  }, {})

  // Add document count to each folder
  return folders.map((folder) => ({
    ...folder,
    documentCount: countMap[folder._id.toString()] || 0,
  }))
}

export async function getFolder(folderId, userId) {
  const client = await clientPromise
  const db = client.db()

  return await db.collection("folders").findOne({ _id: new ObjectId(folderId), userId })
}
