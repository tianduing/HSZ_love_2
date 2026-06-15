function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function truncateText(value, maxLength = 220) {
  const text = cleanText(value).replace(/\s+/g, " ");
  if (!text) {
    return "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function normalizeSearchText(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function pushHanTokens(tokenSet, group) {
  if (!group) {
    return;
  }
  tokenSet.add(group);
  if (group.length === 1) {
    return;
  }
  for (let index = 0; index < group.length; index += 1) {
    tokenSet.add(group.slice(index, index + 1));
  }
  for (let index = 0; index < group.length - 1; index += 1) {
    tokenSet.add(group.slice(index, index + 2));
  }
  for (let index = 0; index < group.length - 2; index += 1) {
    tokenSet.add(group.slice(index, index + 3));
  }
}

function tokenizeSearchText(value) {
  const normalized = normalizeSearchText(value);
  if (!normalized) {
    return [];
  }

  const tokenSet = new Set();
  const latinTokens = normalized.match(/[a-z0-9][a-z0-9._#+:/-]*/g) || [];
  latinTokens.forEach((token) => {
    if (token.length >= 2) {
      tokenSet.add(token);
    }
  });

  const hanGroups = normalized.match(/[\u4e00-\u9fff]+/g) || [];
  hanGroups.forEach((group) => {
    pushHanTokens(tokenSet, group);
  });

  return [...tokenSet].filter(Boolean).slice(0, 256);
}

function buildCitationLabel(pageStart, pageEnd) {
  if (pageStart === pageEnd) {
    return `第 ${pageStart} 页`;
  }
  return `第 ${pageStart}-${pageEnd} 页`;
}

function buildChunkSearchText(document, chunk) {
  return [
    cleanText(document?.name),
    cleanText(chunk?.label),
    cleanText(chunk?.preview),
    cleanText(chunk?.text)
  ]
    .filter(Boolean)
    .join("\n");
}

function scoreChunkMatch(queryTokens, normalizedQuery, document, chunk) {
  const searchText = buildChunkSearchText(document, chunk);
  if (!searchText) {
    return 0;
  }

  const normalizedText = normalizeSearchText(searchText);
  const chunkTokenSet = new Set(tokenizeSearchText(searchText));
  let score = 0;

  queryTokens.forEach((token) => {
    if (chunkTokenSet.has(token)) {
      score += token.length >= 4 ? 4 : token.length === 3 ? 3 : 2;
      return;
    }
    if (normalizedText.includes(token)) {
      score += 1;
    }
  });

  if (normalizedQuery && normalizedText.includes(normalizedQuery)) {
    score += Math.max(4, Math.min(18, Math.round(normalizedQuery.length / 3)));
  }

  if (cleanText(chunk?.label) && normalizedQuery && normalizeSearchText(chunk.label).includes(normalizedQuery)) {
    score += 6;
  }

  return score;
}

function rankDocumentChunks(sourceDocuments = [], queryText, options = {}) {
  const limit = Math.max(1, Number(options.limit || 3));
  const normalizedQuery = normalizeSearchText(queryText);
  const queryTokens = tokenizeSearchText(queryText);
  if (!normalizedQuery && !queryTokens.length) {
    return [];
  }

  const matches = [];
  sourceDocuments.forEach((document) => {
    (document?.chunks || []).forEach((chunk) => {
      const score = scoreChunkMatch(queryTokens, normalizedQuery, document, chunk);
      if (score <= 0) {
        return;
      }
      matches.push({
        document,
        chunk,
        score
      });
    });
  });

  return matches
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      if ((left.chunk?.pageStart || 0) !== (right.chunk?.pageStart || 0)) {
        return (left.chunk?.pageStart || 0) - (right.chunk?.pageStart || 0);
      }
      return String(left.document?.name || "").localeCompare(String(right.document?.name || ""));
    })
    .slice(0, limit)
    .map((item, index) => ({
      evidenceId: `E${index + 1}`,
      documentId: item.document?.id || "",
      chunkId: item.chunk?.id || "",
      documentName: cleanText(item.document?.name) || "未命名材料",
      label: cleanText(item.chunk?.label) || buildCitationLabel(item.chunk?.pageStart || 0, item.chunk?.pageEnd || 0),
      pageStart: Number(item.chunk?.pageStart || 0),
      pageEnd: Number(item.chunk?.pageEnd || item.chunk?.pageStart || 0),
      preview: truncateText(item.chunk?.preview || item.chunk?.text, 220),
      text: cleanText(item.chunk?.text),
      score: Math.round(item.score * 10) / 10
    }));
}

function buildCitationRecord(entry) {
  return {
    documentId: entry.documentId || "",
    chunkId: entry.chunkId || "",
    documentName: cleanText(entry.documentName) || "未命名材料",
    label: cleanText(entry.label) || buildCitationLabel(entry.pageStart || 0, entry.pageEnd || entry.pageStart || 0),
    pageStart: Number(entry.pageStart || 0),
    pageEnd: Number(entry.pageEnd || entry.pageStart || 0),
    preview: truncateText(entry.preview || entry.text, 220)
  };
}

function buildDocumentChunkIndex(sourceDocuments = []) {
  const documentMap = new Map();
  const chunkMap = new Map();
  sourceDocuments.forEach((document) => {
    const documentId = cleanText(document?.id);
    if (!documentId) {
      return;
    }
    documentMap.set(documentId, document);
    (document?.chunks || []).forEach((chunk) => {
      const chunkId = cleanText(chunk?.id);
      if (!chunkId) {
        return;
      }
      chunkMap.set(`${documentId}:${chunkId}`, {
        document,
        chunk
      });
    });
  });
  return {
    documentMap,
    chunkMap
  };
}

function hydrateCitationRecords(citations = [], sourceDocuments = [], options = {}) {
  const limit = Math.max(1, Number(options.limit || citations.length || 1));
  const { chunkMap } = buildDocumentChunkIndex(sourceDocuments);
  return citations
    .map((citation, index) => {
      const documentId = cleanText(citation?.documentId);
      const chunkId = cleanText(citation?.chunkId);
      const indexed = chunkMap.get(`${documentId}:${chunkId}`) || null;
      const chunk = indexed?.chunk || null;
      return {
        evidenceId: cleanText(citation?.evidenceId) || `E${index + 1}`,
        documentId,
        chunkId,
        documentName: cleanText(citation?.documentName) || cleanText(indexed?.document?.name) || "未命名材料",
        label: cleanText(citation?.label) || cleanText(chunk?.label) || buildCitationLabel(citation?.pageStart || chunk?.pageStart || 0, citation?.pageEnd || chunk?.pageEnd || chunk?.pageStart || 0),
        pageStart: Number(citation?.pageStart || chunk?.pageStart || 0),
        pageEnd: Number(citation?.pageEnd || chunk?.pageEnd || chunk?.pageStart || 0),
        preview: truncateText(citation?.preview || chunk?.preview || chunk?.text, 220),
        text: cleanText(chunk?.text)
      };
    })
    .filter((citation) => citation.documentName && citation.label)
    .slice(0, limit);
}

function citationsFromEvidenceIds(evidenceEntries = [], ids = [], options = {}) {
  const limit = Math.max(1, Number(options.limit || 2));
  const fallbackLimit = Math.max(0, Number(options.fallbackLimit || 0));
  const evidenceMap = new Map(evidenceEntries.map((entry) => [entry.evidenceId, entry]));
  const picked = [];
  const seen = new Set();

  (Array.isArray(ids) ? ids : []).forEach((id) => {
    const evidence = evidenceMap.get(cleanText(id));
    if (!evidence) {
      return;
    }
    const key = `${evidence.documentId}:${evidence.chunkId}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    picked.push(buildCitationRecord(evidence));
  });

  if (!picked.length && fallbackLimit > 0) {
    evidenceEntries.slice(0, fallbackLimit).forEach((entry) => {
      const key = `${entry.documentId}:${entry.chunkId}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      picked.push(buildCitationRecord(entry));
    });
  }

  return picked.slice(0, limit);
}

function formatEvidenceContext(evidenceEntries = [], maxChars = 4200) {
  let totalChars = 0;
  const sections = [];
  evidenceEntries.forEach((entry) => {
    if (totalChars >= maxChars) {
      return;
    }
    const section = [
      `[${entry.evidenceId}] ${entry.documentName} / ${entry.label}`,
      entry.text || entry.preview || ""
    ]
      .filter(Boolean)
      .join("\n");
    const nextLength = totalChars + section.length + 2;
    if (nextLength > maxChars) {
      const remaining = maxChars - totalChars - 2;
      if (remaining > 160) {
        sections.push(`${section.slice(0, remaining - 3)}...`);
      }
      totalChars = maxChars;
      return;
    }
    sections.push(section);
    totalChars = nextLength;
  });
  return sections.join("\n\n").trim();
}

function summarizeCitationTargets(citations = []) {
  if (!citations.length) {
    return "";
  }
  return citations
    .map((citation) => `${citation.documentName} ${citation.label}`)
    .join("、");
}

module.exports = {
  buildCitationLabel,
  buildCitationRecord,
  citationsFromEvidenceIds,
  formatEvidenceContext,
  hydrateCitationRecords,
  rankDocumentChunks,
  summarizeCitationTargets,
  tokenizeSearchText
};
