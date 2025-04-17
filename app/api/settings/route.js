import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name } = await req.json()

    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne({ _id: session.user.id }, { $set: { name } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings API error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
