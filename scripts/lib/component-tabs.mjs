import { esc } from "./read.mjs";
import { exportNamed } from "./package-graph.mjs";
import { loadProps } from "./props.mjs";
import { styleTab } from "./style-tab.mjs";

/**
 * A component page as Cloudscape shapes one: Playground / API / Style / Usage.
 *
 * Three of the four are derived from the package you install — the props, their
 * types, their defaults, the sentence the author wrote about each one, and what
 * every choice resolves to in CSS. Add a variant and it appears in the dropdown, in
 * the table, and in the style table on the next install. There is nothing here to
 * remember to update.
 *
 * The fourth cannot be derived, and pretending otherwise is how you ship a broken
 * page. A playground has to *render something* — and what a Table renders is a Table
 * with columns and rows, what an Input renders is an Input with no children at all
 * (React throws: a void element "must neither have children nor use
 * dangerouslySetInnerHTML"), and what a Modal renders is nothing, because it is
 * closed. None of that is in the types.
 *
 * So the recipes below are hand-written, and only they are. They say the one thing
 * the package cannot: what a meaningful demo of this component looks like. A
 * component with no recipe still gets API, Style and Usage — it just does not get a
 * playground, which is better than getting a broken one.
 */

/** How to render a live example. The only hand-maintained list in this pipeline. */
const PLAYGROUND = {
  Button: { children: "Button" },
  Badge: { children: "Badge" },
  Toggle: { children: "Toggle" },
  Alert: { children: "Your session expires in five minutes." },
  /* Void or self-closing: children would be a React error, not a bad demo. */
  Input: { children: false, fixed: { placeholder: "Enter a value" } },
  Textarea: { children: false, fixed: { placeholder: "Enter a description" } },
  Switch: { children: false },
  Checkbox: { children: false },
  Spinner: { children: false },
};

function apiTable(props) {
  const rows = props
    .map((p) => {
      const type =
        p.type === "enum"
          ? p.values.map((v) => `<code>${esc(v)}</code>`).join(" | ")
          : `<code>${esc(p.raw ?? p.type)}</code>`;

      const dflt = p.default ? `<code>${esc(p.default)}</code>` : "—";

      /* The JSDoc is the author's own sentence about the prop. It was sitting in the
       * .d.ts the whole time; the first version of this table threw it away and left
       * a column of types, which tells you what you may pass and never why.
       *
       * They wrote it as markdown — "Omit (or `neutral`) for the default text
       * color" — so the backticks are honoured rather than printed. */
      const note = [
        p.deprecated ? `<strong class="dep">Deprecated.</strong>` : "",
        p.doc ? esc(p.doc).replace(/`([^`]+)`/g, "<code>$1</code>") : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `<tr${p.deprecated ? ' class="row-dep"' : ""}>
<td><code>${esc(p.name)}</code>${p.optional === false ? '<span class="req">required</span>' : ""}</td>
<td>${type}</td><td>${dflt}</td><td>${note || '<span class="muted">—</span>'}</td></tr>`;
    })
    .join("");

  return `<div class="table-scroll"><table>
<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
<tbody>${rows}</tbody>
</table></div>
<p class="note-inline">Read out of the package's own type declarations, so this cannot
drift from the component. Props inherited from the underlying Base UI element — every
<code>onClick</code>, every <code>aria-*</code> — are not listed: fifty of them would
bury the ones that are actually this component's.</p>`;
}

export function componentTabs({ title, usageHtml }) {
  /* The doc's H1 is usually the export name, but not always — chart.md is titled
   * "Chart container" and the export is ChartContainer. */
  const name = exportNamed(title);
  if (!name) return null;

  const props = loadProps(name);
  /* No props of its own means no table worth reading. Several components here are
   * genuine pass-throughs — Select, Tooltip and Sheet add nothing to the Base UI
   * primitive they re-export — and a page of empty tabs would say that badly. They
   * are left exactly as they were. */
  if (!props) return null;

  const tabs = [];

  const recipe = PLAYGROUND[name];
  if (recipe)
    tabs.push({
      id: "playground",
      label: "Playground",
      body: `<div data-playground="${encodeURIComponent(
        JSON.stringify({ component: name, props, ...recipe }),
      )}"></div>`,
    });

  tabs.push({ id: "api", label: "API", body: apiTable(props) });

  /* Cloudscape's Style tab is a `style` prop — a typed escape hatch. There is none
   * here, and that is the design. So the tab answers the question the reader came
   * with — "what decides how this looks?" — with the system's real answer. */
  const style = styleTab(name, props);
  if (style) tabs.push({ id: "style", label: "Style", body: style });

  tabs.push({ id: "usage", label: "Usage", body: usageHtml });

  return tabs;
}
