/**
 * Local preview. Serves _site, and rebuilds when a .md changes.
 *
 * No dependencies beyond node itself — this is a preview server, not a product,
 * and it should never be the reason someone has to install something.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { join, extname, resolve } from "node:path";
import { spawn } from "node:child_process";

const ROOT = resolve(process.cwd());
const SITE = join(ROOT, "_site");
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  // The whole point of this site: an agent fetching a .md must get markdown,
  // not a download prompt and not text/plain.
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

let building = false;
function rebuild(reason) {
  if (building) return;
  building = true;
  const t = Date.now();
  const p = spawn(process.execPath, ["scripts/build-html.mjs"], { cwd: ROOT });
  let err = "";
  p.stderr.on("data", (d) => (err += d));
  p.on("close", (code) => {
    building = false;
    if (code === 0) console.log(`  rebuilt (${reason}) in ${Date.now() - t}ms`);
    else console.error(`  build failed:\n${err}`);
  });
}

// Watch the doc trees. A rename fires twice on some platforms, so coalesce.
let timer;
for (const dir of ["components", "demos", "foundations", "patterns"]) {
  try {
    watch(join(ROOT, dir), { recursive: true }, (_, file) => {
      if (!file?.endsWith(".md")) return;
      clearTimeout(timer);
      timer = setTimeout(() => rebuild(file), 80);
    });
  } catch {
    /* directory may not exist; not fatal for a preview */
  }
}
for (const file of ["llms.txt", "api-surface.md", "assets/docs.css"]) {
  try {
    watch(join(ROOT, file), () => {
      clearTimeout(timer);
      timer = setTimeout(() => rebuild(file), 80);
    });
  } catch {
    /* optional */
  }
}

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";

  // Serve the .md and llms.txt from the repo, not from _site — so what a reader
  // fetches is byte-for-byte the file that is committed, with no build in between.
  const fromRepo = path.endsWith(".md") || path === "/llms.txt";
  let file = join(fromRepo ? ROOT : SITE, path);

  // Don't let a path escape the tree.
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("forbidden");
    return;
  }

  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(`404  ${path}\n\nTry /  or  /llms.txt`);
  }
}).listen(PORT, () => {
  console.log(`
  @cloud/ui docs

    HTML view    http://localhost:${PORT}/
    llms.txt     http://localhost:${PORT}/llms.txt
    a raw doc    http://localhost:${PORT}/foundations/spacing.md

  Watching for .md changes. Ctrl-C to stop.
`);
});
