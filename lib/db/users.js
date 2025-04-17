import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getUser(userId) {
  try {
    const client = await clientPromise
    const db = client.db()

    return await db.collection("users").findOne({ _id: new ObjectId(userId) })
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}
