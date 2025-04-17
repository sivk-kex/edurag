# Educational RAG Chatbot

A Retrieval-Augmented Generation (RAG) based AI chatbot embedded inside a no-code training portal for educational institutions.

##  Overview

This project allows educational institutions to build and manage a knowledge repository (text, images, videos, PDFs, and web links) that an AI chatbot uses to generate accurate responses to student/user queries.

##  Features

- **RAG-based AI Chatbot**: Uses OpenAI's models with vector search for knowledge-based responses
- **No-Code Training Portal**: Upload and manage various content types without coding
- **GitHub OAuth Authentication**: Secure login system for institutional users
- **Confidence Scoring**: Automatically identifies knowledge gaps with low-confidence answers
- **Local File Storage**: Efficient document management with MongoDB references
- **Folder Organization**: Structured content organization for better retrieval

##  Tech Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js with GitHub OAuth
- **AI/ML**: LangChain, OpenAI embeddings and GPT models
- **File Processing**: PDF parsing, text extraction

##  Installation Guide

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- GitHub account (for OAuth setup)
- OpenAI API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/educational-rag-chatbot.git
cd educational-rag-chatbot
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: GitHub OAuth Setup

1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Set the following:
   - Application name: Educational RAG Chatbot
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
3. Register the application and copy the Client ID and Client Secret to your `.env.local` file

### Step 5: Create Upload Directory

Create a directory for file uploads:

```bash
mkdir -p uploads
```

### Step 6: Run the Development Server

```bash
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000)


##  AI Models and Implementation Details

### Vector Embeddings

This project uses **OpenAI's text-embedding-3-small** model to generate vector embeddings for text chunks. These embeddings capture the semantic meaning of text, allowing for efficient similarity search.

### LLM for Response Generation

We use **GPT-3.5-turbo** as our large language model for generating responses. It provides a good balance between performance and cost.

### Document Processing Flow

1. Files are uploaded and stored locally
2. Text is extracted based on file type:
   ```javascript
   export async function processDocument(filePath, fileType) {
     let content = ""
   
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
   ```

3. Content is split into smaller chunks (1000 characters with overlap)
4. Embedding vectors are generated for each chunk
5. Chunks and their embeddings are stored in MongoDB

### Confidence Score Calculation

The system evaluates response confidence using multiple factors:

```javascript
export function calculateConfidence(response, relevantDocs) {
    // Base confidence starts at 50%
    let confidence = 50
  
    // If no relevant docs were found, confidence is lower
    if (relevantDocs.length === 0) {
      return 30
    }
  
    // Check for uncertainty phrases
    const uncertaintyPhrases = [
      "I don't have enough information",
      "I don't know",
      "I'm not sure",
      "cannot find",
      "no information",
      "unclear",
    ]
  
    for (const phrase of uncertaintyPhrases) {
      if (response.toLowerCase().includes(phrase.toLowerCase())) {
        confidence -= 20
        break
      }
    }
  
    // Consider document similarity scores
    const avgSimilarity = relevantDocs.reduce((sum, doc) => sum + (doc.similarity || 0), 0) / relevantDocs.length
    confidence += avgSimilarity * 40 // Scale similarity (0-1) to a 0-40 range
  
    // Add confidence for detailed responses
    if (response.length > 200) {
      confidence += 10
    }
  
    // Cap confidence between 0 and 100
    return Math.min(100, Math.max(0, Math.round(confidence)))
}
```

### Document Retrieval Implementation

The system retrieves relevant documents using semantic similarity:

```javascript
export async function getRelevantDocuments(query, userId, limit = 5) {
  try {
    // Generate embedding for the query
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    })
    
    // Get all chunks for the user
    const chunks = await db.collection("chunks").find({ userId }).toArray()
    
    // Calculate similarity scores
    const scoredChunks = chunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(embedding, chunk.embedding),
    }))
    
    // Sort by similarity and take top results
    const topChunks = scoredChunks
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
    
    // Get full document information
    const documentIds = [...new Set(topChunks.map((chunk) => chunk.documentId))]
    const documents = await db
      .collection("documents")
      .find({ _id: { $in: documentIds } })
      .toArray()
    
    // Return processed results with document metadata
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
```

##  Implementation Choices

### Why These Parameter Values?

1. **Chunk Size (1000 characters)**:
   - Balances context preservation with specificity
   - Prevents token limits in LLM context windows
   - Allows for more targeted retrieval

2. **Chunk Overlap (200 characters)**:
   - Ensures concepts that span chunk boundaries aren't lost
   - Improves retrieval accuracy for concepts that might be split

3. **Top K Retrieval (5 documents)**:
   - Provides sufficient context without overwhelming the LLM
   - Balances relevance with processing time and token costs
   - Reduces the chance of including irrelevant information

4. **Cosine Similarity for Ranking**:
   - Direction-based similarity (not magnitude-dependent)
   - Well-suited for comparing embedding vectors
   - Fast computation for real-time applications

5. **Confidence Base Score (50%)**:
   - Neutral starting point allows for fair evaluation
   - Avoids bias toward excessively high or low confidence
   - Provides room for both upward and downward adjustments

6. **Similarity Contribution (40% of score)**:
   - Higher weight to semantic relevance
   - Reflects importance of document match quality
   - Scaled to maintain overall score balance

##  Usage Guide

### 1. Authentication

1. Access the application at http://localhost:3000
2. Click on "Sign In with GitHub"
3. Authorize the application

### 2. Creating Knowledge Base

1. Create folders to organize your content (e.g., "Admissions," "Courses")
2. Upload relevant files to each folder:
   - Text files (.txt)
   - PDFs (.pdf)
   - Add web links

### 3. Testing the Chatbot

1. Navigate to the "Test Chatbot" section
2. Ask questions related to your uploaded content
3. Review confidence scores for each response
4. Check the "Knowledge Gaps" section for low-confidence answers

### 4. Embedding on Your Website

1. Go to "Embed Settings"
2. Configure appearance options
3. Copy the generated embed code
4. Paste into your website's HTML

## 🔧 Troubleshooting

- **File Upload Issues**: Ensure the "uploads" directory exists and has write permissions
- **Authentication Errors**: Verify GitHub OAuth credentials in the .env file
- **MongoDB Connection**: Check your MongoDB connection string and network access settings
- **RAG Not Working**: Ensure OpenAI API key is valid and has sufficient quota

##  Future Improvements

- Add multi-language support
- Implement usage analytics
- Add support for more file types (DOCX, PPTX)
- Integrate with LMS platforms
- Add batch processing for large document sets
- Add faster OAuth methods 
- Add improvements to UI and design