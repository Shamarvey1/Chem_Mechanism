
const fs   = require('fs');
const path = require('path');
const DOCS_DIR    = path.join(__dirname, '..', 'docs');
const CHUNK_SIZE  = 75;   
const CHUNK_OVERLAP = 10; 
let _documentIndex = null;
let embedder = null;
async function getEmbedder() {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}
async function generateEmbedding(text) {
  const model = await getEmbedder();
  const result = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data); 
}
function chunkDocument(text, filename) {
  const lines  = text.split('\n');
  const chunks = [];
  let i = 0;
  while (i < lines.length) {
    const slice = lines.slice(i, i + CHUNK_SIZE);
    const content = slice.join('\n').trim();
    if (content.length > 40) { 
      chunks.push({
        id:       `${filename}::chunk-${chunks.length}`,
        source:   filename,
        content
      });
    }
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}
async function loadDocuments() {
  if (_documentIndex) return _documentIndex; 
  if (!fs.existsSync(DOCS_DIR)) {
    console.warn(`[DocumentIngestionAgent] docs/ directory not found at ${DOCS_DIR}`);
    _documentIndex = [];
    return _documentIndex;
  }
  function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    });
    return arrayOfFiles;
  }
  const files = getAllFiles(DOCS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  if (files.length === 0) {
    console.warn('[DocumentIngestionAgent] No documents found in docs/ directory.');
    _documentIndex = [];
    return _documentIndex;
  }
  const allChunks = [];
  for (const filePath of files) {
    const text     = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const chunks   = chunkDocument(text, fileName);
    allChunks.push(...chunks);
  }
  console.log(`[DocumentIngestionAgent] Found ${allChunks.length} chunks. Generating vector embeddings... (this may take a moment)`);
  for (const chunk of allChunks) {
    chunk.embedding = await generateEmbedding(chunk.content);
  }
  _documentIndex = allChunks;
  console.log(`[DocumentIngestionAgent] ✓ Vector Database Index ready: ${allChunks.length} embedded chunks`);
  return _documentIndex;
}
async function reloadDocuments() {
  _documentIndex = null;
  return loadDocuments();
}
async function getDocumentIndex() {
  return loadDocuments();
}
module.exports = { getDocumentIndex, reloadDocuments, generateEmbedding };
