import test from "node:test";
import assert from "node:assert/strict";
import { createMenuTemplate } from "../../src/menu.mjs";
import { assertTrustedSender, isTrustedRendererDocumentUrl, isTrustedRendererUrl } from "../../src/security.mjs";

test("native menu contains Mac roles and stable navigation accelerators", () => {
  const navigated = [];
  const template = createMenuTemplate({ navigate: (section) => navigated.push(section), showTrustCenter: () => {} });
  assert.equal(template[0].submenu.some((item) => item.role === "services"), true);
  assert.equal(template[0].submenu.some((item) => item.role === "quit"), true);
  assert.equal(template[2].role, "editMenu");
  assert.equal(template[4].role, "windowMenu");
  const viewItems = template[3].submenu;
  assert.deepEqual(viewItems.filter((item) => item.id?.startsWith("view-")).map((item) => [item.id, item.accelerator]), [
    ["view-focus", "CmdOrCtrl+1"], ["view-canvas", "CmdOrCtrl+2"], ["view-review", "CmdOrCtrl+3"], ["view-writing", "CmdOrCtrl+4"], ["view-memory", "CmdOrCtrl+6"], ["view-connections", "CmdOrCtrl+7"]
  ]);
  viewItems.find((item) => item.id === "view-review").click();
  assert.deepEqual(navigated, ["review"]);
});

test("only the packaged shell origin is trusted", () => {
  for (const trusted of ["clark-app://shell/index.html", "clark-app://shell/renderer.mjs"]) {
    assert.equal(isTrustedRendererUrl(trusted), true, trusted);
  }
  for (const rejected of ["https://shell/index.html", "clark-app://evil/index.html", "file:///tmp/index.html", "not a url"]) {
    assert.equal(isTrustedRendererUrl(rejected), false, rejected);
  }
  assert.equal(isTrustedRendererDocumentUrl("clark-app://shell/index.html"), true);
  assert.equal(isTrustedRendererDocumentUrl("clark-app://shell/renderer.mjs"), false);
});

test("IPC accepts only the expected main frame and webContents", () => {
  const mainFrame = { url: "clark-app://shell/index.html" };
  const webContents = { mainFrame };
  assert.doesNotThrow(() => assertTrustedSender({ sender: webContents, senderFrame: mainFrame }, webContents));
  assert.throws(
    () => assertTrustedSender({ sender: webContents, senderFrame: { url: mainFrame.url } }, webContents),
    /untrusted renderer frame/
  );
  assert.throws(
    () => assertTrustedSender({ sender: {}, senderFrame: mainFrame }, webContents),
    /untrusted renderer frame/
  );
});
