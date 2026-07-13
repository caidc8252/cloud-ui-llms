import { basename } from "node:path";
import { render } from "../lib/markdown.mjs";
import { splitTabs, renderTabs, tabsToc } from "../lib/tabs.mjs";
import { page, toc } from "./layout.mjs";

/**
 * A document page.
 *
 * Component docs are tabbed. They share one house structure — Development /
 * General / Features / Writing / Accessibility, in 92 of 92 — so the `## `
 * headings are the tab bar, derived, with nothing to configure. Everything else
 * (patterns, foundations) scrolls, because their shape is not the same and
 * pretending otherwise would put the reader in a tab that means nothing.
 */
export function docPage({ rel, md, section }) {
  const title = (md.match(/^#\s+(.+)$/m) || [, basename(rel, ".md")])[1].trim();
  const html = render(md);

  const tabbed = section?.title === "Components" ? splitTabs(html) : null;
  if (!tabbed) {
    return page({ title, body: html, rel, section, tocHtml: toc(md) });
  }

  return page({
    title,
    body: renderTabs(tabbed),
    rel,
    section,
    // The rail follows the active tab: listing headings the reader cannot scroll
    // to is worse than listing none.
    tocHtml: `<nav class="toc tabbed" aria-label="On this page">
  <h2>On this page</h2>
  ${tabsToc(tabbed.tabs)}
</nav>`,
  });
}
