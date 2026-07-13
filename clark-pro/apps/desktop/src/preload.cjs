const { contextBridge, ipcRenderer } = require("electron");

const allowedSections = new Set(["focus", "canvas", "connections"]);

const api = Object.freeze({
  version: "0.1.0",
  getShellState: () => ipcRenderer.invoke("desktop:get-shell-state"),
  setActiveSection: (section) => {
    if (!allowedSections.has(section)) return Promise.reject(new TypeError("Unknown section"));
    return ipcRenderer.invoke("desktop:set-active-section", section);
  },
  onNavigate: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = (_event, section) => {
      if (allowedSections.has(section)) listener(section);
    };
    ipcRenderer.on("desktop:navigate", handler);
    return () => ipcRenderer.removeListener("desktop:navigate", handler);
  },
  onTrustCenter: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = () => listener();
    ipcRenderer.on("desktop:show-trust-center", handler);
    return () => ipcRenderer.removeListener("desktop:show-trust-center", handler);
  }
});

contextBridge.exposeInMainWorld("clarkDesktop", api);
