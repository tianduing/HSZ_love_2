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
    subtitle: "项目、主线、复习和统计都汇总在这里"
  },
  library: {
    eyebrow: "项目库",
    title: "项目库",
    subtitle: "查看全部项目、进度和最近活动"
  },
  learn: {
    eyebrow: "闯关学习",
    title: "闯关学习",
    subtitle: "问题地图、作答和教练反馈"
  },
  review: {
    eyebrow: "复习中心",
    title: "复习中心",
    subtitle: "随机抽题、查漏补缺、回看复习记录"
  },
  leisure: {
    eyebrow: "休闲区",
    title: "休闲区",
    subtitle: "用诗词和成语小练习换个脑回路，也顺手补一点文学素养"
  },
  stats: {
    eyebrow: "学习统计",
    title: "学习统计",
    subtitle: "把每天学了多久、答了哪些题、哪天最稳，都放进同一张热力图里"
  },
  settings: {
    eyebrow: "设置",
    title: "设置",
    subtitle: "主题、接口、背景和本地数据"
  }
};

const LEISURE_GAME_META = {
  poetry: {
    label: "诗词补全",
    shortLabel: "诗词",
    icon: "fa-feather-pointed",
    promptLabel: "补全诗句",
    tipTitle: "诗词小窍门",
    tip: "先抓意象和语气，再看节奏与对仗。很多名句一旦记住画面，后半句会顺很多。"
  },
  idiom: {
    label: "成语释义",
    shortLabel: "成语",
    icon: "fa-book-open-reader",
    promptLabel: "选择正确释义",
    tipTitle: "成语小窍门",
    tip: "先判断感情色彩，再判断使用场景。很多成语不是字面意思，关键在语境。"
  }
};

const LEISURE_QUESTION_BANK = {
  poetry: [
    {
      id: "poetry-1",
      prompt: "春眠不觉晓，____。",
      answer: "处处闻啼鸟",
      options: ["处处闻啼鸟", "江清月近人", "山月照弹琴", "白云生处深"],
      source: "孟浩然《春晓》",
      note: "这两句从春晨的听觉入手，先写睡醒不觉天明，再写处处鸟鸣。"
    },
    {
      id: "poetry-2",
      prompt: "海内存知己，____。",
      answer: "天涯若比邻",
      options: ["天涯若比邻", "山山黄叶飞", "千里共婵娟", "风雪夜归人"],
      source: "王勃《送杜少府之任蜀州》",
      note: "它写的是知己之间精神相近，即使远隔天涯也像近邻一样。"
    },
    {
      id: "poetry-3",
      prompt: "欲穷千里目，____。",
      answer: "更上一层楼",
      options: ["更上一层楼", "独钓寒江雪", "草色入帘青", "相看两不厌"],
      source: "王之涣《登鹳雀楼》",
      note: "这句常被拿来比喻想看得更远，就要站得更高。"
    },
    {
      id: "poetry-4",
      prompt: "采菊东篱下，____。",
      answer: "悠然见南山",
      options: ["悠然见南山", "明月来相照", "莲动下渔舟", "白水绕东城"],
      source: "陶渊明《饮酒·其五》",
      note: "关键味道在“悠然”，它写的是不刻意而自然显现的闲适心境。"
    },
    {
      id: "poetry-5",
      prompt: "会当凌绝顶，____。",
      answer: "一览众山小",
      options: ["一览众山小", "星河欲转千帆舞", "轻舟已过万重山", "独怆然而涕下"],
      source: "杜甫《望岳》",
      note: "前句写志向，后句写胸襟，是非常典型的昂扬气象。"
    },
    {
      id: "poetry-6",
      prompt: "山重水复疑无路，____。",
      answer: "柳暗花明又一村",
      options: ["柳暗花明又一村", "芳草萋萋鹦鹉洲", "桃花流水鳜鱼肥", "秋水共长天一色"],
      source: "陆游《游山西村》",
      note: "这句今天常被借来写困境后的转机。"
    },
    {
      id: "poetry-7",
      prompt: "人生自古谁无死，____。",
      answer: "留取丹心照汗青",
      options: ["留取丹心照汗青", "不教胡马度阴山", "何人不起故园情", "对影成三人"],
      source: "文天祥《过零丁洋》",
      note: "“丹心”指赤诚之心，“汗青”借指史册，整句很有历史气节。"
    },
    {
      id: "poetry-8",
      prompt: "落霞与孤鹜齐飞，____。",
      answer: "秋水共长天一色",
      options: ["秋水共长天一色", "青山郭外斜", "只是近黄昏", "夜深篱落一灯明"],
      source: "王勃《滕王阁序》",
      note: "这一联画面感极强，颜色、空间和动态都很完整。"
    }
  ],
  idiom: [
    {
      id: "idiom-1",
      prompt: "画龙点睛",
      answer: "在关键处用简洁有力的话点明重点，使内容更传神。",
      options: [
        "在关键处用简洁有力的话点明重点，使内容更传神。",
        "形容做事没有主见，总跟着别人走。",
        "比喻把复杂问题故意说得很模糊。",
        "形容场面很热闹，到处都很拥挤。"
      ],
      source: "常用成语",
      note: "它经常出现在写作、发言、设计收尾里，强调最后一笔很关键。"
    },
    {
      id: "idiom-2",
      prompt: "不负众望",
      answer: "没有辜负大家的期待。",
      options: ["没有辜负大家的期待。", "不愿意接受别人的帮助。", "很多人对此都非常失望。", "对别人提出过高要求。"],
      source: "常用成语",
      note: "它和“不孚众望”意思相反，后者才是“让人失望”。"
    },
    {
      id: "idiom-3",
      prompt: "炉火纯青",
      answer: "比喻技艺或学问达到了纯熟完美的境界。",
      options: [
        "比喻技艺或学问达到了纯熟完美的境界。",
        "形容现场气氛非常热烈。",
        "比喻做事过于急躁，没有耐心。",
        "指说话时情绪十分激动。"
      ],
      source: "常用成语",
      note: "它强调的是“成熟到几乎没有痕迹”的功力。"
    },
    {
      id: "idiom-4",
      prompt: "望洋兴叹",
      answer: "因力量不足或条件有限而感到无可奈何。",
      options: [
        "因力量不足或条件有限而感到无可奈何。",
        "看到海洋就想起远方的朋友。",
        "面对新鲜事物而感到惊喜。",
        "比喻心情开阔，十分舒畅。"
      ],
      source: "常用成语",
      note: "重点不在“看海”，而在“自觉有限，所以叹服”。"
    },
    {
      id: "idiom-5",
      prompt: "走马观花",
      answer: "比喻粗略地观察，只是大概看看而不深入。",
      options: [
        "比喻粗略地观察，只是大概看看而不深入。",
        "形容路程很远，来回奔波辛苦。",
        "比喻一个人动作很快，效率很高。",
        "形容环境优美，让人流连忘返。"
      ],
      source: "常用成语",
      note: "它常拿来提醒自己别只停留在“看过”，而没有真正理解。"
    },
    {
      id: "idiom-6",
      prompt: "一鼓作气",
      answer: "趁劲头最足的时候一下子把事情做到底。",
      options: [
        "趁劲头最足的时候一下子把事情做到底。",
        "比喻做事时反复犹豫，拿不定主意。",
        "形容说话时声音越来越大。",
        "比喻在很多人帮助下共同完成任务。"
      ],
      source: "常用成语",
      note: "它最适合用来形容需要连续推进、不能频繁泄气的任务。"
    },
    {
      id: "idiom-7",
      prompt: "水落石出",
      answer: "比喻事情经过澄清之后，真相终于显露出来。",
      options: [
        "比喻事情经过澄清之后，真相终于显露出来。",
        "形容环境突然变得很安静。",
        "比喻感情快速冷淡下去。",
        "形容文章写得特别朴素。"
      ],
      source: "常用成语",
      note: "它有一种“表面退去之后，本质露出来”的感觉。"
    },
    {
      id: "idiom-8",
      prompt: "触类旁通",
      answer: "掌握某一类事物的规律后，能类推出相关内容。",
      options: [
        "掌握某一类事物的规律后，能类推出相关内容。",
        "指依靠运气连续碰巧做对几件事。",
        "比喻把不同领域完全混在一起。",
        "形容表达方式非常委婉含蓄。"
      ],
      source: "常用成语",
      note: "这正是学习迁移能力的一个很好的概括。"
    }
  ]
};

const REVIEW_MODE_META = {
  random: {
    label: "随机抽题",
    emptyMessage: "当前还没有可抽查的节点。先完成几道题，再回来随机抽题。"
  },
  current: {
    label: "当前项目",
    emptyMessage: "当前项目还没有完成节点，先把主线往前推几题。"
  },
  weak: {
    label: "薄弱节点",
    emptyMessage: "目前还没有明显的薄弱节点，说明最近几轮回答还算稳定。"
  },
  recent: {
    label: "最新完成",
    emptyMessage: "还没有新完成的节点可供回看。"
  }
};

const THEME_PRESETS = [
  {
    key: "forest",
    name: "护眼绿洲",
    description: "奶油白配植物绿，适合白天长时间学习。"
  },
  {
    key: "ocean",
    name: "海盐蓝调",
    description: "更冷静的浅蓝玻璃感，适合理工和结构化思考。"
  },
  {
    key: "graphite",
    name: "石墨夜读",
    description: "低刺激深色主题，适合晚上专注闯关。"
  }
];

const UI_STORAGE_KEY = "study-quest-ui-v4";
const PREVIEW_STORAGE_KEY = "study-quest-preview-db-v4";
const LEISURE_STORAGE_KEY = "study-quest-leisure-v1";
const DEFAULT_BASE_URL = "https://codex.ximuai.com";
const LEGACY_BASE_URL = "https://api.openai.com/v1";

function createDefaultBackgroundState() {
  return {
    image: "",
    assetPath: "",
    opacity: 55,
    positionX: 50,
    positionY: 50
  };
}

function createDefaultUiState() {
  return {
    theme: "forest",
    focusMode: false,
    background: createDefaultBackgroundState()
  };
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
      launchNote: "默认基础定义已知，重点把边界、取舍和漏洞说透。"
    };
  }
  return {
    tier,
    label: "中级",
    maxFollowUpDepth: 2,
    retryThreshold: 68,
    advanceThreshold: 140,
    launchNote: "先讲清主干，再通过少量必要追问把理解压实。"
  };
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

function getNodeFollowUpDepth(node) {
  const pathText = cleanText(node?.path);
  if (!pathText) {
    return 0;
  }
  return Math.max(0, pathText.split(".").length - 1);
}

function getMaxFollowUpDepth(levelText) {
  return getLearnerProfile(levelText).maxFollowUpDepth;
}

function canCreateFollowUpForQuest(quest, node) {
  return getNodeFollowUpDepth(node) < getMaxFollowUpDepth(quest?.level);
}

function truncateText(value, maxLength = 120) {
  const text = cleanText(value).replace(/\s+/g, " ");
  if (!text) {
    return "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function formatDuration(seconds) {
  const safeSeconds = clamp(Number(seconds || 0), 0, 12 * 60 * 60);
  if (!safeSeconds) {
    return "不足 1 分钟";
  }
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.max(1, Math.round((safeSeconds % 3600) / 60));
  if (!hours) {
    return `${minutes} 分钟`;
  }
  return `${hours} 小时 ${minutes} 分钟`;
}

function toDateKey(value) {
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

function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function startOfWeek(value) {
  const date = new Date(value);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + offset);
  date.setHours(0, 0, 0, 0);
  return date;
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
  const sentence = normalized.split(/[。！？!?|]/)[0].trim();
  const candidate = sentence || normalized || normalizedMaterial;
  return candidate.length > 28 ? `${candidate.slice(0, 28)}...` : candidate;
}

function loadUiState() {
  const defaults = createDefaultUiState();
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    const background = parsed.background || {};
    return {
      theme: ["forest", "ocean", "graphite"].includes(parsed.theme) ? parsed.theme : "forest",
      focusMode: Boolean(parsed.focusMode),
      background: {
        image: typeof background.image === "string" ? background.image : "",
        assetPath: typeof background.assetPath === "string" ? background.assetPath : "",
        opacity: clamp(Number(background.opacity ?? 55), 0, 100),
        positionX: clamp(Number(background.positionX ?? 50), 0, 100),
        positionY: clamp(Number(background.positionY ?? 50), 0, 100)
      }
    };
  } catch (_error) {
    return defaults;
  }
}

function saveUiState() {
  const cachedUiState = {
    theme: appState.ui.theme,
    focusMode: appState.ui.focusMode,
    background: {
      ...appState.ui.background,
      image: appState.previewMode ? appState.ui.background.image : "",
      assetPath: appState.previewMode ? appState.ui.background.assetPath : ""
    }
  };
  try {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(cachedUiState));
  } catch (_error) {
    if (appState.previewMode && appState.ui.background.image) {
      showToast("这张图太大，预览模式里可能只会临时显示，桌面版会更稳定。", "warning");
    }
  }
  if (window.studyCoachApi?.saveUiPrefs) {
    void window.studyCoachApi.saveUiPrefs({
      theme: appState.ui.theme,
      focusMode: appState.ui.focusMode,
      background: appState.ui.background
    }).catch(() => {});
  }
}

function createDefaultLeisureGameState() {
  return {
    seenIds: [],
    currentQuestionId: "",
    selectedOption: "",
    answered: false,
    lastCorrect: null,
    answeredCount: 0,
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    completedRounds: 0,
    lastAnsweredAt: ""
  };
}

function createDefaultLeisureState() {
  return {
    selectedGame: "poetry",
    totals: {
      answered: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    games: {
      poetry: createDefaultLeisureGameState(),
      idiom: createDefaultLeisureGameState()
    }
  };
}

function normalizeLeisureGameState(value = {}) {
  const defaults = createDefaultLeisureGameState();
  return {
    seenIds: Array.isArray(value.seenIds) ? value.seenIds.map(cleanText).filter(Boolean).slice(0, 999) : [],
    currentQuestionId: cleanText(value.currentQuestionId),
    selectedOption: cleanText(value.selectedOption),
    answered: Boolean(value.answered),
    lastCorrect: value.lastCorrect == null ? null : Boolean(value.lastCorrect),
    answeredCount: clamp(Number(value.answeredCount || 0), 0, 999999),
    correctCount: clamp(Number(value.correctCount || 0), 0, 999999),
    currentStreak: clamp(Number(value.currentStreak || 0), 0, 999999),
    bestStreak: clamp(Number(value.bestStreak || 0), 0, 999999),
    completedRounds: clamp(Number(value.completedRounds || 0), 0, 999999),
    lastAnsweredAt: cleanText(value.lastAnsweredAt) || defaults.lastAnsweredAt
  };
}

function loadLeisureState() {
  const defaults = createDefaultLeisureState();
  try {
    const raw = localStorage.getItem(LEISURE_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return {
      selectedGame: LEISURE_GAME_META[parsed?.selectedGame] ? parsed.selectedGame : defaults.selectedGame,
      totals: {
        answered: clamp(Number(parsed?.totals?.answered || 0), 0, 999999),
        correct: clamp(Number(parsed?.totals?.correct || 0), 0, 999999),
        currentStreak: clamp(Number(parsed?.totals?.currentStreak || 0), 0, 999999),
        bestStreak: clamp(Number(parsed?.totals?.bestStreak || 0), 0, 999999)
      },
      games: {
        poetry: normalizeLeisureGameState(parsed?.games?.poetry),
        idiom: normalizeLeisureGameState(parsed?.games?.idiom)
      }
    };
  } catch (_error) {
    return defaults;
  }
}

function saveLeisureState() {
  try {
    localStorage.setItem(LEISURE_STORAGE_KEY, JSON.stringify(appState.leisure));
  } catch (_error) {
    showToast("休闲区进度暂时没有写入本地，下次刷新可能会丢失。", "warning");
  }
}

function buildPreviewRoadmap(topic, rootQuestionCount, templateKey, levelText = "") {
  const profile = getLearnerProfile(levelText);
  const stems = {
    general: [
      `如果你要用自己的话讲清“${topic}”，它的核心对象、目标和边界分别是什么？`,
      `“${topic}”的关键结构、关键步骤或关键机制，是怎样串起来形成完整闭环的？`,
      `把“${topic}”放到真实场景里时，你会如何解释它为什么值得这样设计？`,
      `围绕“${topic}”，最常见的误区、偷懒做法或理解偏差是什么？`,
      `如果要验证自己真的掌握了“${topic}”，你会输出什么结果来证明？`
    ],
    intense: [
      `用自己的话解释“${topic}”到底是什么，并说明它不是什么。`,
      `为什么“${topic}”成立？背后的因果链条或判断逻辑是什么？`,
      `“${topic}”一旦进入复杂场景，最容易在哪些边界条件下失效？`,
      `如果你提出一个关于“${topic}”的方案，我应该从哪些漏洞和反例上挑战它？`,
      `关于“${topic}”，最危险的自我欺骗是什么？你如何当场纠正自己？`
    ],
    algorithm: [
      `面对“${topic}”，你会如何先准确复述题意和边界，再决定解法方向？`,
      `和“${topic}”相关的最直接暴力解法是什么？它慢在哪里？`,
      `“${topic}”真正值得优化的瓶颈在哪里？你凭什么这样判断？`,
      `要把“${topic}”从暴力解推进到更优解，关键思路或数据结构是什么？`,
      `如果写成代码，“${topic}”最容易在哪些边界条件下翻车？`
    ],
    paper: [
      `这篇关于“${topic}”的材料究竟想解决什么问题，问题为什么重要？`,
      `围绕“${topic}”，作者的方法、假设和推理链条是什么？`,
      `材料中的实验或论证，是如何支撑“${topic}”结论的？`,
      `如果你要复述“${topic}”，哪些局限性必须一起讲清楚？`,
      `关于“${topic}”，你最想追问作者的一个问题是什么？`
    ],
    project: [
      `如果把“${topic}”落成一个最小可交付项目，你的闭环会长什么样？`,
      `围绕“${topic}”，关键链路、关键模块和依赖顺序分别是什么？`,
      `“${topic}”落地时最值得做的技术取舍有哪些，代价分别是什么？`,
      `如果“${topic}”真的出问题，最该先盯住哪些故障点和监控指标？`,
      `项目做完后，你会用什么标准判断自己算不算真的掌握了“${topic}”？`
    ]
  };

  const source = stems[templateKey] || stems.general;
  return Array.from({ length: rootQuestionCount }).map((_, index) => ({
    title: adaptRoadmapQuestion(source[index % source.length], topic, index, profile),
    goal:
      profile.tier === "beginner"
        ? (
            index === 0
              ? "先把概念、核心作用和一个直观例子讲明白。"
              : index === rootQuestionCount - 1
                ? "把复盘、辨错和能否举例自证也一起带出来。"
                : "继续往结构理解、应用判断和具体例子推进。"
          )
        : index === 0
          ? "先把核心定义和主干逻辑讲明白。"
          : index === rootQuestionCount - 1
            ? "把复盘、边界和自证能力也带出来。"
            : "继续往结构理解、应用判断和场景取舍推进。",
    whyItMatters:
      profile.tier === "beginner"
        ? (
            index === 0
              ? "第一关先站稳主干，后面才不会被术语和细节带偏。"
              : "真正的掌握，必须能讲例子、辨边界、做判断。"
          )
        : index === 0
          ? "第一关讲不清，后面的追问会一直漂。"
          : "真正的掌握，必须能讲应用、辨边界、做判断。",
    difficulty: getRoadmapDifficulty(profile, index)
  }));
}

function createPreviewApi() {
  function normalizePreviewSettings(settings = {}) {
    return {
      baseUrl:
        !cleanText(settings.baseUrl) || cleanText(settings.baseUrl) === LEGACY_BASE_URL
          ? DEFAULT_BASE_URL
          : cleanText(settings.baseUrl),
      model: cleanText(settings.model) || "gpt-5.4",
      apiKey: cleanText(settings.apiKey),
      defaultTemplateKey: cleanText(settings.defaultTemplateKey) || "general",
      defaultRootQuestionCount: clamp(Number(settings.defaultRootQuestionCount || 10), 5, 30),
      allowFollowUpQuestions: settings.allowFollowUpQuestions !== false
    };
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

  function getPendingPreviewNodes(quest) {
    return (quest.nodes || [])
      .filter((node) => node.status === "pending" || node.status === "active")
      .sort(compareNodes);
  }

  function activateFirstPendingPreviewNode(quest) {
    const now = new Date().toISOString();
    const nextNode = getPendingPreviewNodes(quest)
      .find((node) => getNodeFollowUpDepth(node) <= getMaxFollowUpDepth(quest.level)) || null;
    quest.currentNodeId = nextNode?.id || null;
    if (!nextNode) {
      return;
    }
    nextNode.status = "active";
    nextNode.updatedAt = now;
    nextNode.activeSince = now;
  }

  function repairPreviewQuestDepth(quest) {
    const maxDepth = getMaxFollowUpDepth(quest.level);
    let removedCurrentNode = false;
    quest.nodes = [...(quest.nodes || [])]
      .sort(compareNodes)
      .flatMap((node) => {
        if (getNodeFollowUpDepth(node) <= maxDepth) {
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

    const currentNode = quest.nodes.find((node) => node.id === quest.currentNodeId) || null;
    const hasValidActiveNode = quest.nodes.some(
      (node) => node.status === "active" && getNodeFollowUpDepth(node) <= maxDepth
    );

    if (!currentNode || removedCurrentNode || !hasValidActiveNode) {
      quest.nodes.forEach((node) => {
        if (node.status === "active") {
          node.status = "pending";
          node.activeSince = null;
        }
      });
      activateFirstPendingPreviewNode(quest);
    }
  }

  function normalizePreviewAttempt(attempt, index) {
    const answer = cleanText(attempt?.answer);
    return {
      id: attempt?.id || crypto.randomUUID(),
      mode: attempt?.mode === "review" ? "review" : "learn",
      attemptNumber: clamp(Number(attempt?.attemptNumber || index + 1), 1, 9999),
      answer,
      answerPreview: cleanText(attempt?.answerPreview) || truncateText(answer, 90),
      verdict: cleanText(attempt?.verdict),
      score: Number.isFinite(Number(attempt?.score)) ? clamp(Number(attempt.score), 0, 100) : null,
      coachReply: cleanText(attempt?.coachReply),
      hint: cleanText(attempt?.hint),
      strengths: Array.isArray(attempt?.strengths) ? attempt.strengths.map(cleanText).filter(Boolean).slice(0, 3) : [],
      gaps: Array.isArray(attempt?.gaps) ? attempt.gaps.map(cleanText).filter(Boolean).slice(0, 3) : [],
      missing: Array.isArray(attempt?.missing) ? attempt.missing.map(cleanText).filter(Boolean).slice(0, 3) : [],
      improve: cleanText(attempt?.improve),
      durationSeconds: clamp(Number(attempt?.durationSeconds || 0), 0, 12 * 60 * 60),
      createdAt: attempt?.createdAt || new Date().toISOString()
    };
  }

  function normalizePreviewQuest(quest) {
    const fallbackTime = quest?.updatedAt || quest?.createdAt || new Date().toISOString();
    const nodes = Array.isArray(quest?.nodes)
      ? quest.nodes.map((node, index) => ({
          id: node?.id || crypto.randomUUID(),
          path: cleanText(node?.path) || `Q${index + 1}`,
          parentId: node?.parentId || null,
          sortOrder: clamp(Number(node?.sortOrder || index + 1), 1, 999999),
          title: cleanText(node?.title) || `问题 ${index + 1}`,
          goal: cleanText(node?.goal),
          whyItMatters: cleanText(node?.whyItMatters),
          difficulty: clamp(Number(node?.difficulty || 3), 1, 5),
          status: ["pending", "active", "completed"].includes(node?.status) ? node.status : "pending",
          source: cleanText(node?.source) || "roadmap",
          attempts: Array.isArray(node?.attempts) ? node.attempts.map(normalizePreviewAttempt) : [],
          reviewCount: clamp(Number(node?.reviewCount || 0), 0, 999999),
          lastReviewAt: node?.lastReviewAt || null,
          createdAt: node?.createdAt || fallbackTime,
          updatedAt: node?.updatedAt || fallbackTime,
          completedAt: node?.completedAt || null,
          activeSince: node?.status === "active" ? (node?.activeSince || node?.updatedAt || fallbackTime) : null
        }))
      : [];
    const normalizedQuest = {
      id: quest?.id || crypto.randomUUID(),
      title: cleanText(quest?.title) || deriveTopicFromMaterial(quest?.material, quest?.topic),
      topic: cleanText(quest?.topic) || deriveTopicFromMaterial(quest?.material, quest?.topic),
      material: cleanText(quest?.material),
      level: cleanText(quest?.level),
      goal: cleanText(quest?.goal),
      timebox: cleanText(quest?.timebox),
      templateKey: cleanText(quest?.templateKey) || "general",
      rootQuestionCount: clamp(Number(quest?.rootQuestionCount || nodes.filter((node) => !node.parentId).length), 0, 9999),
      missionBrief: cleanText(quest?.missionBrief),
      launchNote: cleanText(quest?.launchNote),
      status: cleanText(quest?.status) === "archived" ? "archived" : "active",
      category: cleanText(quest?.category),
      tags: Array.isArray(quest?.tags) ? quest.tags.map(cleanText).filter(Boolean) : [],
      sourceDocuments: Array.isArray(quest?.sourceDocuments) ? quest.sourceDocuments : [],
      createdAt: quest?.createdAt || fallbackTime,
      updatedAt: fallbackTime,
      finishedAt: quest?.finishedAt || null,
      currentNodeId: quest?.currentNodeId || nodes.find((node) => node.status === "active")?.id || null,
      nodes,
      timeline: Array.isArray(quest?.timeline)
        ? quest.timeline.map((entry) => ({
            id: entry?.id || crypto.randomUUID(),
            kind: cleanText(entry?.kind) || "activity",
            summary: cleanText(entry?.summary) || "学习记录已更新",
            createdAt: entry?.createdAt || fallbackTime
          })).slice(0, 60)
        : []
    };
    repairPreviewQuestDepth(normalizedQuest);
    return normalizedQuest;
  }

  function loadPreviewState() {
    try {
      const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (!raw) {
        return {
          settings: normalizePreviewSettings(),
          quests: []
        };
      }
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        settings: normalizePreviewSettings(parsed.settings || {}),
        quests: Array.isArray(parsed.quests) ? parsed.quests.map(normalizePreviewQuest) : []
      };
    } catch (_error) {
      return {
        settings: normalizePreviewSettings(),
        quests: []
      };
    }
  }

  function savePreviewState(nextState) {
    localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(nextState));
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
      status: quest.status || "active",
      category: cleanText(quest.category),
      tags: Array.isArray(quest.tags) ? quest.tags : [],
      sourceDocumentCount: Array.isArray(quest.sourceDocuments) ? quest.sourceDocuments.length : 0,
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
    const now = new Date().toISOString();
    quest.nodes.forEach((node) => {
      if (node.status === "active") {
        node.status = "pending";
        node.activeSince = null;
      }
    });
    const nextNode = [...quest.nodes]
      .filter((node) => node.status === "pending")
      .sort(compareNodes)[0];
    if (nextNode) {
      nextNode.status = "active";
      nextNode.activeSince = now;
      nextNode.updatedAt = now;
      quest.currentNodeId = nextNode.id;
    } else {
      quest.currentNodeId = null;
      quest.finishedAt = now;
    }
  }

  function createAttemptRecord(node, mode, answer, evaluation, createdAt, durationSeconds) {
    return {
      id: crypto.randomUUID(),
      mode,
      attemptNumber: (node.attempts?.length || 0) + 1,
      answer,
      answerPreview: truncateText(answer, 90),
      verdict: evaluation.verdict,
      score: evaluation.score,
      coachReply: evaluation.coachReply,
      hint: evaluation.hint,
      strengths: evaluation.feedback.strengths,
      gaps: evaluation.feedback.gaps,
      missing: evaluation.feedback.missing,
      improve: evaluation.feedback.improve,
      durationSeconds,
      createdAt
    };
  }

  function buildPreviewStudyStats(state) {
    const dayMap = new Map();
    let totalAnswers = 0;
    let totalSeconds = 0;
    let totalScore = 0;
    let scoreCount = 0;
    const completedKeys = new Set();

    state.quests.forEach((quest) => {
      (quest.nodes || []).forEach((node) => {
        (node.attempts || []).forEach((attempt) => {
          const date = toDateKey(attempt.createdAt);
          if (!date) {
            return;
          }
          totalAnswers += 1;
          totalSeconds += clamp(Number(attempt.durationSeconds || 0), 0, 12 * 60 * 60);
          if (Number.isFinite(Number(attempt.score))) {
            totalScore += Number(attempt.score);
            scoreCount += 1;
          }
          const day = dayMap.get(date) || {
            date,
            totalSeconds: 0,
            answersCount: 0,
            learnCount: 0,
            reviewCount: 0,
            completedCount: 0,
            scoreTotal: 0,
            scoreCount: 0,
            questionKeys: new Set(),
            items: []
          };
          day.totalSeconds += clamp(Number(attempt.durationSeconds || 0), 0, 12 * 60 * 60);
          day.answersCount += 1;
          if (attempt.mode === "review") {
            day.reviewCount += 1;
          } else {
            day.learnCount += 1;
          }
          if (Number.isFinite(Number(attempt.score))) {
            day.scoreTotal += Number(attempt.score);
            day.scoreCount += 1;
          }
          if (attempt.mode === "learn" && attempt.verdict !== "retry_same_question") {
            const completedKey = `${date}:${quest.id}:${node.id}`;
            if (!completedKeys.has(completedKey)) {
              completedKeys.add(completedKey);
              day.completedCount += 1;
            }
          }
          day.questionKeys.add(`${quest.id}:${node.id}`);
          day.items.push({
            questId: quest.id,
            questTitle: quest.title,
            nodeId: node.id,
            nodePath: node.path,
            nodeTitle: node.title,
            mode: attempt.mode,
            verdict: attempt.verdict,
            score: attempt.score,
            durationSeconds: clamp(Number(attempt.durationSeconds || 0), 0, 12 * 60 * 60),
            attemptNumber: attempt.attemptNumber,
            answerPreview: attempt.answerPreview || truncateText(attempt.answer, 90),
            coachPreview: truncateText(attempt.coachReply, 90),
            answeredAt: attempt.createdAt
          });
          dayMap.set(date, day);
        });
      });
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
        questionCount: day.questionKeys.size,
        averageScore: day.scoreCount ? Math.round(day.scoreTotal / day.scoreCount) : null,
        items: day.items.sort((left, right) => new Date(right.answeredAt) - new Date(left.answeredAt))
      }))
      .sort((left, right) => left.date.localeCompare(right.date));

    const dateSet = new Set(days.map((day) => day.date));
    const today = new Date();

    function countBackward(date) {
      let streak = 0;
      const cursor = new Date(date);
      while (dateSet.has(toDateKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    }

    const yesterday = addDays(today, -1);
    const currentStreak = dateSet.has(toDateKey(today))
      ? countBackward(today)
      : (dateSet.has(toDateKey(yesterday)) ? countBackward(yesterday) : 0);

    let bestStreak = 0;
    days.forEach((day) => {
      const previous = addDays(new Date(day.date), -1);
      if (!dateSet.has(toDateKey(previous))) {
        bestStreak = Math.max(bestStreak, countBackward(new Date(day.date)));
      }
    });

    return {
      totals: {
        studyDays: days.length,
        totalAnswers,
        totalMinutes: Math.round(totalSeconds / 60),
        totalHours: Number((totalSeconds / 3600).toFixed(1)),
        completedCount: completedKeys.size,
        averageScore: scoreCount ? Math.round(totalScore / scoreCount) : null,
        currentStreak,
        bestStreak
      },
      days
    };
  }

  function buildLearningEvaluation(answer, node, quest, settings) {
    const profile = getLearnerProfile(quest?.level);
    const answerLength = answer.length;
    const shortAnswer = answerLength < profile.retryThreshold;
    const strongAnswer = answerLength >= profile.advanceThreshold;
    const alreadyHasChild = quest.nodes.some((item) => item.parentId === node.id);
    const canFollowUp =
      settings?.allowFollowUpQuestions !== false &&
      canCreateFollowUpForQuest(quest, node) &&
      !alreadyHasChild;
    const verdict = shortAnswer
      ? "retry_same_question"
      : (!strongAnswer && canFollowUp ? "follow_up_required" : "complete_and_advance");
    const score = verdict === "retry_same_question"
      ? Math.min(58, Math.max(18, Math.round(answerLength * 0.7)))
      : verdict === "follow_up_required"
        ? Math.min(82, Math.max(62, Math.round(answerLength * 0.45)))
        : Math.min(91, Math.max(78, Math.round(answerLength * 0.4)));

    return {
      verdict,
      score,
      coachReply:
        verdict === "retry_same_question"
          ? (
              profile.tier === "beginner"
                ? "这次已经碰到主题了，但主干和例子还没站稳，我们再补一轮就够。"
                : "这次回答已经碰到了主题，但主干、判断依据和场景解释还没有立住。"
            )
          : verdict === "follow_up_required"
            ? "当前主干已经过线，下一步该把场景、边界和取舍说得更具体。"
            : "这一关可以通过，但分数不代表没有缺口，后面仍然要继续压实表达。",
      hint:
        verdict === "retry_same_question"
          ? (
              profile.tier === "beginner"
                ? "先补清楚三件事：它是什么、为什么这样理解、能举什么例子。"
                : "先补清楚：它是什么、为什么成立、怎么用、什么情况下会失效。"
            )
          : verdict === "follow_up_required"
            ? "继续把真实场景、取舍理由和边界条件说具体。"
            : "",
      feedback: {
        strengths: shortAnswer ? ["已经开始尝试用自己的话表达"] : ["主干没有跑偏", "已经有一定结构感"],
        gaps: shortAnswer ? ["展开不足", "缺少判断依据"] : ["还可以更具体", "场景颗粒度还不够"],
        missing: shortAnswer ? ["应用场景", "边界条件"] : (verdict === "follow_up_required" ? ["更具体的取舍例子"] : []),
        improve: shortAnswer ? "先用一句话给出本质，再补一个真实例子。" : "把一个具体场景和选择理由压得更实，分数会更稳。"
      },
      followUpQuestion:
        verdict === "follow_up_required"
          ? {
              title: profile.tier === "beginner"
                ? `请你换一个更生活化的例子，再解释一次“${node.title}”。`
                : `请把“${node.title}”放进一个真实场景里再解释一次。`,
              goal: profile.tier === "beginner"
                ? "继续补足一个具体例子，以及为什么这样理解。"
                : "继续补足应用场景、判断依据和边界条件。",
              reason: profile.tier === "beginner"
                ? "主干已经碰到了，但还需要通过例子把理解说稳。"
                : "主干已经碰到了，但真正的掌握需要落到场景和取舍里。",
              difficulty: clamp((node.difficulty || 3) + (profile.tier === "advanced" ? 1 : 0), 1, 5)
            }
          : null
    };
  }

  function buildReviewEvaluation(answer) {
    const answerLength = answer.length;
    const verdict = answerLength >= 90 ? "review-locked-in" : "review-needs-refresh";
    const score = verdict === "review-locked-in"
      ? Math.min(88, Math.max(74, Math.round(answerLength * 0.36)))
      : Math.min(68, Math.max(22, Math.round(answerLength * 0.7)));
    return {
      verdict,
      score,
      coachReply:
        verdict === "review-locked-in"
          ? "这次复述基本站住了，但仍然建议把边界和例子说得更利落一些。"
          : "这题还没有真正复述稳，建议回到主线把主干和场景再梳理一遍。",
      hint: verdict === "review-locked-in" ? "" : "先用一句话说本质，再补一个场景和判断依据。",
      feedback: {
        strengths: verdict === "review-locked-in" ? ["主干还在", "表达比第一次更稳"] : ["还记得部分结构"],
        gaps: verdict === "review-locked-in" ? ["还可以更凝练"] : ["细节容易散", "场景判断还不够稳"],
        missing: verdict === "review-locked-in" ? [] : ["至少一个应用例子"],
        improve: "复习时先说本质，再补边界、例子和判断依据。"
      }
    };
  }

  return {
    async loadBootstrap() {
      const state = loadPreviewState();
      return {
        runtime: {
          dataRoot: "浏览器本地预览数据",
          templateOptions: FALLBACK_TEMPLATES
        },
        settings: {
          ...state.settings,
          hasApiKey: Boolean(state.settings.apiKey)
        },
        quests: state.quests.map(summarizeQuest).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      };
    },

    async loadStudyStats() {
      return buildPreviewStudyStats(loadPreviewState());
    },

    async saveBackgroundImage(payload) {
      return {
        ...createDefaultBackgroundState(),
        image: cleanText(payload?.dataUrl),
        assetPath: "preview-local"
      };
    },

    async saveSettings(payload) {
      const state = loadPreviewState();
      state.settings = {
        ...state.settings,
        ...payload,
        baseUrl:
          !cleanText(payload.baseUrl) || cleanText(payload.baseUrl) === LEGACY_BASE_URL
            ? DEFAULT_BASE_URL
            : cleanText(payload.baseUrl),
        defaultRootQuestionCount: clamp(Number(payload.defaultRootQuestionCount || 10), 5, 30),
        allowFollowUpQuestions: payload.allowFollowUpQuestions !== false
      };
      savePreviewState(state);
      return {
        settings: {
          ...state.settings,
          hasApiKey: Boolean(state.settings.apiKey)
        }
      };
    },

    async createQuest(payload) {
      const state = loadPreviewState();
      const now = new Date().toISOString();
      const topic = deriveTopicFromMaterial(payload.material, payload.topic);
      const rootQuestionCount = clamp(Number(payload.rootQuestionCount || state.settings.defaultRootQuestionCount || 10), 5, 30);
      const roadmap = buildPreviewRoadmap(topic, rootQuestionCount, payload.templateKey, payload.level);
      const learnerProfile = getLearnerProfile(payload.level);
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
        completedAt: null,
        activeSince: index === 0 ? now : null
      }));

      const quest = normalizePreviewQuest({
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
        launchNote: learnerProfile.launchNote,
        status: "active",
        category: cleanText(payload.category),
        tags: Array.isArray(payload.tags) ? payload.tags.map(cleanText).filter(Boolean) : [],
        sourceDocuments: Array.isArray(payload.sourceDocuments) ? payload.sourceDocuments : [],
        createdAt: now,
        updatedAt: now,
        finishedAt: null,
        currentNodeId: nodes[0]?.id || null,
        nodes,
        timeline: [
          {
            id: crypto.randomUUID(),
            kind: "session-created",
            summary: "已生成学习主线，准备开始答题。",
            createdAt: now
          }
        ]
      });

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
      const evaluation = buildLearningEvaluation(answer, node, quest, state.settings);
      const durationSeconds = node.activeSince
        ? Math.max(0, Math.round((new Date(now) - new Date(node.activeSince)) / 1000))
        : 0;

      node.attempts.push(createAttemptRecord(node, "learn", answer, evaluation, now, durationSeconds));
      node.updatedAt = now;

      if (evaluation.verdict === "retry_same_question") {
        node.status = "active";
        node.activeSince = now;
        quest.currentNodeId = node.id;
        appendTimeline(quest, "answer-retry", `${node.path} 还需要继续展开。`);
      } else {
        node.status = "completed";
        node.completedAt = now;
        node.activeSince = null;
        if (evaluation.verdict === "follow_up_required" && evaluation.followUpQuestion) {
          quest.nodes.forEach((item) => {
            if (item.status === "active") {
              item.status = "pending";
              item.activeSince = null;
            }
          });
          const childIndex = quest.nodes.filter((item) => item.parentId === node.id).length + 1;
          const childNode = {
            id: crypto.randomUUID(),
            path: `${node.path}.${childIndex}`,
            parentId: node.id,
            title: evaluation.followUpQuestion.title,
            goal: evaluation.followUpQuestion.goal,
            whyItMatters: evaluation.followUpQuestion.reason,
            difficulty: evaluation.followUpQuestion.difficulty,
            status: "active",
            source: "follow-up",
            attempts: [],
            reviewCount: 0,
            lastReviewAt: null,
            createdAt: now,
            updatedAt: now,
            completedAt: null,
            activeSince: now
          };
          quest.nodes.push(childNode);
          quest.currentNodeId = childNode.id;
          appendTimeline(quest, "follow-up-created", `${node.path} 通过，已解锁 ${childNode.path}。`);
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
      const evaluation = buildReviewEvaluation(answer);
      const durationSeconds = payload.startedAt
        ? Math.max(0, Math.round((new Date(now) - new Date(payload.startedAt)) / 1000))
        : 0;

      node.attempts.push(createAttemptRecord(node, "review", answer, evaluation, now, durationSeconds));
      node.reviewCount = (node.reviewCount || 0) + 1;
      node.lastReviewAt = now;
      node.updatedAt = now;
      appendTimeline(quest, "review-answer", `${node.path} 已完成一次复习回顾。`);
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

    async updateQuestMeta() {
      throw new Error("预览模式暂不支持项目管理，请在桌面版里体验。");
    },

    async setQuestArchived() {
      throw new Error("预览模式暂不支持归档操作，请在桌面版里体验。");
    },

    async duplicateQuest() {
      throw new Error("预览模式暂不支持复制项目，请在桌面版里体验。");
    },

    async deleteQuest() {
      throw new Error("预览模式暂不支持删除项目，请在桌面版里体验。");
    },

    async upsertQuestNode() {
      throw new Error("预览模式暂不支持路线编辑，请在桌面版里体验。");
    },

    async deleteQuestNode() {
      throw new Error("预览模式暂不支持路线编辑，请在桌面版里体验。");
    },

    async moveQuestNode() {
      throw new Error("预览模式暂不支持路线编辑，请在桌面版里体验。");
    },

    async parsePdf() {
      throw new Error("预览模式暂不支持 PDF 导入，请在桌面版里体验。");
    }
  };
}

const dom = {
  body: document.body,
  navButtons: [...document.querySelectorAll(".nav-button")],
  openCreateButtons: [
    ...document.querySelectorAll("[data-open-create], #open-create-modal")
  ],
  viewJumpButtons: [...document.querySelectorAll("[data-view-jump]")],
  closeModalButtons: [...document.querySelectorAll("[data-close-modal]")],
  viewPanes: {
    home: document.querySelector("#home-view"),
    library: document.querySelector("#library-view"),
    learn: document.querySelector("#learn-view"),
    review: document.querySelector("#review-view"),
    leisure: document.querySelector("#leisure-view"),
    stats: document.querySelector("#stats-view"),
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
  sidebarLibrarySection: document.querySelector("#sidebar-library-section"),
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
  libraryStatusFilter: document.querySelector("#library-status-filter"),
  libraryCategoryFilter: document.querySelector("#library-category-filter"),
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
  manageActiveQuestButton: document.querySelector("#manage-active-quest"),
  addRootNodeButton: document.querySelector("#add-root-node"),
  toggleFocusModeButton: document.querySelector("#toggle-focus-mode"),
  focusExitButton: document.querySelector("#focus-exit-button"),
  questionPanel: document.querySelector("#question-panel"),
  questionEmpty: document.querySelector("#question-empty"),
  currentQuestionTag: document.querySelector("#current-question-tag"),
  currentQuestionPath: document.querySelector("#current-question-path"),
  currentQuestionTitle: document.querySelector("#current-question-title"),
  currentQuestionDifficulty: document.querySelector("#current-question-difficulty"),
  currentQuestionGoal: document.querySelector("#current-question-goal"),
  currentQuestionWhy: document.querySelector("#current-question-why"),
  openQuestionHistoryButton: document.querySelector("#open-question-history"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  submitAnswer: document.querySelector("#submit-answer"),
  feedbackVerdict: document.querySelector("#feedback-verdict"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  learnTimelineCard: document.querySelector("#learn-timeline-card"),
  timelineList: document.querySelector("#timeline-list"),
  reviewModeButtons: [...document.querySelectorAll("[data-review-mode]")],
  reviewModeTitle: document.querySelector("#review-mode-title"),
  drawReviewButton: document.querySelector("#draw-review"),
  reviewSummary: document.querySelector("#review-summary"),
  reviewPanel: document.querySelector("#review-panel"),
  reviewRecords: document.querySelector("#review-records"),
  leisureGameSwitcher: document.querySelector("#leisure-game-switcher"),
  leisureSummaryGrid: document.querySelector("#leisure-summary-grid"),
  leisureQuestionShell: document.querySelector("#leisure-question-shell"),
  leisureSidePanel: document.querySelector("#leisure-side-panel"),
  statsTotalDays: document.querySelector("#stats-total-days"),
  statsTotalAnswers: document.querySelector("#stats-total-answers"),
  statsTotalHours: document.querySelector("#stats-total-hours"),
  statsCurrentStreak: document.querySelector("#stats-current-streak"),
  statsHeatmapRange: document.querySelector("#stats-heatmap-range"),
  statsCalendar: document.querySelector("#stats-calendar"),
  statsDayHighlight: document.querySelector("#stats-day-highlight"),
  statsRecentDays: document.querySelector("#stats-recent-days"),
  themeOptions: document.querySelector("#theme-options"),
  settingsForm: document.querySelector("#settings-form"),
  settingsBaseUrl: document.querySelector("#settings-base-url"),
  settingsModel: document.querySelector("#settings-model"),
  settingsApiKey: document.querySelector("#settings-api-key"),
  settingsTemplate: document.querySelector("#settings-template"),
  settingsRootCount: document.querySelector("#settings-root-count"),
  settingsFollowUpOn: document.querySelector("#settings-follow-up-on"),
  settingsFollowUpOff: document.querySelector("#settings-follow-up-off"),
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
  pdfFileInput: document.querySelector("#pdf-file-input"),
  importPdfButton: document.querySelector("#import-pdf-button"),
  clearPdfButton: document.querySelector("#clear-pdf-button"),
  pdfImportSummary: document.querySelector("#pdf-import-summary"),
  topicInput: document.querySelector("#topic-input"),
  materialInput: document.querySelector("#material-input"),
  levelInput: document.querySelector("#level-input"),
  goalInput: document.querySelector("#goal-input"),
  timeboxInput: document.querySelector("#timebox-input"),
  categoryInput: document.querySelector("#category-input"),
  tagsInput: document.querySelector("#tags-input"),
  countInput: document.querySelector("#count-input"),
  templateSelect: document.querySelector("#template-select"),
  createQuestButton: document.querySelector("#create-quest"),
  derivedTopicLabel: document.querySelector("#derived-topic-label"),
  toggleAdvancedButton: document.querySelector("#toggle-advanced"),
  advancedFields: document.querySelector("#advanced-fields"),
  detailModal: document.querySelector("#detail-modal"),
  detailModalCloseButtons: [...document.querySelectorAll("[data-close-detail]")],
  detailModalEyebrow: document.querySelector("#detail-modal-eyebrow"),
  detailModalTitle: document.querySelector("#detail-modal-title"),
  detailModalSubtitle: document.querySelector("#detail-modal-subtitle"),
  detailModalBody: document.querySelector("#detail-modal-body"),
  celebrationLayer: document.querySelector("#celebration-layer"),
  celebrationParticles: document.querySelector("#celebration-particles"),
  celebrationCloseButton: document.querySelector("#celebration-close"),
  celebrationEmoji: document.querySelector("#celebration-emoji"),
  celebrationTitle: document.querySelector("#celebration-title"),
  celebrationSubtitle: document.querySelector("#celebration-subtitle"),
  toastRegion: document.querySelector("#toast-region")
};

const appState = {
  bootstrap: null,
  stats: null,
  selectedStatsDate: "",
  quests: [],
  activeQuestId: null,
  activeQuest: null,
  questDetails: new Map(),
  currentView: "home",
  currentReview: null,
  currentReviewStartedAt: null,
  reviewMode: "random",
  lastEvaluation: null,
  detailModal: {
    type: "",
    questId: "",
    nodeId: "",
    date: ""
  },
  previewMode: !window.studyCoachApi,
  advancedCreateOpen: false,
  celebrationTimer: 0,
  ui: loadUiState(),
  leisure: loadLeisureState(),
  projectSearch: "",
  libraryStatusFilter: "active",
  libraryCategoryFilter: "",
  createDraftDocument: null
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

function formatDifficultyBadge(quest, node) {
  const profile = getLearnerProfile(quest?.level);
  const levelText = profile.tier === "beginner"
    ? "入门"
    : profile.tier === "advanced"
      ? "进阶"
      : "中级";
  return `${levelText} · 难度 ${node?.difficulty || 3}`;
}

function sortQuestSummaries(quests) {
  return [...quests].sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

function normalizeQuestStatus(status) {
  return cleanText(status) === "archived" ? "archived" : "active";
}

function getQuestCategories() {
  return [...new Set(
    appState.quests
      .map((quest) => cleanText(quest.category))
      .filter(Boolean)
  )].sort((left, right) => left.localeCompare(right, "zh-CN"));
}

function matchesQuestSearch(quest, keyword) {
  if (!keyword) {
    return true;
  }
  const searchText = [
    quest.title,
    quest.topic,
    quest.missionBrief,
    quest.category,
    ...(Array.isArray(quest.tags) ? quest.tags : [])
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
  return searchText.includes(keyword);
}

function getVisibleQuestList(options = {}) {
  const {
    includeArchived = false,
    useLibraryFilters = false
  } = options;
  const keyword = cleanText(appState.projectSearch).toLowerCase();
  let quests = [...appState.quests];

  if (!includeArchived) {
    quests = quests.filter((quest) => normalizeQuestStatus(quest.status) !== "archived");
  }

  if (useLibraryFilters) {
    if (appState.libraryStatusFilter === "active") {
      quests = quests.filter((quest) => normalizeQuestStatus(quest.status) !== "archived");
    } else if (appState.libraryStatusFilter === "archived") {
      quests = quests.filter((quest) => normalizeQuestStatus(quest.status) === "archived");
    }
    if (cleanText(appState.libraryCategoryFilter)) {
      quests = quests.filter((quest) => cleanText(quest.category) === appState.libraryCategoryFilter);
    }
  }

  return quests.filter((quest) => matchesQuestSearch(quest, keyword));
}

function formatTagList(tags = []) {
  if (!Array.isArray(tags) || !tags.length) {
    return "";
  }
  return tags.slice(0, 4).map((tag) => `<span class="meta-chip tag-chip">${escapeHtml(tag)}</span>`).join("");
}

function formatQuestCategory(category) {
  return cleanText(category);
}

function formatDateTime(value) {
  if (!value) {
    return "还没有记录";
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
    return { label: "解锁追问", tone: "success" };
  }
  if (verdict === "complete_and_advance" || verdict === "review-locked-in") {
    return { label: "可以过关", tone: "success" };
  }
  return { label: "等待回答", tone: "neutral" };
}

function getScoreTone(score) {
  const numeric = Number(score || 0);
  if (numeric >= 85) {
    return "success";
  }
  if (numeric >= 60) {
    return "warning";
  }
  return "neutral";
}

function getQuestById(questId) {
  if (appState.activeQuest?.id === questId) {
    return appState.activeQuest;
  }
  return appState.questDetails.get(questId) || null;
}

function getNodeById(quest, nodeId) {
  return (quest?.nodes || []).find((node) => node.id === nodeId) || null;
}

function getSortedAttempts(node) {
  return [...(node?.attempts || [])].sort((left, right) => (left.attemptNumber || 0) - (right.attemptNumber || 0));
}

function formatAttemptMode(mode) {
  return mode === "review" ? "复习回答" : "主线回答";
}

function buildAttemptDetailMarkup(attempt) {
  const verdict = getVerdictMeta(attempt.verdict);
  const scoreTone = getScoreTone(attempt.score);
  const strengths = (attempt.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";
  const gaps = (attempt.gaps || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";
  const missing = (attempt.missing || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>暂无</li>";
  return `
    <details class="attempt-card">
      <summary class="attempt-summary">
        <div>
          <h4>用户回答 ${escapeHtml(String(attempt.attemptNumber || 1))}</h4>
          <div class="attempt-meta-row">
            <span class="attempt-meta-chip">${escapeHtml(formatAttemptMode(attempt.mode))}</span>
            <span class="attempt-meta-chip">${escapeHtml(verdict.label)}</span>
            <span class="attempt-meta-chip">${escapeHtml(formatDateTime(attempt.createdAt))}</span>
            <span class="attempt-meta-chip">${escapeHtml(formatDuration(attempt.durationSeconds || 0))}</span>
          </div>
        </div>
        <span class="status-pill ${scoreTone}">${escapeHtml(String(attempt.score ?? "--"))} 分</span>
      </summary>
      <div class="attempt-body">
        <section class="attempt-block">
          <p class="eyebrow">用户原回答</p>
          <pre>${escapeHtml(attempt.answer || "暂无内容")}</pre>
        </section>
        <section class="attempt-block">
          <p class="eyebrow">教练详细解释</p>
          <p>${escapeHtml(attempt.coachReply || "暂无教练解释")}</p>
          ${attempt.hint ? `<p><strong>下一步建议：</strong>${escapeHtml(attempt.hint)}</p>` : ""}
          ${attempt.improve ? `<p><strong>更稳的表达：</strong>${escapeHtml(attempt.improve)}</p>` : ""}
        </section>
        <div class="feedback-grid">
          <section class="feedback-box">
            <h4>这次答对的部分</h4>
            <ul>${strengths}</ul>
          </section>
          <section class="feedback-box">
            <h4>还不够稳的部分</h4>
            <ul>${gaps}</ul>
          </section>
          <section class="feedback-box">
            <h4>还缺的关键点</h4>
            <ul>${missing}</ul>
          </section>
        </div>
      </div>
    </details>
  `;
}

function getNodeAttemptsSummary(node) {
  const attempts = getSortedAttempts(node);
  const latest = attempts.at(-1) || null;
  return {
    attempts,
    latest,
    averageScore: attempts.length
      ? Math.round(
          attempts.reduce((sum, item) => sum + Number(item.score || 0), 0) / attempts.length
        )
      : null
  };
}

function getQuestStatusMeta(summary) {
  if (normalizeQuestStatus(summary?.status) === "archived") {
    return { label: "已归档", tone: "neutral" };
  }
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

function getLeisureQuestionBank(gameKey) {
  return LEISURE_QUESTION_BANK[gameKey] || LEISURE_QUESTION_BANK.poetry;
}

function getLeisureGameState(gameKey = appState.leisure.selectedGame) {
  if (!appState.leisure.games[gameKey]) {
    appState.leisure.games[gameKey] = createDefaultLeisureGameState();
  }
  return appState.leisure.games[gameKey];
}

function pickRandomItem(items = []) {
  if (!items.length) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function formatLeisureAccuracy(correct, answered) {
  if (!answered) {
    return "--";
  }
  return `${Math.round((correct / answered) * 100)}%`;
}

function ensureLeisureQuestion(gameKey = appState.leisure.selectedGame) {
  const bank = getLeisureQuestionBank(gameKey);
  const gameState = getLeisureGameState(gameKey);
  if (!bank.length) {
    return null;
  }

  const normalizedSeenIds = gameState.seenIds.filter((id) => bank.some((question) => question.id === id));
  gameState.seenIds = normalizedSeenIds;

  const hasCurrentQuestion = bank.some((question) => question.id === gameState.currentQuestionId);
  if (!hasCurrentQuestion) {
    if (normalizedSeenIds.length >= bank.length) {
      gameState.seenIds = [];
    }
    const unseenQuestions = bank.filter((question) => !gameState.seenIds.includes(question.id));
    const nextQuestion = pickRandomItem(unseenQuestions.length ? unseenQuestions : bank);
    gameState.currentQuestionId = nextQuestion?.id || bank[0].id;
    gameState.selectedOption = "";
    gameState.answered = false;
    gameState.lastCorrect = null;
    saveLeisureState();
  }

  return bank.find((question) => question.id === gameState.currentQuestionId) || bank[0];
}

function advanceLeisureQuestion(gameKey = appState.leisure.selectedGame) {
  const bank = getLeisureQuestionBank(gameKey);
  const gameState = getLeisureGameState(gameKey);
  if (!bank.length) {
    return;
  }

  let seenIds = gameState.seenIds.filter((id) => bank.some((question) => question.id === id));
  if (seenIds.length >= bank.length) {
    seenIds = [];
  }

  const pool = bank.filter((question) => !seenIds.includes(question.id) && question.id !== gameState.currentQuestionId);
  const fallbackPool = bank.filter((question) => question.id !== gameState.currentQuestionId);
  const nextQuestion = pickRandomItem(pool.length ? pool : (fallbackPool.length ? fallbackPool : bank));

  gameState.seenIds = seenIds;
  gameState.currentQuestionId = nextQuestion?.id || bank[0].id;
  gameState.selectedOption = "";
  gameState.answered = false;
  gameState.lastCorrect = null;
  saveLeisureState();
}

function selectLeisureGame(gameKey) {
  if (!LEISURE_GAME_META[gameKey]) {
    return;
  }
  appState.leisure.selectedGame = gameKey;
  ensureLeisureQuestion(gameKey);
  saveLeisureState();
  renderAll();
}

function selectLeisureOption(optionText) {
  const gameState = getLeisureGameState();
  if (gameState.answered) {
    return;
  }
  gameState.selectedOption = optionText;
  saveLeisureState();
  renderAll();
}

function submitLeisureAnswer() {
  const gameKey = appState.leisure.selectedGame;
  const question = ensureLeisureQuestion(gameKey);
  const gameState = getLeisureGameState(gameKey);
  const totals = appState.leisure.totals;
  if (!question) {
    return;
  }
  if (!gameState.selectedOption) {
    showToast("先选一个答案，再看看自己判断得准不准。", "warning");
    return;
  }
  if (gameState.answered) {
    return;
  }

  const isCorrect = gameState.selectedOption === question.answer;
  const bank = getLeisureQuestionBank(gameKey);
  gameState.answered = true;
  gameState.lastCorrect = isCorrect;
  gameState.lastAnsweredAt = new Date().toISOString();
  if (!gameState.seenIds.includes(question.id)) {
    gameState.seenIds.push(question.id);
  }
  gameState.answeredCount += 1;
  totals.answered += 1;
  playAnswerTone();

  if (isCorrect) {
    gameState.correctCount += 1;
    gameState.currentStreak += 1;
    gameState.bestStreak = Math.max(gameState.bestStreak, gameState.currentStreak);
    totals.correct += 1;
    totals.currentStreak += 1;
    totals.bestStreak = Math.max(totals.bestStreak, totals.currentStreak);
    playPositiveTone();
    showToast("答对了，这一题拿得很稳。");
  } else {
    gameState.currentStreak = 0;
    totals.currentStreak = 0;
    showToast(`这题的正确答案是：${question.answer}`, "warning");
  }

  if (gameState.seenIds.length >= bank.length) {
    gameState.completedRounds += 1;
  }

  saveLeisureState();
  renderAll();
}

function renderLeisureView() {
  const gameKey = appState.leisure.selectedGame;
  const gameMeta = LEISURE_GAME_META[gameKey];
  const question = ensureLeisureQuestion(gameKey);
  const gameState = getLeisureGameState(gameKey);
  const totals = appState.leisure.totals;
  const bank = getLeisureQuestionBank(gameKey);
  const roundProgress = Math.min(gameState.seenIds.length, bank.length);

  dom.leisureGameSwitcher.innerHTML = Object.entries(LEISURE_GAME_META)
    .map(([key, meta]) => {
      const state = getLeisureGameState(key);
      const keyBank = getLeisureQuestionBank(key);
      const progress = keyBank.length ? Math.round((Math.min(state.seenIds.length, keyBank.length) / keyBank.length) * 100) : 0;
      return `
        <button class="leisure-game-button ${key === gameKey ? "active" : ""}" data-leisure-game="${escapeHtml(key)}" type="button">
          <div class="leisure-game-button-head compact-head">
            <span class="tag">
              <i class="fa-solid ${escapeHtml(meta.icon)}"></i>
              ${escapeHtml(meta.shortLabel)}
            </span>
            <span class="status-pill neutral">${Math.min(state.seenIds.length, keyBank.length)}/${keyBank.length}</span>
          </div>
          <strong>${escapeHtml(meta.label)}</strong>
          <div class="project-row-meta">
            <span>正确率 ${formatLeisureAccuracy(state.correctCount || 0, state.answeredCount || 0)}</span>
            <span>最佳连胜 ${state.bestStreak || 0}</span>
          </div>
          <div class="leisure-mini-progress">
            <span style="width:${progress}%"></span>
          </div>
        </button>
      `;
    })
    .join("");

  dom.leisureSummaryGrid.innerHTML = [
    buildInlineStatCard("累计答题", String(totals.answered || 0)),
    buildInlineStatCard("总正确率", formatLeisureAccuracy(totals.correct || 0, totals.answered || 0)),
    buildInlineStatCard("当前连胜", String(totals.currentStreak || 0)),
    buildInlineStatCard("最佳连胜", String(totals.bestStreak || 0))
  ].join("");

  if (!question) {
    dom.leisureQuestionShell.innerHTML = `<div class="empty-inline compact-empty"><strong>题库暂时还没装填完成</strong></div>`;
    dom.leisureSidePanel.innerHTML = "";
    return;
  }

  const feedbackMarkup = gameState.answered
    ? `
      <div class="leisure-feedback ${gameState.lastCorrect ? "success" : "warning"}">
        <div class="project-card-head">
          <strong>${gameState.lastCorrect ? "答对了" : "这题再记一下"}</strong>
          <span class="status-pill ${gameState.lastCorrect ? "success" : "warning"}">${gameState.lastCorrect ? "已拿下" : "继续补强"}</span>
        </div>
        ${
          gameState.lastCorrect
            ? `<p class="muted">${escapeHtml(question.note)}</p>`
            : `<p class="muted">正确答案：${escapeHtml(question.answer)}</p><p class="muted">${escapeHtml(question.note)}</p>`
        }
        <p class="leisure-source">${escapeHtml(question.source)}</p>
      </div>
    `
    : "";

  dom.leisureQuestionShell.innerHTML = `
    <article class="leisure-question-card glass-subpanel">
      <div class="project-card-head">
        <div>
          <p class="eyebrow">${escapeHtml(gameMeta.label)}</p>
          <h3>${escapeHtml(gameMeta.promptLabel)}</h3>
        </div>
        <div class="attempt-meta-row">
          <span class="status-pill neutral">本轮 ${roundProgress}/${bank.length}</span>
          <span class="status-pill neutral">已完成 ${gameState.completedRounds || 0} 轮</span>
        </div>
      </div>
      <p class="leisure-question-prompt">${escapeHtml(question.prompt)}</p>
      <div class="leisure-option-grid">
        ${question.options.map((option) => {
          const isSelected = gameState.selectedOption === option;
          const isCorrectOption = gameState.answered && option === question.answer;
          const isWrongSelected = gameState.answered && isSelected && option !== question.answer;
          return `
            <button
              class="leisure-option ${isSelected ? "active" : ""} ${isCorrectOption ? "correct" : ""} ${isWrongSelected ? "wrong" : ""}"
              data-leisure-option="${escapeHtml(option)}"
              type="button"
            >
              ${escapeHtml(option)}
            </button>
          `;
        }).join("")}
      </div>
      ${feedbackMarkup}
      <div class="form-actions">
        <button id="submit-leisure-answer" class="primary-button" type="button" ${!gameState.selectedOption || gameState.answered ? "disabled" : ""}>
          <i class="fa-solid fa-check"></i>
          <span>提交答案</span>
        </button>
        <button id="next-leisure-question" class="ghost-button" type="button">
          <i class="fa-solid fa-rotate-right"></i>
          <span>${gameState.answered ? "下一题" : "换一题"}</span>
        </button>
      </div>
    </article>
  `;

  dom.leisureSidePanel.innerHTML = `
    <article class="glass-panel rail-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">当前模式</p>
          <h3>${escapeHtml(gameMeta.tipTitle)}</h3>
        </div>
      </div>
      <p class="section-copy">${escapeHtml(gameMeta.tip)}</p>
      <div class="inline-stat-grid">
        ${buildInlineStatCard("本模式答题", String(gameState.answeredCount || 0))}
        ${buildInlineStatCard("本模式正确率", formatLeisureAccuracy(gameState.correctCount || 0, gameState.answeredCount || 0))}
        ${buildInlineStatCard("本模式连胜", String(gameState.currentStreak || 0))}
      </div>
    </article>
    <article class="glass-panel rail-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">题库进度</p>
          <h3>双题库概览</h3>
        </div>
      </div>
      <div class="leisure-progress-list">
        ${Object.entries(LEISURE_GAME_META).map(([key, meta]) => {
          const state = getLeisureGameState(key);
          const keyBank = getLeisureQuestionBank(key);
          const progress = keyBank.length ? Math.round((Math.min(state.seenIds.length, keyBank.length) / keyBank.length) * 100) : 0;
          return `
            <div class="leisure-progress-item ${key === gameKey ? "active" : ""}">
              <div class="project-row-head">
                <strong>${escapeHtml(meta.label)}</strong>
                <span class="muted">${Math.min(state.seenIds.length, keyBank.length)}/${keyBank.length}</span>
              </div>
              <div class="progress-track">
                <span style="width:${progress}%"></span>
              </div>
              <div class="project-row-meta">
                <span>正确率 ${formatLeisureAccuracy(state.correctCount || 0, state.answeredCount || 0)}</span>
                <span>完成轮次 ${state.completedRounds || 0}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </article>
  `;

  dom.leisureGameSwitcher.querySelectorAll("[data-leisure-game]").forEach((button) => {
    button.addEventListener("click", () => {
      selectLeisureGame(button.dataset.leisureGame);
    });
  });

  dom.leisureQuestionShell.querySelectorAll("[data-leisure-option]").forEach((button) => {
    button.addEventListener("click", () => {
      selectLeisureOption(button.dataset.leisureOption);
    });
  });

  dom.leisureQuestionShell.querySelector("#submit-leisure-answer")?.addEventListener("click", submitLeisureAnswer);
  dom.leisureQuestionShell.querySelector("#next-leisure-question")?.addEventListener("click", () => {
    advanceLeisureQuestion();
    renderAll();
  });
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

function closeCelebration() {
  if (appState.celebrationTimer) {
    window.clearTimeout(appState.celebrationTimer);
    appState.celebrationTimer = 0;
  }
  dom.celebrationLayer?.classList.add("hidden");
  dom.celebrationLayer?.setAttribute("aria-hidden", "true");
  if (dom.celebrationParticles) {
    dom.celebrationParticles.innerHTML = "";
  }
}

function burstCelebrationParticles() {
  if (!dom.celebrationParticles) {
    return;
  }
  const colors = ["#7fd7ff", "#f5c36a", "#7ad7a0", "#f6a4d8", "#8fa6ff", "#ffe27a"];
  dom.celebrationParticles.innerHTML = "";
  Array.from({ length: 24 }).forEach((_, index) => {
    const particle = document.createElement("span");
    particle.className = "celebration-particle";
    particle.style.setProperty("--origin-x", `${12 + Math.random() * 76}%`);
    particle.style.setProperty("--drift-x", `${Math.round((Math.random() - 0.5) * 260)}px`);
    particle.style.setProperty("--drift-y", `${120 + Math.round(Math.random() * 140)}px`);
    particle.style.setProperty("--rotate-end", `${Math.round((Math.random() - 0.5) * 540)}deg`);
    particle.style.setProperty("--particle-delay", `${(index % 6) * 0.03}s`);
    particle.style.setProperty("--particle-duration", `${2.2 + Math.random() * 0.7}s`);
    particle.style.background = colors[index % colors.length];
    dom.celebrationParticles.append(particle);
  });
}

function openCelebration({ emoji, title, subtitle }) {
  if (!dom.celebrationLayer) {
    return;
  }
  if (dom.celebrationEmoji) {
    dom.celebrationEmoji.textContent = emoji;
  }
  if (dom.celebrationTitle) {
    dom.celebrationTitle.textContent = title;
  }
  if (dom.celebrationSubtitle) {
    dom.celebrationSubtitle.textContent = subtitle;
  }
  burstCelebrationParticles();
  dom.celebrationLayer.classList.remove("hidden");
  dom.celebrationLayer.setAttribute("aria-hidden", "false");
  if (appState.celebrationTimer) {
    window.clearTimeout(appState.celebrationTimer);
  }
  appState.celebrationTimer = window.setTimeout(() => {
    closeCelebration();
  }, 2800);
}

function buildCelebrationPayload(evaluation, quest, currentNode) {
  const nextNode = getActiveNode(quest);
  if (evaluation?.verdict === "follow_up_required") {
    return {
      emoji: "🎉",
      title: `${currentNode?.path || "这一题"} 已通过`,
      subtitle: nextNode
        ? `已解锁 ${nextNode.path}，继续把这一点讲得更扎实。`
        : "已解锁下一步追问，继续往前。"
    };
  }
  if (evaluation?.verdict === "complete_and_advance") {
    return {
      emoji: "🥳",
      title: `${currentNode?.path || "这一题"} 过关了`,
      subtitle: nextNode
        ? `下一关是 ${nextNode.path}，我们继续前进。`
        : "这一轮主线已经顺利推进。"
    };
  }
  if (evaluation?.verdict === "review-locked-in") {
    return {
      emoji: "✨",
      title: "这次复习锁定了",
      subtitle: "主干已经站稳，后面可以继续去补薄弱点。"
    };
  }
  return null;
}

function playToneSequence(sequence) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  const context = new AudioContextClass();
  const totalDuration = sequence.reduce((maxDuration, tone) => Math.max(maxDuration, tone.at + tone.duration), 0);
  sequence.forEach((tone) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = tone.type || "triangle";
    oscillator.frequency.setValueAtTime(tone.from, context.currentTime + tone.at);
    oscillator.frequency.exponentialRampToValueAtTime(tone.to || tone.from, context.currentTime + tone.at + tone.duration);
    gain.gain.setValueAtTime(0.0001, context.currentTime + tone.at);
    gain.gain.exponentialRampToValueAtTime(tone.volume || 0.12, context.currentTime + tone.at + Math.min(0.03, tone.duration / 2));
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + tone.at + tone.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + tone.at);
    oscillator.stop(context.currentTime + tone.at + tone.duration);
  });
  window.setTimeout(() => {
    void context.close?.().catch?.(() => {});
  }, Math.ceil((totalDuration + 0.05) * 1000));
}

function playAnswerTone() {
  playToneSequence([
    { at: 0, from: 520, to: 640, duration: 0.08, volume: 0.08, type: "sine" },
    { at: 0.08, from: 640, to: 520, duration: 0.06, volume: 0.05, type: "sine" }
  ]);
}

function playPositiveTone() {
  playToneSequence([
    { at: 0, from: 980, to: 1240, duration: 0.06, volume: 0.11, type: "square" },
    { at: 0.055, from: 1240, to: 1480, duration: 0.07, volume: 0.09, type: "triangle" },
    { at: 0.125, from: 1480, to: 1760, duration: 0.09, volume: 0.07, type: "sine" }
  ]);
}

function applyUiState() {
  dom.body.dataset.theme = appState.ui.theme;
  dom.body.dataset.currentView = appState.currentView;
  dom.body.classList.toggle("focus-mode", appState.ui.focusMode && appState.currentView === "learn");
  const background = appState.ui.background || createDefaultBackgroundState();
  dom.body.classList.toggle("has-custom-background", Boolean(background.image));
  dom.body.style.setProperty("--custom-bg-image", background.image ? `url("${background.image}")` : "none");
  dom.body.style.setProperty("--custom-bg-opacity", String(clamp(Number(background.opacity || 0), 0, 100) / 100));
  dom.body.style.setProperty("--custom-bg-position-x", `${clamp(Number(background.positionX || 50), 0, 100)}%`);
  dom.body.style.setProperty("--custom-bg-position-y", `${clamp(Number(background.positionY || 50), 0, 100)}%`);
  dom.toggleFocusModeButton.textContent = appState.ui.focusMode ? "退出沉浸模式" : "沉浸模式";
  if (dom.focusExitButton) {
    dom.focusExitButton.classList.toggle("hidden", !(appState.ui.focusMode && appState.currentView === "learn"));
  }
  if (dom.sidebarLibrarySection) {
    dom.sidebarLibrarySection.classList.toggle("hidden", ["home", "learn", "leisure"].includes(appState.currentView));
  }
  if (dom.learnTimelineCard) {
    dom.learnTimelineCard.classList.toggle("hidden", appState.currentView === "learn");
  }
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

async function loadCustomBackgroundFile(file) {
  if (!file) {
    return;
  }
  if (!String(file.type || "").startsWith("image/")) {
    showToast("请选择图片文件作为背景。", "warning");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    const imageData = typeof reader.result === "string" ? reader.result : "";
    if (!imageData) {
      showToast("背景图片读取失败，请换一张图再试。", "warning");
      return;
    }
    if (appState.previewMode && imageData.length > 1_500_000) {
      appState.ui.background = {
        ...appState.ui.background,
        image: imageData,
        assetPath: "preview-local"
      };
      saveUiState();
      applyUiState();
      renderBackgroundControls();
      showToast("预览模式里大图会先临时显示，正式桌面版会持久保存。", "warning");
      return;
    }
    try {
      if (window.studyCoachApi?.saveBackgroundImage) {
        const background = await window.studyCoachApi.saveBackgroundImage({
          fileName: file.name,
          dataUrl: imageData
        });
        appState.ui.background = {
          ...createDefaultBackgroundState(),
          ...appState.ui.background,
          ...background
        };
        saveUiState();
        applyUiState();
        renderBackgroundControls();
        showToast("背景图片已保存，下次重启也会保留。");
        return;
      }
      appState.ui.background = {
        ...createDefaultBackgroundState(),
        ...appState.ui.background,
        image: imageData,
        assetPath: "preview-local"
      };
      saveUiState();
      applyUiState();
      renderBackgroundControls();
      showToast("已更新自定义背景。");
    } catch (error) {
      showToast(error?.message || "背景图片保存失败，请稍后再试。", "warning");
    }
  });
  reader.readAsDataURL(file);
}

async function loadPdfFile(file) {
  if (!file) {
    return;
  }
  const isPdf = String(file.type || "").includes("pdf") || /\.pdf$/i.test(file.name || "");
  if (!isPdf) {
    showToast("请选择 PDF 文件。", "warning");
    return;
  }
  if (!api.parsePdf) {
    showToast("当前环境暂不支持 PDF 导入。", "warning");
    return;
  }

  const originalMarkup = dom.importPdfButton?.innerHTML || "导入 PDF";
  if (dom.importPdfButton) {
    dom.importPdfButton.innerHTML = `<span>正在解析 PDF...</span>`;
    dom.importPdfButton.disabled = true;
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const document = await api.parsePdf({
      fileName: file.name,
      bytes: Array.from(bytes)
    });
    appState.createDraftDocument = document;
    dom.materialInput.value = cleanText(document.material || "");
    if (!cleanText(dom.topicInput.value)) {
      dom.topicInput.value = cleanText(String(file.name || "").replace(/\.pdf$/i, ""));
    }
    renderPdfImportSummary();
    updateDerivedTopicLabel();
    showToast(`已导入 ${document.name}。`);
  } catch (error) {
    showToast(error?.message || "PDF 解析失败。", "warning");
  } finally {
    if (dom.importPdfButton) {
      dom.importPdfButton.innerHTML = originalMarkup;
      dom.importPdfButton.disabled = false;
    }
  }
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
  renderPdfImportSummary();
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
  dom.settingsApiKey.placeholder = appState.previewMode
    ? "预览模式不会校验真实 key，正式桌面版会使用本地已保存配置"
    : (settings.hasApiKey ? "已保存 key，如需替换再输入新的 key" : "输入后会保存到本地配置中");
  dom.settingsTemplate.value = settings.defaultTemplateKey || "general";
  dom.settingsRootCount.value = clamp(Number(settings.defaultRootQuestionCount || 10), 5, 30);
  if (dom.settingsFollowUpOn && dom.settingsFollowUpOff) {
    dom.settingsFollowUpOn.checked = settings.allowFollowUpQuestions !== false;
    dom.settingsFollowUpOff.checked = settings.allowFollowUpQuestions === false;
  }
  dom.countInput.value = clamp(Number(settings.defaultRootQuestionCount || 10), 5, 30);
  updateDerivedTopicLabel();
  renderPdfImportSummary();
}

function updateDerivedTopicLabel() {
  dom.derivedTopicLabel.textContent = deriveTopicFromMaterial(dom.materialInput.value, dom.topicInput.value);
}

function parseTagsInput(value) {
  return [...new Set(
    cleanText(value)
      .split(/[,\n，、]/)
      .map(cleanText)
      .filter(Boolean)
  )];
}

function renderPdfImportSummary() {
  if (!dom.pdfImportSummary) {
    return;
  }
  const document = appState.createDraftDocument;
  if (!document) {
    dom.pdfImportSummary.className = "pdf-import-summary empty-inline compact-empty";
    dom.pdfImportSummary.innerHTML = `
      <strong>还没有导入 PDF</strong>
      <p class="muted">导入后会自动提取文本，并把压缩后的内容带入建题材料。</p>
    `;
    if (dom.clearPdfButton) {
      dom.clearPdfButton.disabled = true;
    }
    return;
  }
  dom.pdfImportSummary.className = "pdf-import-summary project-card compact-card";
  dom.pdfImportSummary.innerHTML = `
    <div class="project-card-head">
      <div>
        <p class="eyebrow">已导入 PDF</p>
        <h4>${escapeHtml(document.name)}</h4>
      </div>
      <span class="status-pill success">${escapeHtml(String(document.pageCount || 0))} 页</span>
    </div>
    <p class="muted">${escapeHtml(`${document.characterCount || 0} 字符 · ${document.chunks?.length || 0} 个材料片段`)}</p>
    <div class="meta-chip-row">
      ${(document.pages || []).slice(0, 3).map((page) => `<span class="meta-chip">第 ${escapeHtml(String(page.pageNumber))} 页</span>`).join("")}
    </div>
  `;
  if (dom.clearPdfButton) {
    dom.clearPdfButton.disabled = false;
  }
}

function clearDraftDocument({ resetMaterial = false } = {}) {
  appState.createDraftDocument = null;
  if (resetMaterial) {
    dom.materialInput.value = "";
  }
  renderPdfImportSummary();
  updateDerivedTopicLabel();
}

function renderLibraryCategoryOptions() {
  if (!dom.libraryCategoryFilter) {
    return;
  }
  const selectedValue = appState.libraryCategoryFilter;
  const options = [
    `<option value="">全部分类</option>`,
    ...getQuestCategories().map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ];
  const hasSelected = selectedValue && getQuestCategories().includes(selectedValue);
  if (!hasSelected) {
    appState.libraryCategoryFilter = "";
  }
  dom.libraryCategoryFilter.innerHTML = options.join("");
  dom.libraryCategoryFilter.value = hasSelected ? selectedValue : "";
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

async function applyQuestMutationResponse(response, options = {}) {
  hydrateQuestSummaries(response.quests || []);
  if (response.quest) {
    rememberQuestDetail(response.quest);
  }
  if (options.deletedQuestId) {
    appState.questDetails.delete(options.deletedQuestId);
    if (appState.activeQuestId === options.deletedQuestId) {
      appState.activeQuestId = null;
      appState.activeQuest = null;
    }
  }
  await refreshStudyStats();

  const activeStillExists = appState.activeQuestId && appState.quests.some((quest) => quest.id === appState.activeQuestId);
  const nextActiveId = options.focusQuestId
    || response.quest?.id
    || (activeStillExists ? appState.activeQuestId : appState.quests[0]?.id || null);

  if (nextActiveId) {
    await selectQuest(nextActiveId);
    return;
  }

  appState.activeQuestId = null;
  appState.activeQuest = null;
  renderAll();
}

async function selectQuest(questId) {
  appState.activeQuestId = questId;
  appState.lastEvaluation = null;
  appState.currentReview = null;
  appState.currentReviewStartedAt = null;
  appState.activeQuest = await ensureQuestDetail(questId);
  renderAll();
}

function renderPreviewBanner() {
  dom.previewBanner.classList.toggle("hidden", !appState.previewMode);
}

async function refreshStudyStats() {
  if (!api.loadStudyStats) {
    appState.stats = {
      totals: {
        studyDays: 0,
        totalAnswers: 0,
        totalMinutes: 0,
        totalHours: 0,
        completedCount: 0,
        averageScore: null,
        currentStreak: 0,
        bestStreak: 0
      },
      days: []
    };
    return;
  }
  appState.stats = await api.loadStudyStats();
  if (!appState.selectedStatsDate) {
    appState.selectedStatsDate = appState.stats.days.at(-1)?.date || toDateKey(new Date());
  }
}

function closeDetailModal() {
  appState.detailModal = {
    type: "",
    questId: "",
    nodeId: "",
    date: ""
  };
  dom.detailModal.classList.add("hidden");
  dom.detailModal.setAttribute("aria-hidden", "true");
  dom.detailModalBody.innerHTML = "";
}

function openDetailModal({ type, questId = "", nodeId = "", date = "", eyebrow, title, subtitle, body }) {
  appState.detailModal = {
    type,
    questId,
    nodeId,
    date
  };
  dom.detailModalEyebrow.textContent = eyebrow;
  dom.detailModalTitle.textContent = title;
  dom.detailModalSubtitle.textContent = subtitle;
  dom.detailModalBody.innerHTML = body;
  dom.detailModal.classList.remove("hidden");
  dom.detailModal.setAttribute("aria-hidden", "false");
  dom.detailModal.querySelectorAll("[data-close-detail]").forEach((button) => {
    button.addEventListener("click", closeDetailModal);
  });
}

function getStatsDay(date) {
  return (appState.stats?.days || []).find((day) => day.date === date) || null;
}

function buildDayDetailBody(day) {
  const summaryGrid = [
    buildInlineStatCard("答题次数", String(day.answersCount || 0)),
    buildInlineStatCard("覆盖问题", String(day.questionCount || 0)),
    buildInlineStatCard("学习时长", formatDuration(day.totalSeconds || 0)),
    buildInlineStatCard("平均分", day.averageScore == null ? "--" : `${day.averageScore} 分`)
  ].join("");

  const itemsMarkup = day.items.length
    ? day.items
        .map((item) => {
          const verdict = getVerdictMeta(item.verdict);
          return `
            <div class="day-item">
              <div class="detail-section-header">
                <div>
                  <p class="eyebrow">${escapeHtml(item.questTitle)}</p>
                  <h4>${escapeHtml(item.nodePath)} · ${escapeHtml(item.nodeTitle)}</h4>
                </div>
                <span class="status-pill ${getScoreTone(item.score)}">${escapeHtml(String(item.score ?? "--"))} 分</span>
              </div>
              <p class="muted">${escapeHtml(formatAttemptMode(item.mode))} · ${escapeHtml(verdict.label)} · ${escapeHtml(formatDateTime(item.answeredAt))}</p>
              <p>${escapeHtml(item.answerPreview || "暂无回答摘要")}</p>
              <p class="muted">学习时长：${escapeHtml(formatDuration(item.durationSeconds || 0))}</p>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-inline compact-empty"><strong>当天还没有记录</strong></div>`;

  return `
    <section class="detail-section">
      <div class="detail-summary-grid">${summaryGrid}</div>
    </section>
    <section class="detail-section">
      <div class="detail-section-header">
        <div>
          <p class="eyebrow">当天记录</p>
          <h4>回答与复习明细</h4>
        </div>
      </div>
      <div class="detail-list">${itemsMarkup}</div>
    </section>
  `;
}

function openStatsDayModal(date) {
  const day = getStatsDay(date);
  if (!day) {
    showToast("这一天还没有学习记录。", "warning");
    return;
  }
  openDetailModal({
    type: "stats-day",
    date,
    eyebrow: "学习日详情",
    title: `${date} 学习记录`,
    subtitle: `共回答 ${day.answersCount} 次，累计 ${formatDuration(day.totalSeconds || 0)}`,
    body: buildDayDetailBody(day)
  });
}

async function openRoadmapNodeModal(questId, nodeId) {
  const quest = await ensureQuestDetail(questId);
  const node = getNodeById(quest, nodeId);
  if (!node) {
    showToast("没有找到这道题的说明。", "warning");
    return;
  }
  const attempts = getSortedAttempts(node);
  const latestAttempt = attempts.at(-1) || null;
  const childCount = (quest.nodes || []).filter((item) => item.parentId === node.id).length;
  const summaryGrid = [
    buildInlineStatCard("当前状态", node.status === "completed" ? "已通过" : (node.status === "active" ? "进行中" : "待回答")),
    buildInlineStatCard("回答次数", String(attempts.length)),
    buildInlineStatCard("最近得分", latestAttempt?.score == null ? "--" : `${latestAttempt.score} 分`),
    buildInlineStatCard("子节点", String(childCount))
  ].join("");
  const body = `
    <section class="detail-section">
      <div class="detail-summary-grid">${summaryGrid}</div>
    </section>
    <section class="detail-section">
      <div class="detail-section-header">
        <div>
          <p class="eyebrow">题目说明</p>
          <h4>${escapeHtml(node.path)} · ${escapeHtml(node.title)}</h4>
        </div>
      </div>
      <div class="detail-list">
        <div class="day-item">
          <p class="muted">这一关要讲清什么</p>
          <p>${escapeHtml(node.goal || "暂无说明")}</p>
        </div>
        <div class="day-item">
          <p class="muted">为什么重要</p>
          <p>${escapeHtml(node.whyItMatters || "暂无补充说明")}</p>
        </div>
      </div>
    </section>
  `;
  openDetailModal({
    type: "roadmap-node",
    questId,
    nodeId,
    eyebrow: quest.title,
    title: `${node.path} · 题目详情`,
    subtitle: "这里展示这道题的说明、状态和层级信息。",
    body
  });
}

async function openQuestionHistoryModal(questId, nodeId) {
  const quest = await ensureQuestDetail(questId);
  const node = getNodeById(quest, nodeId);
  if (!node) {
    showToast("没有找到这道题的历史记录。", "warning");
    return;
  }
  const summary = getNodeAttemptsSummary(node);
  const body = summary.attempts.length
    ? `
        <section class="detail-section">
          <div class="detail-summary-grid">
            ${buildInlineStatCard("回答次数", String(summary.attempts.length))}
            ${buildInlineStatCard("平均分", summary.averageScore == null ? "--" : `${summary.averageScore} 分`)}
            ${buildInlineStatCard("最近得分", summary.latest?.score == null ? "--" : `${summary.latest.score} 分`)}
            ${buildInlineStatCard("最近时间", summary.latest ? formatDateTime(summary.latest.createdAt) : "--")}
          </div>
        </section>
        <section class="detail-section">
          <div class="detail-section-header">
            <div>
              <p class="eyebrow">逐次回放</p>
              <h4>用户回答与教练解释</h4>
            </div>
          </div>
          <div class="attempt-history-list">${summary.attempts.map(buildAttemptDetailMarkup).join("")}</div>
        </section>
      `
    : `<div class="empty-inline compact-empty"><strong>这道题还没有历史回答</strong></div>`;
  openDetailModal({
    type: "question-history",
    questId,
    nodeId,
    eyebrow: quest.title,
    title: `${node.path} · ${node.title}`,
    subtitle: node.goal || "这里会展示这道题的全部回答和教练解释。",
    body
  });
}

function buildSourceDocumentDetails(documents = []) {
  if (!documents.length) {
    return `<div class="empty-inline compact-empty"><strong>还没有关联材料</strong></div>`;
  }
  return documents.map((document) => `
    <div class="day-item">
      <div class="detail-section-header">
        <div>
          <p class="eyebrow">PDF 材料</p>
          <h4>${escapeHtml(document.name)}</h4>
        </div>
        <span class="status-pill neutral">${escapeHtml(String(document.pageCount || 0))} 页</span>
      </div>
      <p class="muted">${escapeHtml(`${document.characterCount || 0} 字符 · ${document.chunks?.length || 0} 个材料片段`)}</p>
      <div class="meta-chip-row">
        ${(document.pages || []).slice(0, 4).map((page) => `<span class="meta-chip">第 ${escapeHtml(String(page.pageNumber))} 页</span>`).join("")}
      </div>
    </div>
  `).join("");
}

async function openQuestManagerModal(questId) {
  const quest = await ensureQuestDetail(questId);
  const tagsValue = Array.isArray(quest.tags) ? quest.tags.join(", ") : "";
  openDetailModal({
    type: "quest-manage",
    questId,
    eyebrow: "项目管理",
    title: quest.title,
    subtitle: "这里可以改标题、分类、标签，也可以归档、复制或删除项目。",
    body: `
      <form id="quest-manage-form" class="modal-form dense-form">
        <div class="field-grid">
          <label class="field-block">
            <span>项目标题</span>
            <input id="manage-quest-title" type="text" value="${escapeHtml(quest.title)}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>项目主题</span>
            <input id="manage-quest-topic" type="text" value="${escapeHtml(quest.topic || "")}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>当前水平</span>
            <input id="manage-quest-level" type="text" value="${escapeHtml(quest.level || "")}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>时间限制</span>
            <input id="manage-quest-timebox" type="text" value="${escapeHtml(quest.timebox || "")}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>项目分类</span>
            <input id="manage-quest-category" type="text" value="${escapeHtml(quest.category || "")}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>标签</span>
            <input id="manage-quest-tags" type="text" value="${escapeHtml(tagsValue)}" spellcheck="false" />
          </label>
          <label class="field-block full-span">
            <span>学习目标</span>
            <input id="manage-quest-goal" type="text" value="${escapeHtml(quest.goal || "")}" spellcheck="false" />
          </label>
          <label class="field-block full-span">
            <span>项目摘要</span>
            <textarea id="manage-quest-brief" rows="4" spellcheck="false">${escapeHtml(quest.missionBrief || "")}</textarea>
          </label>
        </div>
        <div class="detail-section">
          <div class="detail-section-header">
            <div>
              <p class="eyebrow">已关联材料</p>
              <h4>文档来源</h4>
            </div>
          </div>
          <div class="detail-list">${buildSourceDocumentDetails(quest.sourceDocuments || [])}</div>
        </div>
        <div class="form-actions split-actions">
          <div class="inline-action-group">
            <button id="archive-quest-button" class="ghost-button" type="button">${normalizeQuestStatus(quest.status) === "archived" ? "恢复项目" : "归档项目"}</button>
            <button id="duplicate-quest-button" class="ghost-button" type="button">复制项目</button>
            <button id="delete-quest-button" class="ghost-button danger-ghost" type="button">删除项目</button>
          </div>
          <div class="inline-action-group">
            <button class="ghost-button" data-close-detail type="button">关闭</button>
            <button class="primary-button" type="submit">保存修改</button>
          </div>
        </div>
      </form>
    `
  });

  document.querySelector("#quest-manage-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const response = await api.updateQuestMeta({
        questId,
        title: cleanText(document.querySelector("#manage-quest-title")?.value),
        topic: cleanText(document.querySelector("#manage-quest-topic")?.value),
        level: cleanText(document.querySelector("#manage-quest-level")?.value),
        timebox: cleanText(document.querySelector("#manage-quest-timebox")?.value),
        category: cleanText(document.querySelector("#manage-quest-category")?.value),
        tags: parseTagsInput(document.querySelector("#manage-quest-tags")?.value),
        goal: cleanText(document.querySelector("#manage-quest-goal")?.value),
        missionBrief: cleanText(document.querySelector("#manage-quest-brief")?.value)
      });
      closeDetailModal();
      await applyQuestMutationResponse(response, { focusQuestId: questId });
      showToast("项目信息已更新。");
    } catch (error) {
      showToast(error?.message || "保存项目信息失败。", "warning");
    }
  });

  document.querySelector("#archive-quest-button")?.addEventListener("click", async () => {
    try {
      const nextArchived = normalizeQuestStatus(quest.status) !== "archived";
      const response = await api.setQuestArchived({
        questId,
        archived: nextArchived
      });
      closeDetailModal();
      await applyQuestMutationResponse(response, { focusQuestId: questId });
      showToast(nextArchived ? "项目已归档。" : "项目已恢复。");
    } catch (error) {
      showToast(error?.message || "归档操作失败。", "warning");
    }
  });

  document.querySelector("#duplicate-quest-button")?.addEventListener("click", async () => {
    try {
      const response = await api.duplicateQuest({ questId });
      closeDetailModal();
      await applyQuestMutationResponse(response, { focusQuestId: response.quest?.id });
      showToast(`已复制项目：${response.quest?.title || "副本"}`);
    } catch (error) {
      showToast(error?.message || "复制项目失败。", "warning");
    }
  });

  document.querySelector("#delete-quest-button")?.addEventListener("click", async () => {
    if (!window.confirm(`确认删除「${quest.title}」吗？这会移除整条路线和答题记录。`)) {
      return;
    }
    try {
      const response = await api.deleteQuest({ questId });
      closeDetailModal();
      await applyQuestMutationResponse(response, { deletedQuestId: questId });
      showToast("项目已删除。");
    } catch (error) {
      showToast(error?.message || "删除项目失败。", "warning");
    }
  });
}

async function openNodeEditorModal(config = {}) {
  const quest = await ensureQuestDetail(config.questId);
  const existingNode = config.nodeId ? getNodeById(quest, config.nodeId) : null;
  const title = existingNode?.title || "";
  const goal = existingNode?.goal || "";
  const whyItMatters = existingNode?.whyItMatters || "";
  const difficulty = existingNode?.difficulty || 3;
  const isEditing = Boolean(existingNode);

  openDetailModal({
    type: "node-editor",
    questId: quest.id,
    nodeId: existingNode?.id || "",
    eyebrow: quest.title,
    title: isEditing ? `${existingNode.path} · 编辑节点` : "新增路线节点",
    subtitle: isEditing ? "修改题目、目标和提示语。" : "可以新增主线题，也可以在某个节点后面继续补题。",
    body: `
      <form id="node-editor-form" class="modal-form dense-form">
        <div class="field-grid">
          <label class="field-block full-span">
            <span>题目标题</span>
            <input id="node-editor-title" type="text" value="${escapeHtml(title)}" spellcheck="false" />
          </label>
          <label class="field-block">
            <span>难度</span>
            <input id="node-editor-difficulty" type="number" min="1" max="5" value="${escapeHtml(String(difficulty))}" />
          </label>
          <label class="field-block full-span">
            <span>这一关要讲清什么</span>
            <input id="node-editor-goal" type="text" value="${escapeHtml(goal)}" spellcheck="false" />
          </label>
          <label class="field-block full-span">
            <span>为什么重要</span>
            <textarea id="node-editor-why" rows="4" spellcheck="false">${escapeHtml(whyItMatters)}</textarea>
          </label>
        </div>
        <div class="form-actions split-actions">
          <div class="inline-action-group">
            ${isEditing ? `<button id="delete-node-button" class="ghost-button danger-ghost" type="button">删除节点</button>` : ""}
          </div>
          <div class="inline-action-group">
            <button class="ghost-button" data-close-detail type="button">关闭</button>
            <button class="primary-button" type="submit">${isEditing ? "保存节点" : "新增节点"}</button>
          </div>
        </div>
      </form>
    `
  });

  document.querySelector("#node-editor-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const response = await api.upsertQuestNode({
        questId: quest.id,
        nodeId: existingNode?.id || "",
        parentId: config.parentId || existingNode?.parentId || "",
        insertAfterId: config.insertAfterId || "",
        title: cleanText(document.querySelector("#node-editor-title")?.value),
        goal: cleanText(document.querySelector("#node-editor-goal")?.value),
        whyItMatters: cleanText(document.querySelector("#node-editor-why")?.value),
        difficulty: clamp(Number(document.querySelector("#node-editor-difficulty")?.value || difficulty), 1, 5)
      });
      closeDetailModal();
      await applyQuestMutationResponse(response, { focusQuestId: quest.id });
      switchView("learn");
      renderAll();
      showToast(isEditing ? "节点已更新。" : "已新增路线节点。");
    } catch (error) {
      showToast(error?.message || "保存节点失败。", "warning");
    }
  });

  document.querySelector("#delete-node-button")?.addEventListener("click", async () => {
    if (!existingNode) {
      return;
    }
    if (!window.confirm(`确认删除 ${existingNode.path} 吗？它下面的子题也会一起移除。`)) {
      return;
    }
    try {
      const response = await api.deleteQuestNode({
        questId: quest.id,
        nodeId: existingNode.id
      });
      closeDetailModal();
      await applyQuestMutationResponse(response, { focusQuestId: quest.id });
      switchView("learn");
      renderAll();
      showToast("节点已删除。");
    } catch (error) {
      showToast(error?.message || "删除节点失败。", "warning");
    }
  });
}

function clearCurrentReview() {
  appState.currentReview = null;
  appState.currentReviewStartedAt = null;
  renderAll();
}

function renderHeaderAndSidebar() {
  const settings = appState.bootstrap?.settings;
  const hasApiKey = Boolean(settings?.hasApiKey);
  dom.apiStatusPill.textContent = appState.previewMode ? "预览模式" : (hasApiKey ? "接口已就绪" : "接口待配置");
  dom.apiStatusPill.className = `status-pill ${appState.previewMode ? "neutral" : (hasApiKey ? "success" : "neutral")}`;
  dom.settingsApiHint.textContent = appState.previewMode ? "预览模式" : (hasApiKey ? "已保存 key" : "待配置");
  dom.settingsApiHint.className = `status-pill ${appState.previewMode ? "neutral" : (hasApiKey ? "success" : "neutral")}`;
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

  const visibleQuests = getVisibleQuestList({ includeArchived: false });
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
  const chips = [
    formatQuestCategory(summary.category) ? `<span class="meta-chip">${escapeHtml(summary.category)}</span>` : "",
    formatTagList(summary.tags),
    Number(summary.sourceDocumentCount || 0) > 0 ? `<span class="meta-chip">${escapeHtml(String(summary.sourceDocumentCount))} 份材料</span>` : ""
  ].filter(Boolean).join("");
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
      ${chips ? `<div class="meta-chip-row">${chips}</div>` : ""}
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
        <button class="ghost-button" data-manage-quest="${escapeHtml(summary.id)}" type="button">
          ${compact ? "管理" : "管理项目"}
        </button>
      </div>
    </article>
  `;
}

function projectRowMarkup(summary, { active = false } = {}) {
  const status = getQuestStatusMeta(summary);
  const progress = getQuestProgressPercent(summary);
  const chips = [
    formatQuestCategory(summary.category) ? `<span>${escapeHtml(summary.category)}</span>` : "",
    Number(summary.sourceDocumentCount || 0) > 0 ? `<span>${escapeHtml(String(summary.sourceDocumentCount))} 份材料</span>` : ""
  ].filter(Boolean).join("");
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
          ${chips}
          <span>${formatDateTime(summary.updatedAt)}</span>
        </div>
      </button>
      <div class="project-row-actions">
        <button class="ghost-button" data-continue-quest="${escapeHtml(summary.id)}" type="button">继续</button>
        <button class="ghost-button" data-review-scope="${escapeHtml(summary.id)}" type="button">复习</button>
        <button class="ghost-button" data-manage-quest="${escapeHtml(summary.id)}" type="button">管理</button>
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

  container.querySelectorAll("[data-manage-quest]").forEach((button) => {
    button.addEventListener("click", async () => {
      await openQuestManagerModal(button.dataset.manageQuest);
    });
  });
}

function renderHomeView() {
  const activeQuests = getVisibleQuestList({ includeArchived: false });
  const totalProjects = activeQuests.length;
  const totalRoots = activeQuests.reduce((sum, quest) => sum + Number(quest.stats.totalRoots || 0), 0);
  const completedRoots = activeQuests.reduce((sum, quest) => sum + Number(quest.stats.completedRoots || 0), 0);
  const reviewable = activeQuests.reduce((sum, quest) => sum + Number(quest.stats.completedNodes || 0), 0);
  const latestUpdated = activeQuests[0]?.updatedAt || null;
  const focusQuestSummary = appState.activeQuest || appState.questDetails.get(activeQuests[0]?.id) || activeQuests[0] || null;

  dom.homeStatProjects.textContent = String(totalProjects);
  dom.homeStatRoots.textContent = `${completedRoots} / ${totalRoots}`;
  dom.homeStatReviewable.textContent = String(reviewable);
  dom.homeStatUpdated.textContent = formatDateTime(latestUpdated);

  if (!activeQuests.length) {
    dom.homeProjectList.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无项目</strong><button class="ghost-button" data-open-create type="button">新建项目</button></div>`;
    dom.homeProjectList.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", openCreateModal));
  } else {
    dom.homeProjectList.innerHTML = activeQuests
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
    `;
    wireProjectActions(dom.homeFocusCard);
  }

  const reviewSuggestions = activeQuests
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
              <button class="ghost-button" data-select-quest="${escapeHtml(quest.id)}" type="button">查看</button>
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
  const visibleQuests = getVisibleQuestList({
    includeArchived: true,
    useLibraryFilters: true
  });
  renderLibraryCategoryOptions();
  if (dom.libraryStatusFilter) {
    dom.libraryStatusFilter.value = appState.libraryStatusFilter;
  }
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
          <span class="status-pill ${getQuestStatusMeta(quest).tone}">${escapeHtml(getQuestStatusMeta(quest).label)}</span>
        </div>
        <p class="muted">${escapeHtml(quest.missionBrief || quest.launchNote || "暂无摘要")}</p>
        <div class="meta-chip-row">${chips}${formatQuestCategory(quest.category) ? `<span class="meta-chip">${escapeHtml(quest.category)}</span>` : ""}${formatTagList(quest.tags)}${Number(quest.sourceDocuments?.length || 0) > 0 ? `<span class="meta-chip">${escapeHtml(String(quest.sourceDocuments.length))} 份材料</span>` : ""}</div>
        <div class="inline-stat-grid">
          ${buildInlineStatCard("总节点", `${quest.stats.completedNodes}/${quest.stats.totalNodes}`)}
          ${buildInlineStatCard("可复习", String(quest.nodes.filter((node) => node.status === "completed").length))}
          ${buildInlineStatCard("最近更新", formatDateTime(quest.updatedAt))}
        </div>
        <div class="project-actions">
          <button class="primary-button" data-continue-quest="${escapeHtml(quest.id)}" type="button">进入闯关页</button>
          <button class="ghost-button" data-review-scope="${escapeHtml(quest.id)}" type="button">当前项目复习</button>
          <button class="ghost-button" data-manage-quest="${escapeHtml(quest.id)}" type="button">管理项目</button>
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
    dom.roadmapTree.innerHTML = `<div class="empty-inline"><p class="muted">创建项目后，这里会按顺序展开全部问题。</p></div>`;
    return;
  }

  const sortedNodes = sortNodes(quest.nodes || []);
  const nodeById = new Map(sortedNodes.map((node) => [node.id, node]));
  const childrenByParent = new Map();
  sortedNodes.forEach((node) => {
    const parentKey = node.parentId && nodeById.has(node.parentId) ? node.parentId : "__root__";
    if (!childrenByParent.has(parentKey)) {
      childrenByParent.set(parentKey, []);
    }
    childrenByParent.get(parentKey).push(node);
  });

  const activeNode = getActiveNode(quest);
  const activeNodeId = activeNode?.id || "";
  const expandedNodeIds = new Set();
  let cursor = activeNode || null;
  while (cursor) {
    expandedNodeIds.add(cursor.id);
    cursor = cursor.parentId ? (nodeById.get(cursor.parentId) || null) : null;
  }

  const buildRoadmapNode = (node) => {
    const attempts = getSortedAttempts(node);
    const latestAttempt = attempts.at(-1) || null;
    const scoreText = latestAttempt?.score == null ? "未评分" : `${latestAttempt.score} 分`;
    const attemptText = attempts.length ? `已回答 ${attempts.length} 次` : "还没有回答";
    const lineText = `${node.path} · ${node.title}`;
    const statusLabel = node.status === "completed" ? "已通过" : (node.status === "active" ? "进行中" : "待回答");
    const nodeTone = latestAttempt ? getScoreTone(latestAttempt.score) : "neutral";
    const children = childrenByParent.get(node.id) || [];
    const hasChildren = children.length > 0;
    const siblingGroup = childrenByParent.get(node.parentId || "__root__") || [];
    const canMoveUp = Number(node.sortOrder || 1) > 1;
    const canMoveDown = Number(node.sortOrder || 1) < siblingGroup.length;
    const details = document.createElement("details");
    details.className = `roadmap-node ${node.status} ${node.parentId ? "child" : "root"} ${node.id === activeNodeId ? "current-node" : ""}`;
    details.open = expandedNodeIds.has(node.id);
    details.innerHTML = `
      <summary class="roadmap-line">
        <span class="roadmap-bullet ${node.status}" aria-hidden="true"></span>
        <span class="roadmap-line-copy">
          <span class="roadmap-line-text">${escapeHtml(lineText)}</span>
        </span>
        <i class="fa-solid ${hasChildren ? "fa-chevron-down" : "fa-minus"} roadmap-chevron ${hasChildren ? "" : "leaf"}" aria-hidden="true"></i>
      </summary>
      <div class="roadmap-detail">
        <div class="roadmap-detail-meta">
          <span class="attempt-meta-chip">${escapeHtml(attemptText)}</span>
          <span class="attempt-meta-chip">${escapeHtml(scoreText)}</span>
          <span class="status-pill ${escapeHtml(nodeTone)}">${escapeHtml(statusLabel)}</span>
        </div>
        <div class="roadmap-detail-actions">
          <button class="ghost-button" data-roadmap-detail="${escapeHtml(node.id)}" type="button">查看详情</button>
          <button class="ghost-button" data-roadmap-edit="${escapeHtml(node.id)}" type="button">编辑</button>
          <button class="ghost-button" data-roadmap-add-after="${escapeHtml(node.id)}" type="button">新增同级</button>
          <button class="ghost-button" data-roadmap-add-child="${escapeHtml(node.id)}" type="button">新增子题</button>
          <button class="ghost-button" data-roadmap-move="${escapeHtml(node.id)}:up" type="button" ${canMoveUp ? "" : "disabled"}>上移</button>
          <button class="ghost-button" data-roadmap-move="${escapeHtml(node.id)}:down" type="button" ${canMoveDown ? "" : "disabled"}>下移</button>
          <button class="ghost-button danger-ghost" data-roadmap-delete="${escapeHtml(node.id)}" type="button">删除</button>
          ${
            attempts.length
              ? `<button class="ghost-button" data-roadmap-history="${escapeHtml(node.id)}" type="button">查看过往回答</button>`
              : `<span class="muted roadmap-detail-hint">还没有历史回答</span>`
          }
          ${
            node.id === activeNodeId
              ? `<button class="primary-button" data-roadmap-focus="${escapeHtml(node.id)}" type="button">前往当前问题</button>`
              : ""
          }
        </div>
        <div class="roadmap-children"></div>
      </div>
    `;
    const childrenContainer = details.querySelector(".roadmap-children");
    if (hasChildren) {
      children.forEach((child) => {
        childrenContainer.append(buildRoadmapNode(child));
      });
    } else {
      childrenContainer.remove();
    }
    return details;
  };

  const rootNodes = childrenByParent.get("__root__") || [];
  rootNodes.forEach((node) => {
    dom.roadmapTree.append(buildRoadmapNode(node));
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void openRoadmapNodeModal(quest.id, button.dataset.roadmapDetail);
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-history]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void openQuestionHistoryModal(quest.id, button.dataset.roadmapHistory);
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-focus]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      dom.answerInput.focus();
      dom.answerInput.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-edit]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void openNodeEditorModal({
        questId: quest.id,
        nodeId: button.dataset.roadmapEdit
      });
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-add-after]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const sourceNode = getNodeById(quest, button.dataset.roadmapAddAfter);
      void openNodeEditorModal({
        questId: quest.id,
        parentId: sourceNode?.parentId || "",
        insertAfterId: sourceNode?.id || ""
      });
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-add-child]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void openNodeEditorModal({
        questId: quest.id,
        parentId: button.dataset.roadmapAddChild
      });
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-move]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const [nodeId, direction] = String(button.dataset.roadmapMove || "").split(":");
      try {
        const response = await api.moveQuestNode({
          questId: quest.id,
          nodeId,
          direction
        });
        await applyQuestMutationResponse(response, { focusQuestId: quest.id });
        switchView("learn");
        renderAll();
      } catch (error) {
        showToast(error?.message || "节点移动失败。", "warning");
      }
    });
  });

  dom.roadmapTree.querySelectorAll("[data-roadmap-delete]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const targetNode = getNodeById(quest, button.dataset.roadmapDelete);
      if (!targetNode) {
        return;
      }
      if (!window.confirm(`确认删除 ${targetNode.path} 吗？它下面的子题也会一起移除。`)) {
        return;
      }
      try {
        const response = await api.deleteQuestNode({
          questId: quest.id,
          nodeId: targetNode.id
        });
        await applyQuestMutationResponse(response, { focusQuestId: quest.id });
        switchView("learn");
        renderAll();
        showToast("节点已删除。");
      } catch (error) {
        showToast(error?.message || "删除节点失败。", "warning");
      }
    });
  });
}

function getLatestAttemptNode(quest) {
  if (!quest) {
    return null;
  }
  return (quest.nodes || [])
    .map((node) => ({
      node,
      latestAttempt: getLatestAttempt(node)
    }))
    .filter((item) => item.latestAttempt)
    .sort((left, right) => new Date(right.latestAttempt.createdAt) - new Date(left.latestAttempt.createdAt))[0]?.node || null;
}

function renderFeedback(quest) {
  const focusNode = getLatestAttemptNode(quest);
  if (!focusNode) {
    dom.feedbackVerdict.textContent = "等待回答";
    dom.feedbackVerdict.className = "status-pill neutral";
    dom.feedbackPanel.innerHTML = `
      <div class="empty-inline">
        <p class="muted">你每次作答后，这里都会按“用户回答 1 / 2 / 3 ...”保存完整记录，包括评分、教练解释、缺口和下一步建议。</p>
      </div>
    `;
    return;
  }

  const summary = getNodeAttemptsSummary(focusNode);
  const latestAttempt = summary.latest;
  const meta = getVerdictMeta(latestAttempt.verdict);
  dom.feedbackVerdict.textContent = meta.label;
  dom.feedbackVerdict.className = `status-pill ${meta.tone}`;

  dom.feedbackPanel.innerHTML = `
    <div class="feedback-header">
      <div>
        <p class="eyebrow">最近反馈来自 ${escapeHtml(focusNode.path)}</p>
        <h4>${escapeHtml(focusNode.title)}</h4>
        <p class="muted">${escapeHtml(focusNode.goal || "这里会显示这道题最近一次作答后的完整反馈。")}</p>
      </div>
      <div class="score-chip">
        <small>最近得分</small>
        <span>${escapeHtml(String(latestAttempt.score ?? "--"))} / 100</span>
      </div>
    </div>
    <p class="feedback-note">${escapeHtml(latestAttempt.coachReply || "已保存最近一次反馈。")}</p>
    ${latestAttempt.hint ? `<p class="feedback-note"><strong>下一步建议：</strong>${escapeHtml(latestAttempt.hint)}</p>` : ""}
    <div class="attempt-history-list">
      ${summary.attempts.map(buildAttemptDetailMarkup).join("")}
    </div>
    <div class="form-actions">
      <button class="ghost-button" data-open-node-history="${escapeHtml(focusNode.id)}" type="button">
        <i class="fa-solid fa-book-open"></i>
        <span>详细查看这道题的全部记录</span>
      </button>
    </div>
  `;
  dom.feedbackPanel.querySelector("[data-open-node-history]")?.addEventListener("click", () => {
    void openQuestionHistoryModal(quest.id, focusNode.id);
  });
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
    dom.openQuestionHistoryButton.disabled = true;
    if (dom.manageActiveQuestButton) {
      dom.manageActiveQuestButton.disabled = true;
    }
    if (dom.addRootNodeButton) {
      dom.addRootNodeButton.disabled = true;
    }
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
    quest.category ? `项目分类：${quest.category}` : null,
    Number(quest.sourceDocuments?.length || 0) > 0 ? `已关联 ${quest.sourceDocuments.length} 份材料` : null,
    `训练模式：${getTemplateLabel(quest.templateKey)}`
  ]
    .filter(Boolean)
    .map((item) => `<span class="meta-chip">${escapeHtml(item)}</span>`)
    .join("");
  dom.learnMetaChips.innerHTML = metaChips;
  if (dom.manageActiveQuestButton) {
    dom.manageActiveQuestButton.disabled = false;
  }
  if (dom.addRootNodeButton) {
    dom.addRootNodeButton.disabled = false;
  }

  renderRoadmap(quest);
  renderFeedback(quest);
  renderTimeline(quest);

  if (!activeNode) {
    dom.openQuestionHistoryButton.disabled = true;
    dom.questionPanel.classList.add("hidden");
    dom.questionEmpty.classList.remove("hidden");
    return;
  }

  dom.questionPanel.classList.remove("hidden");
  dom.questionEmpty.classList.add("hidden");
  dom.openQuestionHistoryButton.disabled = false;
  dom.currentQuestionTag.textContent = activeNode.source === "follow-up" ? "追问问题" : "主线关卡";
  dom.currentQuestionTag.className = `status-pill ${activeNode.source === "follow-up" ? "warning" : "neutral"}`;
  dom.currentQuestionPath.textContent = activeNode.path;
  dom.currentQuestionTitle.textContent = activeNode.title;
  dom.currentQuestionDifficulty.textContent = formatDifficultyBadge(quest, activeNode);
  dom.currentQuestionGoal.textContent = activeNode.goal || "继续把主干、应用和边界条件讲具体。";
  dom.currentQuestionWhy.textContent = activeNode.whyItMatters || "这道题的提示会显示在这里。";
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
      : appState.quests.filter((quest) => normalizeQuestStatus(quest.status) !== "archived");

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
  appState.currentReviewStartedAt = null;
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
  appState.currentReviewStartedAt = new Date().toISOString();
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
  const reviewableCount = appState.quests
    .filter((quest) => normalizeQuestStatus(quest.status) !== "archived")
    .reduce((sum, quest) => sum + Number(quest.stats.completedNodes || 0), 0);
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
          <div class="attempt-meta-row">
            <span class="status-pill warning">${escapeHtml(REVIEW_MODE_META[review.mode].label)}</span>
            <button id="close-review-card" class="icon-btn" type="button" title="关闭这张卡片">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
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
    document.querySelector("#submit-review")?.addEventListener("click", submitReviewAnswer);
    document.querySelector("#close-review-card")?.addEventListener("click", clearCurrentReview);
  }

  renderReviewRecords();
}

function renderStatsView() {
  const totals = appState.stats?.totals || {
    studyDays: 0,
    totalAnswers: 0,
    totalHours: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageScore: null
  };
  const days = appState.stats?.days || [];
  const selectedDay = getStatsDay(appState.selectedStatsDate) || days.at(-1) || null;

  dom.statsTotalDays.textContent = String(totals.studyDays || 0);
  dom.statsTotalAnswers.textContent = String(totals.totalAnswers || 0);
  dom.statsTotalHours.textContent = `${totals.totalHours || 0} h`;
  dom.statsCurrentStreak.textContent = String(totals.currentStreak || 0);

  if (!days.length) {
    dom.statsHeatmapRange.textContent = "暂无数据";
    dom.statsCalendar.innerHTML = `<div class="empty-inline compact-empty"><strong>还没有学习热力图</strong><p class="muted">先完成几道题，这里会自动按日历方式累计学习轨迹。</p></div>`;
    dom.statsDayHighlight.innerHTML = `<div class="empty-inline compact-empty"><strong>今天还没有记录</strong></div>`;
    dom.statsRecentDays.innerHTML = `<div class="empty-inline compact-empty"><strong>暂无学习日</strong></div>`;
    return;
  }

  const latestDate = days.at(-1).date;
  const earliestDate = days[0].date;
  dom.statsHeatmapRange.textContent = `${earliestDate} 至 ${latestDate}`;

  const dayMap = new Map(days.map((day) => [day.date, day]));
  const maxSeconds = Math.max(...days.map((day) => day.totalSeconds || 0), 1);
  const endDate = new Date();
  const startDate = addDays(startOfWeek(endDate), -77);
  const weekdayLabels = ["一", "", "三", "", "五", "", "日"];
  const cells = [];
  for (let offset = 0; offset < 84; offset += 1) {
    const date = addDays(startDate, offset);
    const dateKey = toDateKey(date);
    const day = dayMap.get(dateKey) || null;
    const ratio = day ? (day.totalSeconds || 0) / maxSeconds : 0;
    const level = !day ? 0 : (ratio >= 0.8 ? 4 : ratio >= 0.55 ? 3 : ratio >= 0.3 ? 2 : 1);
    const isToday = dateKey === toDateKey(new Date());
    const isActive = selectedDay?.date === dateKey;
    cells.push(`
      <button
        class="stats-day-cell level-${level} ${isToday ? "today" : ""} ${isActive ? "active" : ""}"
        data-stats-date="${dateKey}"
        type="button"
        title="${dateKey}${day ? ` · ${day.answersCount} 次回答 · ${formatDuration(day.totalSeconds || 0)}` : " · 暂无记录"}"
      ></button>
    `);
  }

  dom.statsCalendar.innerHTML = `
    <div class="stats-calendar-shell">
      <div class="stats-weekday-column">
        ${weekdayLabels.map((label) => `<span>${label}</span>`).join("")}
      </div>
      <div class="stats-day-grid">${cells.join("")}</div>
    </div>
  `;
  dom.statsCalendar.querySelectorAll("[data-stats-date]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedStatsDate = button.dataset.statsDate;
      renderStatsView();
      if (dayMap.has(button.dataset.statsDate)) {
        openStatsDayModal(button.dataset.statsDate);
      }
    });
  });

  if (!selectedDay) {
    dom.statsDayHighlight.innerHTML = `<div class="empty-inline compact-empty"><strong>还没有选中的学习日</strong></div>`;
  } else {
    dom.statsDayHighlight.innerHTML = `
      <div class="project-card active day-summary-card">
        <div class="project-card-head">
          <div>
            <p class="eyebrow">选中日期</p>
            <h4>${escapeHtml(selectedDay.date)}</h4>
          </div>
          <span class="status-pill ${getScoreTone(selectedDay.averageScore || 0)}">${escapeHtml(selectedDay.averageScore == null ? "--" : `${selectedDay.averageScore} 分`)}</span>
        </div>
        <div class="inline-stat-grid">
          ${buildInlineStatCard("答题次数", String(selectedDay.answersCount || 0))}
          ${buildInlineStatCard("学习时长", formatDuration(selectedDay.totalSeconds || 0))}
          ${buildInlineStatCard("完成节点", String(selectedDay.completedCount || 0))}
        </div>
        <div class="project-actions">
          <button class="primary-button" data-open-stats-day="${escapeHtml(selectedDay.date)}" type="button">详细查看</button>
        </div>
      </div>
    `;
    dom.statsDayHighlight.querySelector("[data-open-stats-day]")?.addEventListener("click", () => {
      openStatsDayModal(selectedDay.date);
    });
  }

  dom.statsRecentDays.innerHTML = days
    .slice(-8)
    .reverse()
    .map((day) => `
      <button class="sidebar-project-item ${selectedDay?.date === day.date ? "active" : ""}" data-stats-day-row="${escapeHtml(day.date)}" type="button">
        <div>
          <strong>${escapeHtml(day.date)}</strong>
          <span>${escapeHtml(formatDuration(day.totalSeconds || 0))} · ${escapeHtml(String(day.answersCount || 0))} 次回答</span>
        </div>
        <em class="${getScoreTone(day.averageScore || 0)}">${escapeHtml(day.averageScore == null ? "--" : `${day.averageScore} 分`)}</em>
      </button>
    `)
    .join("");
  dom.statsRecentDays.querySelectorAll("[data-stats-day-row]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedStatsDate = button.dataset.statsDayRow;
      renderStatsView();
      openStatsDayModal(button.dataset.statsDayRow);
    });
  });
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
  renderLeisureView();
  renderStatsView();
  renderSettingsView();
  switchView(appState.currentView);
}

async function bootstrap() {
  if (window.studyCoachApi?.loadUiPrefs) {
    try {
      const persistedUi = await window.studyCoachApi.loadUiPrefs();
      appState.ui = {
        ...createDefaultUiState(),
        ...persistedUi,
        background: {
          ...createDefaultBackgroundState(),
          ...(persistedUi?.background || {})
        }
      };
    } catch (_error) {
      appState.ui = loadUiState();
    }
  }
  appState.bootstrap = await api.loadBootstrap();
  hydrateQuestSummaries(appState.bootstrap.quests || []);
  await refreshStudyStats();
  syncFormsFromSettings();
  renderPreviewBanner();
  applyUiState();
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
    category: cleanText(dom.categoryInput.value),
    tags: parseTagsInput(dom.tagsInput.value),
    sourceDocuments: appState.createDraftDocument ? [appState.createDraftDocument] : [],
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
    await refreshStudyStats();
    appState.activeQuestId = response.quest.id;
    appState.activeQuest = response.quest;
    appState.lastEvaluation = null;
    appState.currentReview = null;
    appState.currentReviewStartedAt = null;
    dom.questForm.reset();
    clearDraftDocument();
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
    playAnswerTone();
    const response = await api.answerQuestion({
      questId: appState.activeQuest.id,
      nodeId: activeNode.id,
      answer
    });
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    await refreshStudyStats();
    appState.lastEvaluation = response.evaluation;
    appState.currentReview = null;
    appState.currentReviewStartedAt = null;
    dom.answerInput.value = "";
    renderAll();
    if (response.evaluation.verdict !== "retry_same_question") {
      playPositiveTone();
      const celebration = buildCelebrationPayload(response.evaluation, response.quest, activeNode);
      if (celebration) {
        openCelebration(celebration);
      }
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
    appState.currentReviewStartedAt = null;
    renderAll();
    showToast(REVIEW_MODE_META[appState.reviewMode].emptyMessage, "warning");
    return;
  }
  appState.currentReview = {
    ...picked,
    mode: appState.reviewMode
  };
  appState.currentReviewStartedAt = new Date().toISOString();
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

  try {
    const currentReview = appState.currentReview;
    const response = await api.answerReviewQuestion({
      questId: currentReview.questId,
      nodeId: currentReview.node.id,
      answer,
      startedAt: appState.currentReviewStartedAt
    });
    playAnswerTone();
    hydrateQuestSummaries(response.quests);
    rememberQuestDetail(response.quest);
    await refreshStudyStats();
    appState.lastEvaluation = response.evaluation;
    appState.currentReview = null;
    appState.currentReviewStartedAt = null;
    renderAll();
    if (response.evaluation.verdict === "review-locked-in") {
      playPositiveTone();
      const celebration = buildCelebrationPayload(response.evaluation, response.quest, currentReview.node);
      if (celebration) {
        openCelebration(celebration);
      }
    }
  } catch (error) {
    showToast(error?.message || "提交复习回答失败，请稍后再试。", "warning");
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const response = await api.saveSettings({
    baseUrl: cleanText(dom.settingsBaseUrl.value),
    model: cleanText(dom.settingsModel.value),
    apiKey: cleanText(dom.settingsApiKey.value),
    defaultTemplateKey: dom.settingsTemplate.value,
    defaultRootQuestionCount: clamp(Number(dom.settingsRootCount.value || 10), 5, 30),
    allowFollowUpQuestions: Boolean(dom.settingsFollowUpOn?.checked)
  });
  appState.bootstrap.settings = response.settings;
  syncFormsFromSettings();
  renderAll();
  showToast("设置已保存。");
}

function handleGlobalShortcuts(event) {
  const isModifier = event.ctrlKey || event.metaKey;
  if (event.key === "Escape") {
    if (!dom.celebrationLayer.classList.contains("hidden")) {
      closeCelebration();
      return;
    }
    if (!dom.detailModal.classList.contains("hidden")) {
      closeDetailModal();
      return;
    }
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

dom.libraryStatusFilter?.addEventListener("change", () => {
  appState.libraryStatusFilter = dom.libraryStatusFilter.value;
  renderAll();
});

dom.libraryCategoryFilter?.addEventListener("change", () => {
  appState.libraryCategoryFilter = dom.libraryCategoryFilter.value;
  renderAll();
});

dom.closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeCreateModal);
});

dom.detailModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeDetailModal);
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

dom.importPdfButton?.addEventListener("click", () => {
  dom.pdfFileInput?.click();
});

dom.clearPdfButton?.addEventListener("click", () => {
  clearDraftDocument();
  showToast("已移除当前 PDF 绑定。");
});

dom.pdfFileInput?.addEventListener("change", () => {
  const [file] = dom.pdfFileInput.files || [];
  void loadPdfFile(file);
  dom.pdfFileInput.value = "";
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

dom.manageActiveQuestButton?.addEventListener("click", () => {
  if (!appState.activeQuest?.id) {
    return;
  }
  void openQuestManagerModal(appState.activeQuest.id);
});

dom.addRootNodeButton?.addEventListener("click", () => {
  if (!appState.activeQuest?.id) {
    return;
  }
  void openNodeEditorModal({
    questId: appState.activeQuest.id
  });
});

dom.focusExitButton?.addEventListener("click", () => {
  setFocusMode(false);
});

dom.toggleAdvancedButton.addEventListener("click", () => {
  setAdvancedCreateOpen(!appState.advancedCreateOpen);
});

dom.openQuestionHistoryButton?.addEventListener("click", () => {
  const activeQuest = appState.activeQuest;
  const activeNode = getActiveNode(activeQuest);
  if (!activeQuest || !activeNode) {
    showToast("当前还没有可查看历史的问题。", "warning");
    return;
  }
  void openQuestionHistoryModal(activeQuest.id, activeNode.id);
});

dom.celebrationCloseButton?.addEventListener("click", closeCelebration);
dom.celebrationLayer?.addEventListener("click", (event) => {
  if (event.target === dom.celebrationLayer) {
    closeCelebration();
  }
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
    await refreshStudyStats();
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
    await refreshStudyStats();
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






