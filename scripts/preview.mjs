// A local stand-in for Cloudflare Pages, to check the static export before a
// deploy. It serves out/ with the parts of Pages' behaviour this site relies
// on: `/route` 308s to `/route/`, `/route/` serves its index.html, unknown
// paths get 404.html, and out/_redirects and out/_headers apply. It is not
// Pages itself, so the deployed site still gets checked with curl.
//
// Usage: npm run build && npm run preview [-- <port>]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.argv[2] ?? 3317);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const lines = async (name) =>
  (await readFile(join(ROOT, name), "utf8").catch(() => "")).split("\n");
const isRule = (line) => line.trim() && !line.trim().startsWith("#");

// _redirects: "<from> <to> [status]", exact paths only, which is all this site uses.
const redirects = new Map();
for (const line of (await lines("_redirects")).filter(isRule)) {
  const [from, to, status] = line.trim().split(/\s+/);
  redirects.set(from, { location: to, status: Number(status) || 302 });
}

// _headers: an unindented path pattern, then indented "Name: value" lines.
// A "*" in the pattern matches anything, as on Pages.
const headerRules = [];
for (const line of (await lines("_headers")).filter(isRule)) {
  if (!/^\s/.test(line)) {
    const pattern = line.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    headerRules.push({ test: new RegExp(`^${pattern}$`), headers: {} });
  } else if (headerRules.length) {
    const colon = line.indexOf(":");
    headerRules.at(-1).headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
}

const isFile = async (path) => (await stat(path).catch(() => null))?.isFile() ?? false;

async function resolve(path) {
  const base = normalize(join(ROOT, decodeURIComponent(path)));
  if (base !== ROOT && !base.startsWith(ROOT + sep)) return {};
  if (path.endsWith("/")) {
    const index = join(base, "index.html");
    return (await isFile(index)) ? { file: index } : {};
  }
  if (await isFile(base)) return { file: base };
  if (await isFile(join(base, "index.html"))) return { location: `${path}/`, status: 308 };
  return {};
}

createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const hit = redirects.get(path) ?? (await resolve(path));
  if (hit.location) {
    res.writeHead(hit.status, { Location: hit.location });
    res.end();
    return;
  }
  const file = hit.file ?? join(ROOT, "404.html");
  const headers = { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" };
  for (const rule of headerRules) if (rule.test.test(path)) Object.assign(headers, rule.headers);
  res.writeHead(hit.file ? 200 : 404, headers);
  res.end(await readFile(file).catch(() => "Not found"));
}).listen(PORT, () => console.log(`Serving out/ like Cloudflare Pages on http://127.0.0.1:${PORT}`));
