import { renderInline } from "../lib/markdown.mjs";
import { esc } from "../lib/read.mjs";
import { page } from "./layout.mjs";

/**
 * The landing page: a hero, then one card per module.
 *
 * Rendering llms.txt as a flat list — which the first pass did — gives a wall of
 * 130 rows and no way in. A landing page's job is to be a door, not a dump.
 *
 * The cards are still the index's `##` sections, so a new section appears here on
 * its own and a section that is not in llms.txt does not exist anywhere.
 */
export function homePage({ nav, tagline, entry }) {
  const cards = nav
    .map((s) => {
      const to = entry(s);
      const n = s.items.length;
      const peek = s.items
        .slice(0, 4)
        .map(
          (i) =>
            `<a href="${i.md.replace(/\.md$/, ".html")}">${esc(i.name)}</a>`,
        )
        .join("");
      return `<article class="card">
      <h3><a href="${to}">${esc(s.title)}</a></h3>
      <p>${renderInline(s.intro)}</p>
      <div class="peek">${peek}${n > 4 ? `<a class="more" href="${to}">+${n - 4} more</a>` : ""}</div>
      <span class="count">${n} ${n === 1 ? "doc" : "docs"}</span>
    </article>`;
    })
    .join("");

  const started = entry(nav.find((s) => /get started/i.test(s.title)) ?? nav[0]);
  const components = entry(
    nav.find((s) => /components/i.test(s.title)) ?? nav[0],
  );

  const body = `
<section class="hero">
  <div class="hero-in">
    <h1>@cloud/ui</h1>
    <p class="lede">The design system for Cloud applications — written to be read by an agent first.</p>
    <p class="sub">${renderInline(tagline)}</p>
    <div class="cta">
      <a class="primary" href="${started}">Get started</a>
      <a class="ghost" href="${components}">Browse components</a>
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

  return page({
    title: "Documentation",
    body,
    rel: "index.md",
    raw: "llms.txt", // the landing page's source IS the index; there is no index.md
    section: null,
    tocHtml: "",
    home: true,
  });
}
