export function minimalHarnessEnvironment(source = process.env) {
  const environment = {
    LANG: source.LANG ?? "en_US.UTF-8",
    LC_ALL: source.LC_ALL ?? source.LANG ?? "en_US.UTF-8",
    NODE_ENV: source.NODE_ENV === "production" ? "production" : "development"
  };
  if (source.CLARK_E2E === "1" && source.CLARK_TEST_STEP_DELAY_MS) {
    environment.CLARK_TEST_STEP_DELAY_MS = String(source.CLARK_TEST_STEP_DELAY_MS);
  }
  return environment;
}

export function sanitizeDiagnostic(text) {
  return String(text)
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/(?:gh[opusr]_|sk-|Bearer\s+)[A-Za-z0-9._-]{8,}/gi, "[redacted]")
    .trim()
    .slice(0, 4_096);
}
