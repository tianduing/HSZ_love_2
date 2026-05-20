const templateCatalog = [
  { key: "general", label: "通用学习教练" },
  { key: "intense", label: "费曼 + 苏格拉底 + 压力测试" },
  { key: "algorithm", label: "算法题训练" },
  { key: "paper", label: "论文阅读训练" },
  { key: "project", label: "项目实战训练" }
];

const viewMeta = {
  dashboard: {
    eyebrow: "任务总览",
    title: "把学习任务拆成卡片式关卡",
    subtitle: "先建任务，再进闯关房答题，最后去复习区随机抽问。"
  },
  learn: {
    eyebrow: "闯关答题",
    title: "一次只打一题，让思路真正落地",
    subtitle: "当前问题、即时反馈和路线图都在这里，但不再跟别的模块挤在一屏。"
  },
  review: {
    eyebrow: "随机复习",
    title: "从已完成节点里随机回抽",
    subtitle: "复习区只做一件事：帮你检验内容有没有真正沉淀下来。"
  },
  settings: {
    eyebrow: "接口设置",
    title: "把模型接口、默认模式和安装信息放在独立页面",
    subtitle: "配置完成后，后面创建任务和打包安装都会更顺。"
  }
};

const dom = {
  navButtons: [...document.querySelectorAll(".nav-button")],
  viewPanes: {
    dashboard: document.querySelector("#dashboard-view"),
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
  topbarProgress: document.querySelector("#topbar-progress"),
  projectRootText: document.querySelector("#project-root-text"),
  dataRootText: document.querySelector("#data-root-text"),
  navActiveQuestTitle: document.querySelector("#nav-active-quest-title"),
  navActiveQuestBrief: document.querySelector("#nav-active-quest-brief"),
  jumpSettingsButton: document.querySelector("#jump-settings"),
  questForm: document.querySelector("#quest-form"),
  createQuestButton: document.querySelector("#create-quest"),
  templateSelect: document.querySelector("#template-select"),
  dashboardQuestCount: document.querySelector("#dashboard-quest-count"),
  dashboardQuestList: document.querySelector("#dashboard-quest-list"),
  dashboardActiveTitle: document.querySelector("#dashboard-active-title"),
  dashboardActiveBrief: document.querySelector("#dashboard-active-brief"),
  dashboardActiveStats: document.querySelector("#dashboard-active-stats"),
  learnEmptyState: document.querySelector("#learn-empty-state"),
  learnContent: document.querySelector("#learn-content"),
  activeQuestTitle: document.querySelector("#active-quest-title"),
  activeQuestBrief: document.querySelector("#active-quest-brief"),
  rootProgress: document.querySelector("#root-progress"),
  nodeProgress: document.querySelector("#node-progress"),
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
  completionDots: document.querySelector("#completion-dots"),
  roadmapTree: document.querySelector("#roadmap-tree"),
  timelineList: document.querySelector("#timeline-list"),
  drawReviewButton: document.querySelector("#draw-review"),
  reviewSummary: document.querySelector("#review-summary"),
  reviewPanel: document.querySelector("#review-panel"),
  reviewRecords: document.querySelector("#review-records"),
  settingsForm: document.querySelector("#settings-form"),
  settingsBaseUrl: document.querySelector("#settings-base-url"),
  settingsModel: document.querySelector("#settings-model"),
  settingsApiKey: document.querySelector("#settings-api-key"),
  settingsTemplate: document.querySelector("#settings-template"),
  settingsRootCount: document.querySelector("#settings-root-count"),
  settingsApiHint: document.querySelector("#settings-api-hint"),
  settingsProjectRoot: document.querySelector("#settings-project-root"),
  settingsDataRoot: document.querySelector("#settings-data-root")
};

const appState = {
  bootstrap: null,
  quests: [],
  activeQuestId: null,
  activeQuest: null,
  currentReview: null,
  previewMode: !window.studyCoachApi,
  currentView: "dashboard",
  lastEvaluation: null
};

function createPreviewApi() {
  const storageKey = "study-quest-preview-db-v2";

  const loadPreviewState = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw
        ? JSON.parse(raw)
        : {
            settings: {
              baseUrl: "https://api.openai.com/v1",
              model: "gpt-5.4",
              defaultTemplateKey: "general",
              defaultRootQuestionCount: 8
            },
            quests: []
          };
    } catch (_error) {
      return {
        settings: {
          baseUrl: "https://api.openai.com/v1",
          model: "gpt-5.4",
          defaultTemplateKey: "general",
          defaultRootQuestionCount: 8
        },
        quests: []
      };
    }
  };

  const savePreviewState = (value) => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const buildStats = (quest) => {
    const roots = quest.nodes.filter((node) => !node.parentId);
    return {
      totalRoots: roots.length,
      completedRoots: roots.filter((node) => node.status === "completed").length,
      totalNodes: quest.nodes.length,
      completedNodes: quest.nodes.filter((node) => node.status === "completed").length,
      pendingNodes: quest.nodes.filter((node) => node.status === "pending" || node.status === "active").length
    };
  };

  const summarizeQuest = (quest) => ({
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
  });

  const compareNodes = (left, right) => {
    const leftParts = left.path.replace(/^Q/, "").split(".").map(Number);
    const rightParts = right.path.replace(/^Q/, "").split(".").map(Number);
    const size = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < size; index += 1) {
      const diff = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  };

  const activateNext = (quest) => {
    quest.nodes.forEach((node) => {
      if (node.status === "active") {
        node.status = "pending";
      }
    });
    const next = quest.nodes
      .filter((node) => node.status === "pending")
      .sort(compareNodes)[0];
    if (next) {
      next.status = "active";
      quest.currentNodeId = next.id;
    } else {
      quest.currentNodeId = null;
      quest.finishedAt = new Date().toISOString();
    }
  };

  return {
    async loadBootstrap() {
      const state = loadPreviewState();
      return {
        runtime: {
          dataRoot: "浏览器预览模式（使用 localStorage）",
          templateOptions: templateCatalog
        },
        settings: {
          ...state.settings,
          hasApiKey: false
        },
        quests: state.quests.map(summarizeQuest)
      };
    },
    async saveSettings(payload) {
      const state = loadPreviewState();
      state.settings = {
        ...state.settings,
        ...payload
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
      const questionPatterns = [
        "先用自己的话解释",
        "比较它和相近概念",
        "说明它为什么重要",
        "举一个应用场景",
        "分析常见误区",
        "说明边界条件",
        "设计一个验证方法",
        "给出一个反例"
      ];
      const nodes = Array.from({ length: payload.rootQuestionCount }).map((_, index) => ({
        id: crypto.randomUUID(),
        path: `Q${index + 1}`,
        parentId: null,
        title: `${questionPatterns[index % questionPatterns.length]}：${payload.topic}`,
        goal: "逼自己把概念、应用和边界讲清楚。",
        whyItMatters: "只要能清楚输出，就说明不是只停留在“看懂”。",
        difficulty: Math.min(5, 2 + (index % 4)),
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
        title: payload.topic,
        topic: payload.topic,
        material: payload.material,
        level: payload.level,
        goal: payload.goal,
        timebox: payload.timebox,
        templateKey: payload.templateKey,
        rootQuestionCount: payload.rootQuestionCount,
        missionBrief: "这是浏览器预览模式生成的样例路线，用来演示分视图卡片交互。",
        launchNote: "现在开始第一关。",
        createdAt: now,
        updatedAt: now,
        finishedAt: null,
        currentNodeId: nodes[0]?.id || null,
        nodes,
        timeline: [
          {
            id: crypto.randomUUID(),
            kind: "session-created",
            summary: "预览模式已生成一条示例路线。",
            createdAt: now
          }
        ]
      };
      state.quests.unshift(quest);
      savePreviewState(state);
      return {
        quest: { ...quest, stats: buildStats(quest) },
        quests: state.quests.map(summarizeQuest)
      };
    },
    async getQuest(questId) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === questId);
      return { ...quest, stats: buildStats(quest) };
    },
    async answerQuestion(payload) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === payload.questId);
      const node = quest.nodes.find((item) => item.id === payload.nodeId);
      const answer = String(payload.answer || "").trim();
      const answerLength = answer.length;
      const now = new Date().toISOString();
      const needsRetry = answerLength < 32;
      const needsFollowUp = !needsRetry && !node.parentId && answerLength < 120 && !quest.nodes.some((item) => item.parentId === node.id);
      const evaluation = {
        verdict: needsRetry ? "retry_same_question" : needsFollowUp ? "follow_up_required" : "complete_and_advance",
        score: Math.min(98, Math.max(38, answerLength)),
        coachReply: needsRetry
          ? "这次回答还偏短，像是知道一点，但还没把逻辑讲透。"
          : needsFollowUp
            ? "主干已经说到了，接下来补一问，把应用和边界也掰开。"
            : "这一关已经基本过线，可以继续往下推进。",
        hint: needsRetry ? "试着补上：为什么重要、怎么用、什么时候会失效。" : "",
        feedback: {
          strengths: needsRetry ? ["已经开始组织答案"] : ["已经抓住主干", "回答里有自己的结构"],
          gaps: needsRetry ? ["展开不够", "判断依据不够具体"] : ["还可以更凝练"],
          missing: needsRetry ? ["应用场景", "边界条件"] : needsFollowUp ? ["更具体的场景取舍"] : [],
          improve: needsRetry ? "下一轮先说一句话本质，再补一个真实例子。" : "如果再补一个真实场景，这个答案会更稳。"
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

      if (evaluation.verdict === "retry_same_question") {
        node.status = "active";
        quest.currentNodeId = node.id;
      } else {
        node.status = "completed";
        node.completedAt = now;
        if (evaluation.verdict === "follow_up_required") {
          const childCount = quest.nodes.filter((item) => item.parentId === node.id).length;
          const child = {
            id: crypto.randomUUID(),
            path: `${node.path}.${childCount + 1}`,
            parentId: node.id,
            title: `把 ${node.title} 放进真实场景里再解释一次`,
            goal: "把概念解释推进到应用和边界判断。",
            whyItMatters: "只有能处理场景变化，才算不是死记。",
            difficulty: Math.min(5, (node.difficulty || 3) + 1),
            status: "active",
            source: "follow-up",
            attempts: [],
            reviewCount: 0,
            lastReviewAt: null,
            createdAt: now,
            updatedAt: now,
            completedAt: null
          };
          quest.nodes.forEach((item) => {
            if (item.id !== child.id && item.status === "active") {
              item.status = "pending";
            }
          });
          quest.nodes.push(child);
          quest.currentNodeId = child.id;
          evaluation.followUpQuestion = {
            title: child.title,
            goal: child.goal,
            reason: child.whyItMatters,
            difficulty: child.difficulty
          };
        } else {
          activateNext(quest);
        }
      }

      quest.updatedAt = now;
      quest.timeline.unshift({
        id: crypto.randomUUID(),
        kind: "preview-answer",
        summary: `已记录 ${node.path} 的一次回答。`,
        createdAt: now
      });
      savePreviewState(state);
      return {
        evaluation,
        quest: { ...quest, stats: buildStats(quest) },
        quests: state.quests.map(summarizeQuest)
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
      return candidates[Math.floor(Math.random() * candidates.length)] || null;
    },
    async answerReviewQuestion(payload) {
      const state = loadPreviewState();
      const quest = state.quests.find((item) => item.id === payload.questId);
      const node = quest.nodes.find((item) => item.id === payload.nodeId);
      const answer = String(payload.answer || "").trim();
      const now = new Date().toISOString();
      const score = Math.min(97, Math.max(35, answer.length));
      const evaluation = {
        verdict: score > 60 ? "review-locked-in" : "review-needs-refresh",
        score,
        coachReply: score > 60 ? "这次复习回答比较稳，说明记忆已经开始固化。" : "这题还有点飘，最好回到原节点再复盘一次。",
        hint: score > 60 ? "" : "优先补一句话本质，再补一个例子。",
        feedback: {
          strengths: score > 60 ? ["主干还在", "表达较完整"] : ["还记得一部分结构"],
          gaps: score > 60 ? ["可以更凝练"] : ["细节容易掉"],
          missing: score > 60 ? [] : ["应用例子"],
          improve: "复习时先说一句话本质，再说一个应用场景。"
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
      quest.updatedAt = now;
      quest.timeline.unshift({
        id: crypto.randomUUID(),
        kind: "preview-review",
        summary: `已完成 ${node.path} 的一次复习抽问。`,
        createdAt: now
      });
      savePreviewState(state);
      return {
        evaluation,
        quest: { ...quest, stats: buildStats(quest) },
        quests: state.quests.map(summarizeQuest)
      };
    }
  };
}

const api = window.studyCoachApi || createPreviewApi();

function fillTemplateOptions(selectElement, selectedValue) {
  selectElement.innerHTML = "";
  templateCatalog.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.key;
    option.textContent = template.label;
    option.selected = template.key === selectedValue;
    selectElement.append(option);
  });
}

function formatDateTime(value) {
  if (!value) {
    return "刚刚";
  }
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function getVerdictMeta(verdict) {
  if (verdict === "retry_same_question" || verdict === "review-needs-refresh") {
    return { label: "继续打磨", className: "warning-chip" };
  }
  if (verdict === "follow_up_required") {
    return { label: "已解锁子关卡", className: "success-chip" };
  }
  if (verdict === "complete_and_advance" || verdict === "review-locked-in") {
    return { label: "已过关", className: "success-chip" };
  }
  return { label: "等待回答", className: "neutral-chip" };
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

function getActiveNode(quest) {
  if (!quest?.currentNodeId) {
    return null;
  }
  return quest.nodes.find((node) => node.id === quest.currentNodeId) || null;
}

function buildStatBadge(label, value) {
  return `<div class="stat-badge"><span>${label}</span><strong>${value}</strong></div>`;
}

function switchView(viewKey) {
  appState.currentView = viewKey;
  Object.entries(dom.viewPanes).forEach(([key, pane]) => {
    pane.classList.toggle("hidden", key !== viewKey);
  });
  dom.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewKey);
  });
  const meta = viewMeta[viewKey];
  dom.viewEyebrow.textContent = meta.eyebrow;
  dom.viewTitle.textContent = meta.title;
  dom.viewSubtitle.textContent = meta.subtitle;
}

function renderApiStatus() {
  const hasApiKey = Boolean(appState.bootstrap?.settings?.hasApiKey);
  dom.apiStatusPill.textContent = hasApiKey ? "接口已就绪" : "待配置接口";
  dom.apiStatusPill.className = `pill-chip ${hasApiKey ? "success-chip" : "neutral-chip"}`;
  dom.settingsApiHint.textContent = hasApiKey ? "已保存 key" : "待配置";
  dom.settingsApiHint.className = `pill-chip ${hasApiKey ? "success-chip" : "neutral-chip"}`;
}

function renderNavStatus() {
  const quest = appState.activeQuest;
  dom.questCountPill.textContent = `${appState.quests.length} 个任务`;
  dom.dashboardQuestCount.textContent = String(appState.quests.length);

  if (!quest) {
    dom.navActiveQuestTitle.textContent = "还没有任务";
    dom.navActiveQuestBrief.textContent = "先创建一条学习主线。";
    dom.topbarProgress.textContent = "0 / 0";
    return;
  }

  dom.navActiveQuestTitle.textContent = quest.title;
  dom.navActiveQuestBrief.textContent = quest.missionBrief || quest.launchNote || "继续推进这一轮任务。";
  dom.topbarProgress.textContent = `${quest.stats.completedRoots} / ${quest.stats.totalRoots}`;
}

function renderQuestList() {
  dom.dashboardQuestList.innerHTML = "";
  if (!appState.quests.length) {
    dom.dashboardQuestList.innerHTML = `<p class="muted">还没有任务，先生成你的第一组学习关卡。</p>`;
    return;
  }

  appState.quests.forEach((quest) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `quest-card ${quest.id === appState.activeQuestId ? "active" : ""}`;
    button.innerHTML = `
      <h3>${quest.title}</h3>
      <p class="quest-meta">${quest.stats.completedRoots} / ${quest.stats.totalRoots} 主线已点亮</p>
      <p class="quest-meta">${quest.stats.completedNodes} / ${quest.stats.totalNodes} 总节点已完成</p>
      <p class="quest-meta">${formatDateTime(quest.updatedAt)}</p>
    `;
    button.addEventListener("click", async () => {
      await selectQuest(quest.id);
      switchView("learn");
    });
    dom.dashboardQuestList.append(button);
  });
}

function renderDashboard() {
  if (!appState.activeQuest) {
    dom.dashboardActiveTitle.textContent = "还没有任务";
    dom.dashboardActiveBrief.textContent = "创建第一条任务后，这里会显示主线摘要和节奏提醒。";
    dom.dashboardActiveStats.innerHTML = [
      buildStatBadge("主线进度", "0 / 0"),
      buildStatBadge("总节点", "0 / 0"),
      buildStatBadge("待复习", "0")
    ].join("");
    return;
  }

  const quest = appState.activeQuest;
  const reviewable = quest.nodes.filter((node) => node.status === "completed").length;
  dom.dashboardActiveTitle.textContent = quest.title;
  dom.dashboardActiveBrief.textContent = quest.missionBrief || quest.launchNote || "继续推进这一轮任务。";
  dom.dashboardActiveStats.innerHTML = [
    buildStatBadge("主线进度", `${quest.stats.completedRoots} / ${quest.stats.totalRoots}`),
    buildStatBadge("总节点", `${quest.stats.completedNodes} / ${quest.stats.totalNodes}`),
    buildStatBadge("可复习节点", String(reviewable))
  ].join("");
}

function renderLearnView() {
  const quest = appState.activeQuest;
  if (!quest) {
    dom.learnEmptyState.classList.remove("hidden");
    dom.learnContent.classList.add("hidden");
    return;
  }

  dom.learnEmptyState.classList.add("hidden");
  dom.learnContent.classList.remove("hidden");
  dom.activeQuestTitle.textContent = quest.title;
  dom.activeQuestBrief.textContent = quest.missionBrief || quest.launchNote || "继续推进这一轮任务。";
  dom.rootProgress.textContent = `${quest.stats.completedRoots} / ${quest.stats.totalRoots} 主线`;
  dom.nodeProgress.textContent = `${quest.stats.completedNodes} / ${quest.stats.totalNodes} 节点`;

  const activeNode = getActiveNode(quest);
  if (!activeNode) {
    dom.questionPanel.classList.add("hidden");
    dom.questionEmpty.classList.remove("hidden");
  } else {
    dom.questionPanel.classList.remove("hidden");
    dom.questionEmpty.classList.add("hidden");
    dom.currentQuestionTag.textContent = activeNode.source === "follow-up" ? "子关卡" : "主线关卡";
    dom.currentQuestionTag.className = `pill-chip ${activeNode.source === "follow-up" ? "warning-chip" : "neutral-chip"}`;
    dom.currentQuestionPath.textContent = activeNode.path;
    dom.currentQuestionTitle.textContent = activeNode.title;
    dom.currentQuestionDifficulty.textContent = `难度 ${activeNode.difficulty || 3}`;
    dom.currentQuestionGoal.textContent = activeNode.goal || "这一关的目标是逼自己把逻辑说清楚。";
    dom.currentQuestionWhy.textContent = activeNode.whyItMatters || "答题后会留下持久化记录，方便后续复盘。";
  }

  renderRoadmap();
  renderTimeline();
}

function renderFeedback() {
  const evaluation = appState.lastEvaluation;
  if (!evaluation) {
    dom.feedbackVerdict.textContent = "等待回答";
    dom.feedbackVerdict.className = "pill-chip neutral-chip";
    dom.feedbackPanel.innerHTML = `<p class="muted">每次回答之后，这里会沉淀你的纠错记录、提示和改进建议。</p>`;
    return;
  }

  const meta = getVerdictMeta(evaluation.verdict);
  dom.feedbackVerdict.textContent = meta.label;
  dom.feedbackVerdict.className = `pill-chip ${meta.className}`;
  const strengths = (evaluation.feedback?.strengths || []).map((item) => `<li>${item}</li>`).join("") || "<li>暂无</li>";
  const gaps = (evaluation.feedback?.gaps || []).map((item) => `<li>${item}</li>`).join("") || "<li>暂无</li>";
  const missing = (evaluation.feedback?.missing || []).map((item) => `<li>${item}</li>`).join("") || "<li>暂无</li>";

  dom.feedbackPanel.innerHTML = `
    <p class="feedback-note">${evaluation.coachReply || "这次回答已经记录。"}</p>
    <div class="feedback-grid">
      <section class="feedback-box">
        <h4>你答对的地方</h4>
        <ul>${strengths}</ul>
      </section>
      <section class="feedback-box">
        <h4>还不够稳的地方</h4>
        <ul>${gaps}</ul>
      </section>
      <section class="feedback-box">
        <h4>缺掉的关键点</h4>
        <ul>${missing}</ul>
      </section>
    </div>
    <p class="feedback-note"><strong>更好的表达：</strong>${evaluation.feedback?.improve || "继续补具体例子和边界条件。"}</p>
    ${evaluation.hint ? `<p class="feedback-note"><strong>下一步提示：</strong>${evaluation.hint}</p>` : ""}
  `;
}

function renderRoadmap() {
  const quest = appState.activeQuest;
  dom.completionDots.innerHTML = "";
  dom.roadmapTree.innerHTML = "";
  if (!quest) {
    dom.roadmapTree.innerHTML = `<p class="muted">路线图会在任务创建后出现。</p>`;
    return;
  }

  const sortedNodes = [...quest.nodes].sort((left, right) => {
    const leftParts = left.path.replace(/^Q/, "").split(".").map(Number);
    const rightParts = right.path.replace(/^Q/, "").split(".").map(Number);
    const size = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < size; index += 1) {
      const diff = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  });

  sortedNodes.forEach((node) => {
    const dot = document.createElement("span");
    dot.className = `completion-dot ${node.status === "completed" ? "done" : ""}`;
    dom.completionDots.append(dot);

    const article = document.createElement("article");
    article.className = `roadmap-item ${node.status} ${node.parentId ? "child" : "root"}`;
    article.innerHTML = `
      <div class="roadmap-head">
        <div>
          <p class="quest-meta">${node.path}</p>
          <h4>${node.title}</h4>
        </div>
        <span class="status-mark ${node.status}"></span>
      </div>
      <p>${node.goal || "继续输出，让理解真正落地。"}</p>
    `;
    dom.roadmapTree.append(article);
  });
}

function renderTimeline() {
  dom.timelineList.innerHTML = "";
  const timeline = appState.activeQuest?.timeline || [];
  if (!timeline.length) {
    dom.timelineList.innerHTML = `<p class="muted">开始答题后，这里会逐步积累你的战报。</p>`;
    return;
  }
  timeline.slice(0, 16).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `<strong>${entry.summary}</strong><p>${formatDateTime(entry.createdAt)}</p>`;
    dom.timelineList.append(item);
  });
}

function getRecentAttempts(quest) {
  if (!quest) {
    return [];
  }
  return quest.nodes
    .flatMap((node) =>
      (node.attempts || []).map((attempt) => ({
        nodePath: node.path,
        nodeTitle: node.title,
        mode: attempt.mode,
        verdict: attempt.verdict,
        createdAt: attempt.createdAt
      }))
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 10);
}

function renderReviewView() {
  const quest = appState.activeQuest;
  if (!quest) {
    dom.reviewSummary.innerHTML = [buildStatBadge("可复习节点", "0"), buildStatBadge("最近复习次数", "0")].join("");
    dom.reviewPanel.innerHTML = `<p class="muted">先创建并完成几个节点，再来这里随机抽题。</p>`;
    dom.reviewRecords.innerHTML = `<p class="muted">还没有记录。</p>`;
    return;
  }

  const reviewableNodes = quest.nodes.filter((node) => node.status === "completed");
  const recentReviewAttempts = getRecentAttempts(quest).filter((item) => item.mode === "review");
  dom.reviewSummary.innerHTML = [
    buildStatBadge("可复习节点", String(reviewableNodes.length)),
    buildStatBadge("最近复习次数", String(recentReviewAttempts.length))
  ].join("");

  if (!appState.currentReview) {
    dom.reviewPanel.innerHTML = `<p class="muted">点击“抽一题”，从已经完成的节点里随机回抽。</p>`;
  } else {
    const review = appState.currentReview;
    dom.reviewPanel.innerHTML = `
      <div class="stack-form">
        <p class="quest-meta">${review.questTitle}</p>
        <h3>${review.node.path} · ${review.node.title}</h3>
        <p class="muted">${review.node.goal || "用自己的话重新讲清楚这一点。"}</p>
        <label>
          <span>复习回答</span>
          <textarea id="review-answer-input" rows="6" placeholder="现在开始复述，不要看提示。"></textarea>
        </label>
        <button id="submit-review" class="primary-button" type="button">提交复习回答</button>
      </div>
    `;
    document.querySelector("#submit-review")?.addEventListener("click", submitReviewAnswer);
  }

  const recentAttempts = getRecentAttempts(quest);
  if (!recentAttempts.length) {
    dom.reviewRecords.innerHTML = `<p class="muted">还没有答题记录。</p>`;
    return;
  }
  dom.reviewRecords.innerHTML = recentAttempts
    .map((attempt) => {
      const meta = getVerdictMeta(attempt.verdict);
      return `<div class="timeline-item"><strong>${attempt.nodePath} · ${attempt.nodeTitle}</strong><p>${attempt.mode === "review" ? "复习记录" : "闯关记录"} · ${meta.label} · ${formatDateTime(attempt.createdAt)}</p></div>`;
    })
    .join("");
}

function renderSettingsView() {
  const runtimeRoot = appState.bootstrap?.runtime?.dataRoot || "本地";
  dom.projectRootText.textContent = "E:\\study-quest-desktop";
  dom.settingsProjectRoot.textContent = "E:\\study-quest-desktop";
  dom.dataRootText.textContent = runtimeRoot;
  dom.settingsDataRoot.textContent = runtimeRoot;
}

function syncFormsFromSettings() {
  const settings = appState.bootstrap?.settings;
  if (!settings) {
    return;
  }
  fillTemplateOptions(dom.templateSelect, settings.defaultTemplateKey || "general");
  fillTemplateOptions(dom.settingsTemplate, settings.defaultTemplateKey || "general");
  dom.templateSelect.value = settings.defaultTemplateKey || "general";
  dom.settingsTemplate.value = settings.defaultTemplateKey || "general";
  dom.settingsBaseUrl.value = settings.baseUrl || "";
  dom.settingsModel.value = settings.model || "";
  dom.settingsApiKey.value = "";
  dom.settingsRootCount.value = settings.defaultRootQuestionCount || 8;
  document.querySelector("#count-input").value = settings.defaultRootQuestionCount || 8;
}

async function selectQuest(questId) {
  const quest = await api.getQuest(questId);
  appState.activeQuestId = questId;
  appState.activeQuest = quest;
  renderAll();
}

function renderPreviewBanner() {
  dom.previewBanner.classList.toggle("hidden", !appState.previewMode);
}

function renderAll() {
  renderApiStatus();
  renderNavStatus();
  renderQuestList();
  renderDashboard();
  renderLearnView();
  renderFeedback();
  renderReviewView();
  renderSettingsView();
  switchView(appState.currentView);
}

async function bootstrap() {
  appState.bootstrap = await api.loadBootstrap();
  appState.quests = appState.bootstrap.quests || [];
  syncFormsFromSettings();
  renderPreviewBanner();
  if (appState.quests.length) {
    await selectQuest(appState.quests[0].id);
  } else {
    renderAll();
  }
}

async function handleCreateQuest(event) {
  event.preventDefault();
  const payload = {
    topic: document.querySelector("#topic-input").value.trim(),
    material: document.querySelector("#material-input").value.trim(),
    level: document.querySelector("#level-input").value.trim(),
    goal: document.querySelector("#goal-input").value.trim(),
    timebox: document.querySelector("#timebox-input").value.trim(),
    rootQuestionCount: Number(document.querySelector("#count-input").value),
    templateKey: dom.templateSelect.value
  };

  const originalText = dom.createQuestButton.textContent;
  dom.createQuestButton.textContent = "正在生成卡组...";
  dom.createQuestButton.disabled = true;

  try {
    const response = await api.createQuest(payload);
    appState.quests = response.quests;
    appState.activeQuestId = response.quest.id;
    appState.activeQuest = response.quest;
    appState.currentReview = null;
    appState.lastEvaluation = null;
    dom.questForm.reset();
    syncFormsFromSettings();
    switchView("learn");
    renderAll();
  } catch (error) {
    appState.lastEvaluation = {
      verdict: "retry_same_question",
      coachReply: error.message || "生成任务失败。",
      hint: "先检查接口配置，再试一次。",
      feedback: {
        strengths: [],
        gaps: ["任务还没生成成功"],
        missing: ["可用的接口配置"],
        improve: "确认 Base URL、模型名和 API Key 是否正确。"
      }
    };
    switchView("settings");
    renderAll();
  } finally {
    dom.createQuestButton.textContent = originalText;
    dom.createQuestButton.disabled = false;
  }
}

async function handleAnswerQuestion(event) {
  event.preventDefault();
  const quest = appState.activeQuest;
  const activeNode = getActiveNode(quest);
  const answer = dom.answerInput.value.trim();
  if (!quest || !activeNode || !answer) {
    return;
  }

  const originalText = dom.submitAnswer.textContent;
  dom.submitAnswer.textContent = "教练判定中...";
  dom.submitAnswer.disabled = true;

  try {
    const response = await api.answerQuestion({
      questId: quest.id,
      nodeId: activeNode.id,
      answer
    });
    appState.quests = response.quests;
    appState.activeQuest = response.quest;
    appState.lastEvaluation = response.evaluation;
    appState.currentReview = null;
    dom.answerInput.value = "";
    renderAll();
    if (response.evaluation.verdict !== "retry_same_question") {
      playPositiveTone();
    }
  } catch (error) {
    appState.lastEvaluation = {
      verdict: "retry_same_question",
      coachReply: error.message || "提交回答失败。",
      hint: "先检查接口设置，或稍后再试。",
      feedback: {
        strengths: [],
        gaps: ["本次记录没有成功写入"],
        missing: ["稳定的接口响应"],
        improve: "确认网络和接口设置后再提交一次。"
      }
    };
    renderAll();
  } finally {
    dom.submitAnswer.textContent = originalText;
    dom.submitAnswer.disabled = false;
  }
}

async function drawReviewQuestion() {
  appState.currentReview = await api.drawReviewQuestion(appState.activeQuestId);
  switchView("review");
  renderAll();
}

async function submitReviewAnswer() {
  const textarea = document.querySelector("#review-answer-input");
  const answer = String(textarea?.value || "").trim();
  if (!answer || !appState.currentReview) {
    return;
  }
  const current = appState.currentReview;
  const response = await api.answerReviewQuestion({
    questId: current.questId,
    nodeId: current.node.id,
    answer
  });
  appState.quests = response.quests;
  if (appState.activeQuestId === response.quest.id) {
    appState.activeQuest = response.quest;
  }
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
    baseUrl: dom.settingsBaseUrl.value.trim(),
    model: dom.settingsModel.value.trim(),
    apiKey: dom.settingsApiKey.value.trim(),
    defaultTemplateKey: dom.settingsTemplate.value,
    defaultRootQuestionCount: Number(dom.settingsRootCount.value)
  });
  appState.bootstrap.settings = response.settings;
  syncFormsFromSettings();
  renderAll();
}

dom.navButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

dom.jumpSettingsButton.addEventListener("click", () => switchView("settings"));
dom.questForm.addEventListener("submit", handleCreateQuest);
dom.answerForm.addEventListener("submit", handleAnswerQuestion);
dom.drawReviewButton.addEventListener("click", drawReviewQuestion);
dom.settingsForm.addEventListener("submit", saveSettings);

bootstrap();
