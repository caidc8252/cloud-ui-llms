import { esc } from "./read.mjs";
import { functionOf, blockAt } from "./package-graph.mjs";

/**
 * What a choice actually resolves to.
 *
 * Cloudscape's Style tab is a `style` prop: a typed escape hatch for overriding
 * background, colour, border and shadow per state — default, hover, active,
 * disabled. AWS services need it, because they brand within limits.
 *
 * @cloud/ui has no such prop, and that is the design. The docs say it in as many
 * words: never put buttonVariants() on another element's className; the variant
 * follows the slot. So this tab cannot show you how to override the appearance.
 *
 * It can answer the question the reader opened it to ask — "what decides how this
 * looks?" — with the system's real answer: the variant does, and here is what each
 * one is. The same shape as Cloudscape's table, read instead of written.
 *
 * Reading it is the whole problem. The bundle is minified, and a component applies
 * its choices in one of two ways:
 *
 *   Button   e(p({ variant: i, size: a }), …)     a cva function, called with the props
 *   Badge    e(Pe, Fe[n], …)                      an object literal, indexed by the prop
 *
 * Both are found by starting from the component's *own* function — never by scanning
 * the chunk for an object whose keys look right. Tone is shared: Badge, StatCard and
 * StatusCard all take the same five values and map them to different classes, so key
 * matching alone picks whichever one the minifier happened to emit first. Starting
 * from the function that actually references the map cannot make that mistake.
 *
 * A prop whose classes are welded inline — Input builds its `variant` into a string
 * with a conditional — has no map to find, and gets no table. That is a fact about
 * the component, and inventing a table for it would be worse than the silence.
 */

const STATES = [
  ["default", (c) => !c.includes(":")],
  ["hover", (c) => c.startsWith("hover:")],
  ["active", (c) => c.startsWith("active:")],
  ["disabled", (c) => c.startsWith("disabled:")],
];

/* Only the classes that carry appearance. Layout utilities — inline-flex, gap-2,
 * shrink-0 — are the component's business, not a styling decision anyone reading
 * this gets to make.
 *
 * `text-` is the trap. `text-primary-foreground` is a colour; `text-xs` is a font
 * size, and matching it dragged every size scale in here — Button's `size` arrived
 * as a ten-row table of `text-xs`, `text-md`, `text-lg` and nothing else, which
 * answers a question about metrics on a tab about appearance. Sizes are in the API
 * table, and in the spacing foundation, where they belong. */
const FONT_SIZE = /^text-(xs|sm|base|md|lg|xl|\d?xl)$/;
const CARRIES_COLOUR = (c) =>
  /^(bg|text|border|shadow|ring|outline)-/.test(c) && !FONT_SIZE.test(c);
const strip = (c) => c.replace(/^[a-z-]+:/, "").replace(/!$/, "");

/** `{ neutral: "…", success: "…" }` → [[key, classes]] */
const entries = (body) =>
  [...body.matchAll(/"?([\w-]+)"?\s*:\s*"([^"]*)"/g)].map(([, k, v]) => [k, v]);

/** The minified binding each prop was destructured into. */
function aliases(params) {
  const map = new Map();
  for (const [, prop, alias] of params.matchAll(/(\w+)\s*:\s*([$\w]+)/g))
    map.set(prop, alias);
  return map;
}

/** The class map for one prop, or null if the component does not use one. */
function mapFor(prop, fn) {
  const { js, params, body } = fn;

  /* cva:  p({ variant: i, size: a })  — the call names the props */
  const call = body.match(
    new RegExp(`([$\\w]+)\\(\\{[^}]*\\b${prop.name}\\s*:`),
  );
  if (call) {
    const def = js.search(
      new RegExp(`\\b${call[1].replace(/\$/g, "\\$")}\\s*=`),
    );
    if (def >= 0) {
      const cfg = js.indexOf("variants:", def);
      if (cfg >= 0 && cfg - def < 4000) {
        const all = blockAt(js, cfg);
        if (all) {
          const group = all.body.search(
            new RegExp(`\\b${prop.name}\\s*:\\s*\\{`),
          );
          if (group >= 0) {
            const g = blockAt(all.body, group);
            if (g) return entries(g.body);
          }
        }
      }
    }
  }

  /* an object literal, indexed by the prop:  Fe[n] */
  const alias = aliases(params).get(prop.name);
  if (alias) {
    const idx = body.match(
      new RegExp(`([$\\w]+)\\[${alias.replace(/\$/g, "\\$")}\\]`),
    );
    if (idx) {
      const def = js.search(
        new RegExp(`\\b${idx[1].replace(/\$/g, "\\$")}\\s*=\\s*\\{`),
      );
      if (def >= 0) {
        const b = blockAt(js, def);
        if (b) return entries(b.body);
      }
    }
  }

  return null;
}

function table(prop, map) {
  const carried = map.map(([name, classes]) => [
    name,
    classes.split(/\s+/).filter((c) => c && CARRIES_COLOUR(strip(c))),
  ]);

  /* Only the states this component actually has. Badge does not change on hover, on
   * press, or when disabled — printing those three columns anyway gave a table that
   * was three-fifths em-dash, and a column of dashes reads as missing data rather
   * than as "there is nothing here to know". */
  const states = STATES.filter(([, match]) =>
    carried.some(([, classes]) => classes.some(match)),
  );

  const rows = carried
    .map(([name, classes]) => {
      const cells = states.map(([, match]) => {
        const hit = classes.filter(match).map(strip);
        return hit.length
          ? hit.map((c) => `<code>${esc(c)}</code>`).join(" ")
          : `<span class="muted">—</span>`;
      });
      return `<tr><td><code>${esc(name)}</code></td>${cells
        .map((c) => `<td>${c}</td>`)
        .join("")}</tr>`;
    })
    .join("");

  return `<h3><code>${esc(prop.name)}</code></h3>
<div class="table-scroll"><table>
<thead><tr><th>${esc(prop.name)}</th>${states
    .map(([s]) => `<th>${s}</th>`)
    .join("")}</tr></thead>
<tbody>${rows}</tbody>
</table></div>`;
}

export function styleTab(component, props) {
  const fn = functionOf(component);
  if (!fn) return null;

  const tables = [];
  for (const prop of props.filter((p) => p.type === "enum")) {
    const map = mapFor(prop, fn);
    /* Only a map that actually covers the declared values. A partial match means we
     * found the wrong object, and half a table is a lie. */
    if (!map || !prop.values.every((v) => map.some(([k]) => k === v))) continue;
    const known = map.filter(([k]) => prop.values.includes(k));

    /* A choice that carries no appearance — a size scale, which is all heights and
     * padding — would render as a table of dashes. It is a real answer to a question
     * nobody asked here. */
    const carriesAppearance = known.some(([, classes]) =>
      classes.split(/\s+/).some((c) => c && CARRIES_COLOUR(strip(c))),
    );
    if (carriesAppearance) tables.push(table(prop, known));
  }

  if (!tables.length) return null;

  return `<p class="note-inline"><strong>There is no style API.</strong> A
${esc(component)} is styled by its own props and by nothing else — the system does not
open a hole for arbitrary CSS, and the docs say so: never put a component's variant
classes on another element's <code>className</code>. If a surface needs an appearance
these choices do not carry, that is a system decision, not a local one.</p>

<p class="note-inline">What each choice <em>resolves to</em>, per state — read out of the
component's own code, so it cannot fall behind it:</p>

${tables.join("\n")}

<p class="note-inline">These are semantic tokens, not values. What <code>bg-error</code>
or <code>shadow-cta</code> becomes in light and dark is in
<a href="../foundations/colors.html">Colors</a> and
<a href="../foundations/design-tokens.html">Design tokens</a>.</p>`;
}
