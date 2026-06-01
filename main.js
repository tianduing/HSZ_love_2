const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { app, BrowserWindow, ipcMain } = require("electron");
const {
  buildStudyStats,
  createQuestRecord,
  deleteQuestNode,
  duplicateQuestRecord,
  findNodeOrThrow,
  findQuestOrThrow,
  loadState,
  moveQuestNode,
  sanitizeSettings,
  serializeQuestDetail,
  serializeQuestSummary,
  setQuestArchived,
  saveState,
  applyLearningEvaluation,
  applyReviewEvaluation,
  pickReviewNode,
  updateQuestMeta,
  upsertQuestNode
} = require("./core/store");
const {
  TEMPLATE_GUIDES,
  generateQuestPlan,
  evaluateLearningAnswer,
  evaluateReviewAnswer
} = require("./core/openai");
const { parsePdfBytes } = require("./core/pdf");

const DEFAULT_E_DRIVE_DATA_ROOT = path.join("E:\\", "StudyQuestData", "app-data");
const UI_PREFS_FILE_NAME = "study-quest-ui.json";
const UI_BACKGROUND_DIR_NAME = "ui-backgrounds";

function getDefaultUiPrefs() {
  return {
    theme: "forest",
    focusMode: false,
    background: {
      image: "",
      assetPath: "",
      opacity: 55,
      positionX: 50,
      positionY: 50
    }
  };
}

function getUiPrefsPath() {
  return path.join(appDataRoot, UI_PREFS_FILE_NAME);
}

function getUiBackgroundDir() {
  return path.join(appDataRoot, UI_BACKGROUND_DIR_NAME);
}

function ensureUiBackgroundDir() {
  fs.mkdirSync(getUiBackgroundDir(), { recursive: true });
}

function isManagedBackgroundAsset(filePath) {
  const target = String(filePath || "").trim();
  if (!target) {
    return false;
  }
  const managedRoot = path.resolve(getUiBackgroundDir()) + path.sep;
  const resolved = path.resolve(target);
  return resolved === path.resolve(getUiBackgroundDir()) || resolved.startsWith(managedRoot);
}

function safeDeleteManagedBackground(filePath) {
  if (!isManagedBackgroundAsset(filePath)) {
    return;
  }
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (_error) {
    // Ignore cleanup failures to avoid blocking the UI.
  }
}

function normalizeBackgroundPrefs(background = {}) {
  const defaults = getDefaultUiPrefs().background;
  const image = typeof background.image === "string" ? background.image : "";
  const assetPath = typeof background.assetPath === "string" ? background.assetPath : "";
  return {
    image,
    assetPath: image ? assetPath : "",
    opacity: Math.min(100, Math.max(0, Number(background.opacity ?? defaults.opacity) || defaults.opacity)),
    positionX: Math.min(100, Math.max(0, Number(background.positionX ?? defaults.positionX) || defaults.positionX)),
    positionY: Math.min(100, Math.max(0, Number(background.positionY ?? defaults.positionY) || defaults.positionY))
  };
}

function loadUiPrefs() {
  const defaults = getDefaultUiPrefs();
  const prefsPath = getUiPrefsPath();
  try {
    if (!fs.existsSync(prefsPath)) {
      return defaults;
    }
    const raw = fs.readFileSync(prefsPath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      background: normalizeBackgroundPrefs({
        ...defaults.background,
        ...(parsed.background || {})
      })
    };
  } catch (_error) {
    return defaults;
  }
}

function saveUiPrefs(input) {
  const defaults = getDefaultUiPrefs();
  const current = loadUiPrefs();
  const next = {
    ...defaults,
    ...current,
    ...input,
    background: normalizeBackgroundPrefs({
      ...defaults.background,
      ...(current.background || {}),
      ...((input && input.background) || {})
    })
  };
  if (
    current.background?.assetPath &&
    current.background.assetPath !== next.background.assetPath
  ) {
    safeDeleteManagedBackground(current.background.assetPath);
  }
  fs.writeFileSync(getUiPrefsPath(), JSON.stringify(next, null, 2), "utf-8");
  return next;
}

function parseImageDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("背景图片格式无效，请重新选择一张图片。");
  }
  const mimeType = match[1].toLowerCase();
  const base64Body = match[2];
  const extensionMap = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp"
  };
  const extension = extensionMap[mimeType];
  if (!extension) {
    throw new Error("暂不支持这种背景图片格式。");
  }
  return {
    mimeType,
    extension,
    bytes: Buffer.from(base64Body, "base64")
  };
}

function saveBackgroundImage({ fileName, dataUrl }) {
  const parsed = parseImageDataUrl(dataUrl);
  ensureUiBackgroundDir();
  const safeBaseName = cleanFileName(fileName) || "background";
  const nextName = `${Date.now()}-${safeBaseName}-${crypto.randomUUID()}.${parsed.extension}`;
  const targetPath = path.join(getUiBackgroundDir(), nextName);
  fs.writeFileSync(targetPath, parsed.bytes);
  const prefs = saveUiPrefs({
    background: {
      image: pathToFileURL(targetPath).href,
      assetPath: targetPath
    }
  });
  return prefs.background;
}

function cleanFileName(value) {
  return String(value || "")
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function resolveAppDataRoot() {
  const envRoot = process.env.STUDY_QUEST_DATA_ROOT;
  if (envRoot) {
    return envRoot;
  }
  if (fs.existsSync("E:\\")) {
    return DEFAULT_E_DRIVE_DATA_ROOT;
  }
  return path.join(app.getPath("documents"), "StudyQuestData");
}

const appDataRoot = resolveAppDataRoot();
app.setPath("userData", appDataRoot);

function getRuntime() {
  return {
    dataRoot: appDataRoot,
    envApiKey: process.env.OPENAI_API_KEY || ""
  };
}

function getState() {
  return loadState(appDataRoot);
}

function persistState(nextState) {
  return saveState(appDataRoot, nextState);
}

function buildBootstrapPayload(state) {
  const runtime = getRuntime();
  return {
    runtime: {
      dataRoot: runtime.dataRoot,
      templateOptions: Object.entries(TEMPLATE_GUIDES).map(([key, value]) => ({
        key,
        label: value.label
      }))
    },
    settings: sanitizeSettings(state.settings, runtime),
    quests: state.quests
      .map(serializeQuestSummary)
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
  };
}

function withQuest(state, questId) {
  const quest = findQuestOrThrow(state, questId);
  return {
    quest,
    payload: serializeQuestDetail(quest)
  };
}

function buildQuestMutationResponse(state, quest) {
  return {
    quest: serializeQuestDetail(quest),
    quests: state.quests.map(serializeQuestSummary)
  };
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1520,
    height: 960,
    minWidth: 1240,
    minHeight: 760,
    backgroundColor: "#f7f4ee",
    title: "仅予你的晴天-学习小助手",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

ipcMain.handle("bootstrap:load", async () => {
  const state = getState();
  return buildBootstrapPayload(state);
});

ipcMain.handle("ui:load", async () => {
  return loadUiPrefs();
});

ipcMain.handle("ui:save", async (_event, input) => {
  return saveUiPrefs(input);
});

ipcMain.handle("ui:save-background-image", async (_event, input) => {
  return saveBackgroundImage(input || {});
});

ipcMain.handle("settings:save", async (_event, input) => {
  const state = getState();
  state.settings = {
    ...state.settings,
    provider: "OpenAI",
    baseUrl: String(input.baseUrl || state.settings.baseUrl || "").trim(),
    model: String(input.model || state.settings.model || "").trim(),
    defaultTemplateKey: String(input.defaultTemplateKey || state.settings.defaultTemplateKey || "general"),
    defaultRootQuestionCount: Number(input.defaultRootQuestionCount || state.settings.defaultRootQuestionCount || 8),
    allowFollowUpQuestions:
      typeof input.allowFollowUpQuestions === "boolean"
        ? input.allowFollowUpQuestions
        : state.settings.allowFollowUpQuestions !== false,
    preferredDataRoot: appDataRoot,
    apiKey: input.apiKey ? String(input.apiKey).trim() : state.settings.apiKey || ""
  };
  persistState(state);
  return {
    settings: sanitizeSettings(state.settings, getRuntime())
  };
});

ipcMain.handle("quest:create", async (_event, input) => {
  const state = getState();
  const plan = await generateQuestPlan(state.settings, input);
  const quest = createQuestRecord(input, plan);
  state.quests.unshift(quest);
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("quest:get", async (_event, questId) => {
  const state = getState();
  const { payload } = withQuest(state, questId);
  return payload;
});

ipcMain.handle("quest:answer", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  const node = findNodeOrThrow(quest, input.nodeId);
  const answer = String(input.answer || "").trim();
  const evaluation = await evaluateLearningAnswer(state.settings, quest, node, answer);
  applyLearningEvaluation(quest, node, answer, evaluation);
  quest.updatedAt = new Date().toISOString();
  persistState(state);
  return {
    evaluation,
    ...buildQuestMutationResponse(state, quest)
  };
});

ipcMain.handle("quest:update-meta", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  updateQuestMeta(quest, input);
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("quest:set-archived", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  setQuestArchived(quest, Boolean(input.archived));
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("quest:duplicate", async (_event, input) => {
  const state = getState();
  const sourceQuest = findQuestOrThrow(state, input.questId);
  const duplicatedQuest = duplicateQuestRecord(sourceQuest);
  state.quests.unshift(duplicatedQuest);
  persistState(state);
  return buildQuestMutationResponse(state, duplicatedQuest);
});

ipcMain.handle("quest:delete", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  state.quests = state.quests.filter((item) => item.id !== quest.id);
  persistState(state);
  return {
    deletedQuestId: quest.id,
    quests: state.quests.map(serializeQuestSummary)
  };
});

ipcMain.handle("quest:upsert-node", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  upsertQuestNode(quest, input);
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("quest:delete-node", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  deleteQuestNode(quest, input.nodeId);
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("quest:move-node", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  moveQuestNode(quest, input.nodeId, input.direction);
  persistState(state);
  return buildQuestMutationResponse(state, quest);
});

ipcMain.handle("pdf:parse", async (_event, input) => {
  return parsePdfBytes({
    fileName: input?.fileName,
    bytes: input?.bytes
  });
});

ipcMain.handle("review:draw", async (_event, scopeQuestId) => {
  const state = getState();
  const picked = pickReviewNode(state.quests, scopeQuestId || null);
  if (!picked) {
    return null;
  }
  return {
    questId: picked.questId,
    questTitle: picked.questTitle,
    node: picked.node
  };
});

ipcMain.handle("review:answer", async (_event, input) => {
  const state = getState();
  const quest = findQuestOrThrow(state, input.questId);
  const node = findNodeOrThrow(quest, input.nodeId);
  const answer = String(input.answer || "").trim();
  const evaluation = await evaluateReviewAnswer(state.settings, quest, node, answer);
  applyReviewEvaluation(quest, node, answer, evaluation, {
    startedAt: input.startedAt
  });
  quest.updatedAt = new Date().toISOString();
  persistState(state);
  return {
    evaluation,
    ...buildQuestMutationResponse(state, quest)
  };
});

ipcMain.handle("stats:load", async () => {
  return buildStudyStats(getState());
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
