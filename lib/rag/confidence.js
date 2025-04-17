export function calculateConfidence(response, relevantDocs) {
    // Base confidence starts at 50%
    let confidence = 50
  
    // If no relevant docs were found, confidence is lower
    if (relevantDocs.length === 0) {
      return 30
    }
  
    // Check if the response contains phrases indicating uncertainty
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
  
    // Add confidence based on the similarity scores of relevant documents
    const avgSimilarity = relevantDocs.reduce((sum, doc) => sum + (doc.similarity || 0), 0) / relevantDocs.length
    confidence += avgSimilarity * 40 // Scale similarity (0-1) to a 0-40 range
  
    // Add confidence if the response is detailed (longer)
    if (response.length > 200) {
      confidence += 10
    }
  
    // Cap confidence between 0 and 100
    return Math.min(100, Math.max(0, Math.round(confidence)))
  }
  