/**
 * Renders every .md in the repo to a sibling .html, styled with the @cloud/ui tokens.
 *
 * The markdown is the source. This is a *view* of it — which is the opposite of how
 * Cloudscape does it (they build HTML and convert it back down to markdown, which
 * loses the images, the previews, and even table cells that lived in visual columns).
 * Going md -> html loses nothing, because the md is what was written.
 *
 * The .md files are published untouched alongside the .html, so agents keep reading
 * exactly what they read before. Nothing about llms.txt changes.
 */

import { readFile, writeFile, mkdir, readdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, relative, basename, sep } from "node:path";
import { marked } from "marked";

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

/** GitHub-style heading slug, so `spacing.html#sizing` lands where the md said it would. */
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/* marked injects `this.parser` into the renderer at parse time, so these must be
 * plain functions — an arrow, or anything pre-bound, loses it. */
const renderer = {
  heading({ tokens, depth: level }) {
    const text = this.parser.parseInline(tokens);
    const id = slug(tokens.map((t) => t.raw ?? "").join(""));
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  },

  // A link to another doc must point at that doc's *view*, not at its source —
  // otherwise clicking through in the browser downloads a .md file instead of
  // opening the page. The raw markdown is still one click away, in the header.
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const internal = !/^(https?:|mailto:|#)/.test(href);
    const to = internal ? href.replace(/\.md(?=$|#)/, ".html") : href;
    const t = title ? ` title="${title}"` : "";
    const ext = internal ? "" : ' target="_blank" rel="noopener"';
    return `<a href="${to}"${t}${ext}>${text}</a>`;
  },
};

/* Wide tables scroll inside their own box rather than pushing the page sideways.
 * Done as a post-pass: re-implementing marked's table renderer to add a wrapper
 * would mean re-implementing its cell handling too, for no gain. */
const wrapTables = (html) =>
  html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page({ title, body, depth, rawHref, crumbs, extraClass = "" }) {
  const up = depth === 0 ? "." : Array(depth).fill("..").join("/");
  const trail = crumbs
    .map(
      (c) => `<span class="sep">/</span><span class="crumb">${esc(c)}</span>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en" data-theme="">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · @cloud/ui</title>
<link rel="stylesheet" href="${up}/assets/docs.css">
<script>
  // Set the theme before first paint so the page never flashes the wrong one.
  (function () {
    var t = localStorage.getItem("cloud-ui-docs-theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  })();
</script>
</head>
<body>
<header class="bar">
  <a class="home" href="${up}/index.html">@cloud/ui</a>
  ${trail}
  <span class="spacer"></span>
  <a class="raw" href="${rawHref}" title="The markdown an agent reads — the source of this page">View source .md</a>
  <button id="theme" type="button" aria-label="Switch theme">Theme</button>
</header>
<main class="${extraClass}">
${body}
</main>
<footer>
  This page is a rendered view of <a href="${rawHref}">${esc(rawHref.split("/").pop())}</a>.
  The markdown is the source; agents read it directly, and
  <a href="${up}/llms.txt">llms.txt</a> is the index they start from.
</footer>
<script>
  var root = document.documentElement;
  document.getElementById("theme").addEventListener("click", function () {
    var dark = getComputedStyle(root).colorScheme === "dark";
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cloud-ui-docs-theme", next);
  });
</script>
</body>
</html>
`;
}

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

marked.use({ gfm: true, renderer });

const files = await walk(ROOT);
let n = 0;

for (const file of files) {
  const rel = relative(ROOT, file);
  const depth = rel.split(sep).length - 1;
  const md = await readFile(file, "utf8");

  const body = wrapTables(marked.parse(md));

  const title = (md.match(/^#\s+(.+)$/m) || [, basename(rel, ".md")])[1];
  const parts = rel.split(sep);
  const crumbs = parts.length > 1 ? [parts[0]] : [];

  const outPath = join(OUT, rel.replace(/\.md$/, ".html"));
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(
    outPath,
    page({ title, body, depth, rawHref: basename(rel), crumbs }),
  );
  n++;
}

// The landing page IS llms.txt — the same map an agent gets, rendered for a human.
// One source, two views; there is no second index to keep in sync.
const llms = await readFile(join(ROOT, "llms.txt"), "utf8");
await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, "index.html"),
  page({
    title: "Documentation",
    body: wrapTables(marked.parse(llms)),
    depth: 0,
    rawHref: "llms.txt",
    crumbs: [],
    extraClass: "home-index",
  }),
);

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });

console.log(`rendered ${n} docs + index.html`);
