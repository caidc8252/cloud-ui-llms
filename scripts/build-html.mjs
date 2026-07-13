/**
 * Renders every .md to a sibling .html, in a three-column docs shell:
 * top nav / section sidebar / content / on-this-page.
 *
 * The markdown is the source. This is a *view* of it — the opposite of how
 * Cloudscape does it (they build HTML and convert it back down to markdown,
 * which loses the images, the previews, and even table cells that held visual
 * swatches). Going md -> html loses nothing, because the md is what was written.
 *
 * The navigation is not hand-written. The sidebar comes from llms.txt and the
 * on-this-page rail comes from the document's own headings — so a doc that is
 * added to the index appears in the nav, and one that is not stays invisible,
 * which is exactly the signal you want.
 */

import { readFile, writeFile, mkdir, readdir, cp } from "node:fs/promises";
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

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** GitHub-style heading slug, so `spacing.html#sizing` lands where the md said it would. */
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/* marked injects `this.parser` at parse time, so these must be plain functions —
 * an arrow, or anything pre-bound, loses it. */
const renderer = {
  heading({ tokens, depth }) {
    const raw = tokens.map((t) => t.raw ?? "").join("");
    return `<h${depth} id="${slug(raw)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
  },
  // A link to another doc points at that doc's *view*. Otherwise clicking through
  // in a browser downloads a .md file instead of opening the page; the raw markdown
  // stays one click away, in the header.
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const internal = !/^(https?:|mailto:|#)/.test(href);
    const to = internal ? href.replace(/\.md(?=$|#)/, ".html") : href;
    const t = title ? ` title="${esc(title)}"` : "";
    return `<a href="${to}"${t}${internal ? "" : ' target="_blank" rel="noopener"'}>${text}</a>`;
  },
};
marked.use({ gfm: true, renderer });

const wrapTables = (html) =>
  html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");

/* ── The index, parsed once ──────────────────────────────────────────────────
 * llms.txt is the single source for the navigation. A section becomes a top-nav
 * entry; its bullets become that section's sidebar. */

const llms = await readFile(join(ROOT, "llms.txt"), "utf8");

const sections = [];
for (const line of llms.split("\n")) {
  const h2 = line.match(/^##\s+(.+)$/);
  if (h2) {
    sections.push({ title: h2[1].trim(), items: [] });
    continue;
  }
  const item = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
  if (item && sections.length) {
    const [, name, href] = item;
    if (/^https?:/.test(href) || href.startsWith("../")) continue; // off-site: not navigable
    sections.push(sections.pop()); // no-op, keeps intent readable
    sections[sections.length - 1].items.push({
      name,
      md: href.replace(/#.*$/, ""),
    });
  }
}

/** Which section does this file belong to, and which item is it? */
function locate(rel) {
  for (const s of sections) {
    const hit = s.items.find((i) => i.md === rel);
    if (hit) return { section: s, item: hit };
  }
  return { section: null, item: null };
}

/* ── Shell ───────────────────────────────────────────────────────────────── */

function topNav(up, current) {
  return sections
    .filter((s) => s.items.length)
    .map((s) => {
      const first = s.items[0].md.replace(/\.md$/, ".html");
      const on = s === current ? ' class="on"' : "";
      return `<a href="${up}/${first}"${on}>${esc(s.title)}</a>`;
    })
    .join("");
}

function sidebar(up, section, activeMd) {
  if (!section) return "";
  const links = section.items
    .map((i) => {
      const on = i.md === activeMd ? ' class="on" aria-current="page"' : "";
      return `<a href="${up}/${i.md.replace(/\.md$/, ".html")}"${on}>${esc(i.name)}</a>`;
    })
    .join("");
  return `<nav class="side" aria-label="${esc(section.title)}">
  <h2>${esc(section.title)}</h2>
  ${links}
</nav>`;
}

/** "On this page" — built from the document's own h2/h3, never hand-written. */
function toc(md) {
  const rows = [];
  let fenced = false;
  for (const line of md.split("\n")) {
    if (/^```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const text = m[2].replace(/`/g, "").replace(/\*\*/g, "").trim();
    rows.push({ level: m[1].length, text, id: slug(m[2]) });
  }
  if (rows.length < 2) return "";
  const links = rows
    .map(
      (r) =>
        `<a href="#${r.id}" class="l${r.level}" data-id="${r.id}">${esc(r.text)}</a>`,
    )
    .join("");
  return `<nav class="toc" aria-label="On this page">
  <h2>On this page</h2>
  ${links}
</nav>`;
}

function page({ title, body, rel, section, tocHtml, home = false }) {
  const depth = rel.split(sep).length - 1;
  const up = depth === 0 ? "." : Array(depth).fill("..").join("/");
  const raw = basename(rel);
  const crumbs = home
    ? ""
    : `<nav class="crumbs" aria-label="Breadcrumb">
      <a href="${up}/index.html">@cloud/ui</a>
      ${section ? `<span>›</span><span>${esc(section.title)}</span>` : ""}
      <span>›</span><span class="here">${esc(title)}</span>
    </nav>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · @cloud/ui</title>
<link rel="stylesheet" href="${up}/assets/docs.css">
<script>
  // Before first paint, so the page never flashes the wrong theme.
  (function () { var t = localStorage.getItem("cloud-ui-docs-theme"); if (t) document.documentElement.dataset.theme = t; })();
</script>
</head>
<body${home ? ' class="is-home"' : ""}>

<header class="top">
  <button class="menu" type="button" aria-label="Show navigation" aria-expanded="false">☰</button>
  <a class="brand" href="${up}/index.html">@cloud/ui</a>
  <nav class="tabs" aria-label="Sections">${topNav(up, section)}</nav>
  <span class="grow"></span>
  <a class="btn" href="${raw}">View source .md</a>
  <button class="btn theme" type="button" aria-label="Switch theme">◐</button>
</header>
<div class="rule"></div>

<div class="shell">
  ${sidebar(up, section, rel)}
  <main>
    ${crumbs}
    ${body}
    <footer>
      A rendered view of <a href="${raw}">${esc(raw)}</a>. The markdown is the source —
      agents read it directly, starting from <a href="${up}/llms.txt">llms.txt</a>.
    </footer>
  </main>
  ${tocHtml}
</div>

<script>
  var root = document.documentElement;
  document.querySelector(".theme").addEventListener("click", function () {
    var next = getComputedStyle(root).colorScheme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("cloud-ui-docs-theme", next);
  });

  var menu = document.querySelector(".menu");
  var side = document.querySelector(".side");
  if (menu && side) menu.addEventListener("click", function () {
    var open = side.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  // Light up the section you are actually reading.
  var links = [].slice.call(document.querySelectorAll(".toc a"));
  if (links.length) {
    var seen = new Map();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen.set(e.target.id, e.isIntersecting); });
      var active = links.find(function (l) { return seen.get(l.dataset.id); });
      links.forEach(function (l) { l.classList.toggle("on", l === active); });
    }, { rootMargin: "-72px 0px -70% 0px" });
    links.forEach(function (l) {
      var el = document.getElementById(l.dataset.id);
      if (el) obs.observe(el);
    });
  }
</script>
</body>
</html>
`;
}

/* ── Render ──────────────────────────────────────────────────────────────── */

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

let n = 0;
for (const file of await walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join("/");
  const md = await readFile(file, "utf8");
  const { section } = locate(rel);
  const title = (md.match(/^#\s+(.+)$/m) || [, basename(rel, ".md")])[1].trim();

  const out = join(OUT, rel.replace(/\.md$/, ".html"));
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    page({
      title,
      body: wrapTables(marked.parse(md)),
      rel,
      section,
      tocHtml: toc(md),
    }),
  );
  n++;
}

// The landing page IS llms.txt, rendered. One source, two views — there is no
// second index to drift out of sync with the one agents read.
await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, "index.html"),
  page({
    title: "Documentation",
    body: wrapTables(marked.parse(llms)),
    rel: "index.md",
    section: null,
    tocHtml: "",
    home: true,
  }),
);

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });
console.log(
  `rendered ${n} docs + index — ${sections.filter((s) => s.items.length).length} nav sections`,
);
