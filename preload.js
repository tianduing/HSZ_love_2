const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studyCoachApi", {
  loadBootstrap: () => ipcRenderer.invoke("bootstrap:load"),
  saveSettings: (payload) => ipcRenderer.invoke("settings:save", payload),
  createQuest: (payload) => ipcRenderer.invoke("quest:create", payload),
  getQuest: (questId) => ipcRenderer.invoke("quest:get", questId),
  answerQuestion: (payload) => ipcRenderer.invoke("quest:answer", payload),
  drawReviewQuestion: (scopeQuestId) => ipcRenderer.invoke("review:draw", scopeQuestId),
  answerReviewQuestion: (payload) => ipcRenderer.invoke("review:answer", payload)
});
