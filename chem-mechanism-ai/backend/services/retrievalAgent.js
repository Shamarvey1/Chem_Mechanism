
const { getDocumentIndex } = require('./documentIngestionAgent');

const TOP_K           = 1;
const MIN_SCORE       = 0.08;
const MAX_CHUNK_CHARS = 1500;

function tokenizeQuery(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2)
  );
}

function keywordScore(queryTokens, chunkTokens) {
  if (!chunkTokens || chunkTokens.size === 0 || queryTokens.size === 0) return 0;
  let overlap = 0;
  for (const t of queryTokens) {
    if (chunkTokens.has(t)) overlap++;
  }
  // Normalize by query token count so shorter queries still score well
  return overlap / queryTokens.size;
}

async function retrieve(query, topK = TOP_K) {
  const index = await getDocumentIndex();
  if (!index.length) {
    console.warn('[RetrievalAgent] Document index is empty.');
    return [];
  }

  const queryTokens = tokenizeQuery(query);

  const scored = index.map(chunk => ({
    id:      chunk.id,
    source:  chunk.source,
    content: chunk.content.slice(0, MAX_CHUNK_CHARS),
    score:   keywordScore(queryTokens, chunk.tokens),
  }));

  const results = scored
    .filter(r => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (results.length > 0) {
    console.log(`[RetrievalAgent] ⚡ Keyword match found ${results.length} result(s) for "${query}" (top score: ${results[0].score.toFixed(3)})`);
    results.forEach(r => console.log(`  → [${r.source}] keyword_score=${r.score.toFixed(3)}`));
  } else {
    console.log(`[RetrievalAgent] No keyword matches for "${query}" — LLM fallback will be used.`);
  }

  return results;
}

// hasConfidentMatch kept for API compatibility
function hasConfidentMatch(results) {
  return results && results.length > 0 && results[0].score >= 0.2;
}

module.exports = { retrieve, hasConfidentMatch };
