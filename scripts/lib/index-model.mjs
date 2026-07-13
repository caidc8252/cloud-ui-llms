import { readText } from "./read.mjs";

/**
 * llms.txt → the site's content model.
 *
 * This file is the reason the navigation cannot drift. Every section, every
 * sidebar entry and every landing-page card is derived from the index that
 * agents read — so a doc that is in llms.txt appears in the nav, and one that is
 * not stays invisible everywhere. That is the signal we want: it is the failure
 * layout.md already hit, written and good and unreachable because nobody had
 * added it to the index.
 *
 * Nothing here is hand-listed. If you find yourself wanting to special-case a
 * section, add the fact to llms.txt instead.
 */
export async function loadIndex(root, join) {
  const llms = await readText(join(root, "llms.txt"));
  const tagline = (llms.match(/^>\s*(.+)$/m) || [, ""])[1].trim();

  const sections = [];
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
      const [, name, href] = item;
      if (/^https?:/.test(href) || href.startsWith("../")) continue; // off-site: not navigable
      const blurb = line.slice(line.indexOf(")") + 1).replace(/^:\s*/, "");
      here.items.push({ name, md: href.replace(/#.*$/, ""), blurb });
      continue;
    }

    // The paragraph under a `## ` heading is that section's own description — it
    // orients an agent, and it is what the landing page's module card says.
    if (!here.items.length && /^[A-Za-z`]/.test(line)) {
      here.intro += (here.intro ? " " : "") + line.trim();
    }
  }

  /* A section earns a hub page when its docs share one directory and there is more
   * than one of them. A one-doc section (Get Started, Demos) has nothing to be an
   * index OF — the doc is the index. Code Snippets shares demos/ with Demos, so it
   * cannot own that directory's index either. */
  for (const s of sections) {
    const dirs = new Set(
      s.items.map((i) => (i.md.includes("/") ? i.md.split("/")[0] : "")),
    );
    const dir = dirs.size === 1 ? [...dirs][0] : "";
    s.dir = dir;
    s.indexHref = dir && s.items.length > 1 ? `${dir}/index.html` : null;
  }
  const claimed = new Set();
  for (const s of sections) {
    if (!s.indexHref) continue;
    if (claimed.has(s.dir)) s.indexHref = null;
    else claimed.add(s.dir);
  }

  const nav = sections.filter((s) => s.items.length);

  /** Which section does this file belong to? */
  const locate = (rel) =>
    sections.find((s) => s.items.some((i) => i.md === rel)) ?? null;

  /** Where a section's top-nav tab points: its hub, or its only doc. */
  const entry = (s) => s.indexHref ?? s.items[0].md.replace(/\.md$/, ".html");

  return { llms, tagline, sections, nav, locate, entry };
}
