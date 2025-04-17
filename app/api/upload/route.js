import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { addDocument } from "@/lib/db/documents"
import { processDocument } from "@/lib/rag/processor"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const title = formData.get("title")
    const description = formData.get("description")
    const folderId = formData.get("folderId")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create unique filename
    const fileId = uuidv4()
    const fileName = `${fileId}-${file.name}`
    const filePath = join(process.cwd(), "uploads", fileName)

    // Save file to local storage
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Process document for RAG
    const { content, chunks } = await processDocument(filePath, file.type)

    // Add document to database
    await addDocument({
      title,
      description,
      fileName,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      content,
      chunks,
      folderId,
      userId: session.user.id,
    })

    return NextResponse.json({ success: true, fileName })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
}
