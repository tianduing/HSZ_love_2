const fs = require("node:fs");
const path = require("node:path");

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

function normalizeBaseUrl(baseUrl) {
  const trimmed = String(baseUrl || "").trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "https://api.openai.com/v1";
  }
  return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
}

function buildFallbackRoadmap(input) {
  const topic = input.topic.trim();
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
    const title = source[index % source.length];
    return {
      title,
      goal:
        index === 0
          ? "逼出主题定义与主干理解"
          : index === input.rootQuestionCount - 1
            ? "逼出复盘、辨错和可验证输出能力"
            : "逼出结构理解、应用判断和取舍能力",
      whyItMatters:
        index === 0
          ? "第一关决定后面的问题是不是能打中知识主干。"
          : "只有把知识放进场景、取舍和复盘里，才算不只是看懂。",
      difficulty: Math.min(5, index + 1)
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
  const template = TEMPLATE_GUIDES[input.templateKey] || TEMPLATE_GUIDES.general;
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

  const userPrompt = [
    `学习主题：${input.topic}`,
    `学习材料：${input.material}`,
    `当前水平：${input.level}`,
    `目标：${input.goal}`,
    `时间限制：${input.timebox}`,
    `主问题数量：${input.rootQuestionCount}`,
    "请生成一个层层推进、有明确目标感的主问题路线图。"
  ].join("\n");

  const result = await callResponsesApi(settings, systemPrompt, userPrompt);
  if (shouldUseFallbackRoadmap(input, result.roadmap)) {
    return {
      sessionTitle: `${input.topic} 闯关路线`,
      missionBrief: `围绕“${input.topic}”按主干理解、结构串联、场景应用和复盘辨错来推进。`,
      launchNote: "先讲清主干，再通过追问把理解逼深。",
      roadmap: buildFallbackRoadmap(input)
    };
  }
  return result;
}

async function evaluateLearningAnswer(settings, quest, node, answer) {
  const recentAttempts = (node.attempts || []).slice(-2).map((attempt) => ({
    verdict: attempt.verdict,
    answer: attempt.answer,
    coachReply: attempt.coachReply
  }));

  const systemPrompt = [
    "你是一个闯关式学习教练裁判。",
    "请根据用户回答来判断：是需要继续追问、需要衍生一个更深的子问题，还是可以完成当前节点并前进。",
    "要求真实、严格、具体，不要空泛鼓励。",
    "如果用户答偏了，优先给提示而不是完整答案。",
    "请严格返回 JSON，不要加 Markdown，不要加解释。",
    "JSON 结构必须是：",
    "{",
    '  "verdict": "retry_same_question" | "follow_up_required" | "complete_and_advance",',
    '  "score": 0 到 100 的整数,',
    '  "coachReply": "1 到 3 句自然语言反馈",',
    '  "hint": "给用户下一步修正提示，可为空字符串",',
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
    `最近两次尝试：${JSON.stringify(recentAttempts, null, 2)}`,
    `用户最新回答：${answer}`
  ].join("\n\n");

  return callResponsesApi(settings, systemPrompt, userPrompt);
}

async function evaluateReviewAnswer(settings, quest, node, answer) {
  const systemPrompt = [
    "你是一个学习复习抽问裁判。",
    "你只需要判断用户这次复习答得扎不扎实，并给出简短反馈。",
    "请严格返回 JSON，不要加 Markdown。",
    "JSON 结构必须是：",
    "{",
    '  "verdict": "review-locked-in" | "review-needs-refresh",',
    '  "score": 0 到 100 的整数,',
    '  "coachReply": "1 到 3 句自然语言反馈",',
    '  "hint": "下一步修正提示，可为空字符串",',
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
    `用户本次回答：${answer}`
  ].join("\n\n");

  return callResponsesApi(settings, systemPrompt, userPrompt);
}

module.exports = {
  TEMPLATE_GUIDES,
  evaluateLearningAnswer,
  evaluateReviewAnswer,
  generateQuestPlan,
  normalizeBaseUrl
};
