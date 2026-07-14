import { basename } from "node:path";
import { render } from "../lib/markdown.mjs";
import { componentTabs } from "../lib/component-tabs.mjs";
import { renderTabs, tabsToc } from "../lib/tabs.mjs";
import { page, toc } from "./layout.mjs";

/**
 * A document page.
 *
 * A component the package describes gets Cloudscape's shape — Playground / API /
 * Style / Usage — where only Usage is written by hand: it is the markdown,
 * unchanged. Everything else is derived from the .d.ts that ships in the tarball.
 *
 * A component the package does not describe, and every pattern and foundation,
 * scrolls as it always did. Adding a playground must not make a doc without one
 * any worse.
 */
export async function docPage({ rel, md, section }) {
  const title = (md.match(/^#\s+(.+)$/m) || [, basename(rel, ".md")])[1].trim();
  const isColors = /(?:^|\/)colors\.md$/.test(rel);
  const colorPreviewLabels = isColors
    ? { preview: "Preview", light: "Light", dark: "Dark" }
    : undefined;
  const html = render(md, colorPreviewLabels);

  const tabs =
    section?.title === "Components"
      ? componentTabs({ title, md, usageHtml: html })
      : null;

  if (!tabs) {
    return page({
      title,
      body: isColors
        ? `<div class="colors-reference" data-color-mode="light">${html}</div>`
        : html,
      rel,
      section,
      tocHtml: toc(md),
    });
  }

  /* The title and the lede sit ABOVE the tab bar, as they do on cloudscape: they
   * are the two things that are true whichever tab you are in. Pulling them out
   * of Usage is what stops the page saying its own name twice. */
  const head = html.match(/^<h1[^>]*>[\s\S]*?<\/h1>\n?(<p>[\s\S]*?<\/p>)?/)?.[0] ?? "";
  const usage = tabs.find((t) => t.id === "usage");
  if (usage && head) usage.body = usage.body.replace(head, "");

  return page({
    title,
    body: renderTabs({ lead: head, tabs }),
    rel,
    section,
    tocHtml: `<nav class="toc tabbed" aria-label="On this page">
  <h2>On this page</h2>
  ${tabsToc(tabs)}
</nav>`,
  });
}
