import fs from "node:fs";
import path from "node:path";
import { sha256 } from "./canonical.mjs";

export class AssetStore {
  constructor(rootDirectory) {
    this.rootDirectory = path.resolve(rootDirectory);
    fs.mkdirSync(this.rootDirectory, { recursive: true, mode: 0o700 });
  }

  pathFor(contentHash) {
    if (!/^sha256:[a-f0-9]{64}$/.test(contentHash)) throw new TypeError("Invalid content hash");
    const digest = contentHash.slice("sha256:".length);
    return path.join(this.rootDirectory, "sha256", digest.slice(0, 2), digest);
  }

  writeText(text) {
    const normalized = String(text).replace(/\r\n?/g, "\n");
    const contentHash = sha256(normalized);
    const destination = this.pathFor(contentHash);
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
      const temporary = `${destination}.${process.pid}.tmp`;
      fs.writeFileSync(temporary, normalized, { encoding: "utf8", mode: 0o600, flag: "wx" });
      try {
        fs.renameSync(temporary, destination);
      } catch (error) {
        fs.rmSync(temporary, { force: true });
        if (!fs.existsSync(destination)) throw error;
      }
    }
    return { contentHash, byteLength: Buffer.byteLength(normalized, "utf8") };
  }

  readText(contentHash) {
    const content = fs.readFileSync(this.pathFor(contentHash), "utf8");
    if (sha256(content) !== contentHash) throw new Error(`Asset integrity check failed for ${contentHash}`);
    return content;
  }
}
