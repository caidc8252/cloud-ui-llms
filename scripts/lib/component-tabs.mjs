import { esc } from "./read.mjs";
import { loadProps } from "./props.mjs";

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

  tabs.push({
    id: "style",
    label: "Style",
    body: `<p class="note-inline">There is no style API. A ${esc(title)} is styled
by its <code>variant</code> and <code>size</code>, and by nothing else — the design
system does not open a hole for arbitrary CSS, and the docs say so in as many
words: never put <code>buttonVariants()</code> on some other element's
<code>className</code>. If a surface needs an appearance the variants do not
carry, that is a system decision, not a local one.</p>
<p class="note-inline">The tokens behind those variants are in
<a href="../foundations/design-tokens.html">Design tokens</a> and
<a href="../foundations/colors.html">Colors</a>.</p>`,
  });

  tabs.push({ id: "usage", label: "Usage", body: usageHtml });

  return tabs;
}
