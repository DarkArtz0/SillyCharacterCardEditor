const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

const APP_STATE_FILE = "forge-state.json";

function getStatePath() {
  return path.join(app.getPath("userData"), APP_STATE_FILE);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1220,
    minHeight: 760,
    backgroundColor: "#111214",
    autoHideMenuBar: true,
    title: "SillyTavern Character Card Forge",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
}

async function safeReadJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

app.whenReady().then(() => {
  ipcMain.handle("app:get-meta", () => ({
    version: app.getVersion(),
    isPackaged: app.isPackaged,
    platform: process.platform
  }));

  ipcMain.handle("state:load", async () => {
    return safeReadJson(getStatePath(), null);
  });

  ipcMain.handle("state:save", async (_event, payload) => {
    await fs.mkdir(app.getPath("userData"), { recursive: true });
    await fs.writeFile(getStatePath(), JSON.stringify(payload, null, 2), "utf8");
    return { ok: true };
  });

  ipcMain.handle("dialog:open-card", async () => {
    const result = await dialog.showOpenDialog({
      title: "Import SillyTavern Character Card",
      properties: ["openFile"],
      filters: [
        { name: "Character Cards", extensions: ["png", "json"] },
        { name: "PNG", extensions: ["png"] },
        { name: "JSON", extensions: ["json"] }
      ]
    });

    if (result.canceled || !result.filePaths[0]) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".png") {
      const data = await fs.readFile(filePath);
      return {
        canceled: false,
        filePath,
        kind: "png",
        bytes: Array.from(data)
      };
    }

    const text = await fs.readFile(filePath, "utf8");
    return {
      canceled: false,
      filePath,
      kind: "json",
      text
    };
  });

  ipcMain.handle("dialog:save-json", async (_event, { suggestedName, contents }) => {
    const result = await dialog.showSaveDialog({
      title: "Export Character Card JSON",
      defaultPath: suggestedName,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    await fs.writeFile(result.filePath, contents, "utf8");
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("dialog:save-png", async (_event, { suggestedName, bytes }) => {
    const result = await dialog.showSaveDialog({
      title: "Export Character Card PNG",
      defaultPath: suggestedName,
      filters: [{ name: "PNG", extensions: ["png"] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    await fs.writeFile(result.filePath, Buffer.from(bytes));
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("api:chat", async (_event, payload) => {
    const { endpoint, apiKey, body, headers = {} } = payload ?? {};

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        ...headers
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      text,
      json
    };
  });

  ipcMain.handle("api:request", async (_event, payload) => {
    const { endpoint, apiKey, method = "GET", headers = {}, body } = payload ?? {};

    const response = await fetch(endpoint, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        ...headers
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });

    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      text,
      json
    };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
