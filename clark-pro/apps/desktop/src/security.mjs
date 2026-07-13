export const APP_ORIGIN = "clark-app://shell";

export function isTrustedRendererUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "clark-app:" && url.hostname === "shell";
  } catch {
    return false;
  }
}

export function isTrustedRendererDocumentUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "clark-app:" && url.hostname === "shell" && url.pathname === "/index.html";
  } catch {
    return false;
  }
}

export function assertTrustedSender(event, expectedWebContents) {
  const frame = event?.senderFrame;
  if (
    event?.sender !== expectedWebContents ||
    frame !== expectedWebContents?.mainFrame ||
    !isTrustedRendererDocumentUrl(frame?.url)
  ) {
    throw new Error("Rejected IPC from an untrusted renderer frame");
  }
}

export function hardenWebContents(webContents) {
  webContents.on("will-navigate", (event, navigationUrl) => {
    if (!isTrustedRendererDocumentUrl(navigationUrl)) event.preventDefault();
  });
  webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  webContents.on("will-attach-webview", (event) => event.preventDefault());
}

export function denyAllSessionPermissions(session) {
  session.setPermissionCheckHandler(() => false);
  session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  session.setDevicePermissionHandler(() => false);
}
