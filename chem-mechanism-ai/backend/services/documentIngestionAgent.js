
const fs   = require('fs');
const path = require('path');

const DOCS_DIR     = path.join(__dirname, '..', 'docs');
const CHUNK_SIZE   = 75;
const CHUNK_OVERLAP = 10;

let _documentIndex = null;

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Build a Set of unique tokens for a chunk (for fast intersection scoring)
function buildTokenSet(text) {
  return new Set(tokenize(text));
}

function chunkDocument(text, filename) {
  const lines  = text.split('\n');
  const chunks = [];
  let i = 0;
  while (i < lines.length) {
    const slice   = lines.slice(i, i + CHUNK_SIZE);
    const content = slice.join('\n').trim();
    if (content.length > 40) {
      chunks.push({
        id:      `${filename}::chunk-${chunks.length}`,
        source:  filename,
        content,
        tokens:  buildTokenSet(content), // pre-built token set for fast scoring
      });
    }
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

async function loadDocuments() {
  if (_documentIndex) return _documentIndex; // already loaded

  if (!fs.existsSync(DOCS_DIR)) {
    console.warn(`[DocumentIngestionAgent] docs/ directory not found at ${DOCS_DIR}`);
    _documentIndex = [];
    return _documentIndex;
  }

  function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, '/', file));
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

  _documentIndex = allChunks;
  console.log(`[DocumentIngestionAgent] ⚡ Keyword index ready: ${allChunks.length} chunks (no ML, instant startup)`);
  return _documentIndex;
}

async function reloadDocuments() {
  _documentIndex = null;
  return loadDocuments();
}

async function getDocumentIndex() {
  return loadDocuments();
}

// Kept for API compatibility — no longer used for retrieval, returns null
async function generateEmbedding(_text) {
  return null;
}

module.exports = { getDocumentIndex, reloadDocuments, generateEmbedding };
