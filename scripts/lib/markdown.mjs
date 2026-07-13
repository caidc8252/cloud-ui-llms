import { marked } from "marked";
import { esc, slug } from "./read.mjs";
import { compileExample } from "./preview.mjs";
import { previewsAvailable } from "./preview-available.mjs";

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
  if (lang !== "tsx" || !previewsAvailable) return body;
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

const textContent = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

function colorSwatch(value, mode) {
  const color = textContent(value);
  return `<span class="color-preview__swatch color-preview__swatch--${mode}" style="--color-preview-value: ${esc(color)}" aria-hidden="true"></span>`;
}

function colorPreview(lightValue, darkValue, { light, dark }) {
  const lightColor = textContent(lightValue);
  const darkColor = textContent(darkValue);
  return `<span class="color-preview" role="img" data-color-light="${esc(`${light}: ${lightColor}`)}" data-color-dark="${esc(`${dark}: ${darkColor}`)}" aria-label="${esc(`${light}: ${lightColor}`)}">${colorSwatch(lightValue, "light")}${colorSwatch(darkValue, "dark")}</span>`;
}

const colorModeControl = ({ light, dark }) => `<div class="color-mode-switch" role="group" aria-label="Palette visual mode">
  <button type="button" aria-pressed="true" data-color-mode-tab="light">${light} mode</button>
  <button type="button" aria-pressed="false" data-color-mode-tab="dark">${dark} mode</button>
</div>`;

/* The Colors reference has the same four data columns in every palette table.
 * Add the visual-only fifth column at render time so the Markdown remains a
 * compact, useful source for both people and agents. */
function addColorPreviews(html, { preview, light, dark }) {
  let insertedModeControl = false;
  return html.replace(
    /<table>\n<thead>\n<tr>\n<th>(Token|令牌)<\/th>\n<th>(Light value|浅色值)<\/th>\n<th>(Dark value|深色值)<\/th>\n<th>(Description|说明)<\/th>\n<\/tr>\n<\/thead>\n<tbody>([\s\S]*?)<\/tbody><\/table>/g,
    (_, token, lightHeader, darkHeader, description, rows) => {
      const withPreviews = rows.replace(
        /(<tr>\n<td>[\s\S]*?<\/td>\n<td>)([\s\S]*?)(<\/td>\n<td>)([\s\S]*?)(<\/td>)(\n<td>)/g,
        (_, beforeLight, lightValue, betweenValues, darkValue, afterDark, beforeDescription) =>
          `${beforeLight}<span class="color-value color-value--light">${lightValue}</span><span class="color-value color-value--dark">${darkValue}</span>${afterDark}\n<td>${colorPreview(lightValue, darkValue, { light, dark })}</td>${beforeDescription}`,
      );
      const modeControl = insertedModeControl
        ? ""
        : colorModeControl({ light, dark });
      insertedModeControl = true;
      return `${modeControl}<table>\n<thead>\n<tr>\n<th>${token}</th>\n<th>Value</th>\n<th>${preview}</th>\n<th>${description}</th>\n</tr>\n</thead>\n<tbody>${withPreviews}</tbody></table>`;
    },
  );
}

export const render = (md, colorPreviewLabels) => {
  const html = marked.parse(md);
  return wrapTables(
    colorPreviewLabels ? addColorPreviews(html, colorPreviewLabels) : html,
  );
};
export const renderInline = (md) => marked.parseInline(md || "");

/** Inline markdown with its anchors removed — for a card whose whole surface is a link. */
export const renderFlat = (md) =>
  renderInline(md).replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1");
