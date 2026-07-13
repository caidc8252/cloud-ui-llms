import { basename } from "node:path";
import { render } from "../lib/markdown.mjs";
import { page, toc } from "./layout.mjs";

/** A document page: the markdown, rendered, with a rail built from its own headings. */
export function docPage({ rel, md, section }) {
  const title = (md.match(/^#\s+(.+)$/m) || [, basename(rel, ".md")])[1].trim();
  return page({
    title,
    body: render(md),
    rel,
    section,
    tocHtml: toc(md),
  });
}
