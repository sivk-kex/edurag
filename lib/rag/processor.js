import { readFile } from "fs/promises"
import { embed } from "ai"
import { openai } from "@ai-sdk/openai"
import * as cheerio from "cheerio"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function processDocument(filePath, fileType) {
  let content = ""

  // Extract text based on file type
  if (fileType.includes("pdf")) {
    const loader = new PDFLoader(filePath)
    const docs = await loader.load()
    content = docs.map((doc) => doc.pageContent).join("\n\n")
  } else if (fileType.includes("text")) {
    content = await readFile(filePath, "utf-8")
  } else if (fileType.includes("html")) {
    const html = await readFile(filePath, "utf-8")
    const $ = cheerio.load(html)
    content = $("body").text()
  } else {
    // For other file types, we might need specific extractors
    content = "File content not extractable"
  }

  // Split content into chunks
  const chunks = splitIntoChunks(content)

  // Generate embeddings for chunks
  const embeddedChunks = await generateEmbeddings(chunks)

  return {
    content,
    chunks: embeddedChunks,
  }
}

function splitIntoChunks(text, maxChunkSize = 1000) {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks = []
  let currentChunk = ""

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      chunks.push(currentChunk)
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

async function generateEmbeddings(chunks) {
  const embeddedChunks = []

  for (const chunk of chunks) {
    try {
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: chunk,
      })

      embeddedChunks.push({
        text: chunk,
        embedding,
      })
    } catch (error) {
      console.error("Error generating embedding:", error)
    }
  }

  return embeddedChunks
}
