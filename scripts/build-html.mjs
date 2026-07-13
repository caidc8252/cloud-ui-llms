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

import {
  readFile as _readFile,
  writeFile,
  mkdir,
  readdir,
  cp,
} from "node:fs/promises";

/* Read a text file with its line endings normalised.
 *
 * On a Windows checkout git hands these files back with CRLF, and that quietly
 * destroys the parsing: in a JS regex `.` does not match `\r` (it is a line
 * terminator) and a non-multiline `$` demands the true end of the string — so
 * `/^##\s+(.+)$/` simply fails on "## Components\r", every section comes back
 * empty, and the build dies on `nav[0].items`. The heading scan behind the
 * on-this-page rail fails the same way, but silently: the rail just comes out
 * empty and nobody notices.
 *
 * Normalising once, here, is the fix — the parsers below then only ever see \n.
 */
const readFile = async (p, enc = "utf8") =>
  (await _readFile(p, enc)).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
import { join, dirname, relative, basename, resolve, sep } from "node:path";
import { existsSync } from "node:fs";
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
    // Links that escape the site root (the .claude/team-rule ones) are already a
    // 404 for every reader. Don't also mangle their extension — leave them exactly
    // as the markdown wrote them, so the pending decision about them stays visible.
    const offSite = href.includes("/.claude/");
    const to = internal && !offSite ? href.replace(/\.md(?=$|#)/, ".html") : href;
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
const tagline = (llms.match(/^>\s*(.+)$/m) || [, ""])[1].trim();

for (const line of llms.split("\n")) {
  const h2 = line.match(/^##\s+(.+)$/);
  if (h2) {
    sections.push({ title: h2[1].trim(), intro: "", items: [] });
    continue;
  }
  if (!sections.length) continue;
  const here = sections[sections.length - 1];

  const item = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
  if (item) {
    const [, name, href, ] = item;
    if (/^https?:/.test(href) || href.startsWith("../")) continue; // off-site: not navigable
    const rest = line.slice(line.indexOf(")") + 1).replace(/^:\s*/, "");
    here.items.push({ name, md: href.replace(/#.*$/, ""), blurb: rest });
    continue;
  }
  // The paragraph under a `## ` heading is that section's own description — it
  // orients an agent, and it is what the landing page's module card says.
  if (!here.items.length && /^[A-Za-z`]/.test(line)) {
    here.intro += (here.intro ? " " : "") + line.trim();
  }
}

/* A section earns an index page when its docs share one directory and there is
 * more than one of them. A one-doc section (Get Started, Demos) has nothing to
 * be an index OF — the doc is the index. Code Snippets shares demos/ with the
 * Demos section, so it cannot own that directory's index either. */
for (const s of sections) {
  const dirs = new Set(
    s.items.map((i) => (i.md.includes("/") ? i.md.split("/")[0] : "")),
  );
  const dir = dirs.size === 1 ? [...dirs][0] : "";
  s.dir = dir;
  s.indexHref = dir && s.items.length > 1 ? `${dir}/index.html` : null;
}
// Two sections cannot claim the same directory's index. First one wins.
const claimed = new Set();
for (const s of sections) {
  if (!s.indexHref) continue;
  if (claimed.has(s.dir)) s.indexHref = null;
  else claimed.add(s.dir);
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
      const to = s.indexHref ?? s.items[0].md.replace(/\.md$/, ".html");
      const on = s === current ? ' class="on"' : "";
      return `<a href="${up}/${to}"${on}>${esc(s.title)}</a>`;
    })
    .join("");
}

function sidebar(up, section, activeMd, onIndex = false) {
  if (!section) return "";
  const overview = section.indexHref
    ? `<a href="${up}/${section.indexHref}"${onIndex ? ' class="on" aria-current="page"' : ""}>Overview</a>`
    : "";
  const links = section.items
    .map((i) => {
      const on = i.md === activeMd ? ' class="on" aria-current="page"' : "";
      return `<a href="${up}/${i.md.replace(/\.md$/, ".html")}"${on}>${esc(i.name)}</a>`;
    })
    .join("");
  return `<nav class="side" aria-label="${esc(section.title)}">
  <h2>${esc(section.title)}</h2>
  ${overview}
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

function page({ title, body, rel, section, tocHtml, home = false, raw, onIndex = false }) {
  /* `rel` is always slash-separated — see the render loop, which normalises it.
   * Splitting on the platform separator would therefore find nothing on Windows
   * (sep is "\\"), depth would come out 0 for every page, and `up` would be "."
   * from inside foundations/ — so the stylesheet, the nav and every crumb would
   * 404 and the whole site would render unstyled. Split on "/" and only "/". */
  const depth = rel.split("/").length - 1;
  const up = depth === 0 ? "." : Array(depth).fill("..").join("/");
  raw = raw ?? basename(rel);
  // On a section's own hub the section name IS the title — don't say it twice.
  const trail =
    section && !onIndex
      ? `<span>›</span><a href="${up}/${section.indexHref ?? section.items[0].md.replace(/\.md$/, ".html")}">${esc(section.title)}</a>`
      : "";
  const crumbs = home
    ? ""
    : `<nav class="crumbs" aria-label="Breadcrumb">
      <a href="${up}/index.html">@cloud/ui</a>
      ${trail}
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

<div class="shell${tocHtml ? "" : " no-toc"}">
  ${sidebar(up, section, rel, onIndex)}
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

/* ── Section index pages ─────────────────────────────────────────────────────
 * A hub for each section: what it is, then a card per doc. Cloudscape's
 * /foundation/ shape — introduction, then "browse".
 *
 * The cards are the section's llms.txt entries, and the text on them is the
 * blurb the index already carries. That blurb is the decision rule — "use this
 * when…, otherwise use that" — so the hub tells you which doc you want before
 * you open any of them. Writing separate card copy would mean maintaining the
 * same sentence twice, and the two would drift.
 */

for (const sec of sections) {
  if (!sec.indexHref) continue;

  // If the directory ships a hand-written index.md, its prose (everything above
  // the first item heading) becomes the introduction. Its own list is dropped —
  // the grid below is generated from llms.txt and cannot fall out of date.
  let intro = "";
  const ownIndex = join(ROOT, sec.dir, "index.md");
  try {
    const raw = await readFile(ownIndex);
    const body = raw.replace(/^#\s+.*$/m, "").split(/^###\s+/m)[0].trim();
    if (body) intro = `<div class="intro">${marked.parse(body)}</div>`;
  } catch {
    /* no index.md — the section's llms.txt paragraph is introduction enough */
  }

  /* The whole tile is the link, so the blurb cannot keep its own anchors — an <a>
   * inside an <a> is invalid HTML and the browser will tear the outer link apart.
   * Their hrefs would be wrong here anyway: they are written relative to llms.txt
   * at the repo root, not to this directory. Keep the words, drop the anchors. */
  const flatten = (md) =>
    marked.parseInline(md || "").replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1");

  const cards = sec.items
    .map(
      (i) => `<a class="tile" href="${basename(i.md).replace(/\.md$/, ".html")}">
      <h3>${esc(i.name)}</h3>
      <p>${flatten(i.blurb)}</p>
    </a>`,
    )
    .join("");

  const body = `
<h1>${esc(sec.title)}</h1>
<p class="lede">${marked.parseInline(sec.intro || "")}</p>
${intro}
<h2 id="browse">Browse ${esc(sec.title.toLowerCase())}</h2>
<div class="tiles">${cards}</div>
`;

  const out = join(OUT, sec.dir, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    page({
      title: sec.title,
      body,
      rel: `${sec.dir}/index.md`,
      raw: "../llms.txt",
      section: sec,
      tocHtml: "",
      onIndex: true,
    }),
  );
}

/* ── Landing page ────────────────────────────────────────────────────────────
 * A hero and one card per section, both generated from llms.txt. Rendering the
 * whole index as a flat list — which is what the first pass did — gives a wall
 * of 130 rows and no way in. A landing page's job is to be a door, not a dump.
 *
 * The cards still come from the index, so a new section appears here on its own
 * and a section that is not in llms.txt does not exist anywhere. */

const nav = sections.filter((s) => s.items.length);

const cards = nav
  .map((s) => {
    const first = s.items[0].md.replace(/\.md$/, ".html");
    const n = s.items.length;
    // A few real entries, so the card shows what is actually inside it.
    const peek = s.items
      .slice(0, 4)
      .map(
        (i) =>
          `<a href="${i.md.replace(/\.md$/, ".html")}">${esc(i.name)}</a>`,
      )
      .join("");
    return `<article class="card">
      <h3><a href="${first}">${esc(s.title)}</a></h3>
      <p>${marked.parseInline(s.intro || "")}</p>
      <div class="peek">${peek}${n > 4 ? `<a class="more" href="${first}">+${n - 4} more</a>` : ""}</div>
      <span class="count">${n} ${n === 1 ? "doc" : "docs"}</span>
    </article>`;
  })
  .join("");

const getStarted = (nav.find((s) => /get started/i.test(s.title)) ?? nav[0])
  .items[0].md.replace(/\.md$/, ".html");
const componentsHref = (nav.find((s) => /components/i.test(s.title)) ?? nav[0])
  .items[0].md.replace(/\.md$/, ".html");

const homeBody = `
<section class="hero">
  <div class="hero-in">
    <h1>@cloud/ui</h1>
    <p class="lede">The design system for Cloud applications — written to be read by an agent first.</p>
    <p class="sub">${marked.parseInline(tagline)}</p>
    <div class="cta">
      <a class="primary" href="${getStarted}">Get started</a>
      <a class="ghost" href="${componentsHref}">Browse components</a>
      <a class="ghost" href="llms.txt">llms.txt</a>
    </div>
  </div>
</section>

<section class="cards">${cards}</section>

<section class="note">
  <h2>The markdown is the source</h2>
  <p>
    Every page here is a view of a <code>.md</code> file. Agents read those files directly,
    starting from <a href="llms.txt">llms.txt</a> — the same index this page is built from,
    so the two can never drift apart.
  </p>
  <p>
    That direction matters. A docs site that builds HTML and converts it <em>back down</em> to
    markdown for LLMs ships a degraded copy: the images go, the previews go, and table cells that
    held visual swatches come out empty. Here nothing can be lost, because the markdown is what
    was written.
  </p>
</section>
`;

await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, "index.html"),
  page({
    title: "Documentation",
    body: homeBody,
    rel: "index.md",
    raw: "llms.txt", // the landing page's source IS the index; there is no index.md
    section: null,
    tocHtml: "",
    home: true,
  }),
);

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });

/* Every page's relative paths must actually resolve. This is not paranoia: the
 * depth calculation split a slash-separated path on the platform separator, so on
 * Windows every page came out at depth 0, `up` was ".", and the stylesheet, the
 * nav and every breadcrumb 404'd — the site rendered as unstyled text and the
 * build said nothing. A build that cannot see that is not finished. */
{
  const pages = [];
  const collect = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const f = join(dir, e.name);
      if (e.isDirectory()) await collect(f);
      else if (e.name.endsWith(".html")) pages.push(f);
    }
  };
  await collect(OUT);

  let broken = 0;
  for (const f of pages) {
    const html = await _readFile(f, "utf8");
    for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(https?:|mailto:|\/)/.test(href)) continue;
      if (href.includes("/.claude/")) continue; // known: escapes the site, pending
      if (/\.(md|txt)$/.test(href)) continue; // published beside the html, not by it
      if (!existsSync(resolve(dirname(f), href))) {
        if (broken < 6) console.error(`  broken: ${relative(OUT, f)} -> ${href}`);
        broken++;
      }
    }
  }
  if (broken) {
    console.error(`\n${broken} broken reference(s) in the built site.`);
    process.exit(1);
  }
}

console.log(
  `rendered ${n} docs + index — ${sections.filter((s) => s.items.length).length} nav sections`,
);
