const fs = require("node:fs");
const path = require("node:path");
const {
  buildCitationRecord,
  citationsFromEvidenceIds,
  formatEvidenceContext,
  hydrateCitationRecords,
  rankDocumentChunks,
  summarizeCitationTargets
} = require("./retrieval");

const TEMPLATE_GUIDES = {
  general: {
    label: "通用学习教练",
    guidance:
      "先讲清主干，再立刻转为提问、纠错、练习和复盘。避免直接把答案端给用户，要逼用户输出。"
  },
  intense: {
    label: "费曼 + 苏格拉底 + 压力测试",
    guidance:
      "强调复述、追问、边界条件、反例和压力测试。不要轻易夸奖，要给具体反馈。"
  },
  algorithm: {
    label: "算法题训练",
    guidance:
      "优先引导用户复述题意、分析暴力解、定位瓶颈，再逐步提示优化方向。"
  },
  paper: {
    label: "论文阅读训练",
    guidance:
      "围绕问题重要性、核心方法、关键假设、实验验证和局限性来提问。"
  },
  project: {
    label: "项目实战训练",
    guidance:
      "问题要贴近真实项目推进，既训练概念也训练取舍、验证和复盘。"
  }
};

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
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

function getLearnerProfile(levelText) {
  const tier = inferLearnerTier(levelText);
  if (tier === "beginner") {
    return {
      tier,
      label: "入门",
      maxFollowUpDepth: 1,
      retryThreshold: 50,
      advanceThreshold: 110,
      roadmapGuidance:
        "默认学习者基础较弱。问题要更直观、更具体，优先通过例子、类比和一步一问帮助理解；不要一开始就连环深挖。",
      evaluationGuidance:
        "入门用户只要能讲清基本概念、核心因果，再配一个贴切例子，就可以允许当前节点过关，不要用术语洁癖卡分。",
      launchNote: "先用自己的话讲清主干，再配一个例子，过关标准以理解为主。"
    };
  }
  if (tier === "advanced") {
    return {
      tier,
      label: "进阶 / 高阶",
      maxFollowUpDepth: 2,
      retryThreshold: 80,
      advanceThreshold: 165,
      roadmapGuidance:
        "默认学习者已掌握基础定义。少问纯定义题，优先暴露理解漏洞、边界条件、反例、取舍和实战判断。",
      evaluationGuidance:
        "进阶用户要更看重完整性、边界和取舍。即使能过关，也不要轻易给高分；只有讲清关键依据和场景时才放高分。",
      launchNote: "默认基础定义已知，重点把边界、取舍和漏洞说透。"
    };
  }
  return {
    tier,
    label: "中级",
    maxFollowUpDepth: 2,
    retryThreshold: 68,
    advanceThreshold: 140,
    roadmapGuidance:
      "默认学习者已经有一点基础。问题要兼顾主干解释、结构串联、应用判断和边界条件，不要只停在背定义。",
    evaluationGuidance:
      "中级用户既要讲主干，也要落到场景和判断依据。能过关不代表可以高分，高分仍然要看完整性和边界。",
    launchNote: "先讲清主干，再通过少量必要追问把理解压实。"
  };
}

function getFollowUpDepth(node) {
  const pathText = cleanText(node?.path);
  if (!pathText) {
    return 0;
  }
  return Math.max(0, pathText.split(".").length - 1);
}

function canGenerateFollowUp(quest, node) {
  return getFollowUpDepth(node) < getLearnerProfile(quest?.level).maxFollowUpDepth;
}

function isFollowUpGenerationEnabled(settings) {
  return settings?.allowFollowUpQuestions !== false;
}

function getRoadmapDifficulty(profile, index) {
  const difficultyBands = profile.tier === "beginner"
    ? [1, 1, 2, 2, 3]
    : profile.tier === "advanced"
      ? [3, 3, 4, 4, 5]
      : [2, 2, 3, 4, 4];
  return difficultyBands[index % difficultyBands.length];
}

function adaptRoadmapQuestion(title, topic, index, profile) {
  if (profile.tier === "beginner") {
    if (index === 0) {
      return `先别背定义，请用自己的话解释“${topic}”，再举一个最直观的小例子。`;
    }
    return `${title} 请尽量配一个具体例子，允许用比较朴素的语言来说明。`;
  }
  if (profile.tier === "advanced") {
    return `${title} 默认基础定义已掌握，请重点说明判断依据、边界和取舍。`;
  }
  return title;
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

function normalizeBaseUrl(baseUrl) {
  const trimmed = String(baseUrl || "").trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "https://api.openai.com/v1";
  }
  return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
}

function buildFallbackRoadmap(input) {
  const topic = deriveTopicFromInput(input);
  const profile = getLearnerProfile(input.level);
  const baseSets = {
    general: [
      `就“${topic}”来说，它的核心对象、核心目标和基本边界分别是什么？`,
      `“${topic}”的关键结构、关键步骤或关键机制是怎样串起来的？`,
      `如果要把“${topic}”放进一个真实场景里应用，你会怎么做，并如何解释你的取舍？`,
      `关于“${topic}”，最容易出现的误解、错法或遗漏是什么？为什么？`,
      `如果要验证自己已经真正掌握“${topic}”，你会设计什么输出任务来证明？`
    ],
    intense: [
      `用你自己的话解释“${topic}”到底是什么，并说清它不是什么。`,
      `为什么“${topic}”成立？它背后的关键因果链或判断逻辑是什么？`,
      `把“${topic}”放进复杂场景后，哪些边界条件会让原先的做法失效？`,
      `如果你给出一个关于“${topic}”的方案，我应该从哪些漏洞、反例和代价上拷打它？`,
      `关于“${topic}”，最常见但最危险的自我欺骗是什么？如何当场纠正？`
    ],
    algorithm: [
      `面对“${topic}”，你会如何准确复述题意，并明确输入、输出和边界情况？`,
      `关于“${topic}”，最直接的暴力解法是什么？它为什么会慢？`,
      `“${topic}”真正的性能瓶颈在哪里？你凭什么判断这里值得优化？`,
      `要把“${topic}”从暴力解推进到更优解，关键思路或数据结构是什么？`,
      `如果把“${topic}”写成代码，哪些边界情况最容易写错？你会怎样自检？`
    ],
    paper: [
      `这篇与“${topic}”相关的论文或文章，究竟想解决什么问题？`,
      `为什么“${topic}”对应的问题重要？不解决会造成什么后果？`,
      `围绕“${topic}”，作者的核心方法、关键假设和推理链条是什么？`,
      `关于“${topic}”，实验设计是如何支撑结论的？哪里可能还不够扎实？`,
      `如果你要汇报“${topic}”，最应该提醒听众的局限性和误区是什么？`
    ],
    project: [
      `如果要通过一个最小项目掌握“${topic}”，你的最小可交付闭环会是什么？`,
      `“${topic}”真正落地时，关键链路、关键模块和先后依赖关系是什么？`,
      `围绕“${topic}”，你要做哪些核心技术取舍？这些取舍的代价分别是什么？`,
      `在“${topic}”的实战里，哪些故障、监控指标或风险点最值得优先盯住？`,
      `如果这一轮“${topic}”项目做完后要复盘，你会用什么标准判断自己是否真的掌握？`
    ]
  };

  const source = baseSets[input.templateKey] || baseSets.general;
  return Array.from({ length: input.rootQuestionCount }).map((_, index) => {
    const title = adaptRoadmapQuestion(source[index % source.length], topic, index, profile);
    return {
      title,
      goal:
        profile.tier === "beginner"
          ? (
              index === 0
                ? "先把主题定义、核心作用和一个最直观例子讲明白。"
                : index === input.rootQuestionCount - 1
                  ? "把复盘、辨错和能否举例自证也一起带出来。"
                  : "继续往结构理解、应用判断和真实例子推进。"
            )
          : index === 0
            ? "逼出主题定义与主干理解"
            : index === input.rootQuestionCount - 1
              ? "逼出复盘、辨错和可验证输出能力"
              : "逼出结构理解、应用判断和取舍能力",
      whyItMatters:
        profile.tier === "beginner"
          ? (
              index === 0
                ? "第一关先站稳主干，后面才不会被术语和细节带偏。"
                : "只有讲清例子、场景和判断，才算不只是看懂。"
            )
          : index === 0
            ? "第一关决定后面的问题是不是能打中知识主干。"
            : "只有把知识放进场景、取舍和复盘里，才算不只是看懂。",
      difficulty: getRoadmapDifficulty(profile, index)
    };
  });
}

function shouldUseFallbackRoadmap(input, roadmap) {
  if (!Array.isArray(roadmap) || roadmap.length !== input.rootQuestionCount) {
    return true;
  }
  const metaWords = ["学习主题", "学习材料", "当前水平", "时间限制", "规划学习", "补全主题", "补全信息"];
  const malformed = roadmap.some((item) => /[?？]{3,}/.test(item.title || ""));
  const metaHeavyCount = roadmap.filter((item) =>
    metaWords.some((word) => String(item.title || "").includes(word))
  ).length;
  return malformed || metaHeavyCount >= Math.ceil(roadmap.length / 2);
}

function buildNodeEvidenceEntries(sourceDocuments, node, topic, limit = 3) {
  return rankDocumentChunks(
    sourceDocuments,
    [
      topic,
      cleanText(node?.title),
      cleanText(node?.goal),
      cleanText(node?.whyItMatters)
    ]
      .filter(Boolean)
      .join("\n"),
    { limit }
  );
}

function attachRoadmapCitations(roadmap, input) {
  const sourceDocuments = Array.isArray(input?.sourceDocuments) ? input.sourceDocuments : [];
  if (!sourceDocuments.length) {
    return roadmap;
  }
  const topic = deriveTopicFromInput(input);
  return roadmap.map((item) => {
    const evidenceEntries = buildNodeEvidenceEntries(sourceDocuments, item, topic, 3);
    const citations = evidenceEntries.map(buildCitationRecord).slice(0, 3);
    return {
      ...item,
      citations,
      evidenceNote: citations.length
        ? `建议先对照 ${summarizeCitationTargets(citations)} 再作答。`
        : ""
    };
  });
}

function buildNodeEvidenceContext(quest, node, limit = 3) {
  const sourceDocuments = Array.isArray(quest?.sourceDocuments) ? quest.sourceDocuments : [];
  if (!sourceDocuments.length) {
    return [];
  }

  const storedEvidence = hydrateCitationRecords(node?.citations || [], sourceDocuments, { limit });
  const seen = new Set();
  const merged = [];

  storedEvidence.forEach((entry) => {
    const key = `${entry.documentId}:${entry.chunkId}`;
    seen.add(key);
    merged.push(entry);
  });

  buildNodeEvidenceEntries(sourceDocuments, node, quest?.topic, limit + 1).forEach((entry) => {
    const key = `${entry.documentId}:${entry.chunkId}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    merged.push(entry);
  });

  return merged.slice(0, limit);
}

function getResponseText(responseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text;
  }
  const outputItems = Array.isArray(responseJson.output) ? responseJson.output : [];
  const contentText = outputItems
    .flatMap((item) => item.content || [])
    .map((item) => item.text || item.output_text || "")
    .join("\n")
    .trim();
  if (contentText) {
    return contentText;
  }
  return "";
}

function extractJsonObject(rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    throw new Error("AI 没有返回可解析的内容。");
  }
  let start = -1;
  let depth = 0;
  let inString = false;
  let isEscaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (start === -1) {
      if (char === "{") {
        start = index;
        depth = 1;
      }
      continue;
    }

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return JSON.parse(text.slice(start, index + 1));
      }
    }
  }
  throw new Error("AI 返回内容中没有找到完整 JSON。");
}

function cleanFeedbackList(value) {
  return Array.isArray(value) ? value.map(cleanText).filter(Boolean).slice(0, 3) : [];
}

function sanitizeFeedback(rawFeedback) {
  return {
    strengths: cleanFeedbackList(rawFeedback?.strengths),
    gaps: cleanFeedbackList(rawFeedback?.gaps),
    missing: cleanFeedbackList(rawFeedback?.missing),
    improve: cleanText(rawFeedback?.improve)
  };
}

function coerceScore(score, verdict, answerLength, defaults) {
  const fallback = defaults[verdict] ?? 50;
  let next = Number.isFinite(Number(score)) ? Math.round(Number(score)) : fallback;
  next = Math.min(100, Math.max(0, next));

  if (answerLength < 24) {
    next = Math.min(next, 35);
  } else if (answerLength < 60) {
    next = Math.min(next, 55);
  } else if (answerLength < 100) {
    next = Math.min(next, 74);
  }

  if (verdict === "retry_same_question") {
    return Math.min(next, 59);
  }
  if (verdict === "follow_up_required") {
    return Math.min(next, 82);
  }
  if (verdict === "complete_and_advance") {
    return Math.min(next, 93);
  }
  if (verdict === "review-needs-refresh") {
    return Math.min(next, 69);
  }
  if (verdict === "review-locked-in") {
    return Math.min(next, 90);
  }
  return next;
}

function sanitizeFollowUpQuestion(rawFollowUpQuestion, node) {
  return {
    title: cleanText(rawFollowUpQuestion?.title) || `请把“${node.title}”放进真实场景里再解释一次。`,
    goal: cleanText(rawFollowUpQuestion?.goal) || "继续补足应用场景、判断依据和边界条件。",
    reason: cleanText(rawFollowUpQuestion?.reason) || "主干已经碰到了，但还需要落到更具体的判断与应用。",
    difficulty: Math.min(5, Math.max(1, Number(rawFollowUpQuestion?.difficulty || node.difficulty || 3))),
    evidenceNote: cleanText(rawFollowUpQuestion?.evidenceNote)
  };
}

function normalizeLearningEvaluation(rawEvaluation, answer, quest, node, settings, evidenceEntries = []) {
  const allowedVerdicts = new Set([
    "retry_same_question",
    "follow_up_required",
    "complete_and_advance"
  ]);
  const profile = getLearnerProfile(quest?.level);
  const answerLength = cleanText(answer).length;
  const canFollowUp = canGenerateFollowUp(quest, node) && isFollowUpGenerationEnabled(settings);
  const verdict = allowedVerdicts.has(rawEvaluation?.verdict)
    ? rawEvaluation.verdict
    : (
        answerLength < profile.retryThreshold
          ? "retry_same_question"
          : (answerLength >= profile.advanceThreshold || !canFollowUp ? "complete_and_advance" : "follow_up_required")
      );

  const feedback = sanitizeFeedback(rawEvaluation?.feedback);
  const normalized = {
    verdict,
    score: coerceScore(rawEvaluation?.score, verdict, answerLength, {
      retry_same_question: 46,
      follow_up_required: 72,
      complete_and_advance: 84
    }),
    coachReply: cleanText(rawEvaluation?.coachReply),
    hint: cleanText(rawEvaluation?.hint),
    feedback
  };

  if (normalized.verdict === "follow_up_required" && !canFollowUp) {
    normalized.verdict = answerLength < profile.retryThreshold ? "retry_same_question" : "complete_and_advance";
    normalized.coachReply = "";
    normalized.hint = "";
  }

  const finalVerdict = normalized.verdict;

  if (!normalized.coachReply) {
    normalized.coachReply =
      finalVerdict === "retry_same_question"
        ? "这次回答已经碰到主题了，但主干和判断依据还没有讲透。"
        : finalVerdict === "follow_up_required"
          ? "当前主干已经过线，下一步该把场景、取舍和边界条件补实。"
          : "这道题可以过，但分数不代表没有瑕疵，后面仍然要继续把表达压实。";
  }

  if (!normalized.hint && finalVerdict !== "complete_and_advance") {
    normalized.hint =
      finalVerdict === "retry_same_question"
        ? "先补清楚：它是什么、为什么成立、怎么用、什么情况下会失效。"
        : "请继续把真实场景、取舍理由和边界条件说具体。";
  }

  normalized.citations = citationsFromEvidenceIds(
    evidenceEntries,
    rawEvaluation?.citationIds,
    {
      limit: 3,
      fallbackLimit: finalVerdict === "complete_and_advance" ? 1 : 2
    }
  );
  normalized.evidenceNote = normalized.citations.length
    ? `建议回看 ${summarizeCitationTargets(normalized.citations)}。`
    : "";

  if (normalized.citations.length && finalVerdict !== "complete_and_advance") {
    const evidenceHint = `先对照 ${summarizeCitationTargets(normalized.citations)} 再补答案。`;
    normalized.hint = normalized.hint
      ? `${normalized.hint} ${evidenceHint}`
      : evidenceHint;
  }

  if (finalVerdict === "follow_up_required") {
    normalized.followUpQuestion = finalVerdict === "follow_up_required"
      ? sanitizeFollowUpQuestion(rawEvaluation?.followUpQuestion, node)
      : null;
    if (normalized.followUpQuestion) {
      normalized.followUpQuestion.citations = normalized.citations;
      normalized.followUpQuestion.evidenceNote = normalized.evidenceNote;
    }
  } else {
    normalized.followUpQuestion = null;
  }

  return normalized;
}

function normalizeReviewEvaluation(rawEvaluation, answer, evidenceEntries = []) {
  const allowedVerdicts = new Set([
    "review-locked-in",
    "review-needs-refresh"
  ]);
  const answerLength = cleanText(answer).length;
  const verdict = allowedVerdicts.has(rawEvaluation?.verdict)
    ? rawEvaluation.verdict
    : (answerLength >= 90 ? "review-locked-in" : "review-needs-refresh");

  const normalized = {
    verdict,
    score: coerceScore(rawEvaluation?.score, verdict, answerLength, {
      "review-needs-refresh": 56,
      "review-locked-in": 81
    }),
    coachReply: cleanText(rawEvaluation?.coachReply),
    hint: cleanText(rawEvaluation?.hint),
    feedback: sanitizeFeedback(rawEvaluation?.feedback)
  };

  if (!normalized.coachReply) {
    normalized.coachReply =
      verdict === "review-locked-in"
        ? "这次复述基本站住了，但仍然建议把关键边界再说得更利落一些。"
        : "这题还没有真正复述稳，建议回到主线把主干和场景再梳理一遍。";
  }

  if (!normalized.hint && verdict === "review-needs-refresh") {
    normalized.hint = "先用一句话说本质，再补一个真实场景和判断依据。";
  }

  normalized.citations = citationsFromEvidenceIds(
    evidenceEntries,
    rawEvaluation?.citationIds,
    {
      limit: 3,
      fallbackLimit: verdict === "review-needs-refresh" ? 2 : 1
    }
  );
  normalized.evidenceNote = normalized.citations.length
    ? `建议回看 ${summarizeCitationTargets(normalized.citations)}。`
    : "";

  if (normalized.citations.length && verdict === "review-needs-refresh") {
    normalized.hint = normalized.hint
      ? `${normalized.hint} 先对照 ${summarizeCitationTargets(normalized.citations)}。`
      : `先对照 ${summarizeCitationTargets(normalized.citations)}。`;
  }

  return normalized;
}

async function callResponsesApi(settings, systemPrompt, userPrompt) {
  const apiKey = settings.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("还没有配置 OPENAI_API_KEY。请先在设置里补上。");
  }

  const url = `${normalizeBaseUrl(settings.baseUrl)}/responses`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: settings.model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemPrompt
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: userPrompt
            }
          ]
        }
      ]
    })
  });

  const rawJson = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage =
      rawJson?.error?.message ||
      rawJson?.message ||
      `请求失败，状态码 ${response.status}`;
    throw new Error(errorMessage);
  }

  const text = getResponseText(rawJson);
  return extractJsonObject(text);
}

function formatQuestContext(quest) {
  const nodeLines = (quest.nodes || [])
    .map((node) => {
      const parentMark = node.parentId ? "child" : "root";
      return `${node.path} [${parentMark}] ${node.status} | ${node.title} | goal=${node.goal || "无"}`;
    })
    .join("\n");
  return [
    `任务标题：${quest.title}`,
    `主题：${quest.topic}`,
    `学习目标：${quest.goal}`,
    `当前水平：${quest.level}`,
    `时间限制：${quest.timebox}`,
    `当前路线：\n${nodeLines}`
  ].join("\n");
}

async function generateQuestPlan(settings, input) {
  const topic = deriveTopicFromInput(input);
  const level = cleanText(input.level) || "未填写";
  const goal = cleanText(input.goal) || "希望通过主动提问掌握核心内容";
  const timebox = cleanText(input.timebox) || "未填写";
  const template = TEMPLATE_GUIDES[input.templateKey] || TEMPLATE_GUIDES.general;
  const profile = getLearnerProfile(level);
  const systemPrompt = [
    "你是一个严谨、真实、带闯关感的学习教练规划器。",
    "你的任务是把用户要学的内容，拆成一串能逐步击破的主问题。",
    "每个问题必须适合口头回答或书面回答，应该能逼用户解释、比较、推导、应用或反思。",
    "不要直接给知识点答案，只设计问题路线。",
    "如果用户已经给出了明确主题和学习材料，主问题必须优先围绕知识内容本身来设计，例如概念、结构、关键取舍、应用场景、边界条件、常见误区和实战落地。",
    "除非用户输入极度模糊，否则不要把整条路线设计成“如何规划学习”“如何补全信息”这种元问题。",
    "坏问题示例：你到底要学什么、如何补全主题、如何安排学习计划、如何划分材料优先级。",
    "好问题示例（以模型服务与部署为例）：模型服务化和本地脚本推理的本质区别是什么、为什么推理接口和监控是部署闭环的一部分、部署方案里延迟与成本如何取舍、哪些常见故障会导致服务不可用。",
    "如果用户已经写了明确主题，禁止把第一问写成主题澄清题。",
    "roadmap 里每个问题标题都必须直接带上用户主题或材料里的关键词，禁止只用“它”“这个主题”这类泛称。",
    `学习者层级：${profile.label}。${profile.roadmapGuidance}`,
    "请严格返回 JSON，不要加 Markdown 代码块，不要加解释。",
    "JSON 结构必须是：",
    "{",
    '  "sessionTitle": "字符串",',
    '  "missionBrief": "不超过 100 字的任务说明",',
    '  "launchNote": "一句开场提醒",',
    '  "roadmap": [',
    "    {",
    '      "title": "问题标题",',
    '      "goal": "这一问要逼出的能力",',
    '      "whyItMatters": "为什么重要",',
    '      "difficulty": 1 到 5 的整数',
    "    }",
    "  ]",
    "}",
    "roadmap 长度必须等于用户指定的 rootQuestionCount。",
    `本轮采用的训练模板：${template.label}。要求：${template.guidance}`
  ].join("\n");

  const sourceDocuments = Array.isArray(input?.sourceDocuments) ? input.sourceDocuments : [];
  const sourceSummary = sourceDocuments.length
    ? sourceDocuments
        .slice(0, 3)
        .map((document) => `${document.name}（${document.pageCount || 0} 页，${document.chunks?.length || 0} 个片段）`)
        .join("；")
    : "";
  const userPrompt = [
    `学习主题：${topic}`,
    `学习材料：${cleanText(input.material)}`,
    sourceSummary ? `已导入材料：${sourceSummary}` : "",
    `当前水平：${level}`,
    `目标：${goal}`,
    `时间限制：${timebox}`,
    `主问题数量：${input.rootQuestionCount}`,
    "请生成一个层层推进、有明确目标感的主问题路线图。"
  ]
    .filter(Boolean)
    .join("\n");

  const result = await callResponsesApi(settings, systemPrompt, userPrompt);
  if (shouldUseFallbackRoadmap(input, result.roadmap)) {
    return {
      sessionTitle: `${topic} 闯关路线`,
      missionBrief: `围绕“${topic}”按主干理解、结构串联、场景应用和复盘辨错来推进。`,
      launchNote: profile.launchNote,
      roadmap: attachRoadmapCitations(buildFallbackRoadmap(input), input)
    };
  }
  return {
    ...result,
    roadmap: attachRoadmapCitations(Array.isArray(result.roadmap) ? result.roadmap : [], input)
  };
}

async function evaluateLearningAnswer(settings, quest, node, answer) {
  const profile = getLearnerProfile(quest?.level);
  const evidenceEntries = buildNodeEvidenceContext(quest, node, 3);
  const evidenceContext = formatEvidenceContext(evidenceEntries);
  const recentAttempts = (node.attempts || []).slice(-2).map((attempt) => ({
    verdict: attempt.verdict,
    answer: attempt.answer,
    coachReply: attempt.coachReply
  }));

  const systemPrompt = [
    "你是一个闯关式学习教练裁判。",
    "请根据用户回答来判断：是需要继续追问、需要衍生一个更深的子问题，还是可以完成当前节点并前进。",
    "要求真实、严格、具体，不要空泛鼓励。",
    "禁止阿谀奉承，禁止使用“非常棒”“完美”“天才”这类夸张表述。",
    "评分必须克制：90 分以上只给真正讲清主干、关键依据、真实场景和边界条件的回答；75 到 89 分表示基本过关但仍有明显缺口；60 到 74 分表示部分正确但不够扎实；60 分以下表示核心内容仍不稳定。",
    "如果用户答偏了，优先给提示而不是完整答案。",
    evidenceContext ? "如果提供了材料证据，请优先用这些证据判断回答是否贴合原文，并只从给定证据里挑 citationIds。" : "当前没有材料证据可引用。",
    `当前学习者层级：${profile.label}。${profile.evaluationGuidance}`,
    `当前节点追问深度：${getFollowUpDepth(node)}，允许的最大追问深度：${profile.maxFollowUpDepth}。如果当前节点已经达到追问上限，禁止再生成新的子问题，只能在 retry_same_question 和 complete_and_advance 之间选择。`,
    "请严格返回 JSON，不要加 Markdown，不要加解释。",
    "JSON 结构必须是：",
    "{",
    '  "verdict": "retry_same_question" | "follow_up_required" | "complete_and_advance",',
    '  "score": 0 到 100 的整数,',
    '  "coachReply": "1 到 3 句自然语言反馈",',
    '  "hint": "给用户下一步修正提示，可为空字符串",',
    '  "citationIds": ["从已给证据中选择的 ID，最多 3 个"],',
    '  "feedback": {',
    '    "strengths": ["数组，最多 3 条"],',
    '    "gaps": ["数组，最多 3 条"],',
    '    "missing": ["数组，最多 3 条"],',
    '    "improve": "一句更准确的表达建议"',
    "  },",
    '  "followUpQuestion": {',
    '    "title": "字符串",',
    '    "goal": "字符串",',
    '    "reason": "字符串",',
    '    "difficulty": 1 到 5 的整数',
    "  } 或 null",
    "}",
    "当且仅当 verdict 为 follow_up_required 时，followUpQuestion 不能为空。",
    "当用户核心概念已过关，但还值得继续深挖应用、边界或反例时，使用 follow_up_required。",
    "当用户回答明显不足时，使用 retry_same_question。",
    "当当前节点已经足够完成并应切到下一主问题时，使用 complete_and_advance。"
  ].join("\n");

  const userPrompt = [
    formatQuestContext(quest),
    `当前问题：${node.path} ${node.title}`,
    `当前问题目标：${node.goal || "无"}`,
    `为什么重要：${node.whyItMatters || "无"}`,
    evidenceContext ? `当前材料证据：\n${evidenceContext}` : "",
    `最近两次尝试：${JSON.stringify(recentAttempts, null, 2)}`,
    `用户最新回答：${answer}`
  ]
    .filter(Boolean)
    .join("\n\n");

  const rawEvaluation = await callResponsesApi(settings, systemPrompt, userPrompt);
  return normalizeLearningEvaluation(rawEvaluation, answer, quest, node, settings, evidenceEntries);
}

async function evaluateReviewAnswer(settings, quest, node, answer) {
  const evidenceEntries = buildNodeEvidenceContext(quest, node, 3);
  const evidenceContext = formatEvidenceContext(evidenceEntries);
  const systemPrompt = [
    "你是一个学习复习抽问裁判。",
    "你只需要判断用户这次复习答得扎不扎实，并给出简短反馈。",
    "禁止过度夸赞，评分要保守，不要因为语气自信就虚高给分。",
    "90 分以上应当极少出现，只在复述准确、结构完整、场景明确时给出。",
    evidenceContext ? "如果提供了材料证据，请优先根据这些证据来判断复述是否准确，并只返回给定证据里的 citationIds。" : "当前没有材料证据可引用。",
    "请严格返回 JSON，不要加 Markdown。",
    "JSON 结构必须是：",
    "{",
    '  "verdict": "review-locked-in" | "review-needs-refresh",',
    '  "score": 0 到 100 的整数,',
    '  "coachReply": "1 到 3 句自然语言反馈",',
    '  "hint": "下一步修正提示，可为空字符串",',
    '  "citationIds": ["从已给证据中选择的 ID，最多 3 个"],',
    '  "feedback": {',
    '    "strengths": ["数组，最多 3 条"],',
    '    "gaps": ["数组，最多 3 条"],',
    '    "missing": ["数组，最多 3 条"],',
    '    "improve": "一句建议"',
    "  }",
    "}"
  ].join("\n");

  const userPrompt = [
    formatQuestContext(quest),
    `复习抽问节点：${node.path} ${node.title}`,
    `节点目标：${node.goal || "无"}`,
    evidenceContext ? `当前材料证据：\n${evidenceContext}` : "",
    `用户本次回答：${answer}`
  ]
    .filter(Boolean)
    .join("\n\n");

  const rawEvaluation = await callResponsesApi(settings, systemPrompt, userPrompt);
  return normalizeReviewEvaluation(rawEvaluation, answer, evidenceEntries);
}

module.exports = {
  TEMPLATE_GUIDES,
  evaluateLearningAnswer,
  evaluateReviewAnswer,
  generateQuestPlan,
  normalizeBaseUrl
};
