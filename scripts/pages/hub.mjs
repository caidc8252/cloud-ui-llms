import { basename } from "node:path";
import { render, renderInline, renderFlat } from "../lib/markdown.mjs";
import { esc } from "../lib/read.mjs";
import { page } from "./layout.mjs";

/**
 * A section hub: what the section is, then a card per doc.
 *
 * The tiles ARE the section's llms.txt entries, and the text on them is the blurb
 * the index already carries — which is the decision rule itself ("use this when…,
 * otherwise use that"). So the hub tells you which doc you want before you open
 * any of them. Writing separate card copy would mean keeping the same sentence in
 * two places, and the two would drift.
 */
export function hubPage({ section, ownIndexMd }) {
  // A hand-written index.md in the directory contributes its prose (everything
  // above the first item heading). Its own list is dropped: the grid below is
  // generated and cannot fall out of date.
  const intro = ownIndexMd
    ? `<div class="intro">${render(
        ownIndexMd.replace(/^#\s+.*$/m, "").split(/^###\s+/m)[0].trim(),
      )}</div>`
    : "";

  const tiles = section.items
    .map(
      (i) => `<a class="tile" href="${basename(i.md).replace(/\.md$/, ".html")}">
      <h3>${esc(i.name)}</h3>
      <p>${renderFlat(i.blurb)}</p>
    </a>`,
    )
    .join("");

  const body = `
<h1>${esc(section.title)}</h1>
<p class="lede">${renderInline(section.intro)}</p>
${intro}
<h2 id="browse">Browse ${esc(section.title.toLowerCase())}</h2>
<div class="tiles">${tiles}</div>
`;

  return page({
    title: section.title,
    body,
    rel: `${section.dir}/index.md`,
    raw: "../llms.txt",
    section,
    tocHtml: "",
    onIndex: true,
  });
}
