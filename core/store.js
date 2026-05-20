const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DB_FILE_NAME = "study-quest-db.json";

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
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
  const sentence = normalized.split(/[。！？!?；;，,|]/)[0].trim();
  const candidate = sentence || normalized || material;
  return candidate.length > 28 ? `${candidate.slice(0, 28)}...` : candidate;
}

function getDefaultSettings() {
  return {
    provider: "OpenAI",
    baseUrl: "https://codex.ximuai.com",
    model: "gpt-5.4",
    defaultTemplateKey: "general",
    defaultRootQuestionCount: 10,
    preferredDataRoot: ""
  };
}

function createDefaultState() {
  const now = new Date().toISOString();
  return {
    meta: {
      createdAt: now,
      updatedAt: now,
      version: 1
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

function loadState(dataRoot) {
  const dbPath = ensureStateFile(dataRoot);
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...createDefaultState(),
      ...parsed,
      settings: (() => {
        const defaults = getDefaultSettings();
        const merged = {
          ...defaults,
          ...(parsed.settings || {})
        };
        if (!cleanText(parsed?.settings?.baseUrl) || cleanText(merged.baseUrl) === "https://api.openai.com/v1") {
          merged.baseUrl = defaults.baseUrl;
        }
        return merged;
      })(),
      quests: Array.isArray(parsed.quests) ? parsed.quests : []
    };
  } catch (error) {
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
      version: 1
    }
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
    title: planItem.title,
    goal: planItem.goal,
    whyItMatters: planItem.whyItMatters || "",
    difficulty: planItem.difficulty || 3,
    status: isActive ? "active" : "pending",
    source: "roadmap",
    attempts: [],
    reviewCount: 0,
    lastReviewAt: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null
  };
}

function createQuestRecord(input, plan) {
  const now = new Date().toISOString();
  const roadmap = Array.isArray(plan.roadmap) ? plan.roadmap : [];
  const nodes = roadmap.map((item, index) => createRootNode(item, index, index === 0));
  const topic = deriveTopicFromInput(input);
  return {
    id: crypto.randomUUID(),
    title: cleanText(plan.sessionTitle) || topic,
    topic,
    material: cleanText(input.material),
    level: cleanText(input.level),
    goal: cleanText(input.goal),
    timebox: cleanText(input.timebox),
    templateKey: input.templateKey,
    rootQuestionCount: roadmap.length,
    missionBrief: plan.missionBrief || "",
    launchNote: plan.launchNote || "",
    createdAt: now,
    updatedAt: now,
    finishedAt: null,
    currentNodeId: nodes[0]?.id || null,
    nodes,
    timeline: [
      {
        id: crypto.randomUUID(),
        kind: "session-created",
        summary: "已生成学习闯关路线。",
        createdAt: now
      }
    ]
  };
}

function findQuestOrThrow(state, questId) {
  const quest = state.quests.find((item) => item.id === questId);
  if (!quest) {
    throw new Error("未找到对应的学习任务。");
  }
  if (!Array.isArray(quest.nodes)) {
    quest.nodes = [];
  }
  if (!Array.isArray(quest.timeline)) {
    quest.timeline = [];
  }
  return quest;
}

function findNodeOrThrow(quest, nodeId) {
  const node = quest.nodes.find((item) => item.id === nodeId);
  if (!node) {
    throw new Error("未找到当前问题节点。");
  }
  if (!Array.isArray(node.attempts)) {
    node.attempts = [];
  }
  return node;
}

function getNodeSegments(node) {
  return node.path
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

function getPendingNodes(quest) {
  return quest.nodes
    .filter((node) => node.status === "pending" || node.status === "active")
    .sort(compareNodesByPath);
}

function createChildNode(parentNode, followUpQuestion) {
  const now = new Date().toISOString();
  const existingChildren = followUpQuestion.allNodes.filter((node) => node.parentId === parentNode.id);
  const childIndex = existingChildren.length + 1;
  return {
    id: crypto.randomUUID(),
    path: `${parentNode.path}.${childIndex}`,
    parentId: parentNode.id,
    title: followUpQuestion.title,
    goal: followUpQuestion.goal || "",
    whyItMatters: followUpQuestion.reason || "",
    difficulty: followUpQuestion.difficulty || Math.min((parentNode.difficulty || 3) + 1, 5),
    status: "active",
    source: "follow-up",
    attempts: [],
    reviewCount: 0,
    lastReviewAt: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null
  };
}

function appendTimeline(quest, kind, summary) {
  quest.timeline.unshift({
    id: crypto.randomUUID(),
    kind,
    summary,
    createdAt: new Date().toISOString()
  });
  quest.timeline = quest.timeline.slice(0, 60);
}

function clearActiveStatus(quest) {
  quest.nodes.forEach((item) => {
    if (item.status === "active") {
      item.status = "pending";
    }
  });
}

function markQuestFinishedIfNeeded(quest) {
  const unresolved = quest.nodes.some((node) => node.status === "pending" || node.status === "active");
  if (!unresolved) {
    quest.finishedAt = new Date().toISOString();
    quest.currentNodeId = null;
    appendTimeline(quest, "session-finished", "本轮学习闯关已全部完成。");
  }
}

function activateNextNode(quest) {
  const nextNode = getPendingNodes(quest)[0] || null;
  quest.currentNodeId = nextNode?.id || null;
  if (nextNode) {
    nextNode.status = "active";
    nextNode.updatedAt = new Date().toISOString();
  }
  markQuestFinishedIfNeeded(quest);
}

function applyLearningEvaluation(quest, node, answer, evaluation) {
  const now = new Date().toISOString();
  const attempt = {
    id: crypto.randomUUID(),
    mode: "learn",
    answer,
    verdict: evaluation.verdict,
    score: evaluation.score ?? null,
    coachReply: evaluation.coachReply || "",
    hint: evaluation.hint || "",
    strengths: Array.isArray(evaluation.feedback?.strengths) ? evaluation.feedback.strengths : [],
    gaps: Array.isArray(evaluation.feedback?.gaps) ? evaluation.feedback.gaps : [],
    missing: Array.isArray(evaluation.feedback?.missing) ? evaluation.feedback.missing : [],
    improve: evaluation.feedback?.improve || "",
    createdAt: now
  };
  node.attempts.push(attempt);
  node.updatedAt = now;

  if (evaluation.verdict === "retry_same_question") {
    node.status = "active";
    quest.currentNodeId = node.id;
    appendTimeline(quest, "answer-retry", `${node.path} 需要继续推敲。`);
    return;
  }

  node.status = "completed";
  node.completedAt = now;

  if (evaluation.verdict === "follow_up_required" && evaluation.followUpQuestion?.title) {
    clearActiveStatus(quest);
    const childNode = createChildNode(node, {
      ...evaluation.followUpQuestion,
      allNodes: quest.nodes
    });
    quest.nodes.push(childNode);
    quest.currentNodeId = childNode.id;
    appendTimeline(quest, "follow-up-created", `${node.path} 过关，已解锁 ${childNode.path}。`);
    return;
  }

  clearActiveStatus(quest);
  appendTimeline(quest, "node-completed", `${node.path} 已点亮完成。`);
  activateNextNode(quest);
}

function applyReviewEvaluation(quest, node, answer, evaluation) {
  const now = new Date().toISOString();
  const attempt = {
    id: crypto.randomUUID(),
    mode: "review",
    answer,
    verdict: evaluation.verdict,
    score: evaluation.score ?? null,
    coachReply: evaluation.coachReply || "",
    hint: evaluation.hint || "",
    strengths: Array.isArray(evaluation.feedback?.strengths) ? evaluation.feedback.strengths : [],
    gaps: Array.isArray(evaluation.feedback?.gaps) ? evaluation.feedback.gaps : [],
    missing: Array.isArray(evaluation.feedback?.missing) ? evaluation.feedback.missing : [],
    improve: evaluation.feedback?.improve || "",
    createdAt: now
  };
  node.attempts.push(attempt);
  node.reviewCount = (node.reviewCount || 0) + 1;
  node.lastReviewAt = now;
  node.updatedAt = now;
  appendTimeline(quest, "review-answer", `${node.path} 已完成一次复习抽问。`);
}

function pickReviewNode(quests, scopeQuestId) {
  const sourceQuests = scopeQuestId ? quests.filter((quest) => quest.id === scopeQuestId) : quests;
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
  const rootNodes = quest.nodes.filter((node) => node.parentId === null);
  const completedRootNodes = rootNodes.filter((node) => node.status === "completed").length;
  const completedNodes = quest.nodes.filter((node) => node.status === "completed").length;
  return {
    totalRoots: rootNodes.length,
    completedRoots: completedRootNodes,
    totalNodes: quest.nodes.length,
    completedNodes,
    pendingNodes: quest.nodes.filter((node) => node.status === "pending" || node.status === "active").length
  };
}

function sanitizeSettings(settings, runtime) {
  return {
    provider: settings.provider,
    baseUrl: settings.baseUrl,
    model: settings.model,
    defaultTemplateKey: settings.defaultTemplateKey,
    defaultRootQuestionCount: settings.defaultRootQuestionCount,
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
    stats
  };
}

function serializeQuestDetail(quest) {
  return {
    ...quest,
    stats: buildQuestStats(quest)
  };
}

module.exports = {
  createQuestRecord,
  deriveTopicFromInput,
  findNodeOrThrow,
  findQuestOrThrow,
  loadState,
  saveState,
  sanitizeSettings,
  serializeQuestDetail,
  serializeQuestSummary,
  updateState,
  applyLearningEvaluation,
  applyReviewEvaluation,
  pickReviewNode
};
