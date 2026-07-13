import { esc } from "./read.mjs";
import { loadProps } from "./props.mjs";
import { styleTab } from "./style-tab.mjs";

/**
 * A component page as Cloudscape shapes one: Playground / API / Style / Usage.
 *
 * Only Usage is written by hand — it is the markdown, unchanged. The other three
 * are derived from the package you install:
 *
 *   Playground  a live component with a control per prop
 *   API         the props table
 *
 * Both read the same source: the .d.ts that ships in the tarball. tsc flattens
 * the cva config when it emits declarations, so `variant` and `size` arrive with
 * their values already resolved. Add a variant to Button and it appears in the
 * dropdown, and in the table, on the next install. There is nothing to update.
 */

function apiTable(props) {
  const rows = props
    .map((p) => {
      const type =
        p.type === "enum"
          ? p.values.map((v) => `<code>${esc(v)}</code>`).join(" | ")
          : `<code>${esc(p.raw ?? p.type)}</code>`;
      const dflt = p.default ? `<code>${esc(p.default)}</code>` : "—";
      return `<tr><td><code>${esc(p.name)}</code></td><td>${type}</td><td>${dflt}</td></tr>`;
    })
    .join("");

  return `<div class="table-scroll"><table>
<thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
<tbody>${rows}</tbody>
</table></div>
<p class="note-inline">Read out of the package's own type declarations, so this
cannot drift from the component. Props inherited from the underlying Base UI
element — every <code>onClick</code>, every <code>aria-*</code> — are not listed:
fifty of them would bury the ones that are actually yours.</p>`;
}

export async function componentTabs({ title, usageHtml }) {
  const props = await loadProps(title);
  /* No props means no playground and no table — and a page of just "Style" and
   * "Usage" is two tabs where one scroll would do. A component without a spec is
   * left exactly as it was. */
  if (!props) return null;

  const tabs = [];
  {
    tabs.push({
      id: "playground",
      label: "Playground",
      body: `<div data-playground="${encodeURIComponent(
        JSON.stringify({ component: title, props }),
      )}"></div>`,
    });
    tabs.push({ id: "api", label: "API", body: apiTable(props) });
  }

  /* Cloudscape's Style tab is a `style` prop — a typed escape hatch for
   * overriding background, colour and border per state. There is no such prop
   * here, and that is the design. So the tab answers the question the reader
   * came with — "what decides how this looks?" — with the system's real answer:
   * the variant does, and here is what each one resolves to. */
  const style = await styleTab(title, props);
  if (style) tabs.push({ id: "style", label: "Style", body: style });

  tabs.push({ id: "usage", label: "Usage", body: usageHtml });

  return tabs;
}
