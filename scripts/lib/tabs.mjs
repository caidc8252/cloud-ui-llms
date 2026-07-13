import { esc, slug } from "./read.mjs";

/**
 * Split a rendered doc into tabs, one per `## ` section.
 *
 * Nothing is configured. The component docs already share one house structure —
 * Development / General / Features / Writing / Accessibility, in 92 of 92 docs —
 * so the headings are the tab bar, and a doc that grows a section grows a tab.
 * A hand-written map of doc → tabs would be a second thing to keep in step with
 * the first, and it would be wrong the day someone adds a heading.
 *
 * The labels drop the trailing "guidelines": every section carries it, so it
 * says nothing, and five tabs reading "… guidelines" is a tab bar you have to
 * read twice.
 */
export function splitTabs(html) {
  const parts = html.split(/(?=<h2 id=")/);
  const lead = parts[0].startsWith("<h2") ? "" : parts.shift();
  if (parts.length < 3) return null; // not a doc with a shape worth tabbing

  const tabs = parts.map((part) => {
    const m = part.match(/^<h2 id="([^"]+)">(.*?)<\/h2>/s);
    const id = m?.[1] ?? slug(part.slice(0, 40));
    const title = (m?.[2] ?? "").replace(/<[^>]+>/g, "");
    const label = title.replace(/\s+guidelines$/i, "");
    // The h2 is the tab; printing it again at the top of its own panel is noise.
    const body = part.replace(/^<h2 id="[^"]+">.*?<\/h2>\n?/s, "");
    return { id, label, title, body };
  });

  return { lead, tabs };
}

export function renderTabs({ lead, tabs }) {
  const bar = tabs
    .map(
      (t, i) =>
        `<button role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" data-tab="${t.id}">${esc(t.label)}</button>`,
    )
    .join("");

  const panels = tabs
    .map(
      (t, i) =>
        `<section role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}"${i === 0 ? "" : " hidden"}>
<h2 id="${t.id}" class="panel-title">${esc(t.title)}</h2>
${t.body}</section>`,
    )
    .join("");

  return `${lead}<div class="tabs-bar" role="tablist">${bar}</div>${panels}`;
}

/** The rail follows the active tab: only the headings you can actually scroll to. */
export function tabsToc(tabs) {
  return tabs
    .map((t, i) => {
      const rows = [...t.body.matchAll(/<h3 id="([^"]+)">(.*?)<\/h3>/gs)].map(
        ([, id, text]) =>
          `<a href="#${id}" class="l3" data-id="${id}">${esc(text.replace(/<[^>]+>/g, ""))}</a>`,
      );
      /* Only the opening tab's group shows. Emitting them all visible and
       * waiting for the script to hide them lists headings the reader cannot
       * scroll to — and if the script never runs, it stays that way. */
      const hide = i > 0 || !rows.length;
      return `<div class="toc-group" data-for="${t.id}"${hide ? " hidden" : ""}>${rows.join("")}</div>`;
    })
    .join("");
}
