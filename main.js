const path = require("node:path");
const fs = require("node:fs");
const { app, BrowserWindow, ipcMain } = require("electron");
const {
  createQuestRecord,
  findNodeOrThrow,
  findQuestOrThrow,
  loadState,
  sanitizeSettings,
  serializeQuestDetail,
  serializeQuestSummary,
  saveState,
  applyLearningEvaluation,
  applyReviewEvaluation,
  pickReviewNode
} = require("./core/store");
const {
  TEMPLATE_GUIDES,
  generateQuestPlan,
  evaluateLearningAnswer,
  evaluateReviewAnswer
} = require("./core/openai");

const DEFAULT_E_DRIVE_DATA_ROOT = path.join("E:\\", "StudyQuestData", "app-data");
const UI_PREFS_FILE_NAME = "study-quest-ui.json";

function getDefaultUiPrefs() {
  return {
    theme: "forest",
    focusMode: false,
    background: {
      image: "",
      opacity: 55,
      positionX: 50,
      positionY: 50
    }
  };
}

function getUiPrefsPath() {
  return path.join(appDataRoot, UI_PREFS_FILE_NAME);
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
      background: {
        ...defaults.background,
        ...(parsed.background || {})
      }
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
    background: {
      ...defaults.background,
      ...(current.background || {}),
      ...((input && input.background) || {})
    }
  };
  fs.writeFileSync(getUiPrefsPath(), JSON.stringify(next, null, 2), "utf-8");
  return next;
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

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1520,
    height: 960,
    minWidth: 1240,
    minHeight: 760,
    backgroundColor: "#f7f4ee",
    title: "Study Quest 学练闯关",
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

ipcMain.handle("settings:save", async (_event, input) => {
  const state = getState();
  state.settings = {
    ...state.settings,
    provider: "OpenAI",
    baseUrl: String(input.baseUrl || state.settings.baseUrl || "").trim(),
    model: String(input.model || state.settings.model || "").trim(),
    defaultTemplateKey: String(input.defaultTemplateKey || state.settings.defaultTemplateKey || "general"),
    defaultRootQuestionCount: Number(input.defaultRootQuestionCount || state.settings.defaultRootQuestionCount || 8),
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
  return {
    quest: serializeQuestDetail(quest),
    quests: state.quests.map(serializeQuestSummary)
  };
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
    quest: serializeQuestDetail(quest),
    quests: state.quests.map(serializeQuestSummary)
  };
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
  applyReviewEvaluation(quest, node, answer, evaluation);
  quest.updatedAt = new Date().toISOString();
  persistState(state);
  return {
    evaluation,
    quest: serializeQuestDetail(quest),
    quests: state.quests.map(serializeQuestSummary)
  };
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
