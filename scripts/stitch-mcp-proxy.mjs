/**
 * Stdio MCP proxy for Google Stitch (uses STITCH_API_KEY or gcloud auth).
 * Configure in .cursor/mcp.json to use Stitch tools from Cursor.
 */
import { spawn } from "node:child_process";

const apiKey = process.env.STITCH_API_KEY;
const accessToken = process.env.STITCH_ACCESS_TOKEN;

if (apiKey) {
  const child = spawn("npx", ["-y", "@google/stitch-sdk", "proxy"], {
    stdio: "inherit",
    env: { ...process.env, STITCH_API_KEY: apiKey },
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
} else if (accessToken) {
  const child = spawn("npx", ["-y", "@google/stitch-sdk", "proxy"], {
    stdio: "inherit",
    env: { ...process.env, STITCH_ACCESS_TOKEN: accessToken },
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
} else {
  const child = spawn("npx", ["-y", "@google/stitch-sdk", "proxy"], {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
}
