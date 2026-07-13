import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { esc } from "./read.mjs";

/**
 * What a variant actually resolves to.
 *
 * Cloudscape's Style tab is a `style` prop: a typed escape hatch that lets you
 * override background, colour, border and shadow per state — default, hover,
 * active, disabled. AWS services need it, because they brand within limits.
 *
 * @cloud/ui does not have one, and that is the design. The docs already say it:
 * never put buttonVariants() on another element's className; the variant follows
 * the slot. So a Style tab here cannot show you how to override the appearance.
 *
 * But it can answer the question the reader actually opened the tab to ask —
 * "what decides how this looks?" — with the system's real answer: the variant
 * does, and here is what each one is. Same shape as Cloudscape's, read instead
 * of written.
 *
 * The mapping is read out of the cva config in the bundle, so it cannot drift:
 * change what `danger` resolves to and this table changes with it.
 */

const STATES = [
  ["default", (c) => !c.includes(":")],
  ["hover", (c) => c.startsWith("hover:")],
  ["active", (c) => c.startsWith("active:")],
  ["disabled", (c) => c.startsWith("disabled:")],
];

/* Only the classes that carry appearance. Layout utilities (inline-flex, gap-2)
 * are the component's business, not a styling decision the reader can make. */
const CARRIES_COLOUR = /^(bg|text|border|shadow|ring|outline)-/;

const strip = (c) => c.replace(/^[a-z-]+:/, "").replace(/!$/, "");

export async function styleTab(component, props) {
  const enums = props.filter((p) => p.type === "enum");
  const variantProp = enums.find((p) => p.name === "variant");
  if (!variantProp) return null;

  /* Find the cva block for this component: the one whose variant keys are exactly
   * the union the .d.ts declared. Filenames carry a content hash; contents do not
   * lie. */
  const dir = join("node_modules", "@cloud", "ui", "dist");
  let map = null;

  for (const f of await readdir(dir)) {
    if (!f.endsWith(".js")) continue;
    const js = await readFile(join(dir, f), "utf8");
    for (const [, block] of js.matchAll(
      /variant:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*size:/g,
    )) {
      const pairs = [...block.matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)];
      const names = pairs.map(([, k]) => k);
      if (
        names.length !== variantProp.values.length ||
        !names.every((n) => variantProp.values.includes(n))
      )
        continue;
      map = pairs.map(([, name, classes]) => ({ name, classes }));
      break;
    }
    if (map) break;
  }

  if (!map) return null;

  const rows = map
    .map(({ name, classes }) => {
      const all = classes.split(/\s+/).filter((c) => CARRIES_COLOUR.test(strip(c)));
      const cells = STATES.map(([, match]) => {
        const hit = all.filter(match).map(strip);
        return hit.length
          ? hit.map((c) => `<code>${esc(c)}</code>`).join(" ")
          : `<span class="muted">—</span>`;
      });
      return `<tr><td><code>${esc(name)}</code></td>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<p class="note-inline"><strong>There is no style API.</strong> A ${esc(component)}
is styled by its <code>variant</code> and its <code>size</code>, and by nothing else — the
system does not open a hole for arbitrary CSS, and the docs say so in as many words:
never put <code>${esc(component.toLowerCase())}Variants()</code> on another element's
<code>className</code>. If a surface needs an appearance the variants do not carry, that
is a system decision, not a local one.</p>

<p class="note-inline">What each variant <em>does</em> resolve to, per state — read out of
the component's own config, so it cannot fall behind the code:</p>

<div class="table-scroll"><table>
<thead><tr><th>variant</th>${STATES.map(([s]) => `<th>${s}</th>`).join("")}</tr></thead>
<tbody>${rows}</tbody>
</table></div>

<p class="note-inline">These are semantic tokens, not values. What
<code>bg-error</code> or <code>shadow-cta</code> resolves to in light and dark is in
<a href="../foundations/colors.html">Colors</a> and
<a href="../foundations/design-tokens.html">Design tokens</a>.</p>`;
}
