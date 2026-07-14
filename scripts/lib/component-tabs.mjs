import { esc } from "./read.mjs";
import { exportNamed } from "./package-graph.mjs";
import { loadProps } from "./props.mjs";
import { inheritedProps } from "./inherited.mjs";
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
</table></div>`;
}

/**
 * The props the component does not declare, because the library it wraps does.
 *
 * The table used to end on a note saying these were deliberately left out — "fifty
 * aria-* would bury the four that matter". That is true of Button. It is the exact
 * opposite of true for Select, which declares *nothing*: @cloud/ui re-skins Base UI,
 * and for a pass-through the inherited props are not noise around the API, they are
 * the API. The rule silenced the pages that needed a table most.
 *
 * They are kept in their own section rather than merged, so a component that does
 * have props of its own still leads with them.
 */
function inheritedTable(inherited) {
  if (!inherited) return "";
  return `<h3>Inherited</h3>
<p class="note-inline">${esc(inherited.from)} declares these, and <code>@cloud/ui</code>
passes them straight through. The styling props it does own — <code>className</code>,
<code>render</code> — are not listed: those decisions are already made.</p>
${apiTable(inherited.props)}`;
}

export function componentTabs({ title, usageHtml }) {
  /* The doc's H1 is usually the export name, but not always — chart.md is titled
   * "Chart container" and the export is ChartContainer. */
  const name = exportNamed(title);
  if (!name) return null;

  const props = loadProps(name);
  const inherited = inheritedProps(name);
  /* Nothing of its own AND nothing inherited: Skeleton is a div, Label is a label,
   * and a table of `aria-*` would be the page saying nothing at length. Those are
   * left exactly as they were. */
  if (!props && !inherited) return null;

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

  tabs.push({
    id: "api",
    label: "API",
    body:
      (props ? apiTable(props) : "") +
      inheritedTable(inherited) +
      `<p class="note-inline">Read out of the type declarations that ship in the
package, so this cannot drift from the component.</p>`,
  });

  /* Cloudscape's Style tab is a `style` prop — a typed escape hatch. There is none
   * here, and that is the design. So the tab answers the question the reader came
   * with — "what decides how this looks?" — with the system's real answer. */
  const style = props ? styleTab(name, props) : null;
  if (style) tabs.push({ id: "style", label: "Style", body: style });

  tabs.push({ id: "usage", label: "Usage", body: usageHtml });

  return tabs;
}
