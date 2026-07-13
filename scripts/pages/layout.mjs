/**
 * The docs shell: top nav, section sidebar, content column, on-this-page rail.
 *
 * One layout, three page kinds (doc / hub / home). Everything that varies between
 * them is a parameter; everything that does not lives here once. A page kind's
 * file builds only its own body — it does not know about the chrome, and the
 * chrome does not know about it.
 *
 * The navigation is not hand-written: the tabs and the sidebar come from
 * lib/index-model.mjs, which reads llms.txt. See that file for why.
 */

import { basename } from "node:path";
import { esc, slug } from "../lib/read.mjs";

let MODEL = null;
/** The shell needs the index to draw the nav; the build hands it over once. */
export const useIndex = (model) => (MODEL = model);

function topNav(up, current) {
  return MODEL.sections
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

export function toc(md) {
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

export function page({ title, body, rel, section, tocHtml, home = false, raw, onIndex = false }) {
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

<script src="${up}/assets/docs.js" defer></script>
</body>
</html>
`;
}
