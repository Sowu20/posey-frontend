/**
 * Fetch HTML code and screenshot images from Google Stitch screens.
 *
 * Auth (first match wins):
 *   .env → STITCH_API_KEY
 *   --key sk_...  or  STITCH_API_KEY env var
 *   STITCH_ACCESS_TOKEN + GOOGLE_CLOUD_PROJECT
 *   gcloud auth print-access-token
 *
 * Usage:
 *   npm run stitch:fetch
 *   node scripts/fetch-stitch-screens.mjs --list-projects
 *   node scripts/fetch-stitch-screens.mjs --project 16931726087476600818
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const STITCH_MCP_URL = process.env.STITCH_HOST || "https://stitch.googleapis.com/mcp";
const DEFAULT_PROJECT_ID = "16931726087476600818";
const OUTPUT_DIR = join(ROOT_DIR, "design", "stitch");

const SCREENS = [
  { id: "5fa451dc296842ed9ce680cc619747dd", slug: "page-accueil", title: "Page d'accueil" },
  { id: "ac2b7d40f6a94c0484995ca5666afd80", slug: "profil-prestataire", title: "Page de profil prestataire" },
  { id: "bcf4922525674fc5ba0fb86c1d35cdf9", slug: "dashboard-prestataire", title: "Tableau de bord prestataire" },
  { id: "6477ffe1763f49cab89c5f0ba172ee66", slug: "dashboard-client", title: "Tableau de bord client" },
  { id: "3ae6682b58054b6aa05fcbf11daa79f5", slug: "recherche-services", title: "Page de recherche de services" },
  { id: "1a90bb361e66430f81b92b9b5dad192a", slug: "detail-service-devis", title: "Page de détail de service/demande de devis" },
  { id: "asset-stub-assets_c45af0d976254f4ca4d03f6a2397d866", slug: "design-system", title: "Design System", skipScreen: true },
  { id: "fc78a6829481434dadd9ff374960e12e", slug: "contact", title: "Contact" },
  { id: "0344afb3faa74110892d78480604244a", slug: "a-propos", title: "À Propos" },
  { id: "bcdea5fe791c4e76ada3f373cf57b9ec", slug: "dashboard-admin", title: "Tableau de Bord de l'Administrateur" },
  { id: "6feae31c8de742b3a8e36e95f6b96f1e", slug: "depot-argent", title: "La page de dépôt d'argent" },
  { id: "b69a17faacf14738bb9d262a107cb9f5", slug: "connexion-inscription", title: "Connexion et Inscription" },
  { id: "2235b9fc254b4e1b8f88e569c30bbec1", slug: "mot-de-passe", title: "Mot de passe oublié et Réinitialisation" },
  { id: "bdf80bafab5840fb912a9ef9d5adaaec", slug: "liste-commandes", title: "La liste des commandes" },
  { id: "8fb4127669f6461d92b965d107c31565", slug: "page-prestataire-client", title: "La page du prestataire et du client" },
];

let requestId = 1;

loadEnvFile(join(ROOT_DIR, ".env"));

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const projectIdx = argv.indexOf("--project");
  const keyIdx = argv.indexOf("--key");
  return {
    projectId:
      projectIdx >= 0
        ? argv[projectIdx + 1]
        : process.env.STITCH_PROJECT_ID || DEFAULT_PROJECT_ID,
    apiKey: keyIdx >= 0 ? argv[keyIdx + 1] : process.env.STITCH_API_KEY,
    listProjects: argv.includes("--list-projects"),
    listScreens: argv.includes("--list-screens"),
  };
}

function resolveAuth(apiKeyOverride) {
  if (apiKeyOverride) {
    return { token: apiKeyOverride, method: "api_key" };
  }
  if (process.env.STITCH_API_KEY) {
    return { token: process.env.STITCH_API_KEY, method: "api_key" };
  }
  if (process.env.STITCH_ACCESS_TOKEN) {
    return {
      token: process.env.STITCH_ACCESS_TOKEN,
      method: "access_token",
      gcpProjectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
    };
  }
  try {
    const token = execSync("gcloud auth print-access-token", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (token) {
      return {
        token,
        method: "gcloud",
        gcpProjectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
      };
    }
  } catch {
    // fall through
  }
  throw new Error(
    "No Stitch auth found. Add STITCH_API_KEY to .env, or pass --key, or run `gcloud auth login`.",
  );
}

function buildHeaders(creds) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (creds.method === "api_key") {
    headers["X-Goog-Api-Key"] = creds.token;
  } else {
    headers.Authorization = `Bearer ${creds.token}`;
    if (creds.gcpProjectId) {
      headers["X-Goog-User-Project"] = creds.gcpProjectId;
    }
  }
  return headers;
}

function extractToolError(result) {
  if (!result || typeof result !== "object") return null;
  if (result.isError) {
    const text = result.content?.find((item) => item?.type === "text")?.text;
    return text || "Stitch tool returned an error";
  }
  return null;
}

function extractTextContent(result) {
  if (!result || typeof result !== "object") return null;
  const textItem = result.content?.find((item) => item?.type === "text" && item.text);
  if (!textItem) return null;
  try {
    return JSON.parse(textItem.text);
  } catch {
    return textItem.text;
  }
}

async function callStitchTool(toolName, args, creds) {
  const response = await fetch(STITCH_MCP_URL, {
    method: "POST",
    headers: buildHeaders(creds),
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: toolName, arguments: args },
      id: requestId++,
    }),
  });

  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(`Stitch API HTTP ${response.status}: ${raw}`);
  }

  if (payload.error) {
    throw new Error(`Stitch tool "${toolName}": ${payload.error.message}`);
  }

  const toolError = extractToolError(payload.result);
  if (toolError) {
    throw new Error(`Stitch tool "${toolName}": ${toolError}`);
  }

  if (!response.ok) {
    throw new Error(`Stitch API HTTP ${response.status}: ${raw}`);
  }

  return payload.result;
}

function findHtmlUrl(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.htmlCode?.downloadUrl) return obj.htmlCode.downloadUrl;
  for (const value of Object.values(obj)) {
    const found = findHtmlUrl(value);
    if (found) return found;
  }
  return null;
}

function findImageUrl(obj) {
  if (!obj || typeof obj !== "object") return null;
  const screenshot = obj.screenshot;
  if (screenshot?.downloadUrl) return screenshot.downloadUrl;
  if (typeof obj.downloadUrl === "string") {
    const url = obj.downloadUrl;
    const isImage =
      url.includes(".png") ||
      url.includes(".jpg") ||
      (url.includes("googleusercontent.com") && !url.includes("contribution.usercontent"));
    if (isImage) return url;
  }
  for (const value of Object.values(obj)) {
    const found = findImageUrl(value);
    if (found) return found;
  }
  return null;
}

async function downloadToFile(url, destPath) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buffer);
}

async function listProjects(creds) {
  const result = await callStitchTool("list_projects", {}, creds);
  const parsed = extractTextContent(result) ?? result;
  console.log(JSON.stringify(parsed, null, 2));
}

async function listScreens(projectId, creds) {
  const result = await callStitchTool("list_screens", { projectId }, creds);
  const parsed = extractTextContent(result) ?? result;
  console.log(JSON.stringify(parsed, null, 2));
}

async function fetchDesignSystem(projectId, creds) {
  const result = await callStitchTool("list_design_systems", { projectId }, creds);
  const parsed = extractTextContent(result) ?? result;
  const entry = parsed.designSystems?.[0];
  if (!entry?.designSystem) {
    throw new Error("No design system found for project");
  }

  const screenDir = join(OUTPUT_DIR, "design-system");
  await mkdir(screenDir, { recursive: true });

  const { designSystem } = entry;
  const manifest = {
    projectId,
    assetId: entry.name,
    screenId: "asset-stub-assets_c45af0d976254f4ca4d03f6a2397d866",
    title: "Design System",
    slug: "design-system",
    displayName: designSystem.displayName,
    version: entry.version,
    fetchedAt: new Date().toISOString(),
  };

  await writeFile(join(screenDir, "design-system.json"), JSON.stringify(entry, null, 2));
  console.log("  ✓ Tokens → design/stitch/design-system/design-system.json");

  if (designSystem.theme?.designMd) {
    await writeFile(join(screenDir, "design.md"), designSystem.theme.designMd);
    console.log("  ✓ Code   → design/stitch/design-system/design.md");
  }

  if (designSystem.styleGuidelines) {
    await writeFile(join(screenDir, "style-guidelines.md"), designSystem.styleGuidelines);
    console.log("  ✓ Guide  → design/stitch/design-system/style-guidelines.md");
  }

  await writeFile(join(screenDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function fetchScreen(projectId, screen, creds) {
  const result = await callStitchTool(
    "get_screen",
    { projectId, screenId: screen.id },
    creds,
  );

  const parsed = extractTextContent(result) ?? result;
  const htmlUrl = findHtmlUrl(parsed);
  const imageUrl = findImageUrl(parsed);

  const screenDir = join(OUTPUT_DIR, screen.slug);
  await mkdir(screenDir, { recursive: true });

  const manifest = {
    projectId,
    screenId: screen.id,
    title: screen.title,
    slug: screen.slug,
    htmlUrl,
    imageUrl,
    fetchedAt: new Date().toISOString(),
  };

  if (htmlUrl) {
    await downloadToFile(htmlUrl, join(screenDir, "index.html"));
    console.log(`  ✓ HTML  → design/stitch/${screen.slug}/index.html`);
  } else {
    console.warn(`  ⚠ No HTML URL for ${screen.title}`);
  }

  if (imageUrl) {
    await downloadToFile(imageUrl, join(screenDir, "screenshot.png"));
    console.log(`  ✓ Image → design/stitch/${screen.slug}/screenshot.png`);
  } else {
    console.warn(`  ⚠ No image URL for ${screen.title}`);
  }

  await writeFile(join(screenDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function main() {
  const { projectId, apiKey, listProjects: shouldListProjects, listScreens: shouldListScreens } =
    parseArgs(process.argv.slice(2));
  const creds = resolveAuth(apiKey);

  if (shouldListProjects) {
    await listProjects(creds);
    return;
  }

  if (shouldListScreens) {
    console.log(`Listing screens for project ${projectId}...\n`);
    await listScreens(projectId, creds);
    return;
  }

  console.log(`Stitch project: ${projectId}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Auth: ${creds.method}\n`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  const results = [];
  console.log("Fetching: Design System (asset-stub-assets_c45af0d976254f4ca4d03f6a2397d866)");
  try {
    results.push(await fetchDesignSystem(projectId, creds));
  } catch (error) {
    console.error(`  ✗ ${error.message || error}`);
  }

  for (const screen of SCREENS) {
    if (screen.skipScreen) continue;
    console.log(`Fetching: ${screen.title} (${screen.id})`);
    try {
      results.push(await fetchScreen(projectId, screen, creds));
    } catch (error) {
      console.error(`  ✗ ${error.message || error}`);
    }
  }

  await writeFile(
    join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify({ projectId, screens: results }, null, 2),
  );

  console.log(`\nDone — ${results.length} screens exported to design/stitch/`);
}

main()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
