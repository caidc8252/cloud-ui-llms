/**
 * Renders every .md to a sibling .html, in a three-column docs shell.
 *
 * The markdown is the source. This is a *view* of it — the opposite of how
 * Cloudscape does it (they build HTML and convert the rendered pages back down to
 * markdown, which loses the images, the previews, and even table cells that held
 * visual swatches). Going md -> html loses nothing, because the md is what was
 * written.
 *
 *   lib/index-model  llms.txt -> the section model. Nothing in the nav is hand-listed.
 *   lib/markdown     marked config: link rewriting, heading slugs, table wrapping.
 *   pages/*          one file per page kind. The shell is layout.mjs and only that.
 *   lib/verify       refuses to finish if any href or src in the output is broken.
 *
 * The .md files themselves are published untouched alongside the .html, so agents
 * read exactly what they read before.
 */

import { writeFile, mkdir, readdir, cp, rm } from "node:fs/promises";
import { join, dirname, relative, sep } from "node:path";

import { readText } from "./lib/read.mjs";
import { loadIndex } from "./lib/index-model.mjs";
import { verify } from "./lib/verify.mjs";
import { useIndex } from "./pages/layout.mjs";
import { docPage } from "./pages/doc.mjs";
import { hubPage } from "./pages/hub.mjs";
import { homePage } from "./pages/home.mjs";
import { buildPreviewAssets } from "./lib/preview-assets.mjs";
import { previewsAvailable } from "./lib/preview-available.mjs";

const ROOT = process.cwd();
const OUT = join(ROOT, "_site");
const SKIP = new Set([
  ".git",
  ".github",
  "node_modules",
  "_site",
  "scripts",
  "assets",
]);

// The output is a complete view of the source tree. Start clean so removing a
// source document also removes its previously generated HTML route.
await rm(OUT, { recursive: true, force: true });

const write = async (rel, html) => {
  const out = join(OUT, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
};

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const index = await loadIndex(ROOT, join);
useIndex(index);

// ── Documents ──────────────────────────────────────────────────────────────
let docs = 0;
for (const file of await walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join("/");
  const md = await readText(file);
  await write(
    rel.replace(/\.md$/, ".html"),
    await docPage({ rel, md, section: index.locate(rel) }),
  );
  docs++;
}

// ── Section hubs ───────────────────────────────────────────────────────────
for (const section of index.sections) {
  if (!section.indexHref) continue;
  let ownIndexMd = null;
  try {
    ownIndexMd = await readText(join(ROOT, section.dir, "index.md"));
  } catch {
    /* no index.md — the section's llms.txt paragraph is introduction enough */
  }
  await write(section.indexHref, hubPage({ section, ownIndexMd }));
}

// ── Landing ────────────────────────────────────────────────────────────────
await write("index.html", homePage(index));

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });

/* ── The live-preview assets ─────────────────────────────────────────────────
 * Only built when something needs them. They are heavy — a Tailwind pass over
 * @cloud/ui plus a React bundle — and a docs page with no tsx example should not
 * pay for either. */
if (previewsAvailable) await buildPreviewAssets(OUT);

const pages = await verify(OUT);
console.log(
  `rendered ${docs} docs + ${pages - docs} generated pages — ${index.nav.length} nav sections`,
);
