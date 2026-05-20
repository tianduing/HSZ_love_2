const FALLBACK_TEMPLATES = [
  { key: "general", label: "通用学习教练" },
  { key: "intense", label: "费曼 + 苏格拉底 + 压力测试" },
  { key: "algorithm", label: "算法刷题训练" },
  { key: "paper", label: "论文阅读训练" },
  { key: "project", label: "项目实战训练" }
];

const VIEW_META = {
  home: {
    eyebrow: "学习工作台",
    title: "学习工作台",
    subtitle: "项目、主线、复习队列"
  },
  library: {
    eyebrow: "项目库",
    title: "项目库",
    subtitle: "列表、进度、活动记录"
  },
  learn: {
    eyebrow: "闯关学习",
    title: "闯关学习",
    subtitle: "路线、答题、反馈"
  },
  review: {
    eyebrow: "复习中心",
    title: "复习中心",
    subtitle: "随机抽题、错题回看"
  },
  settings: {
    eyebrow: "设置",
    title: "设置",
    subtitle: "主题、接口、数据"
  }
};

const REVIEW_MODE_META = {
  random: {
    label: "随机抽题",
    emptyMessage: "当前还没有可抽查节点。先完成几个问题，再回来随机抽题。"
  },
  current: {
    label: "当前项目",
    emptyMessage: "当前项目还没有完成节点，先把主线往前推几题。"
  },
  weak: {
    label: "薄弱节点",
    emptyMessage: "目前还没有明显薄弱节点，说明最近几轮回答还算稳。"
  },
  recent: {
    label: "最新完成",
    emptyMessage: "还没有新完成的节点可以回炉。"
  }
};

const THEME_PRESETS = [
  {
    key: "forest",
    name: "护眼绿洲",
    description: "奶油白 + 植物绿，适合白天长时间学习。"
  },
  {
    key: "ocean",
    name: "海盐蓝",
    description: "更冷静的浅蓝玻璃感，适合理工和结构化思考。"
  },
  {
    key: "graphite",
    name: "石墨夜读",
    description: "低刺激深色主题，适合晚上专注闯关。"
  }
];

const UI_STORAGE_KEY = "study-quest-ui-v3";

function createDefaultBackgroundState() {
  return {
    image: "",
    opacity: 55,
    positionX: 50,
    positionY: 50
  };
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function deriveTopicFromMaterial(material, topic = "") {
  const explicitTopic = cleanText(topic);
  if (explicitTopic) {
    return explicitTopic;
  }

  const normalizedMaterial = cleanText(material).replace(/\s+/g, " ");
  if (!normalizedMaterial) {
    return "未命名学习项目";
  }

  const firstLine = normalizedMaterial
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || normalizedMaterial;
  const normalized = firstLine.replace(/^[#>*\-\d.\s:：]+/, "").trim();
  const sentence = normalized.split(/[。！？!?；;，,|]/)[0].trim();
  const candidate = sentence || normalized || normalizedMaterial;
  return candidate.length > 28 ? `${candidate.slice(0, 28)}...` : candidate;
}

function loadUiState() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) {
      return {
        theme: "forest",
        focusMode: false,
        background: createDefaultBackgroundState()
      };
    }
    const parsed = JSON.parse(raw);
    const background = parsed.background || {};
    return {
      theme: ["forest", "ocean", "graphite"].includes(parsed.theme) ? parsed.theme : "forest",
      focusMode: Boolean(parsed.focusMode),
      background: {
        image: typeof background.image === "string" ? background.image : "",
        opacity: clamp(Number(background.opacity ?? 55), 0, 100),
        positionX: clamp(Number(background.positionX ?? 50), 0, 100),
        positionY: clamp(Number(background.positionY ?? 50), 0, 100)
      }
    };
  } catch (_error) {
    return {
      theme: "forest",
      focusMode: false,
      background: createDefaultBackgroundState()
    };
  }
}

function saveUiState() {
  localStorage.setItem(
    UI_STORAGE_KEY,
    JSON.stringify({
      theme: appState.ui.theme,
      focusMode: appState.ui.focusMode,
      background: appState.ui.background
    })
  );
}

function buildPreviewRoadmap(topic, rootQuestionCount, templateKey) {
  const stems = {
    general: [
      `如果你要用自己的话讲清“${topic}”，它的核心对象、目标和边界分别是什么？`,
      `“${topic}”的关键结构、关键步骤或关键机制，是怎样串起来形成完整闭环的？`,
      `把“${topic}”放到真实场景里时，你会如何解释它为什么值得这样设计？`,
      `围绕“${topic}”，最常见的误区、偷懒做法或理解偏差是什么？`,
      `如果要验证自己已经真正掌握“${topic}”，你会输出什么结果来证明？`
    ],
    intense: [
      `用自己的话解释“${topic}”到底是什么，并明确它不是什么。`,
      `为什么“${topic}”成立？背后的因果链条或判断逻辑是什么？`,
      `“${topic}”一旦进入复杂场景，最容易在哪些边界条件下失效？`,
      `如果你提出一个关于“${topic}”的方案，我应该从哪些漏洞和反例上挑战它？`,
      `关于“${topic}”，最危险的自我欺骗是什么？你如何现场纠正自己？`
    ],
    algorithm: [
      `面对“${topic}”，你会如何先准确复述题意和边界，再决定解法方向？`,
      `和“${topic}”相关的最直接暴力解法是什么？它慢在哪里？`,
      `“${topic}”真正值得优化的瓶颈在哪里？你凭什么这样判断？`,
      `要把“${topic}”从暴力解推进到更优解，关键思路或数据结构是什么？`,
      `如果写成代码，“${topic}”最容易在哪些边界情况翻车？`
    ],
    paper: [
      `这篇关于“${topic}”的材料究竟想解决什么问题，问题为什么重要？`,
      `围绕“${topic}”，作者的方法、假设和推理链条是什么？`,
      `材料中的实验或论证，是如何支撑“${topic}”结论的？`,
      `如果你要复述“${topic}”，哪些局限性必须同步讲清楚？`,
      `关于“${topic}”，你最想追问作者的一个问题是什么？`
    ],
    project: [
      `如果把“${topic}”落成一个最小可交付项目，你的闭环会长什么样？`,
      `围绕“${topic}”，关键链路、关键模块和依赖顺序分别是什么？`,
      `“${topic}”落地时最值得做的技术取舍有哪些？代价分别是什么？`,
      `如果“${topic}”真的出问题，最该先盯住哪些故障点和监控指标？`,
      `项目做完后，你会用什么标准判断自己算不算真的掌握了“${topic}”？`
    ]
  };

  const source = stems[templateKey] || stems.general;
  return Array.from({ length: rootQuestionCount }).map((_, index) => ({
    title: source[index % source.length],
    goal:
      index === 0
        ? "先把核心定义和主干逻辑讲明白。"
        : index === rootQuestionCount - 1
          ? "把复盘、边界和自证能力也带出来。"
          : "继续往结构理解、应用判断和场景取舍推进。",
    whyItMatters:
      index === 0
        ? "第一关讲不清，后面的追问会一直漂。"
        : "真正的掌握，必须能讲应用、辨边界、做判断。",
    difficulty: clamp(2 + (index % 4), 1, 5)
  }));
}

function createPreviewApi() {
  const storageKey = "study-quest-preview-db-v3";

  function loadPreviewState() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw
        ? JSON.parse(raw)
        : {
            settings: {
              baseUrl: "https://codex.ximuai.com/v1",
              model: "gpt-5.4",
              defaultTemplateKey: "general",
              defaultRootQuestionCount: 10
            },
            quests: []
          };
    } catch (_error) {
      return {
        settings: {
          baseUrl: "https://codex.ximuai.com/v1",
          model: "gpt-5.4",
          defaultTemplateKey: "general",
          defaultRootQuestionCount: 10
        },
        quests: []
      };
    }
  }

  function savePreviewState(nextState) {
    localStorage.setItem(storageKey, JSON.stringify(nextState));
  }

  function compareNodes(left, right) {
    const leftParts = String(left.path || "")
      .replace(/^Q/, "")
      .split(".")
      .map(Number);
    const rightParts = String(right.path || "")
      .replace(/^Q/, "")
      .split(".")
      .map(Number);
    const size = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < size; index += 1) {
      const diff = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  function buildStats(quest) {
    const nodes = Array.isArray(quest.nodes) ? quest.nodes : [];
    const roots = nodes.filter((node) => !node.parentId);
    return {
      totalRoots: roots.length,
      completedRoots: roots.filter((node) => node.status === "completed").length,
      totalNodes: nodes.length,
      completedNodes: nodes.filter((node) => node.status === "completed").length,
      pendingNodes: nodes.filter((node) => node.status === "pending" || node.status === "active").length
    };
  }

  function summarizeQuest(quest) {
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
      stats: buildStats(quest)
    };
  }

  function appendTimeline(quest, kind, summary) {
    quest.timeline = Array.isArray(quest.timeline) ? quest.timeline : [];
    quest.timeline.unshift({
      id: crypto.randomUUID(),
      kind,
      summary,
      createdAt: new Date().toISOString()
    });
    quest.timeline = quest.timeline.slice(0, 60);
  }

  function activateNextPending(quest) {
    quest.nodes.forEach((node) => {
      if (node.status === "active") {
        node.status = "pending";
      }
    });
    const nextNode = [...quest.nodes]
      .filter((node) => node.status === "pending")
      .sort(compareNodes)[0];
    if (nextNode) {
      nextNode.status = "active";
      quest.currentNodeId = nextNode.id;
    } else {
      quest.currentNodeId = null;
      quest.finishedAt = new Date().toISOString();
    }
  }

  return {
    async loadBootstrap() {
      const state = loadPreviewState();
      return {
        runtime: {
          dataRoot: "浏览器本地数据",
          templateOptions: FALLBACK_TEMPLATES
        },
        settings: {
          ...state.settings,
          hasApiKey: false
        },
        quests: state.quests.map(summarizeQuest).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      };
    },

    async saveSettings(payload) {
      const state = loadPreviewState();
      state.settings = {
        ...state.settings,
        ...payload,
        defaultRootQuestionCount: clamp(Number(payload.defaultRootQuestionCount || 10), 5, 30)
      };
      savePreviewState(state);
      return {
        settings: {
          ...state.settings,
          hasApiKey: false
        }
      };
    },

    async createQuest(payload) {
      const state = loadPreviewState();
      const now = new Date().toISOString();
      const topic = deriveTopicFromMaterial(payload.material, payload.topic);
      const rootQuestionCount = clamp(Number(payload.rootQuestionCount || state.settings.defaultRootQuestionCount || 10), 5, 30);
      const roadmap = buildPreviewRoadmap(topic, rootQuestionCount, payload.templateKey);
      const nodes = roadmap.map((item, index) => ({
        id: crypto.randomUUID(),
        path: `Q${index + 1}`,
        parentId: null,
        title: item.title,
        goal: item.goal,
        whyItMatters: item.whyItMatters,
        difficulty: item.difficulty,
        status: index === 0 ? "active" : "pending",
        source: "roadmap",
        attempts: [],
        reviewCount: 0,
        lastReviewAt: null,
        createdAt: now,
        updatedAt: now,
        completedAt: null
      }));

      const quest = {
        id: crypto.randomUUID(),
        title: topic,
        topic,
        material: cleanText(payload.material),
        level: cleanText(payload.level),
        goal: cleanText(payload.goal),
        timebox: cleanText(payload.timebox),
        templateKey: payload.templateKey,
        rootQuestionCount,
        missionBrief: `围绕“${topic}”按定义、结构、应用、辨错和复盘来推进。`,
        launchNote: "先讲清主干，再通过追问把理解逼深。",
        createdAt: now,
        updatedAt: now,
        finishedAt: null,
        currentNodeId: nodes[0]?.id || null,
        nodes,
        timeline: [
          {
            id: crypto.randomUUID(),
            kind: "session-created",
            summary: "已生成主线关卡。",
            createdAt: now
          }
        ]
      };

      state.quests.unshift(quest);
      savePreviewState(state);
      return {
        quest: {
          ...quest,
          stats: buildStats(quest)
        },
        quests: state.quests.map(summarizeQuest).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      };
    },

    async getQuest(questId) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === questId);
      if (!quest) {
        throw new Error("没有找到对应的预览任务。");
      }
      return {
        ...quest,
        stats: buildStats(quest)
      };
    },

    async answerQuestion(payload) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === payload.questId);
      const node = quest?.nodes?.find((item) => item.id === payload.nodeId);
      if (!quest || !node) {
        throw new Error("当前问题不存在。");
      }

      const answer = cleanText(payload.answer);
      const now = new Date().toISOString();
      const shortAnswer = answer.length < 40;
      const goodEnough = answer.length >= 120;
      const alreadyHasChild = quest.nodes.some((item) => item.parentId === node.id);
      const verdict = shortAnswer
        ? "retry_same_question"
        : !goodEnough && !node.parentId && !alreadyHasChild
          ? "follow_up_required"
          : "complete_and_advance";

      const evaluation = {
        verdict,
        score: clamp(answer.length, 38, 96),
        coachReply:
          verdict === "retry_same_question"
            ? "这次回答还像是抓到了轮廓，但还没把核心逻辑真正讲开。"
            : verdict === "follow_up_required"
              ? "主干已经说到了，下一步该把应用场景和判断依据也补齐。"
              : "这一关已经基本过线，可以继续推进后面的主线。",
        hint:
          verdict === "retry_same_question"
            ? "试着至少补上：它是什么、为什么成立、怎么用、什么时候会失效。"
            : verdict === "follow_up_required"
              ? "继续往真实场景、取舍和边界条件上讲。"
              : "",
        feedback: {
          strengths: shortAnswer ? ["已经开始用自己的话输出"] : ["抓住了主干", "表达开始带有自己的结构"],
          gaps: shortAnswer ? ["展开不够", "缺少判断依据"] : ["还可以更具体", "真实场景还不够扎实"],
          missing: shortAnswer ? ["应用场景", "边界条件"] : verdict === "follow_up_required" ? ["更具体的取舍例子"] : [],
          improve: shortAnswer ? "先用一句话给出本质，再补一个真实例子。" : "如果再补一个具体场景，这个答案会更稳。"
        }
      };

      node.attempts.push({
        id: crypto.randomUUID(),
        mode: "learn",
        answer,
        verdict: evaluation.verdict,
        score: evaluation.score,
        coachReply: evaluation.coachReply,
        hint: evaluation.hint,
        strengths: evaluation.feedback.strengths,
        gaps: evaluation.feedback.gaps,
        missing: evaluation.feedback.missing,
        improve: evaluation.feedback.improve,
        createdAt: now
      });
      node.updatedAt = now;

      if (verdict === "retry_same_question") {
        node.status = "active";
        quest.currentNodeId = node.id;
        appendTimeline(quest, "answer-retry", `${node.path} 还需要继续展开。`);
      } else {
        node.status = "completed";
        node.completedAt = now;
        if (verdict === "follow_up_required") {
          quest.nodes.forEach((item) => {
            if (item.status === "active") {
              item.status = "pending";
            }
          });
          const childIndex = quest.nodes.filter((item) => item.parentId === node.id).length + 1;
          const childNode = {
            id: crypto.randomUUID(),
            path: `${node.path}.${childIndex}`,
            parentId: node.id,
            title: `把“${node.title}”放进真实场景里再解释一次。`,
            goal: "继续往应用、边界和取舍推进。",
            whyItMatters: "真正的掌握不是会背，而是能在变化场景里解释清楚。",
            difficulty: clamp((node.difficulty || 3) + 1, 1, 5),
            status: "active",
            source: "follow-up",
            attempts: [],
            reviewCount: 0,
            lastReviewAt: null,
            createdAt: now,
            updatedAt: now,
            completedAt: null
          };
          quest.nodes.push(childNode);
          quest.currentNodeId = childNode.id;
          evaluation.followUpQuestion = {
            title: childNode.title,
            goal: childNode.goal,
            reason: childNode.whyItMatters,
            difficulty: childNode.difficulty
          };
          appendTimeline(quest, "follow-up-created", `${node.path} 过线，已解锁 ${childNode.path}。`);
        } else {
          appendTimeline(quest, "node-completed", `${node.path} 已点亮完成。`);
          activateNextPending(quest);
        }
      }

      quest.updatedAt = now;
      savePreviewState(state);

      return {
        evaluation,
        quest: {
          ...quest,
          stats: buildStats(quest)
        },
        quests: state.quests.map(summarizeQuest).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      };
    },

    async drawReviewQuestion(scopeQuestId) {
      const state = loadPreviewState();
      const quests = scopeQuestId ? state.quests.filter((item) => item.id === scopeQuestId) : state.quests;
      const candidates = quests.flatMap((quest) =>
        quest.nodes
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
      return candidates[Math.floor(Math.random() * candidates.length)];
    },

    async answerReviewQuestion(payload) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === payload.questId);
      const node = quest?.nodes?.find((item) => item.id === payload.nodeId);
      if (!quest || !node) {
        throw new Error("没有找到当前复习节点。");
      }
      const answer = cleanText(payload.answer);
      const now = new Date().toISOString();
      const score = clamp(answer.length, 35, 95);
      const evaluation = {
        verdict: score >= 65 ? "review-locked-in" : "review-needs-refresh",
        score,
        coachReply:
          score >= 65
            ? "这次复习回答比较稳，说明你不是只停留在看懂。"
            : "这题还有点发飘，建议回到主线里再复盘一次。",
        hint: score >= 65 ? "" : "先讲一句话本质，再补一个真实场景。",
        feedback: {
          strengths: score >= 65 ? ["主干还在", "表达比第一次更顺"] : ["还记得部分结构"],
          gaps: score >= 65 ? ["还可以更凝练"] : ["细节容易散", "场景判断不够稳"],
          missing: score >= 65 ? [] : ["至少一个应用例子"],
          improve: "复习时优先说本质，再补边界和取舍。"
        }
      };

      node.attempts.push({
        id: crypto.randomUUID(),
        mode: "review",
        answer,
        verdict: evaluation.verdict,
        score,
        coachReply: evaluation.coachReply,
        hint: evaluation.hint,
        strengths: evaluation.feedback.strengths,
        gaps: evaluation.feedback.gaps,
        missing: evaluation.feedback.missing,
        improve: evaluation.feedback.improve,
        createdAt: now
      });
      node.reviewCount = (node.reviewCount || 0) + 1;
      node.lastReviewAt = now;
      node.updatedAt = now;
      quest.updatedAt = now;
      appendTimeline(quest, "review-answer", `${node.path} 已完成一次复习回顾。`);
      savePreviewState(state);

      return {
        evaluation,
        quest: {
          ...quest,
          stats: buildStats(quest)
        },
        quests: state.quests.map(summarizeQuest).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      };
    }
  };
}

const dom = {
  body: document.body,
  navButtons: [...document.querySelectorAll(".nav-button")],
  openCreateButtons: [...document.querySelectorAll("[data-open-create]")],
  viewJumpButtons: [...document.querySelectorAll("[data-view-jump]")],
  closeModalButtons: [...document.querySelectorAll("[data-close-modal]")],
  viewPanes: {
    home: document.querySelector("#home-view"),
    library: document.querySelector("#library-view"),
    learn: document.querySelector("#learn-view"),
    review: document.querySelector("#review-view"),
    settings: document.querySelector("#settings-view")
  },
  previewBanner: document.querySelector("#preview-banner"),
  viewEyebrow: document.querySelector("#view-eyebrow"),
  viewTitle: document.querySelector("#view-title"),
  viewSubtitle: document.querySelector("#view-subtitle"),
  apiStatusPill: document.querySelector("#api-status-pill"),
  questCountPill: document.querySelector("#quest-count-pill"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeToggleIcon: document.querySelector("#theme-toggle-icon"),
  projectSearch: document.querySelector("#project-search"),
  sidebarStartReviewButton: document.querySelector("#sidebar-start-review"),
  sidebarLibraryCount: document.querySelector("#sidebar-library-count"),
  sidebarProjectList: document.querySelector("#sidebar-project-list"),
  sidebarQuestTitle: document.querySelector("#sidebar-quest-title"),
  sidebarQuestBrief: document.querySelector("#sidebar-quest-brief"),
  sidebarProgressText: document.querySelector("#sidebar-progress-text"),
  sidebarProgressBar: document.querySelector("#sidebar-progress-bar"),
  projectRootText: document.querySelector("#project-root-text"),
  dataRootText: document.querySelector("#data-root-text"),
  goLibraryButton: document.querySelector("#go-library"),
  startGlobalReviewButton: document.querySelector("#start-global-review"),
  homeStatProjects: document.querySelector("#home-stat-projects"),
  homeStatRoots: document.querySelector("#home-stat-roots"),
  homeStatReviewable: document.querySelector("#home-stat-reviewable"),
  homeStatUpdated: document.querySelector("#home-stat-updated"),
  homeProjectList: document.querySelector("#home-project-list"),
  homeFocusCard: document.querySelector("#home-focus-card"),
  homeReviewList: document.querySelector("#home-review-list"),
  libraryProjectCount: document.querySelector("#library-project-count"),
  libraryProjectList: document.querySelector("#library-project-list"),
  librarySpotlight: document.querySelector("#library-spotlight"),
  learnEmptyState: document.querySelector("#learn-empty-state"),
  learnLayout: document.querySelector("#learn-layout"),
  learnProjectTitle: document.querySelector("#learn-project-title"),
  learnMetaChips: document.querySelector("#learn-meta-chips"),
  learnRootProgressText: document.querySelector("#learn-root-progress-text"),
  learnRootProgressBar: document.querySelector("#learn-root-progress-bar"),
  learnNodeProgress: document.querySelector("#learn-node-progress"),
  learnProjectBrief: document.querySelector("#learn-project-brief"),
  learnStatGrid: document.querySelector("#learn-stat-grid"),
  roadmapTree: document.querySelector("#roadmap-tree"),
  toggleFocusModeButton: document.querySelector("#toggle-focus-mode"),
  questionPanel: document.querySelector("#question-panel"),
  questionEmpty: document.querySelector("#question-empty"),
  currentQuestionTag: document.querySelector("#current-question-tag"),
  currentQuestionPath: document.querySelector("#current-question-path"),
  currentQuestionTitle: document.querySelector("#current-question-title"),
  currentQuestionDifficulty: document.querySelector("#current-question-difficulty"),
  currentQuestionGoal: document.querySelector("#current-question-goal"),
  currentQuestionWhy: document.querySelector("#current-question-why"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  submitAnswer: document.querySelector("#submit-answer"),
  feedbackVerdict: document.querySelector("#feedback-verdict"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  timelineList: document.querySelector("#timeline-list"),
  reviewModeButtons: [...document.querySelectorAll("[data-review-mode]")],
  reviewModeTitle: document.querySelector("#review-mode-title"),
  drawReviewButton: document.querySelector("#draw-review"),
  reviewSummary: document.querySelector("#review-summary"),
  reviewPanel: document.querySelector("#review-panel"),
  reviewRecords: document.querySelector("#review-records"),
  themeOptions: document.querySelector("#theme-options"),
  settingsForm: document.querySelector("#settings-form"),
  settingsBaseUrl: document.querySelector("#settings-base-url"),
  settingsModel: document.querySelector("#settings-model"),
  settingsApiKey: document.querySelector("#settings-api-key"),
  settingsTemplate: document.querySelector("#settings-template"),
  settingsRootCount: document.querySelector("#settings-root-count"),
  settingsApiHint: document.querySelector("#settings-api-hint"),
  settingsProjectRoot: document.querySelector("#settings-project-root"),
  settingsDataRoot: document.querySelector("#settings-data-root"),
  backgroundFileInput: document.querySelector("#background-file-input"),
  pickBackgroundButton: document.querySelector("#pick-background"),
  clearBackgroundButton: document.querySelector("#clear-background"),
  backgroundPreview: document.querySelector("#background-preview"),
  backgroundPreviewCaption: document.querySelector("#background-preview-caption"),
  backgroundOpacity: document.querySelector("#background-opacity"),
  backgroundOpacityValue: document.querySelector("#background-opacity-value"),
  backgroundPositionX: document.querySelector("#background-position-x"),
  backgroundPositionXValue: document.querySelector("#background-position-x-value"),
  backgroundPositionY: document.querySelector("#background-position-y"),
  backgroundPositionYValue: document.querySelector("#background-position-y-value"),
  createModal: document.querySelector("#create-modal"),
  questForm: document.querySelector("#quest-form"),
  topicInput: document.querySelector("#topic-input"),
  materialInput: document.querySelector("#material-input"),
  levelInput: document.querySelector("#level-input"),
  goalInput: document.querySelector("#goal-input"),
  timeboxInput: document.querySelector("#timebox-input"),
  countInput: document.querySelector("#count-input"),
  templateSelect: document.querySelector("#template-select"),
  createQuestButton: document.querySelector("#create-quest"),
  derivedTopicLabel: document.querySelector("#derived-topic-label"),
  toggleAdvancedButton: document.querySelector("#toggle-advanced"),
  advancedFields: document.querySelector("#advanced-fields"),
  toastRegion: document.querySelector("#toast-region")
};

const appState = {
  bootstrap: null,
  quests: [],
  activeQuestId: null,
  activeQuest: null,
  questDetails: new Map(),
  currentView: "home",
  currentReview: null,
  reviewMode: "random",
  lastEvaluation: null,
  previewMode: !window.studyCoachApi,
  advancedCreateOpen: false,
  ui: loadUiState()
  ,
  projectSearch: ""
};

const api = window.studyCoachApi || createPreviewApi();

function getTemplateOptions() {
  return appState.bootstrap?.runtime?.templateOptions?.length
    ? appState.bootstrap.runtime.templateOptions
    : FALLBACK_TEMPLATES;
}

function getTemplateLabel(key) {
  return getTemplateOptions().find((item) => item.key === key)?.label || "通用学习教练";
}

function sortQuestSummaries(quests) {
  return [...quests].sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

function getVisibleQuestList() {
  const keyword = cleanText(appState.projectSearch).toLowerCase();
  if (!keyword) {
    return appState.quests;
  }
  return appState.quests.filter((quest) => quest.title.toLowerCase().includes(keyword));
}

function formatDateTime(value) {
  if (!value) {
    return "还没有";
  }
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function getQuestProgressPercent(questLike) {
  const total = Number(questLike?.stats?.totalRoots || 0);
  const completed = Number(questLike?.stats?.completedRoots || 0);
  if (!total) {
    return 0;
  }
  return Math.round((completed / total) * 100);
}

function getNodeProgressPercent(questLike) {
  const total = Number(questLike?.stats?.totalNodes || 0);
  const completed = Number(questLike?.stats?.completedNodes || 0);
  if (!total) {
    return 0;
  }
  return Math.round((completed / total) * 100);
}

function getVerdictMeta(verdict) {
  if (verdict === "retry_same_question" || verdict === "review-needs-refresh") {
    return { label: "继续打磨", tone: "warning" };
  }
  if (verdict === "follow_up_required") {
    return { label: "解锁子问题", tone: "success" };
  }
  if (verdict === "complete_and_advance" || verdict === "review-locked-in") {
    return { label: "已过关", tone: "success" };
  }
  return { label: "等待回答", tone: "neutral" };
}

function getQuestStatusMeta(summary) {
  const completedRoots = Number(summary?.stats?.completedRoots || 0);
  const totalRoots = Number(summary?.stats?.totalRoots || 0);
  if (totalRoots && completedRoots === totalRoots) {
    return { label: "已通关", tone: "success" };
  }
  if (completedRoots === 0) {
    return { label: "刚开始", tone: "neutral" };
  }
  return { label: "进行中", tone: "warning" };
}

function buildInlineStatCard(label, value) {
  return `<div class="inline-stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function getActiveNode(quest) {
  if (!quest?.currentNodeId || !Array.isArray(quest.nodes)) {
    return null;
  }
  return quest.nodes.find((node) => node.id === quest.currentNodeId) || null;
}

function sortNodes(nodes) {
  return [...nodes].sort((left, right) => {
    const leftParts = String(left.path || "")
      .replace(/^Q/, "")
      .split(".")
      .map(Number);
    const rightParts = String(right.path || "")
      .replace(/^Q/, "")
      .split(".")
      .map(Number);
    const size = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < size; index += 1) {
      const diff = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  });
}

function getLatestAttempt(node) {
  if (!Array.isArray(node?.attempts) || !node.attempts.length) {
    return null;
  }
  return [...node.attempts].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0];
}

function convertAttemptToEvaluation(attempt) {
  if (!attempt) {
    return null;
  }
  return {
    verdict: attempt.verdict,
    score: attempt.score,
    coachReply: attempt.coachReply,
    hint: attempt.hint,
    feedback: {
      strengths: Array.isArray(attempt.strengths) ? attempt.strengths : [],
      gaps: Array.isArray(attempt.gaps) ? attempt.gaps : [],
      missing: Array.isArray(attempt.missing) ? attempt.missing : [],
      improve: attempt.improve || ""
    }
  };
}

function collectRecentAttempts(limit = 12) {
  const questMap = new Map();
  if (appState.activeQuest?.id) {
    questMap.set(appState.activeQuest.id, appState.activeQuest);
  }
  appState.questDetails.forEach((value, key) => {
    questMap.set(key, value);
  });

  return [...questMap.values()]
    .flatMap((quest) =>
      (quest.nodes || []).flatMap((node) =>
        (node.attempts || []).map((attempt) => ({
          questId: quest.id,
          questTitle: quest.title,
          nodePath: node.path,
          nodeTitle: node.title,
          mode: attempt.mode,
          verdict: attempt.verdict,
          score: attempt.score,
          createdAt: attempt.createdAt
        }))
      )
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, limit);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  dom.toastRegion.append(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function playPositiveTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.08);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
}

function applyUiState() {
  dom.body.dataset.theme = appState.ui.theme;
  dom.body.classList.toggle("focus-mode", appState.ui.focusMode && appState.currentView === "learn");
  const background = appState.ui.background || createDefaultBackgroundState();
  dom.body.classList.toggle("has-custom-background", Boolean(background.image));
  dom.body.style.setProperty("--custom-bg-image", background.image ? `url("${background.image}")` : "none");
  dom.body.style.setProperty("--custom-bg-opacity", String(clamp(Number(background.opacity || 0), 0, 100) / 100));
  dom.body.style.setProperty("--custom-bg-position-x", `${clamp(Number(background.positionX || 50), 0, 100)}%`);
  dom.body.style.setProperty("--custom-bg-position-y", `${clamp(Number(background.positionY || 50), 0, 100)}%`);
  dom.toggleFocusModeButton.textContent = appState.ui.focusMode ? "退出沉浸模式" : "沉浸模式";
  if (dom.themeToggleIcon) {
    dom.themeToggleIcon.className = `fa-solid ${appState.ui.theme === "graphite" ? "fa-sun" : "fa-moon"}`;
  }
  if (dom.themeToggle) {
    dom.themeToggle.title = appState.ui.theme === "graphite" ? "切换为浅色工作台" : "切换为夜读工作台";
  }
}

function setTheme(themeKey) {
  appState.ui.theme = themeKey;
  saveUiState();
  applyUiState();
  renderThemeOptions();
}

function setFocusMode(enabled) {
  appState.ui.focusMode = enabled;
  saveUiState();
  applyUiState();
}

function updateBackgroundSetting(key, value) {
  appState.ui.background = {
    ...createDefaultBackgroundState(),
    ...appState.ui.background,
    [key]: value
  };
  saveUiState();
  applyUiState();
  renderBackgroundControls();
}

function clearCustomBackground() {
  appState.ui.background = createDefaultBackgroundState();
  saveUiState();
  applyUiState();
  renderBackgroundControls();
}

function loadCustomBackgroundFile(file) {
  if (!file) {
    return;
  }
  if (!String(file.type || "").startsWith("image/")) {
    showToast("请选择图片文件作为背景。", "warning");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    updateBackgroundSetting("image", typeof reader.result === "string" ? reader.result : "");
    showToast("已更新自定义背景。");
  });
  reader.readAsDataURL(file);
}

function switchView(viewKey) {
  appState.currentView = viewKey;
  Object.entries(dom.viewPanes).forEach(([key, pane]) => {
    pane.classList.toggle("hidden", key !== viewKey);
  });
  dom.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewKey);
  });
  const meta = VIEW_META[viewKey];
  dom.viewEyebrow.textContent = meta.eyebrow;
  dom.viewTitle.textContent = meta.title;
  dom.viewSubtitle.textContent = meta.subtitle;
  applyUiState();
}

function openCreateModal() {
  dom.createModal.classList.remove("hidden");
  dom.createModal.setAttribute("aria-hidden", "false");
  updateDerivedTopicLabel();
  window.setTimeout(() => dom.materialInput.focus(), 0);
}

function closeCreateModal() {
  dom.createModal.classList.add("hidden");
  dom.createModal.setAttribute("aria-hidden", "true");
}

function setAdvancedCreateOpen(isOpen) {
  appState.advancedCreateOpen = isOpen;
  dom.advancedFields.classList.toggle("hidden", !isOpen);
  dom.toggleAdvancedButton.textContent = isOpen ? "收起可选项" : "展开可选项";
}

function fillTemplateOptions(selectElement, selectedValue) {
  selectElement.innerHTML = "";
  getTemplateOptions().forEach((template) => {
    const option = document.createElement("option");
    option.value = template.key;
    option.textContent = template.label;
    option.selected = template.key === selectedValue;
    selectElement.append(option);
  });
}

function syncFormsFromSettings() {
  const settings = appState.bootstrap?.settings;
  if (!settings) {
    return;
  }
  fillTemplateOptions(dom.templateSelect, settings.defaultTemplateKey || "general");
  fillTemplateOptions(dom.settingsTemplate, settings.defaultTemplateKey || "general");
  dom.settingsBaseUrl.value = settings.baseUrl || "";
  dom.settingsModel.value = settings.model || "";
  dom.settingsApiKey.value = "";
  dom.settingsTemplate.value = settings.defaultTemplateKey || "general";
  dom.settingsRootCount.value = clamp(Number(settings.defaultRootQuestionCount || 10), 5, 30);
  dom.countInput.value = clamp(Number(settings.defaultRootQuestionCount || 10), 5, 30);
  updateDerivedTopicLabel();
}

function updateDerivedTopicLabel() {
  dom.derivedTopicLabel.textContent = deriveTopicFromMaterial(dom.materialInput.value, dom.topicInput.value);
}

function hydrateQuestSummaries(quests) {
  appState.quests = sortQuestSummaries(Array.isArray(quests) ? quests : []);
}

function rememberQuestDetail(quest) {
  if (!quest?.id) {
    return;
  }
  appState.questDetails.set(quest.id, quest);
  if (appState.activeQuestId === quest.id) {
    appState.activeQuest = quest;
  }
}

async function ensureQuestDetail(questId, force = false) {
  if (!force && appState.questDetails.has(questId)) {
    return appState.questDetails.get(questId);
  }
  const quest = await api.getQuest(questId);
  rememberQuestDetail(quest);
  return quest;
}

async function prefetchQuestDetails(limit = 6) {
  const subset = appState.quests.slice(0, limit);
  for (const summary of subset) {
    try {
      await ensureQuestDetail(summary.id);
    } catch (_error) {
      // Ignore prefetch failures in preview flow.
    }
  }
  renderReviewRecords();
}

async function selectQuest(questId) {
  appState.activeQuestId = questId;
  appState.lastEvaluation = null;
  appState.currentReview = null;
  appState.activeQuest = await ensureQuestDetail(questId);
  renderAll();
}

function renderPreviewBanner() {
  dom.previewBanner.classList.toggle("hidden", !appState.previewMode);
}

function renderHeaderAndSidebar() {
  const settings = appState.bootstrap?.settings;
  const hasApiKey = Boolean(settings?.hasApiKey);
  dom.apiStatusPill.textContent = hasApiKey ? "接口已就绪" : "接口待配置";
  dom.apiStatusPill.className = `status-pill ${hasApiKey ? "success" : "neutral"}`;
  dom.settingsApiHint.textContent = hasApiKey ? "已保存 key" : "待配置";
  dom.settingsApiHint.className = `status-pill ${hasApiKey ? "success" : "neutral"}`;
  dom.questCountPill.textContent = `${appState.quests.length} 个项目`;

  if (!appState.activeQuest) {
    dom.sidebarQuestTitle.textContent = "还没有学习项目";
    dom.sidebarQuestBrief.textContent = "暂无当前项目";
    dom.sidebarProgressText.textContent = "0 / 0";
    dom.sidebarProgressBar.style.width = "0%";
  } else {
    const quest = appState.activeQuest;
    dom.sidebarQuestTitle.textContent = quest.title;
    dom.sidebarQuestBrief.textContent = quest.missionBrief || quest.launchNote || "暂无摘要";
    dom.sidebarProgressText.textContent = `${quest.stats.completedRoots} / ${quest.stats.totalRoots}`;
    dom.sidebarProgressBar.style.width = `${getQuestProgressPercent(quest)}%`;
  }

  const visibleQuests = getVisibleQuestList();
  dom.sidebarLibraryCount.textContent = String(visibleQuests.length);
  if (!visibleQuests.length) {
    dom.sidebarProjectList.innerHTML = `<div class="sidebar-empty">还没有匹配的项目</div>`;
  } else {
    dom.sidebarProjectList.innerHTML = visibleQuests
      .slice(0, 8)
      .map((quest) => {
        const status = getQuestStatusMeta(quest);
        return `
          <button class="sidebar-project-item ${quest.id === appState.activeQuestId ? "active" : ""}" data-sidebar-quest="${escapeHtml(quest.id)}" type="button">
            <div>
              <strong>${escapeHtml(quest.title)}</strong>
              <span>${quest.stats.completedRoots}/${quest.stats.totalRoots} 主线</span>
            </div>
            <em class="${status.tone}">${escapeHtml(status.label)}</em>
          </button>
        `;
      })
      .join("");
    dom.sidebarProjectList.querySelectorAll("[data-sidebar-quest]").forEach((button) => {
      button.addEventListener("click", async () => {
        await selectQuest(button.dataset.sidebarQuest);
        switchView("learn");
        renderAll();
      });
    });
  }
}

function projectCardMarkup(summary, { active = false, compact = false } = {}) {
  const status = getQuestStatusMeta(summary);
  const progress = getQuestProgressPercent(summary);
  const nodeProgress = getNodeProgressPercent(summary);
  return `
    <article class="project-card ${active ? "active" : ""}">
      <div class="project-card-head">
        <div>
          <p class="eyebrow">${escapeHtml(getTemplateLabel(summary.templateKey))}</p>
          <h4>${escapeHtml(summary.title)}</h4>
        </div>
        <span class="status-pill ${status.tone}">${escapeHtml(status.label)}</span>
      </div>
      <p class="muted">${escapeHtml(summary.missionBrief || "暂无摘要")}</p>
      <div class="progress-track">
        <span style="width:${progress}%"></span>
      </div>
      <div class="project-meta-row">
        <span class="project-meta">主线 ${summary.stats.completedRoots}/${summary.stats.totalRoots}</span>
        <span class="project-meta">节点 ${summary.stats.completedNodes}/${summary.stats.totalNodes}</span>
        <span class="project-meta">节点完成率 ${nodeProgress}%</span>
      </div>
      <div class="project-actions">
        <button class="primary-button" data-continue-quest="${escapeHtml(summary.id)}" type="button">
          ${compact ? "继续" : "继续学习"}
        </button>
        <button class="ghost-button" data-review-scope="${escapeHtml(summary.id)}" type="button">
          ${compact ? "复习" : "去复习"}
        </button>
      </div>
    </article>
  `;
}

function projectRowMarkup(summary, { active = false } = {}) {
  const status = getQuestStatusMeta(summary);
  const progress = getQuestProgressPercent(summary);
  return `
    <article class="project-row ${active ? "active" : ""}">
      <button class="project-row-main" data-select-quest="${escapeHtml(summary.id)}" type="button">
        <div class="project-row-head">
          <div class="project-row-copy">
            <p class="eyebrow">${escapeHtml(getTemplateLabel(summary.templateKey))}</p>
            <strong>${escapeHtml(summary.title)}</strong>
          </div>
          <span class="status-pill ${status.tone}">${escapeHtml(status.label)}</span>
        </div>
        <p class="muted">${escapeHtml(summary.missionBrief || "暂无摘要")}</p>
        <div class="progress-track project-row-progress">
          <span style="width:${progress}%"></span>
        </div>
        <div class="project-row-meta">
          <span>主线 ${summary.stats.completedRoots}/${summary.stats.totalRoots}</span>
          <span>节点 ${summary.stats.completedNodes}/${summary.stats.totalNodes}</span>
          <span>${formatDateTime(summary.updatedAt)}</span>
        </div>
      </button>
      <div class="project-row-actions">
        <button class="ghost-button" data-continue-quest="${escapeHtml(summary.id)}" type="button">继续</button>
        <button class="ghost-button" data-review-scope="${escapeHtml(summary.id)}" type="button">复习</button>
      </div>
    </article>
  `;
}

function wireProjectActions(container) {
  container.querySelectorAll("[data-select-quest]").forEach((button) => {
    button.addEventListener("click", async () => {
      await selectQuest(button.dataset.selectQuest);
      renderAll();
    });
  });

  container.querySelectorAll("[data-continue-quest]").forEach((button) => {
    button.addEventListener("click", async () => {
      await selectQuest(button.dataset.continueQuest);
      switchView("learn");
      renderAll();
    });
  });

  container.querySelectorAll("[data-review-scope]").forEach((button) => {
    button.addEventListener("click", async () => {
      await selectQuest(button.dataset.reviewScope);
      await startReviewMode("current", true);
    });
  });
}

function renderHomeView() {
  const totalProjects = appState.quests.length;
  const totalRoots = appState.quests.reduce((sum, quest) => sum + Number(quest.stats.totalRoots || 0), 0);
  const completedRoots = appState.quests.reduce((sum, quest) => sum + Number(quest.stats.completedRoots || 0), 0);
  const reviewable = appState.quests.reduce((sum, quest) => sum + Number(quest.stats.completedNodes || 0), 0);
  const latestUpdated = appState.quests[0]?.updatedAt || null;
  const focusQuestSummary = appState.activeQuest || appState.questDetails.get(appState.quests[0]?.id) || appState.quests[0] || null;

  dom.homeStatProjects.textContent = String(totalProjects);
  dom.homeStatRoots.textContent = `${completedRoots} / ${totalRoots}`;
  dom.homeStatReviewable.textContent = String(reviewable);
  dom.homeStatUpdated.textContent = formatDateTime(latestUpdated);

  if (!appState.quests.length) {
    dom.homeProjectList.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无项目</strong><button class="ghost-button" data-open-create type="button">新建项目</button></div>`;
    dom.homeProjectList.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", openCreateModal));
  } else {
    dom.homeProjectList.innerHTML = appState.quests
      .slice(0, 6)
      .map((quest) => projectRowMarkup(quest, { active: quest.id === appState.activeQuestId }))
      .join("");
    wireProjectActions(dom.homeProjectList);
  }

  if (!focusQuestSummary) {
    dom.homeFocusCard.innerHTML = `
      <div class="empty-inline compact-empty">
        <strong>未选择项目</strong>
        <button class="ghost-button" data-open-create type="button">新建项目</button>
      </div>
    `;
    dom.homeFocusCard.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", openCreateModal));
  } else {
    const latestTimeline = (focusQuestSummary.timeline || []).slice(0, 3);
    const activeQuestNode = getActiveNode(focusQuestSummary);
    const metaChips = [
      focusQuestSummary.level ? `当前水平：${focusQuestSummary.level}` : null,
      focusQuestSummary.goal ? `学习目标：${focusQuestSummary.goal}` : null,
      focusQuestSummary.timebox ? `时间限制：${focusQuestSummary.timebox}` : null,
      `训练模式：${getTemplateLabel(focusQuestSummary.templateKey)}`
    ]
      .filter(Boolean)
      .map((item) => `<span class="meta-chip">${escapeHtml(item)}</span>`)
      .join("");

    dom.homeFocusCard.innerHTML = `
      <div class="project-card active focus-card">
        <div class="project-card-head">
          <div>
            <p class="eyebrow">当前项目</p>
            <h4>${escapeHtml(focusQuestSummary.title)}</h4>
          </div>
          <span class="status-pill success">${focusQuestSummary.stats.completedRoots}/${focusQuestSummary.stats.totalRoots} 主线</span>
        </div>
        <p class="muted">${escapeHtml(focusQuestSummary.missionBrief || focusQuestSummary.launchNote || "暂无摘要")}</p>
        <div class="meta-chip-row">${metaChips}</div>
        <div class="inline-stat-grid">
          ${buildInlineStatCard("总节点", `${focusQuestSummary.stats.completedNodes}/${focusQuestSummary.stats.totalNodes}`)}
          ${buildInlineStatCard("可复习", String(focusQuestSummary.stats.completedNodes || 0))}
          ${buildInlineStatCard("当前关卡", activeQuestNode?.path || "待进入")}
        </div>
        <div class="project-actions">
          <button class="primary-button" data-continue-quest="${escapeHtml(focusQuestSummary.id)}" type="button">进入闯关页</button>
          <button class="ghost-button" data-review-scope="${escapeHtml(focusQuestSummary.id)}" type="button">复习这一条</button>
        </div>
      </div>
      <div class="detail-stack">
        <div class="section-head">
          <div>
            <p class="eyebrow">最近记录</p>
            <h3>最近活动</h3>
          </div>
        </div>
        <div class="timeline-list">
          ${
            latestTimeline.length
              ? latestTimeline
                  .map(
                    (item) => `
                      <div class="timeline-item">
                        <strong>${escapeHtml(item.summary)}</strong>
                        <p class="muted">${formatDateTime(item.createdAt)}</p>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-inline compact-empty"><strong>暂无记录</strong></div>`
          }
        </div>
      </div>
    `;
    wireProjectActions(dom.homeFocusCard);
  }

  const reviewSuggestions = appState.quests
    .filter((quest) => Number(quest.stats.completedNodes || 0) > 0)
    .sort((left, right) => Number(right.stats.completedNodes || 0) - Number(left.stats.completedNodes || 0))
    .slice(0, 4);

  if (!reviewSuggestions.length) {
    dom.homeReviewList.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无复习节点</strong></div>`;
  } else {
    dom.homeReviewList.innerHTML = reviewSuggestions
      .map((quest) => {
        return `
          <article class="queue-row">
            <div>
              <p class="eyebrow">优先抽查</p>
              <strong>${escapeHtml(quest.title)}</strong>
              <span class="muted">${quest.stats.completedNodes} 个可抽查节点 · ${formatDateTime(quest.updatedAt)}</span>
            </div>
            <div class="project-row-actions">
              <button class="ghost-button" data-select-quest="${escapeHtml(quest.id)}" type="button">检视</button>
              <button class="primary-button" data-review-scope="${escapeHtml(quest.id)}" type="button">抽题</button>
            </div>
          </article>
        `;
      })
      .join("");
    wireProjectActions(dom.homeReviewList);
  }
}

function renderLibraryView() {
  const visibleQuests = getVisibleQuestList();
  dom.libraryProjectCount.textContent = `${visibleQuests.length} 个项目`;

  if (!visibleQuests.length) {
    dom.libraryProjectList.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无项目</strong><button class="ghost-button" data-open-create type="button">新建项目</button></div>`;
    dom.libraryProjectList.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", openCreateModal));
  } else {
    dom.libraryProjectList.innerHTML = visibleQuests.map((quest) => projectRowMarkup(quest, { active: quest.id === appState.activeQuestId })).join("");
    wireProjectActions(dom.libraryProjectList);
  }

  if (!appState.activeQuest) {
    dom.librarySpotlight.innerHTML = `<div class="empty-inline compact-empty"><strong>未选择项目</strong></div>`;
    return;
  }

  const quest = appState.activeQuest;
  const latestTimeline = (quest.timeline || []).slice(0, 5);
  const chips = [
    quest.level ? `当前水平：${quest.level}` : null,
    quest.goal ? `学习目标：${quest.goal}` : null,
    quest.timebox ? `时间限制：${quest.timebox}` : null,
    `训练模式：${getTemplateLabel(quest.templateKey)}`
  ]
    .filter(Boolean)
    .map((item) => `<span class="meta-chip">${escapeHtml(item)}</span>`)
    .join("");

  dom.librarySpotlight.innerHTML = `
    <div class="project-card active focus-card">
      <div class="project-card-head">
        <div>
          <p class="eyebrow">当前项目</p>
          <h4>${escapeHtml(quest.title)}</h4>
        </div>
        <span class="status-pill success">${quest.stats.completedRoots}/${quest.stats.totalRoots} 主线</span>
      </div>
      <p class="muted">${escapeHtml(quest.missionBrief || quest.launchNote || "暂无摘要")}</p>
      <div class="meta-chip-row">${chips}</div>
      <div class="inline-stat-grid">
        ${buildInlineStatCard("总节点", `${quest.stats.completedNodes}/${quest.stats.totalNodes}`)}
        ${buildInlineStatCard("可复习", String(quest.nodes.filter((node) => node.status === "completed").length))}
        ${buildInlineStatCard("最近更新", formatDateTime(quest.updatedAt))}
      </div>
      <div class="project-actions">
        <button class="primary-button" data-continue-quest="${escapeHtml(quest.id)}" type="button">进入闯关页</button>
        <button class="ghost-button" data-review-scope="${escapeHtml(quest.id)}" type="button">当前项目复习</button>
      </div>
    </div>
    <div class="detail-stack">
      <div class="section-head">
        <div>
          <p class="eyebrow">最近记录</p>
          <h3>最近活动</h3>
        </div>
      </div>
      <div class="timeline-list">
        ${
          latestTimeline.length
            ? latestTimeline
                .map(
                  (item) => `
                    <div class="timeline-item">
                      <strong>${escapeHtml(item.summary)}</strong>
                      <p class="muted">${formatDateTime(item.createdAt)}</p>
                    </div>
                  `
                )
                .join("")
            : `<div class="empty-inline compact-empty"><strong>暂无记录</strong></div>`
        }
      </div>
    </div>
  `;
  wireProjectActions(dom.librarySpotlight);
}

function renderRoadmap(quest) {
  dom.roadmapTree.innerHTML = "";
  if (!quest) {
    dom.roadmapTree.innerHTML = `<div class="empty-inline"><p class="muted">主线地图会在你创建项目后出现在这里。</p></div>`;
    return;
  }

  sortNodes(quest.nodes || []).forEach((node) => {
    const article = document.createElement("article");
    article.className = `roadmap-item ${node.status} ${node.parentId ? "child" : "root"}`;
    article.innerHTML = `
      <div class="roadmap-item-head">
        <div>
          <p class="eyebrow">${escapeHtml(node.path)}</p>
          <h4>${escapeHtml(node.title)}</h4>
        </div>
        <span class="status-dot ${escapeHtml(node.status)}"></span>
      </div>
      <p class="muted">${escapeHtml(node.goal || "暂无目标")}</p>
    `;
    dom.roadmapTree.append(article);
  });
}

function getQuestFeedbackSource(quest) {
  if (appState.lastEvaluation) {
    return appState.lastEvaluation;
  }
  if (!quest) {
    return null;
  }
  const latestAttempt = (quest.nodes || [])
    .flatMap((node) => node.attempts || [])
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0];
  return convertAttemptToEvaluation(latestAttempt);
}

function renderFeedback(quest) {
  const evaluation = getQuestFeedbackSource(quest);
  if (!evaluation) {
    dom.feedbackVerdict.textContent = "等待回答";
    dom.feedbackVerdict.className = "status-pill neutral";
    dom.feedbackPanel.innerHTML = `
      <div class="empty-inline">
        <p class="muted">每次回答之后，这里都会留下具体反馈：哪里答对了、哪里还不稳、下一步该怎么补。</p>
      </div>
    `;
    return;
  }

  const meta = getVerdictMeta(evaluation.verdict);
  dom.feedbackVerdict.textContent = meta.label;
  dom.feedbackVerdict.className = `status-pill ${meta.tone}`;

  const strengths = (evaluation.feedback?.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";
  const gaps = (evaluation.feedback?.gaps || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";
  const missing = (evaluation.feedback?.missing || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";

  dom.feedbackPanel.innerHTML = `
    <p class="feedback-note">${escapeHtml(evaluation.coachReply || "这次回答已经留下记录。")}</p>
    <div class="feedback-grid">
      <section class="feedback-box">
        <h4>答得稳的地方</h4>
        <ul>${strengths}</ul>
      </section>
      <section class="feedback-box">
        <h4>还差一口气的地方</h4>
        <ul>${gaps}</ul>
      </section>
      <section class="feedback-box">
        <h4>还缺的关键点</h4>
        <ul>${missing}</ul>
      </section>
    </div>
    <p class="feedback-note"><strong>更好的表达：</strong>${escapeHtml(evaluation.feedback?.improve || "继续补真实场景和判断依据。")}</p>
    ${evaluation.hint ? `<p class="feedback-note"><strong>下一步提示：</strong>${escapeHtml(evaluation.hint)}</p>` : ""}
  `;
}

function renderTimeline(quest) {
  const timeline = quest?.timeline || [];
  if (!timeline.length) {
    dom.timelineList.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无记录</strong></div>`;
    return;
  }

  dom.timelineList.innerHTML = timeline
    .slice(0, 12)
    .map(
      (item) => `
        <div class="timeline-item">
          <strong>${escapeHtml(item.summary)}</strong>
          <p class="muted">${formatDateTime(item.createdAt)}</p>
        </div>
      `
    )
    .join("");
}

function renderLearnView() {
  if (!appState.activeQuest) {
    dom.learnEmptyState.classList.remove("hidden");
    dom.learnLayout.classList.add("hidden");
    return;
  }

  dom.learnEmptyState.classList.add("hidden");
  dom.learnLayout.classList.remove("hidden");

  const quest = appState.activeQuest;
  const activeNode = getActiveNode(quest);
  const reviewableCount = (quest.nodes || []).filter((node) => node.status === "completed").length;

  dom.learnProjectTitle.textContent = quest.title;
  dom.learnProjectBrief.textContent = quest.missionBrief || quest.launchNote || "暂无摘要";
  dom.learnNodeProgress.textContent = `${quest.stats.completedNodes}/${quest.stats.totalNodes} 节点`;
  dom.learnRootProgressText.textContent = `${quest.stats.completedRoots} / ${quest.stats.totalRoots}`;
  dom.learnRootProgressBar.style.width = `${getQuestProgressPercent(quest)}%`;
  dom.learnStatGrid.innerHTML = [
    buildInlineStatCard("主线完成", `${quest.stats.completedRoots}/${quest.stats.totalRoots}`),
    buildInlineStatCard("总节点", `${quest.stats.completedNodes}/${quest.stats.totalNodes}`),
    buildInlineStatCard("可复习", String(reviewableCount))
  ].join("");

  const metaChips = [
    quest.level ? `当前水平：${quest.level}` : null,
    quest.goal ? `学习目标：${quest.goal}` : null,
    quest.timebox ? `时间限制：${quest.timebox}` : null,
    `训练模式：${getTemplateLabel(quest.templateKey)}`
  ]
    .filter(Boolean)
    .map((item) => `<span class="meta-chip">${escapeHtml(item)}</span>`)
    .join("");
  dom.learnMetaChips.innerHTML = metaChips;

  renderRoadmap(quest);
  renderFeedback(quest);
  renderTimeline(quest);

  if (!activeNode) {
    dom.questionPanel.classList.add("hidden");
    dom.questionEmpty.classList.remove("hidden");
    return;
  }

  dom.questionPanel.classList.remove("hidden");
  dom.questionEmpty.classList.add("hidden");
  dom.currentQuestionTag.textContent = activeNode.source === "follow-up" ? "子问题" : "主线关卡";
  dom.currentQuestionTag.className = `status-pill ${activeNode.source === "follow-up" ? "warning" : "neutral"}`;
  dom.currentQuestionPath.textContent = activeNode.path;
  dom.currentQuestionTitle.textContent = activeNode.title;
  dom.currentQuestionDifficulty.textContent = `难度 ${activeNode.difficulty || 3}`;
  dom.currentQuestionGoal.textContent = activeNode.goal || "继续往主干、应用和边界上输出。";
  dom.currentQuestionWhy.textContent = activeNode.whyItMatters || "暂无提示";
}

function renderReviewModeButtons() {
  dom.reviewModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.reviewMode === appState.reviewMode);
  });
  dom.reviewModeTitle.textContent = REVIEW_MODE_META[appState.reviewMode].label;
}

async function buildReviewCandidates(mode) {
  const summaries =
    mode === "current" && appState.activeQuestId
      ? appState.quests.filter((quest) => quest.id === appState.activeQuestId)
      : appState.quests;

  const details = [];
  for (const summary of summaries) {
    details.push(await ensureQuestDetail(summary.id));
  }

  let candidates = details.flatMap((quest) =>
    (quest.nodes || [])
      .filter((node) => node.status === "completed")
      .map((node) => ({
        questId: quest.id,
        questTitle: quest.title,
        node
      }))
  );

  if (mode === "weak") {
    candidates = candidates.filter((candidate) => {
      const latestAttempt = getLatestAttempt(candidate.node);
      return latestAttempt && (
        ["retry_same_question", "follow_up_required", "review-needs-refresh"].includes(latestAttempt.verdict) ||
        Number(latestAttempt.score || 100) < 80
      );
    });
  }

  if (mode === "recent") {
    candidates = candidates.sort((left, right) => new Date(right.node.completedAt || 0) - new Date(left.node.completedAt || 0));
  }

  return candidates;
}

function pickReviewCandidate(mode, candidates) {
  if (!candidates.length) {
    return null;
  }
  if (mode === "recent") {
    return candidates[0];
  }
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

async function startReviewMode(mode, autoDraw = false) {
  appState.reviewMode = mode;
  appState.currentReview = null;
  switchView("review");
  renderAll();

  if (!autoDraw) {
    return;
  }

  const candidates = await buildReviewCandidates(mode);
  const picked = pickReviewCandidate(mode, candidates);
  if (!picked) {
    showToast(REVIEW_MODE_META[mode].emptyMessage, "warning");
    renderAll();
    return;
  }
  appState.currentReview = {
    ...picked,
    mode
  };
  renderAll();
}

function renderReviewRecords() {
  const attempts = collectRecentAttempts(12);
  if (!attempts.length) {
    dom.reviewRecords.innerHTML = `<div class="empty-inline"><p class="muted">还没有答题或复习记录。先完成第一轮主线，再回来这里看回放。</p></div>`;
    return;
  }

  dom.reviewRecords.innerHTML = attempts
    .map((attempt) => {
      const verdict = getVerdictMeta(attempt.verdict);
      return `
        <div class="timeline-item">
          <strong>${escapeHtml(attempt.questTitle)} · ${escapeHtml(attempt.nodePath)} · ${escapeHtml(attempt.nodeTitle)}</strong>
          <p class="muted">${attempt.mode === "review" ? "复习记录" : "答题记录"} · ${escapeHtml(verdict.label)} · ${formatDateTime(attempt.createdAt)}</p>
        </div>
      `;
    })
    .join("");
}

function renderReviewView() {
  renderReviewModeButtons();
  const reviewableCount = appState.quests.reduce((sum, quest) => sum + Number(quest.stats.completedNodes || 0), 0);
  const currentScopeLabel =
    appState.reviewMode === "current"
      ? appState.activeQuest?.title || "当前项目未选中"
      : REVIEW_MODE_META[appState.reviewMode].label;
  const recentReviews = collectRecentAttempts(20).filter((item) => item.mode === "review").length;

  dom.reviewSummary.innerHTML = [
    buildInlineStatCard("可抽查节点", String(reviewableCount)),
    buildInlineStatCard("当前模式", currentScopeLabel),
    buildInlineStatCard("最近复习次数", String(recentReviews))
  ].join("");

  if (!appState.currentReview) {
    dom.reviewPanel.innerHTML = `
      <div class="empty-inline">
        <p class="muted">${escapeHtml(REVIEW_MODE_META[appState.reviewMode].emptyMessage)}</p>
      </div>
    `;
  } else {
    const review = appState.currentReview;
    dom.reviewPanel.innerHTML = `
      <div class="project-card active">
        <div class="project-card-head">
          <div>
            <p class="eyebrow">${escapeHtml(review.questTitle)}</p>
            <h4>${escapeHtml(review.node.path)} · ${escapeHtml(review.node.title)}</h4>
          </div>
          <span class="status-pill warning">${escapeHtml(REVIEW_MODE_META[review.mode].label)}</span>
        </div>
        <p class="muted">${escapeHtml(review.node.goal || "试着不看提示，重新把这题讲完整。")}</p>
        <label class="field-block">
          <span>复习回答</span>
          <textarea id="review-answer-input" rows="7" placeholder="现在开始复述，尽量不要偷看原答案。" spellcheck="false"></textarea>
        </label>
        <div class="form-actions">
          <button id="submit-review" class="primary-button" type="button">提交复习回答</button>
        </div>
      </div>
    `;
    const submitReviewButton = document.querySelector("#submit-review");
    submitReviewButton?.addEventListener("click", submitReviewAnswer);
  }

  renderReviewRecords();
}

function renderThemeOptions() {
  dom.themeOptions.innerHTML = THEME_PRESETS.map((theme) => {
    const isActive = theme.key === appState.ui.theme;
    return `
      <button class="theme-card ${isActive ? "active" : ""}" data-theme-key="${escapeHtml(theme.key)}" type="button">
        <div class="theme-swatch">
          <span class="theme-${escapeHtml(theme.key)}-a"></span>
          <span class="theme-${escapeHtml(theme.key)}-b"></span>
          <span class="theme-${escapeHtml(theme.key)}-c"></span>
          <span class="theme-${escapeHtml(theme.key)}-d"></span>
        </div>
        <strong>${escapeHtml(theme.name)}</strong>
        <span class="muted">${escapeHtml(theme.description)}</span>
      </button>
    `;
  }).join("");

  dom.themeOptions.querySelectorAll("[data-theme-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.dataset.themeKey);
      showToast(`已切换到 ${button.querySelector("strong")?.textContent || "新主题"}`);
    });
  });
}

function renderBackgroundControls() {
  const background = appState.ui.background || createDefaultBackgroundState();
  dom.backgroundOpacity.value = String(background.opacity);
  dom.backgroundPositionX.value = String(background.positionX);
  dom.backgroundPositionY.value = String(background.positionY);
  dom.backgroundOpacityValue.textContent = `${background.opacity}%`;
  dom.backgroundPositionXValue.textContent = `${background.positionX}%`;
  dom.backgroundPositionYValue.textContent = `${background.positionY}%`;
  dom.backgroundPreview.classList.toggle("has-image", Boolean(background.image));
  dom.backgroundPreview.style.backgroundImage = background.image
    ? `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), url("${background.image}")`
    : "none";
  dom.backgroundPreview.style.backgroundPosition = `${background.positionX}% ${background.positionY}%`;
  dom.backgroundPreview.style.setProperty("--preview-bg-opacity", String(clamp(Number(background.opacity || 0), 0, 100) / 100));
  dom.backgroundPreviewCaption.textContent = background.image
    ? `透明度 ${background.opacity}% · 水平 ${background.positionX}% · 垂直 ${background.positionY}%`
    : "还没有自定义背景";
  dom.clearBackgroundButton.disabled = !background.image;
}

function renderSettingsView() {
  const runtimeRoot = appState.bootstrap?.runtime?.dataRoot || "-";
  dom.projectRootText.textContent = "E:\\study-quest-desktop";
  dom.dataRootText.textContent = runtimeRoot;
  dom.settingsProjectRoot.textContent = "E:\\study-quest-desktop";
  dom.settingsDataRoot.textContent = runtimeRoot;
  renderThemeOptions();
  renderBackgroundControls();
}

function renderAll() {
  renderHeaderAndSidebar();
  renderHomeView();
  renderLibraryView();
  renderLearnView();
  renderReviewView();
  renderSettingsView();
  switchView(appState.currentView);
}

async function bootstrap() {
  appState.bootstrap = await api.loadBootstrap();
  hydrateQuestSummaries(appState.bootstrap.quests || []);
  syncFormsFromSettings();
  renderPreviewBanner();
  renderAll();

  if (appState.quests.length) {
    await selectQuest(appState.quests[0].id);
  }

  void prefetchQuestDetails();
}

async function handleCreateQuest(event) {
  event.preventDefault();
  const payload = {
    topic: cleanText(dom.topicInput.value),
    material: cleanText(dom.materialInput.value),
    level: cleanText(dom.levelInput.value),
    goal: cleanText(dom.goalInput.value),
    timebox: cleanText(dom.timeboxInput.value),
    rootQuestionCount: clamp(Number(dom.countInput.value || appState.bootstrap?.settings?.defaultRootQuestionCount || 10), 5, 30),
    templateKey: dom.templateSelect.value || appState.bootstrap?.settings?.defaultTemplateKey || "general"
  };

  if (!payload.material) {
    showToast("学习内容不能为空。先贴材料，我们再替你自动生成项目标题和主线。", "warning");
    dom.materialInput.focus();
    return;
  }

  const originalText = dom.createQuestButton.textContent;
  dom.createQuestButton.textContent = "正在生成主线关卡...";
  dom.createQuestButton.disabled = true;

  try {
    const response = await api.createQuest(payload);
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    appState.activeQuestId = response.quest.id;
    appState.activeQuest = response.quest;
    appState.lastEvaluation = null;
    appState.currentReview = null;
    dom.questForm.reset();
    syncFormsFromSettings();
    setAdvancedCreateOpen(false);
    closeCreateModal();
    switchView("learn");
    renderAll();
    showToast(`已创建项目：${response.quest.title}`);
  } catch (error) {
    switchView("settings");
    renderAll();
    showToast(error.message || "生成项目失败，请先检查接口设置。", "warning");
  } finally {
    dom.createQuestButton.textContent = originalText;
    dom.createQuestButton.disabled = false;
  }
}

async function handleAnswerQuestion(event) {
  event.preventDefault();
  const answer = cleanText(dom.answerInput.value);
  const activeNode = getActiveNode(appState.activeQuest);
  if (!appState.activeQuest || !activeNode) {
    return;
  }
  if (!answer) {
    showToast("先写下你的回答，再提交这一关。", "warning");
    dom.answerInput.focus();
    return;
  }

  const originalText = dom.submitAnswer.textContent;
  dom.submitAnswer.textContent = "教练正在判定...";
  dom.submitAnswer.disabled = true;

  try {
    const response = await api.answerQuestion({
      questId: appState.activeQuest.id,
      nodeId: activeNode.id,
      answer
    });
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    appState.lastEvaluation = response.evaluation;
    appState.currentReview = null;
    dom.answerInput.value = "";
    renderAll();
    if (response.evaluation.verdict !== "retry_same_question") {
      playPositiveTone();
    }
  } catch (error) {
    showToast(error.message || "提交回答失败，请稍后再试。", "warning");
  } finally {
    dom.submitAnswer.textContent = originalText;
    dom.submitAnswer.disabled = false;
  }
}

async function drawReviewQuestion() {
  const candidates = await buildReviewCandidates(appState.reviewMode);
  const picked = pickReviewCandidate(appState.reviewMode, candidates);
  if (!picked) {
    appState.currentReview = null;
    renderAll();
    showToast(REVIEW_MODE_META[appState.reviewMode].emptyMessage, "warning");
    return;
  }
  appState.currentReview = {
    ...picked,
    mode: appState.reviewMode
  };
  renderAll();
}

async function submitReviewAnswer() {
  const textarea = document.querySelector("#review-answer-input");
  const answer = cleanText(textarea?.value);
  if (!answer || !appState.currentReview) {
    showToast("先写下这次复习回答。", "warning");
    textarea?.focus();
    return;
  }

  const response = await api.answerReviewQuestion({
    questId: appState.currentReview.questId,
    nodeId: appState.currentReview.node.id,
    answer
  });
  hydrateQuestSummaries(response.quests);
  rememberQuestDetail(response.quest);
  appState.lastEvaluation = response.evaluation;
  appState.currentReview = null;
  renderAll();
  if (response.evaluation.verdict === "review-locked-in") {
    playPositiveTone();
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const response = await api.saveSettings({
    baseUrl: cleanText(dom.settingsBaseUrl.value),
    model: cleanText(dom.settingsModel.value),
    apiKey: cleanText(dom.settingsApiKey.value),
    defaultTemplateKey: dom.settingsTemplate.value,
    defaultRootQuestionCount: clamp(Number(dom.settingsRootCount.value || 10), 5, 30)
  });
  appState.bootstrap.settings = response.settings;
  syncFormsFromSettings();
  renderAll();
  showToast("设置已保存。");
}

function handleGlobalShortcuts(event) {
  const isModifier = event.ctrlKey || event.metaKey;
  if (event.key === "Escape") {
    if (!dom.createModal.classList.contains("hidden")) {
      closeCreateModal();
      return;
    }
    if (appState.ui.focusMode) {
      setFocusMode(false);
    }
    return;
  }

  if (!isModifier) {
    return;
  }

  const key = event.key.toLowerCase();
  if (key === "n") {
    event.preventDefault();
    openCreateModal();
  } else if (key === "r") {
    event.preventDefault();
    void startReviewMode(appState.activeQuestId ? "current" : "random", true);
  } else if (key === "i" && appState.currentView === "learn") {
    event.preventDefault();
    setFocusMode(!appState.ui.focusMode);
  }
}

dom.navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.view);
    renderAll();
  });
});

dom.openCreateButtons.forEach((button) => {
  button.addEventListener("click", openCreateModal);
});

dom.viewJumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.viewJump);
    renderAll();
  });
});

dom.closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeCreateModal);
});

dom.goLibraryButton.addEventListener("click", () => {
  switchView("library");
  renderAll();
});

dom.startGlobalReviewButton.addEventListener("click", () => {
  void startReviewMode("random", true);
});

dom.sidebarStartReviewButton.addEventListener("click", () => {
  void startReviewMode("random", true);
});

dom.reviewModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    void startReviewMode(button.dataset.reviewMode, false);
  });
});

dom.themeToggle?.addEventListener("click", () => {
  setTheme(appState.ui.theme === "graphite" ? "forest" : "graphite");
});

dom.pickBackgroundButton?.addEventListener("click", () => {
  dom.backgroundFileInput?.click();
});

dom.clearBackgroundButton?.addEventListener("click", () => {
  clearCustomBackground();
  showToast("已清除自定义背景。");
});

dom.backgroundFileInput?.addEventListener("change", () => {
  const [file] = dom.backgroundFileInput.files || [];
  loadCustomBackgroundFile(file);
  dom.backgroundFileInput.value = "";
});

dom.backgroundOpacity?.addEventListener("input", () => {
  updateBackgroundSetting("opacity", clamp(Number(dom.backgroundOpacity.value || 55), 0, 100));
});

dom.backgroundPositionX?.addEventListener("input", () => {
  updateBackgroundSetting("positionX", clamp(Number(dom.backgroundPositionX.value || 50), 0, 100));
});

dom.backgroundPositionY?.addEventListener("input", () => {
  updateBackgroundSetting("positionY", clamp(Number(dom.backgroundPositionY.value || 50), 0, 100));
});

dom.toggleFocusModeButton.addEventListener("click", () => {
  setFocusMode(!appState.ui.focusMode);
});

dom.toggleAdvancedButton.addEventListener("click", () => {
  setAdvancedCreateOpen(!appState.advancedCreateOpen);
});

dom.topicInput.addEventListener("input", updateDerivedTopicLabel);
dom.materialInput.addEventListener("input", updateDerivedTopicLabel);
dom.projectSearch.addEventListener("input", () => {
  appState.projectSearch = dom.projectSearch.value;
  renderAll();
});
dom.questForm.addEventListener("submit", handleCreateQuest);
dom.answerForm.addEventListener("submit", handleAnswerQuestion);
dom.drawReviewButton.addEventListener("click", () => {
  void drawReviewQuestion();
});
dom.settingsForm.addEventListener("submit", saveSettings);

dom.answerInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    dom.answerForm.requestSubmit();
  }
});

window.addEventListener("keydown", handleGlobalShortcuts);

window.__studyQuestDebug = {
  async createQuestFromDebug(payload = {}) {
    const response = await api.createQuest({
      topic: cleanText(payload.topic),
      material: cleanText(payload.material),
      level: cleanText(payload.level),
      goal: cleanText(payload.goal),
      timebox: cleanText(payload.timebox),
      rootQuestionCount: clamp(
        Number(payload.rootQuestionCount || appState.bootstrap?.settings?.defaultRootQuestionCount || 10),
        5,
        30
      ),
      templateKey: payload.templateKey || appState.bootstrap?.settings?.defaultTemplateKey || "general"
    });
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    appState.activeQuestId = response.quest.id;
    appState.activeQuest = response.quest;
    appState.lastEvaluation = null;
    appState.currentReview = null;
    switchView("learn");
    renderAll();
    return response.quest;
  },

  async answerActiveNodeFromDebug(answer) {
    const activeNode = getActiveNode(appState.activeQuest);
    if (!appState.activeQuest || !activeNode) {
      return null;
    }
    const response = await api.answerQuestion({
      questId: appState.activeQuest.id,
      nodeId: activeNode.id,
      answer: cleanText(answer)
    });
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    appState.lastEvaluation = response.evaluation;
    renderAll();
    return response.evaluation;
  },

  async drawReviewFromDebug(mode = "random") {
    await startReviewMode(mode, true);
    return appState.currentReview;
  },

  getState() {
    return {
      currentView: appState.currentView,
      reviewMode: appState.reviewMode,
      activeQuestId: appState.activeQuestId,
      activeQuestTitle: appState.activeQuest?.title || null,
      currentQuestion: getActiveNode(appState.activeQuest)?.title || null,
      totalProjects: appState.quests.length
    };
  }
};

applyUiState();
bootstrap();
