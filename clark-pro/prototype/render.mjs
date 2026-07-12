import { readFileSync, writeFileSync } from "node:fs";

const [source, destination] = process.argv.slice(2);

if (!source || !destination) {
  throw new Error("Usage: node render.mjs <fragment.html> <destination.html>");
}

const fragment = readFileSync(source, "utf8");
const baseStyles = `
:root {
  color-scheme: light dark;
  --background: #f7f7f5;
  --foreground: #20201e;
  --card: #ffffff;
  --card-foreground: #20201e;
  --primary: #20201e;
  --primary-foreground: #ffffff;
  --secondary: #ecece8;
  --secondary-foreground: #20201e;
  --muted: #ecece8;
  --muted-foreground: #686863;
  --accent: #e5e5df;
  --accent-foreground: #20201e;
  --destructive: #b42318;
  --border: #d8d8d2;
  --input: #c9c9c2;
  --ring: #6a6a64;
  --viz-series-1: #6366f1;
  --viz-series-2: #0f9f7f;
  --viz-series-3: #d97706;
  --viz-series-4: #a855f7;
  --viz-series-5: #0284c7;
  --viz-series-6: #db2777;
}
@media (prefers-color-scheme: dark) {
  :root {
    --background: #181816;
    --foreground: #eeeeda;
    --card: #242421;
    --card-foreground: #eeeeda;
    --primary: #eeeeda;
    --primary-foreground: #181816;
    --secondary: #30302c;
    --secondary-foreground: #eeeeda;
    --muted: #30302c;
    --muted-foreground: #aeaea5;
    --accent: #393934;
    --accent-foreground: #eeeeda;
    --destructive: #f97066;
    --border: #45453f;
    --input: #55554d;
    --ring: #c5c5ba;
    --viz-series-1: #8b8df8;
    --viz-series-2: #38cfa8;
    --viz-series-3: #f0a53a;
    --viz-series-4: #c77dff;
    --viz-series-5: #38bdf8;
    --viz-series-6: #f472b6;
  }
}
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; background: var(--background); color: var(--foreground); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; font-size: 14px; line-height: 1.45; }
button, input, select, textarea { font: inherit; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
h1, h2, h3 { font-weight: 500; line-height: 1.25; }
h2 { margin: 10px 0; }
h3 { margin-top: 0; }
.card { min-width: 0; overflow-wrap: anywhere; background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
.btn { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 34px; padding: 6px 10px; border: 1px solid var(--border); border-radius: 7px; background: var(--secondary); color: var(--secondary-foreground); cursor: pointer; text-decoration: none; white-space: normal; }
.btn:hover { background: var(--accent); color: var(--accent-foreground); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary, .btn[aria-pressed="true"] { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
.viz-tile { min-height: 42px; align-self: stretch; }
.viz-badge { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 999px; background: var(--muted); color: var(--foreground); font-size: 12px; }
.viz-controls { display: flex; align-items: end; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.text-small { font-size: 12px; }
.text-muted { color: var(--muted-foreground); }
.form-label { display: grid; gap: 4px; color: var(--muted-foreground); }
.form-select { min-height: 34px; padding: 4px 28px 4px 8px; border: 1px solid var(--input); border-radius: 7px; background: var(--card); color: var(--card-foreground); }
.form-check { display: inline-flex; align-items: center; gap: 7px; min-height: 34px; }
.form-check-input { width: 18px; height: 18px; }
svg.lucide { width: 16px; height: 16px; }
@media (max-width: 620px) { body { padding: 14px; } }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clark Pro Studio Prototype</title>
  <style>${baseStyles}</style>
</head>
<body>
${fragment}
<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.js"></script>
<script>if (globalThis.lucide) lucide.createIcons({ attrs: { width: 16, height: 16 } });</script>
</body>
</html>
`;

writeFileSync(destination, html);
