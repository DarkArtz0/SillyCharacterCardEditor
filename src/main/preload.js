const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopBridge", {
  getMeta: () => ipcRenderer.invoke("app:get-meta"),
  loadState: () => ipcRenderer.invoke("state:load"),
  saveState: (payload) => ipcRenderer.invoke("state:save", payload),
  openCard: () => ipcRenderer.invoke("dialog:open-card"),
  saveJson: (payload) => ipcRenderer.invoke("dialog:save-json", payload),
  savePng: (payload) => ipcRenderer.invoke("dialog:save-png", payload),
  chat: (payload) => ipcRenderer.invoke("api:chat", payload),
  request: (payload) => ipcRenderer.invoke("api:request", payload)
});
