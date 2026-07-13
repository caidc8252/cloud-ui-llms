import { marked } from "marked";
import { esc, slug } from "./read.mjs";
import { compileExample } from "./preview.mjs";

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

/* A tsx example gets a live preview above it — the same component the reader is
 * about to copy, rendered from the same package the app imports. The code that
 * cannot run keeps its block and nothing else changes. */
renderer.code = function ({ text, lang }) {
  const body = `<pre><code class="language-${esc(lang ?? "")}">${esc(text)}</code></pre>`;
  if (lang !== "tsx") return body;
  const js = compileExample(text);
  if (!js) return body;
  return `<div class="demo"><div class="demo-stage" data-preview="${encodeURIComponent(js)}"></div>${body}</div>`;
};

marked.use({ gfm: true, renderer });

/* Wide tables scroll inside their own box rather than pushing the page sideways.
 * A post-pass: re-implementing marked's table renderer to add a wrapper would mean
 * re-implementing its cell handling too, for no gain. */
const wrapTables = (html) =>
  html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");

export const render = (md) => wrapTables(marked.parse(md));
export const renderInline = (md) => marked.parseInline(md || "");

/** Inline markdown with its anchors removed — for a card whose whole surface is a link. */
export const renderFlat = (md) =>
  renderInline(md).replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1");
