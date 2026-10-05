
const { getDocumentIndex, generateEmbedding } = require('./documentIngestionAgent');
const TOP_K           = 2;    
const MIN_SCORE       = 0.35; 
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
async function retrieve(query, topK = TOP_K) {
  const index = await getDocumentIndex();
  if (!index.length) {
    console.warn('[RetrievalAgent] Vector index is empty.');
    return [];
  }
  const queryEmbedding = await generateEmbedding(query);
  const scored = index.map(chunk => ({
    id:      chunk.id,
    source:  chunk.source,
    content: chunk.content,
    score:   cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  const results = scored
    .filter(r => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  if (results.length > 0) {
    console.log(`[RetrievalAgent (Vector DB)] Found ${results.length} semantic match(s) for "${query}" (top score: ${results[0].score.toFixed(3)})`);
    results.forEach(r => console.log(`  → [${r.source}] similarity=${r.score.toFixed(3)}`));
  } else {
    console.log(`[RetrievalAgent (Vector DB)] No semantic matches found for "${query}" — LLM fallback will be used.`);
  }
  return results;
}
module.exports = { retrieve };
