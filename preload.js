const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studyCoachApi", {
  loadBootstrap: () => ipcRenderer.invoke("bootstrap:load"),
  loadUiPrefs: () => ipcRenderer.invoke("ui:load"),
  saveUiPrefs: (payload) => ipcRenderer.invoke("ui:save", payload),
  saveBackgroundImage: (payload) => ipcRenderer.invoke("ui:save-background-image", payload),
  saveSettings: (payload) => ipcRenderer.invoke("settings:save", payload),
  createQuest: (payload) => ipcRenderer.invoke("quest:create", payload),
  getQuest: (questId) => ipcRenderer.invoke("quest:get", questId),
  updateQuestMeta: (payload) => ipcRenderer.invoke("quest:update-meta", payload),
  setQuestArchived: (payload) => ipcRenderer.invoke("quest:set-archived", payload),
  duplicateQuest: (payload) => ipcRenderer.invoke("quest:duplicate", payload),
  deleteQuest: (payload) => ipcRenderer.invoke("quest:delete", payload),
  upsertQuestNode: (payload) => ipcRenderer.invoke("quest:upsert-node", payload),
  deleteQuestNode: (payload) => ipcRenderer.invoke("quest:delete-node", payload),
  moveQuestNode: (payload) => ipcRenderer.invoke("quest:move-node", payload),
  answerQuestion: (payload) => ipcRenderer.invoke("quest:answer", payload),
  drawReviewQuestion: (scopeQuestId) => ipcRenderer.invoke("review:draw", scopeQuestId),
  answerReviewQuestion: (payload) => ipcRenderer.invoke("review:answer", payload),
  loadStudyStats: () => ipcRenderer.invoke("stats:load"),
  parsePdf: (payload) => ipcRenderer.invoke("pdf:parse", payload)
});
