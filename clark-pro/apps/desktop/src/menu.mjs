export const SECTIONS = Object.freeze(["focus", "canvas", "review", "memory", "connections"]);

export function createMenuTemplate({ appName = "Clark Pro", navigate, showTrustCenter }) {
  const go = (section) => () => navigate(section);

  return [
    {
      label: appName,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "File",
      submenu: [
        { id: "new-workspace", label: "New Workspace", accelerator: "CmdOrCtrl+N", enabled: false },
        { id: "open-workspace", label: "Open Workspace…", accelerator: "CmdOrCtrl+O", enabled: false },
        { type: "separator" },
        { role: "close" }
      ]
    },
    { role: "editMenu" },
    {
      label: "View",
      submenu: [
        { id: "view-focus", label: "Today", accessibilityLabel: "Open Today view", accelerator: "CmdOrCtrl+1", click: go("focus") },
        { id: "view-canvas", label: "Shape", accessibilityLabel: "Open Shape view", accelerator: "CmdOrCtrl+2", click: go("canvas") },
        { id: "view-review", label: "Review", accessibilityLabel: "Open Review view", accelerator: "CmdOrCtrl+3", click: go("review") },
        { id: "view-memory", label: "Knowledge", accessibilityLabel: "Open Knowledge view", accelerator: "CmdOrCtrl+6", click: go("memory") },
        { id: "view-connections", label: "Integrations", accessibilityLabel: "Open Integrations view", accelerator: "CmdOrCtrl+7", click: go("connections") },
        { type: "separator" },
        { id: "trust-center", label: "Review Permissions", accelerator: "CmdOrCtrl+Shift+T", click: showTrustCenter },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        { label: "Clark Help", enabled: false },
        { label: "Keyboard Shortcuts", accelerator: "CmdOrCtrl+/", click: go("focus") }
      ]
    }
  ];
}
