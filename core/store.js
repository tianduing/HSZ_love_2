const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DB_FILE_NAME = "study-quest-db.json";
const STORAGE_VERSION = 3;
const MAX_STORED_TIMELINE_ITEMS = 60;
const MAX_DURATION_SECONDS = 12 * 60 * 60;
const MAX_DOCUMENT_PREVIEW_PAGES = 12;
const MAX_DOCUMENT_CHUNKS = 64;

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clampNumber(value, min, max, fallback = min) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numeric));
}

function truncateText(value, maxLength = 120) {
  const text = cleanText(value).replace(/\s+/g, " ");
  if (!text) {
    return "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function toIsoDateKey(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function diffDurationSeconds(startedAt, endedAt) {
  const start = startedAt ? new Date(startedAt).getTime() : NaN;
  const end = endedAt ? new Date(endedAt).getTime() : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }
  return clampNumber(Math.round((end - start) / 1000), 0, MAX_DURATION_SECONDS, 0);
}

function sanitizeQuestTags(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map(cleanText).filter(Boolean))].slice(0, 12);
  }
  const text = cleanText(input);
  if (!text) {
    return [];
  }
  return [...new Set(
    text
      .split(/[,\n，、]/)
      .map(cleanText)
      .filter(Boolean)
  )].slice(0, 12);
}

function normalizeQuestStatus(status) {
  return cleanText(status) === "archived" ? "archived" : "active";
}

function normalizeQuestCategory(value) {
  return truncateText(value, 40);
}

function deriveTopicFromInput(input) {
  const explicitTopic = cleanText(input?.topic);
  if (explicitTopic) {
    return explicitTopic;
  }

  const material = cleanText(input?.material).replace(/\s+/g, " ");
  if (!material) {
    return "未命名学习项目";
  }

  const firstLine = material
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || material;
  const normalized = firstLine.replace(/^[#>*\-\d.\s:：]+/, "").trim();
  const sentence = normalized.split(/[。！？!?|]/)[0].trim();
  const candidate = sentence || normalized || material;
  return candidate.length > 28 ? `${candidate.slice(0, 28)}...` : candidate;
}

function inferLearnerTier(levelText) {
  const normalized = cleanText(levelText).toLowerCase();
  if (!normalized) {
    return "intermediate";
  }
  if (/(零基础|入门|初学|新手|小白|基础|beginner|starter|junior|初级)/.test(normalized)) {
    return "beginner";
  }
  if (/(高级|资深|熟练|研究|面试|advanced|senior|expert|高阶|拔高)/.test(normalized)) {
    return "advanced";
  }
  return "intermediate";
}

function getMaxFollowUpDepth(levelText) {
  return inferLearnerTier(levelText) === "beginner" ? 1 : 2;
}

function getFollowUpDepth(node) {
  const pathText = cleanText(node?.path);
  if (!pathText) {
    return 0;
  }
  return Math.max(0, pathText.split(".").length - 1);
}

function canCreateFollowUp(quest, node) {
  return getFollowUpDepth(node) < getMaxFollowUpDepth(quest?.level);
}

function getDefaultSettings() {
  return {
    provider: "OpenAI",
    baseUrl: "https://codex.ximuai.com",
    model: "gpt-5.4",
    defaultTemplateKey: "general",
    defaultRootQuestionCount: 10,
    allowFollowUpQuestions: true,
    preferredDataRoot: "",
    apiKey: ""
  };
}

function createDefaultState() {
  const now = new Date().toISOString();
  return {
    meta: {
      createdAt: now,
      updatedAt: now,
      version: STORAGE_VERSION
    },
    settings: getDefaultSettings(),
    quests: []
  };
}

function ensureDataRoot(dataRoot) {
  fs.mkdirSync(dataRoot, { recursive: true });
}

function getDbPath(dataRoot) {
  return path.join(dataRoot, DB_FILE_NAME);
}

function ensureStateFile(dataRoot) {
  ensureDataRoot(dataRoot);
  const dbPath = getDbPath(dataRoot);
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(createDefaultState(), null, 2), "utf-8");
  }
  return dbPath;
}

function normalizeAttempt(attempt, index) {
  const createdAt = attempt?.createdAt || new Date().toISOString();
  const answer = cleanText(attempt?.answer);
  return {
    id: attempt?.id || crypto.randomUUID(),
    mode: attempt?.mode === "review" ? "review" : "learn",
    attemptNumber: clampNumber(attempt?.attemptNumber ?? index + 1, 1, 9999, index + 1),
    answer,
    answerPreview: cleanText(attempt?.answerPreview) || truncateText(answer, 90),
    verdict: cleanText(attempt?.verdict),
    score: Number.isFinite(Number(attempt?.score)) ? clampNumber(attempt.score, 0, 100, 0) : null,
    coachReply: cleanText(attempt?.coachReply),
    hint: cleanText(attempt?.hint),
    strengths: Array.isArray(attempt?.strengths) ? attempt.strengths.map(cleanText).filter(Boolean).slice(0, 3) : [],
    gaps: Array.isArray(attempt?.gaps) ? attempt.gaps.map(cleanText).filter(Boolean).slice(0, 3) : [],
    missing: Array.isArray(attempt?.missing) ? attempt.missing.map(cleanText).filter(Boolean).slice(0, 3) : [],
    improve: cleanText(attempt?.improve),
    citations: Array.isArray(attempt?.citations)
      ? attempt.citations.map((citation) => ({
          documentId: cleanText(citation?.documentId),
          chunkId: cleanText(citation?.chunkId),
          documentName: truncateText(citation?.documentName, 120),
          label: truncateText(citation?.label, 60),
          pageStart: clampNumber(citation?.pageStart ?? 0, 0, 99999, 0),
          pageEnd: clampNumber(citation?.pageEnd ?? citation?.pageStart ?? 0, 0, 99999, 0),
          preview: truncateText(citation?.preview, 220)
        })).filter((citation) => citation.documentName && citation.label).slice(0, 3)
      : [],
    evidenceNote: cleanText(attempt?.evidenceNote),
    durationSeconds: clampNumber(attempt?.durationSeconds ?? 0, 0, MAX_DURATION_SECONDS, 0),
    createdAt
  };
}

function normalizeSourceDocument(document, index) {
  const importedAt = document?.importedAt || new Date().toISOString();
  const pages = Array.isArray(document?.pages)
    ? document.pages
        .map((page, pageIndex) => ({
          pageNumber: clampNumber(page?.pageNumber ?? pageIndex + 1, 1, 99999, pageIndex + 1),
          charCount: clampNumber(page?.charCount ?? cleanText(page?.preview).length, 0, 10_000_000, 0),
          preview: truncateText(page?.preview, 180)
        }))
        .slice(0, MAX_DOCUMENT_PREVIEW_PAGES)
    : [];
  const chunks = Array.isArray(document?.chunks)
    ? document.chunks
        .map((chunk, chunkIndex) => {
          const text = cleanText(chunk?.text);
          return {
            id: chunk?.id || crypto.randomUUID(),
            label: cleanText(chunk?.label) || `Chunk ${chunkIndex + 1}`,
            pageStart: clampNumber(chunk?.pageStart ?? chunkIndex + 1, 1, 99999, chunkIndex + 1),
            pageEnd: clampNumber(chunk?.pageEnd ?? chunk?.pageStart ?? chunkIndex + 1, 1, 99999, chunkIndex + 1),
            preview: truncateText(chunk?.preview || text, 220),
            text
          };
        })
        .filter((chunk) => chunk.text)
        .slice(0, MAX_DOCUMENT_CHUNKS)
    : [];
  const characterCount = clampNumber(
    document?.characterCount ?? chunks.reduce((sum, chunk) => sum + chunk.text.length, 0),
    0,
    50_000_000,
    0
  );
  return {
    id: document?.id || crypto.randomUUID(),
    kind: "pdf",
    name: truncateText(document?.name || `材料 ${index + 1}`, 120),
    pageCount: clampNumber(document?.pageCount ?? pages.length, 0, 99999, pages.length),
    characterCount,
    importedAt,
    pages,
    chunks
  };
}

function normalizeNode(node, index, fallbackTimestamp) {
  const updatedAt = node?.updatedAt || fallbackTimestamp;
  const status = ["pending", "active", "completed"].includes(node?.status) ? node.status : "pending";
  const attempts = Array.isArray(node?.attempts) ? node.attempts.map(normalizeAttempt) : [];
  return {
    id: node?.id || crypto.randomUUID(),
    path: cleanText(node?.path) || `Q${index + 1}`,
    parentId: node?.parentId || null,
    sortOrder: clampNumber(node?.sortOrder ?? index + 1, 1, 999999, index + 1),
    title: cleanText(node?.title) || `问题 ${index + 1}`,
    goal: cleanText(node?.goal),
    whyItMatters: cleanText(node?.whyItMatters),
    difficulty: clampNumber(node?.difficulty ?? 3, 1, 5, 3),
    status,
    source: cleanText(node?.source) || "roadmap",
    attempts,
    reviewCount: clampNumber(node?.reviewCount ?? 0, 0, 999999, 0),
    lastReviewAt: node?.lastReviewAt || null,
    citations: Array.isArray(node?.citations)
      ? node.citations.map((citation) => ({
          documentId: cleanText(citation?.documentId),
          chunkId: cleanText(citation?.chunkId),
          documentName: truncateText(citation?.documentName, 120),
          label: truncateText(citation?.label, 60),
          pageStart: clampNumber(citation?.pageStart ?? 0, 0, 99999, 0),
          pageEnd: clampNumber(citation?.pageEnd ?? citation?.pageStart ?? 0, 0, 99999, 0),
          preview: truncateText(citation?.preview, 220)
        })).filter((citation) => citation.documentName && citation.label).slice(0, 3)
      : [],
    evidenceNote: cleanText(node?.evidenceNote),
    createdAt: node?.createdAt || updatedAt,
    updatedAt,
    completedAt: node?.completedAt || null,
    activeSince: status === "active" ? (node?.activeSince || updatedAt) : null
  };
}

function normalizeTimelineEntry(entry) {
  return {
    id: entry?.id || crypto.randomUUID(),
    kind: cleanText(entry?.kind) || "activity",
    summary: cleanText(entry?.summary) || "学习记录已更新",
    createdAt: entry?.createdAt || new Date().toISOString()
  };
}

function getNodeSegments(node) {
  return String(node.path || "")
    .replace(/^Q/, "")
    .split(".")
    .map((part) => Number(part));
}

function compareNodesByPath(left, right) {
  const leftParts = getNodeSegments(left);
  const rightParts = getNodeSegments(right);
  const size = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < size; index += 1) {
    const leftValue = leftParts[index] ?? -1;
    const rightValue = rightParts[index] ?? -1;
    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }
  return 0;
}

function sortNodesByOrder(left, right) {
  const orderDiff = (left.sortOrder || 0) - (right.sortOrder || 0);
  if (orderDiff !== 0) {
    return orderDiff;
  }
  return compareNodesByPath(left, right);
}

function getChildrenMap(nodes) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const childrenByParent = new Map();
  nodes.forEach((node) => {
    const parentKey = node.parentId && nodeIds.has(node.parentId) ? node.parentId : "__root__";
    if (!childrenByParent.has(parentKey)) {
      childrenByParent.set(parentKey, []);
    }
    childrenByParent.get(parentKey).push(node);
  });
  childrenByParent.forEach((children) => {
    children.sort(sortNodesByOrder);
  });
  return childrenByParent;
}

function reindexQuestNodes(quest) {
  const nodes = Array.isArray(quest.nodes) ? quest.nodes : [];
  const childrenByParent = getChildrenMap(nodes);
  const ordered = [];

  function walk(parentId, prefix = "Q") {
    const key = parentId || "__root__";
    const children = childrenByParent.get(key) || [];
    children.forEach((child, index) => {
      child.parentId = parentId || null;
      child.sortOrder = index + 1;
      child.path = prefix === "Q" ? `Q${index + 1}` : `${prefix}.${index + 1}`;
      ordered.push(child);
      walk(child.id, child.path);
    });
  }

  walk(null, "Q");
  quest.nodes = ordered;
  quest.rootQuestionCount = ordered.filter((node) => node.parentId === null).length;
  return ordered;
}

function getSiblingNodes(quest, parentId) {
  return (quest.nodes || [])
    .filter((node) => (node.parentId || null) === (parentId || null))
    .sort(sortNodesByOrder);
}

function getPendingNodes(quest) {
  return (quest.nodes || [])
    .filter((node) => node.status === "pending" || node.status === "active")
    .sort(compareNodesByPath);
}

function clearActiveStatus(quest) {
  (quest.nodes || []).forEach((item) => {
    if (item.status === "active") {
      item.status = "pending";
      item.activeSince = null;
    }
  });
}

function activateFirstPendingNodeSilently(quest) {
  const now = new Date().toISOString();
  const nextNode = getPendingNodes(quest)
    .find((node) => getFollowUpDepth(node) <= getMaxFollowUpDepth(quest.level)) || null;
  quest.currentNodeId = nextNode?.id || null;
  if (!nextNode) {
    return;
  }
  nextNode.status = "active";
  nextNode.updatedAt = now;
  nextNode.activeSince = now;
}

function markQuestFinishedIfNeeded(quest) {
  if (!(quest.nodes || []).length) {
    quest.finishedAt = null;
    quest.currentNodeId = null;
    return;
  }
  const unresolved = quest.nodes.some((node) => node.status === "pending" || node.status === "active");
  if (!unresolved) {
    quest.finishedAt = new Date().toISOString();
    quest.currentNodeId = null;
    appendTimeline(quest, "session-finished", "本轮学习主线已经全部完成。");
  }
}

function activateNextNode(quest) {
  const now = new Date().toISOString();
  const nextNode = getPendingNodes(quest)[0] || null;
  quest.currentNodeId = nextNode?.id || null;
  if (nextNode) {
    nextNode.status = "active";
    nextNode.updatedAt = now;
    nextNode.activeSince = now;
    quest.finishedAt = null;
  }
  markQuestFinishedIfNeeded(quest);
}

function repairQuestFollowUpDepth(quest) {
  const maxDepth = getMaxFollowUpDepth(quest.level);
  let removedCurrentNode = false;

  quest.nodes = [...(quest.nodes || [])].sort(compareNodesByPath).flatMap((node) => {
    if (getFollowUpDepth(node) <= maxDepth) {
      return [node];
    }
    if (node.id === quest.currentNodeId || node.status === "active") {
      removedCurrentNode = true;
    }
    if ((node.attempts?.length || 0) > 0 || node.status === "completed") {
      return [{
        ...node,
        status: "completed",
        activeSince: null
      }];
    }
    return [];
  });

  reindexQuestNodes(quest);

  const currentNode = (quest.nodes || []).find((node) => node.id === quest.currentNodeId) || null;
  const hasValidActiveNode = (quest.nodes || []).some(
    (node) => node.status === "active" && getFollowUpDepth(node) <= maxDepth
  );

  if (!currentNode || removedCurrentNode || !hasValidActiveNode) {
    clearActiveStatus(quest);
    activateFirstPendingNodeSilently(quest);
  }
}

function ensureQuestState(quest) {
  reindexQuestNodes(quest);
  repairQuestFollowUpDepth(quest);
  if (!(quest.nodes || []).length) {
    quest.finishedAt = null;
    quest.currentNodeId = null;
  }
}

function normalizeQuest(quest) {
  const fallbackTimestamp = quest?.updatedAt || quest?.createdAt || new Date().toISOString();
  const nodes = Array.isArray(quest?.nodes) ? quest.nodes.map((node, index) => normalizeNode(node, index, fallbackTimestamp)) : [];
  const activeNode = nodes.find((node) => node.status === "active") || null;
  const normalizedQuest = {
    id: quest?.id || crypto.randomUUID(),
    title: cleanText(quest?.title) || deriveTopicFromInput(quest),
    topic: cleanText(quest?.topic) || deriveTopicFromInput(quest),
    material: cleanText(quest?.material),
    level: cleanText(quest?.level),
    goal: cleanText(quest?.goal),
    timebox: cleanText(quest?.timebox),
    templateKey: cleanText(quest?.templateKey) || "general",
    rootQuestionCount: clampNumber(quest?.rootQuestionCount ?? nodes.filter((node) => node.parentId === null).length, 0, 999, 0),
    missionBrief: cleanText(quest?.missionBrief),
    launchNote: cleanText(quest?.launchNote),
    createdAt: quest?.createdAt || fallbackTimestamp,
    updatedAt: fallbackTimestamp,
    finishedAt: quest?.finishedAt || null,
    currentNodeId: quest?.currentNodeId || activeNode?.id || null,
    status: normalizeQuestStatus(quest?.status),
    category: normalizeQuestCategory(quest?.category),
    tags: sanitizeQuestTags(quest?.tags),
    sourceDocuments: Array.isArray(quest?.sourceDocuments) ? quest.sourceDocuments.map(normalizeSourceDocument) : [],
    nodes,
    timeline: Array.isArray(quest?.timeline)
      ? quest.timeline.map(normalizeTimelineEntry).slice(0, MAX_STORED_TIMELINE_ITEMS)
      : []
  };
  ensureQuestState(normalizedQuest);
  return normalizedQuest;
}

function loadState(dataRoot) {
  const dbPath = ensureStateFile(dataRoot);
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();
    return {
      ...defaults,
      ...parsed,
      meta: {
        ...defaults.meta,
        ...(parsed.meta || {}),
        version: STORAGE_VERSION
      },
      settings: (() => {
        const merged = {
          ...getDefaultSettings(),
          ...(parsed.settings || {})
        };
        if (!cleanText(parsed?.settings?.baseUrl) || cleanText(merged.baseUrl) === "https://api.openai.com/v1") {
          merged.baseUrl = getDefaultSettings().baseUrl;
        }
        return merged;
      })(),
      quests: Array.isArray(parsed.quests) ? parsed.quests.map(normalizeQuest) : []
    };
  } catch (_error) {
    const backupPath = `${dbPath}.corrupt-${Date.now()}.bak`;
    try {
      fs.copyFileSync(dbPath, backupPath);
    } catch (_backupError) {
      // Ignore backup failures and recover with a fresh state.
    }
    const freshState = createDefaultState();
    fs.writeFileSync(dbPath, JSON.stringify(freshState, null, 2), "utf-8");
    return freshState;
  }
}

function saveState(dataRoot, state) {
  const dbPath = ensureStateFile(dataRoot);
  const nextState = {
    ...state,
    meta: {
      ...(state.meta || {}),
      updatedAt: new Date().toISOString(),
      version: STORAGE_VERSION
    },
    quests: Array.isArray(state.quests) ? state.quests.map(normalizeQuest) : []
  };
  fs.writeFileSync(dbPath, JSON.stringify(nextState, null, 2), "utf-8");
  return nextState;
}

function updateState(dataRoot, updater) {
  const currentState = loadState(dataRoot);
  const nextState = updater(structuredClone(currentState));
  return saveState(dataRoot, nextState);
}

function createRootNode(planItem, index, isActive) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    path: `Q${index + 1}`,
    parentId: null,
    sortOrder: index + 1,
    title: cleanText(planItem?.title) || `问题 ${index + 1}`,
    goal: cleanText(planItem?.goal),
    whyItMatters: cleanText(planItem?.whyItMatters),
    difficulty: clampNumber(planItem?.difficulty ?? 3, 1, 5, 3),
    status: isActive ? "active" : "pending",
    source: "roadmap",
    attempts: [],
    reviewCount: 0,
    lastReviewAt: null,
    citations: Array.isArray(planItem?.citations)
      ? planItem.citations.map((citation) => ({
          documentId: cleanText(citation?.documentId),
          chunkId: cleanText(citation?.chunkId),
          documentName: truncateText(citation?.documentName, 120),
          label: truncateText(citation?.label, 60),
          pageStart: clampNumber(citation?.pageStart ?? 0, 0, 99999, 0),
          pageEnd: clampNumber(citation?.pageEnd ?? citation?.pageStart ?? 0, 0, 99999, 0),
          preview: truncateText(citation?.preview, 220)
        })).filter((citation) => citation.documentName && citation.label).slice(0, 3)
      : [],
    evidenceNote: cleanText(planItem?.evidenceNote),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    activeSince: isActive ? now : null
  };
}

function createQuestRecord(input, plan) {
  const now = new Date().toISOString();
  const roadmap = Array.isArray(plan?.roadmap) ? plan.roadmap : [];
  const nodes = roadmap.map((item, index) => createRootNode(item, index, index === 0));
  const topic = deriveTopicFromInput(input);
  const quest = {
    id: crypto.randomUUID(),
    title: cleanText(plan?.sessionTitle) || topic,
    topic,
    material: cleanText(input?.material),
    level: cleanText(input?.level),
    goal: cleanText(input?.goal),
    timebox: cleanText(input?.timebox),
    templateKey: cleanText(input?.templateKey) || "general",
    rootQuestionCount: roadmap.length,
    missionBrief: cleanText(plan?.missionBrief),
    launchNote: cleanText(plan?.launchNote),
    createdAt: now,
    updatedAt: now,
    finishedAt: null,
    currentNodeId: nodes[0]?.id || null,
    status: "active",
    category: normalizeQuestCategory(input?.category),
    tags: sanitizeQuestTags(input?.tags),
    sourceDocuments: Array.isArray(input?.sourceDocuments)
      ? input.sourceDocuments.map(normalizeSourceDocument)
      : [],
    nodes,
    timeline: [
      {
        id: crypto.randomUUID(),
        kind: "session-created",
        summary: "已生成学习主线，准备开始答题。",
        createdAt: now
      }
    ]
  };
  ensureQuestState(quest);
  return quest;
}

function findQuestOrThrow(state, questId) {
  const quest = state.quests.find((item) => item.id === questId);
  if (!quest) {
    throw new Error("没有找到对应的学习项目。");
  }
  if (!Array.isArray(quest.nodes)) {
    quest.nodes = [];
  }
  if (!Array.isArray(quest.timeline)) {
    quest.timeline = [];
  }
  if (!Array.isArray(quest.sourceDocuments)) {
    quest.sourceDocuments = [];
  }
  return quest;
}

function findNodeOrThrow(quest, nodeId) {
  const node = quest.nodes.find((item) => item.id === nodeId);
  if (!node) {
    throw new Error("没有找到当前问题节点。");
  }
  if (!Array.isArray(node.attempts)) {
    node.attempts = [];
  }
  return node;
}

function appendTimeline(quest, kind, summary) {
  quest.timeline.unshift({
    id: crypto.randomUUID(),
    kind,
    summary,
    createdAt: new Date().toISOString()
  });
  quest.timeline = quest.timeline.slice(0, MAX_STORED_TIMELINE_ITEMS);
}

function createChildNode(parentNode, followUpQuestion, sortOrder) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    path: `${parentNode.path}.${sortOrder}`,
    parentId: parentNode.id,
    sortOrder,
    title: cleanText(followUpQuestion.title) || `${parentNode.title} 的追问`,
    goal: cleanText(followUpQuestion.goal),
    whyItMatters: cleanText(followUpQuestion.reason),
    difficulty: clampNumber(
      followUpQuestion.difficulty ?? Math.min((parentNode.difficulty || 3) + 1, 5),
      1,
      5,
      Math.min((parentNode.difficulty || 3) + 1, 5)
    ),
    status: "active",
    source: "follow-up",
    attempts: [],
    reviewCount: 0,
    lastReviewAt: null,
    citations: Array.isArray(followUpQuestion?.citations)
      ? followUpQuestion.citations.map((citation) => ({
          documentId: cleanText(citation?.documentId),
          chunkId: cleanText(citation?.chunkId),
          documentName: truncateText(citation?.documentName, 120),
          label: truncateText(citation?.label, 60),
          pageStart: clampNumber(citation?.pageStart ?? 0, 0, 99999, 0),
          pageEnd: clampNumber(citation?.pageEnd ?? citation?.pageStart ?? 0, 0, 99999, 0),
          preview: truncateText(citation?.preview, 220)
        })).filter((citation) => citation.documentName && citation.label).slice(0, 3)
      : [],
    evidenceNote: cleanText(followUpQuestion?.evidenceNote),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    activeSince: now
  };
}

function createAttemptRecord(node, mode, answer, evaluation, createdAt, durationSeconds) {
  return {
    id: crypto.randomUUID(),
    mode,
    attemptNumber: (node.attempts?.length || 0) + 1,
    answer,
    answerPreview: truncateText(answer, 90),
    verdict: evaluation.verdict,
    score: Number.isFinite(Number(evaluation.score)) ? clampNumber(evaluation.score, 0, 100, 0) : null,
    coachReply: cleanText(evaluation.coachReply),
    hint: cleanText(evaluation.hint),
    strengths: Array.isArray(evaluation.feedback?.strengths) ? evaluation.feedback.strengths.map(cleanText).filter(Boolean).slice(0, 3) : [],
    gaps: Array.isArray(evaluation.feedback?.gaps) ? evaluation.feedback.gaps.map(cleanText).filter(Boolean).slice(0, 3) : [],
    missing: Array.isArray(evaluation.feedback?.missing) ? evaluation.feedback.missing.map(cleanText).filter(Boolean).slice(0, 3) : [],
    improve: cleanText(evaluation.feedback?.improve),
    citations: Array.isArray(evaluation.citations)
      ? evaluation.citations.map((citation) => ({
          documentId: cleanText(citation?.documentId),
          chunkId: cleanText(citation?.chunkId),
          documentName: truncateText(citation?.documentName, 120),
          label: truncateText(citation?.label, 60),
          pageStart: clampNumber(citation?.pageStart ?? 0, 0, 99999, 0),
          pageEnd: clampNumber(citation?.pageEnd ?? citation?.pageStart ?? 0, 0, 99999, 0),
          preview: truncateText(citation?.preview, 220)
        })).filter((citation) => citation.documentName && citation.label).slice(0, 3)
      : [],
    evidenceNote: cleanText(evaluation.evidenceNote),
    durationSeconds: clampNumber(durationSeconds, 0, MAX_DURATION_SECONDS, 0),
    createdAt
  };
}

function applyLearningEvaluation(quest, node, answer, evaluation) {
  const now = new Date().toISOString();
  const durationSeconds = diffDurationSeconds(node.activeSince || node.updatedAt, now);
  const attempt = createAttemptRecord(node, "learn", answer, evaluation, now, durationSeconds);
  node.attempts.push(attempt);
  node.updatedAt = now;

  if (evaluation.verdict === "retry_same_question") {
    node.status = "active";
    node.activeSince = now;
    quest.currentNodeId = node.id;
    appendTimeline(quest, "answer-retry", `${node.path} 还需要继续展开。`);
    return;
  }

  node.status = "completed";
  node.completedAt = now;
  node.activeSince = null;

  if (evaluation.verdict === "follow_up_required" && evaluation.followUpQuestion?.title && canCreateFollowUp(quest, node)) {
    clearActiveStatus(quest);
    const childSortOrder = getSiblingNodes(quest, node.id).length + 1;
    const childNode = createChildNode(node, evaluation.followUpQuestion, childSortOrder);
    quest.nodes.push(childNode);
    reindexQuestNodes(quest);
    quest.currentNodeId = childNode.id;
    appendTimeline(quest, "follow-up-created", `${node.path} 已通过，解锁了 ${childNode.path}。`);
    return;
  }

  clearActiveStatus(quest);
  appendTimeline(quest, "node-completed", `${node.path} 已点亮完成。`);
  activateNextNode(quest);
}

function applyReviewEvaluation(quest, node, answer, evaluation, options = {}) {
  const now = new Date().toISOString();
  const durationSeconds = diffDurationSeconds(options.startedAt, now);
  const attempt = createAttemptRecord(node, "review", answer, evaluation, now, durationSeconds);
  node.attempts.push(attempt);
  node.reviewCount = (node.reviewCount || 0) + 1;
  node.lastReviewAt = now;
  node.updatedAt = now;
  appendTimeline(quest, "review-answer", `${node.path} 完成了一次复习回顾。`);
}

function updateQuestMeta(quest, input) {
  quest.title = cleanText(input?.title) || quest.title;
  quest.topic = cleanText(input?.topic) || quest.topic || deriveTopicFromInput(quest);
  quest.level = cleanText(input?.level);
  quest.goal = cleanText(input?.goal);
  quest.timebox = cleanText(input?.timebox);
  quest.category = normalizeQuestCategory(input?.category);
  quest.tags = sanitizeQuestTags(input?.tags);
  quest.missionBrief = cleanText(input?.missionBrief);
  quest.updatedAt = new Date().toISOString();
  appendTimeline(quest, "quest-updated", "已更新项目信息。");
  return quest;
}

function setQuestArchived(quest, archived) {
  quest.status = archived ? "archived" : "active";
  quest.updatedAt = new Date().toISOString();
  appendTimeline(quest, archived ? "quest-archived" : "quest-restored", archived ? "项目已归档。" : "项目已恢复到活跃列表。");
  return quest;
}

function duplicateQuestRecord(sourceQuest) {
  const now = new Date().toISOString();
  const nodeIdMap = new Map();
  const sourceNodes = [...(sourceQuest.nodes || [])].sort(compareNodesByPath);
  const nodes = sourceNodes.map((node) => {
    const nextId = crypto.randomUUID();
    nodeIdMap.set(node.id, nextId);
    return {
      id: nextId,
      path: node.path,
      parentId: node.parentId,
      sortOrder: node.sortOrder,
      title: node.title,
      goal: node.goal,
      whyItMatters: node.whyItMatters,
      difficulty: node.difficulty,
      status: "pending",
      source: node.source,
      attempts: [],
      reviewCount: 0,
      lastReviewAt: null,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      activeSince: null
    };
  }).map((node) => ({
    ...node,
    parentId: node.parentId ? (nodeIdMap.get(node.parentId) || null) : null
  }));

  if (nodes[0]) {
    nodes[0].status = "active";
    nodes[0].activeSince = now;
  }

  const duplicated = {
    id: crypto.randomUUID(),
    title: `${sourceQuest.title} 副本`,
    topic: sourceQuest.topic,
    material: sourceQuest.material,
    level: sourceQuest.level,
    goal: sourceQuest.goal,
    timebox: sourceQuest.timebox,
    templateKey: sourceQuest.templateKey,
    rootQuestionCount: sourceQuest.rootQuestionCount,
    missionBrief: sourceQuest.missionBrief,
    launchNote: sourceQuest.launchNote,
    createdAt: now,
    updatedAt: now,
    finishedAt: null,
    currentNodeId: nodes[0]?.id || null,
    status: "active",
    category: sourceQuest.category,
    tags: [...(sourceQuest.tags || [])],
    sourceDocuments: Array.isArray(sourceQuest.sourceDocuments)
      ? sourceQuest.sourceDocuments.map((document) => normalizeSourceDocument(document))
      : [],
    nodes,
    timeline: [
      {
        id: crypto.randomUUID(),
        kind: "quest-duplicated",
        summary: `已从「${sourceQuest.title}」复制出新的学习项目。`,
        createdAt: now
      }
    ]
  };
  ensureQuestState(duplicated);
  return duplicated;
}

function upsertQuestNode(quest, input) {
  const now = new Date().toISOString();
  const existingNode = cleanText(input?.nodeId) ? (quest.nodes || []).find((node) => node.id === input.nodeId) : null;

  if (existingNode) {
    existingNode.title = cleanText(input?.title) || existingNode.title;
    existingNode.goal = cleanText(input?.goal);
    existingNode.whyItMatters = cleanText(input?.whyItMatters);
    existingNode.difficulty = clampNumber(input?.difficulty ?? existingNode.difficulty, 1, 5, existingNode.difficulty || 3);
    existingNode.updatedAt = now;
    quest.updatedAt = now;
    appendTimeline(quest, "node-updated", `${existingNode.path} 已更新内容。`);
    ensureQuestState(quest);
    return existingNode;
  }

  const parentId = cleanText(input?.parentId) || null;
  if (parentId && !(quest.nodes || []).some((node) => node.id === parentId)) {
    throw new Error("新增节点失败，父节点不存在。");
  }
  const siblingNodes = getSiblingNodes(quest, parentId);
  const insertAfterId = cleanText(input?.insertAfterId);
  const insertIndex = insertAfterId
    ? siblingNodes.findIndex((node) => node.id === insertAfterId) + 1
    : siblingNodes.length;

  siblingNodes.forEach((node, index) => {
    node.sortOrder = index + 1 + (index >= insertIndex ? 1 : 0);
  });

  const nextNode = {
    id: crypto.randomUUID(),
    path: "",
    parentId,
    sortOrder: insertIndex + 1,
    title: cleanText(input?.title) || (parentId ? "新的子题" : "新的主线题"),
    goal: cleanText(input?.goal),
    whyItMatters: cleanText(input?.whyItMatters),
    difficulty: clampNumber(input?.difficulty ?? 3, 1, 5, 3),
    status: "pending",
    source: cleanText(input?.source) || (parentId ? "manual-child" : "manual-root"),
    attempts: [],
    reviewCount: 0,
    lastReviewAt: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    activeSince: null
  };
  quest.nodes.push(nextNode);
  quest.finishedAt = null;
  quest.updatedAt = now;
  appendTimeline(quest, "node-created", `${parentId ? "已新增子题" : "已新增主线题"}。`);
  ensureQuestState(quest);
  if (!quest.currentNodeId) {
    activateFirstPendingNodeSilently(quest);
  }
  return nextNode;
}

function collectSubtreeNodeIds(quest, rootNodeId) {
  const ids = new Set([rootNodeId]);
  let changed = true;
  while (changed) {
    changed = false;
    (quest.nodes || []).forEach((node) => {
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    });
  }
  return ids;
}

function deleteQuestNode(quest, nodeId) {
  const target = findNodeOrThrow(quest, nodeId);
  const removedIds = collectSubtreeNodeIds(quest, nodeId);
  quest.nodes = (quest.nodes || []).filter((node) => !removedIds.has(node.id));
  if (removedIds.has(quest.currentNodeId)) {
    quest.currentNodeId = null;
    clearActiveStatus(quest);
  }
  quest.updatedAt = new Date().toISOString();
  appendTimeline(quest, "node-deleted", `${target.path} 已从路线中删除。`);
  ensureQuestState(quest);
  if (!quest.currentNodeId) {
    activateFirstPendingNodeSilently(quest);
  }
  return target;
}

function moveQuestNode(quest, nodeId, direction) {
  const target = findNodeOrThrow(quest, nodeId);
  const siblings = getSiblingNodes(quest, target.parentId);
  const index = siblings.findIndex((node) => node.id === nodeId);
  if (index === -1) {
    throw new Error("没有找到需要移动的节点。");
  }
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return target;
  }
  const swapTarget = siblings[swapIndex];
  const currentOrder = target.sortOrder;
  target.sortOrder = swapTarget.sortOrder;
  swapTarget.sortOrder = currentOrder;
  quest.updatedAt = new Date().toISOString();
  appendTimeline(quest, "node-moved", `${target.path} 已调整顺序。`);
  ensureQuestState(quest);
  return findNodeOrThrow(quest, target.id);
}

function pickReviewNode(quests, scopeQuestId) {
  const sourceQuests = scopeQuestId
    ? quests.filter((quest) => quest.id === scopeQuestId)
    : quests.filter((quest) => normalizeQuestStatus(quest.status) !== "archived");
  const candidates = sourceQuests.flatMap((quest) =>
    (quest.nodes || [])
      .filter((node) => node.status === "completed")
      .map((node) => ({
        questId: quest.id,
        questTitle: quest.title,
        node
      }))
  );
  if (!candidates.length) {
    return null;
  }
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

function buildQuestStats(quest) {
  const nodes = Array.isArray(quest.nodes) ? quest.nodes : [];
  const rootNodes = nodes.filter((node) => node.parentId === null);
  const completedRootNodes = rootNodes.filter((node) => node.status === "completed").length;
  const completedNodes = nodes.filter((node) => node.status === "completed").length;
  return {
    totalRoots: rootNodes.length,
    completedRoots: completedRootNodes,
    totalNodes: nodes.length,
    completedNodes,
    pendingNodes: nodes.filter((node) => node.status === "pending" || node.status === "active").length
  };
}

function sanitizeSettings(settings, runtime) {
  return {
    provider: settings.provider,
    baseUrl: settings.baseUrl,
    model: settings.model,
    defaultTemplateKey: settings.defaultTemplateKey,
    defaultRootQuestionCount: settings.defaultRootQuestionCount,
    allowFollowUpQuestions: settings.allowFollowUpQuestions !== false,
    preferredDataRoot: settings.preferredDataRoot,
    hasApiKey: Boolean(settings.apiKey || runtime.envApiKey)
  };
}

function serializeQuestSummary(quest) {
  const stats = buildQuestStats(quest);
  return {
    id: quest.id,
    title: quest.title,
    topic: quest.topic,
    templateKey: quest.templateKey,
    missionBrief: quest.missionBrief,
    createdAt: quest.createdAt,
    updatedAt: quest.updatedAt,
    finishedAt: quest.finishedAt,
    currentNodeId: quest.currentNodeId,
    status: normalizeQuestStatus(quest.status),
    category: normalizeQuestCategory(quest.category),
    tags: sanitizeQuestTags(quest.tags),
    sourceDocumentCount: Array.isArray(quest.sourceDocuments) ? quest.sourceDocuments.length : 0,
    stats
  };
}

function serializeQuestDetail(quest) {
  return {
    ...quest,
    status: normalizeQuestStatus(quest.status),
    category: normalizeQuestCategory(quest.category),
    tags: sanitizeQuestTags(quest.tags),
    sourceDocuments: Array.isArray(quest.sourceDocuments) ? quest.sourceDocuments.map(normalizeSourceDocument) : [],
    stats: buildQuestStats(quest)
  };
}

function iterateAttempts(state, visitor) {
  state.quests.forEach((quest) => {
    (quest.nodes || []).forEach((node) => {
      (node.attempts || []).forEach((attempt) => {
        visitor(quest, node, attempt);
      });
    });
  });
}

function buildStudyStats(state) {
  const dayMap = new Map();
  const completedNodeKeys = new Set();
  let totalAnswers = 0;
  let totalSeconds = 0;
  let scoreTotal = 0;
  let scoreCount = 0;

  iterateAttempts(state, (quest, node, attempt) => {
    const date = toIsoDateKey(attempt.createdAt);
    if (!date) {
      return;
    }

    totalAnswers += 1;
    totalSeconds += clampNumber(attempt.durationSeconds ?? 0, 0, MAX_DURATION_SECONDS, 0);
    if (Number.isFinite(Number(attempt.score))) {
      scoreTotal += Number(attempt.score);
      scoreCount += 1;
    }

    const existing = dayMap.get(date) || {
      date,
      totalSeconds: 0,
      answersCount: 0,
      learnCount: 0,
      reviewCount: 0,
      completedCount: 0,
      scoreTotal: 0,
      scoreCount: 0,
      itemNodeKeys: new Set(),
      items: []
    };

    existing.totalSeconds += clampNumber(attempt.durationSeconds ?? 0, 0, MAX_DURATION_SECONDS, 0);
    existing.answersCount += 1;
    if (attempt.mode === "review") {
      existing.reviewCount += 1;
    } else {
      existing.learnCount += 1;
    }
    if (Number.isFinite(Number(attempt.score))) {
      existing.scoreTotal += Number(attempt.score);
      existing.scoreCount += 1;
    }

    if (attempt.mode === "learn" && attempt.verdict !== "retry_same_question") {
      const completedKey = `${date}:${quest.id}:${node.id}`;
      if (!completedNodeKeys.has(completedKey)) {
        completedNodeKeys.add(completedKey);
        existing.completedCount += 1;
      }
    }

    existing.itemNodeKeys.add(`${quest.id}:${node.id}`);
    existing.items.push({
      questId: quest.id,
      questTitle: quest.title,
      nodeId: node.id,
      nodePath: node.path,
      nodeTitle: node.title,
      mode: attempt.mode,
      verdict: attempt.verdict,
      score: attempt.score,
      durationSeconds: clampNumber(attempt.durationSeconds ?? 0, 0, MAX_DURATION_SECONDS, 0),
      attemptNumber: attempt.attemptNumber,
      answerPreview: attempt.answerPreview || truncateText(attempt.answer, 90),
      coachPreview: truncateText(attempt.coachReply, 90),
      answeredAt: attempt.createdAt
    });

    dayMap.set(date, existing);
  });

  const days = [...dayMap.values()]
    .map((day) => ({
      date: day.date,
      totalSeconds: day.totalSeconds,
      totalMinutes: Math.round(day.totalSeconds / 60),
      answersCount: day.answersCount,
      learnCount: day.learnCount,
      reviewCount: day.reviewCount,
      completedCount: day.completedCount,
      questionCount: day.itemNodeKeys.size,
      averageScore: day.scoreCount ? Math.round(day.scoreTotal / day.scoreCount) : null,
      items: day.items.sort((left, right) => new Date(right.answeredAt) - new Date(left.answeredAt))
    }))
    .sort((left, right) => left.date.localeCompare(right.date));

  const studyDates = days.map((day) => day.date);
  const dateSet = new Set(studyDates);
  const today = new Date();

  function countBackwardStreak(endDate) {
    let streak = 0;
    const cursor = new Date(endDate);
    while (dateSet.has(toIsoDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  const currentStreak = (() => {
    const todayKey = toIsoDateKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (dateSet.has(todayKey)) {
      return countBackwardStreak(today);
    }
    if (dateSet.has(toIsoDateKey(yesterday))) {
      return countBackwardStreak(yesterday);
    }
    return 0;
  })();

  let bestStreak = 0;
  studyDates.forEach((dateKey) => {
    const previous = new Date(dateKey);
    previous.setDate(previous.getDate() - 1);
    if (!dateSet.has(toIsoDateKey(previous))) {
      const streak = countBackwardStreak(new Date(dateKey));
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    }
  });

  return {
    totals: {
      studyDays: days.length,
      totalAnswers,
      totalMinutes: Math.round(totalSeconds / 60),
      totalHours: Number((totalSeconds / 3600).toFixed(1)),
      completedCount: completedNodeKeys.size,
      averageScore: scoreCount ? Math.round(scoreTotal / scoreCount) : null,
      currentStreak,
      bestStreak
    },
    days
  };
}

module.exports = {
  applyLearningEvaluation,
  applyReviewEvaluation,
  buildStudyStats,
  createQuestRecord,
  deleteQuestNode,
  deriveTopicFromInput,
  duplicateQuestRecord,
  findNodeOrThrow,
  findQuestOrThrow,
  loadState,
  moveQuestNode,
  pickReviewNode,
  sanitizeSettings,
  saveState,
  serializeQuestDetail,
  serializeQuestSummary,
  setQuestArchived,
  updateQuestMeta,
  updateState,
  upsertQuestNode
};
