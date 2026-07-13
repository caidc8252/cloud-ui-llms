import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import {
  declarationOf,
  declarationPathOf,
  functionOf,
} from "./package-graph.mjs";

/**
 * A component's props, read out of the package's own type declarations.
 *
 * The first version of this file handled one component, because I had looked at
 * one. Button declares its props the cva way —
 *
 *   interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants>
 *
 * — and tsc, resolving that generic, flattens the whole cva config into the .d.ts.
 * The unions arrive already spelled out. It felt like the package was handing them
 * over.
 *
 * It hands over exactly three components that way. The other forty declare props in
 * three shapes that look nothing like it:
 *
 *   Badge     interface BadgeProps { tone?: BadgeTone; shape?: BadgeShape }
 *             — the values are behind a type alias, and `BadgeTone = Tone` is an
 *               alias to an alias, imported from another file
 *   Alert     declare function Alert(p: React.ComponentProps<"div"> & VariantProps<…>)
 *             — no Props interface at all; the variants are in a `declare const`
 *   Switch    declare function Switch(p: SwitchPrimitive.Root.Props & { size?: "sm" | "default" })
 *             — an anonymous object literal welded onto the base props
 *
 * So: read the interface if there is one, the inline literal if there is not, and
 * the cva block either way; then chase every named type through its aliases and into
 * the file it was imported from.
 *
 * Two things come out of this that the old version threw away:
 *
 *   - **The JSDoc.** "Semantic color for the value. Omit (or `neutral`) for the
 *     default text color." is already sitting in the .d.ts. That is the sentence the
 *     docs exist to say, written by whoever wrote the component, and it was being
 *     dropped on the floor.
 *   - **@deprecated.** StatCard carries `sub` and `active`, both superseded. A props
 *     table that lists them beside their replacements, unmarked, is worse than one
 *     that omits them.
 *
 * Defaults do not survive into a .d.ts — tsc strips them — so they come from the
 * bundle, out of the component function's own destructuring pattern:
 *
 *   function Ie({ className: t, tone: n = "neutral", shape: r = "pill", … })
 *
 * Minification renames the binding but it cannot rename the key, because the key is
 * the prop. That finds defaults for every shape, including the non-cva ones that
 * cva's `defaultVariants` never knew about.
 *
 * Inherited DOM props are deliberately not expanded. Fifty `aria-*` would bury the
 * four that are actually the component's.
 */

const UNION = /^\s*(?:"[^"]*"\s*\|\s*)+"[^"]*"\s*$/;
const values = (s) => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

/**
 * A named type → its union of literals, following aliases and imports.
 *
 *   tone?: BadgeTone  →  type BadgeTone = Tone  →  ../_tone  →  "neutral" | "success" | …
 *
 * Resolved relative to the declaring file's own directory, because that is what the
 * import specifier is relative to.
 */
function unionOf(type, dts, dir, seen = new Set()) {
  const t = type.trim();
  if (UNION.test(t)) return values(t);
  if (!/^\w+$/.test(t)) return null;

  /* The cycle guard is keyed by *where* a name is being resolved, not by the name.
   * Keying it by name alone silently broke the only hop that matters: resolving
   * `StatCardTone = Tone` marks "Tone" as seen, and then following the import into
   * _tone.d.ts — to resolve that very name, in the file that actually defines it —
   * looks like a cycle and gives up. Every shared Tone in the system came back as a
   * plain string, and the table said `tone: BadgeTone` instead of naming the five
   * values you can pass. */
  const here = `${dir}#${t}`;
  if (seen.has(here)) return null;
  seen.add(here);

  const local = dts.match(new RegExp(`type ${t}\\s*=\\s*([^;]+);`));
  if (local) return unionOf(local[1], dts, dir, seen);

  const imp = dts.match(
    new RegExp(
      `import\\s*\\{[^}]*\\b${t}\\b[^}]*\\}\\s*from\\s*["']([^"']+)["']`,
    ),
  );
  if (!imp) return null;
  const file = join(dir, imp[1]) + ".d.ts";
  if (!existsSync(file)) return null;
  return unionOf(t, readFileSync(file, "utf8"), dirname(file), seen);
}

/** An interface or object-literal body → props, keeping the JSDoc above each one. */
function members(body, dts, dir) {
  const props = [];
  let doc = null;
  let deprecated = false;

  for (const line of body.split("\n")) {
    const jsdoc = line.match(/\/\*\*\s*(.*?)\s*\*\//);
    if (jsdoc) {
      deprecated = /@deprecated/.test(jsdoc[1]);
      doc = jsdoc[1].replace(/@deprecated\s*/, "").trim() || null;
      continue;
    }

    const m = line.match(/^\s*(\w+)(\??):\s*(.+?);\s*$/);
    if (!m) continue;
    const [, name, opt, raw] = m;
    const union = unionOf(raw, dts, dir);

    props.push({
      name,
      optional: opt === "?",
      raw,
      doc,
      deprecated,
      default: null,
      type: union
        ? "enum"
        : raw === "boolean"
          ? "boolean"
          : /ReactNode/.test(raw)
            ? "node"
            : raw === "string"
              ? "string"
              : "other",
      ...(union ? { values: union } : {}),
    });
    doc = null;
    deprecated = false;
  }
  return props;
}

export function loadProps(component) {
  const dts = declarationOf(component);
  const path = declarationPathOf(component);
  if (!dts || !path) return null;
  const dir = dirname(path);

  const props = [];

  /* 1. cva — tsc resolved these unions for us when it emitted the declaration */
  const lower = component[0].toLowerCase() + component.slice(1);
  const cva = dts.match(
    new RegExp(`declare const ${lower}Variants[\\s\\S]*?\\}\\s*&`),
  );
  if (cva)
    for (const [, name, union] of cva[0].matchAll(
      /(\w+)\?:\s*((?:"[^"]*"\s*\|\s*)+)/g,
    ))
      props.push({
        name,
        type: "enum",
        values: values(union),
        optional: true,
        raw: null,
        doc: null,
        deprecated: false,
        default: null,
      });

  /* 2. a Props interface, if it has one */
  const iface = dts.match(
    new RegExp(`interface ${component}Props[^{]*\\{([\\s\\S]*?)\\n\\}`),
  );
  if (iface) props.push(...members(iface[1], dts, dir));

  /* 3. no interface — an anonymous literal welded onto the base props */
  if (!iface) {
    const inline = dts.match(
      new RegExp(`declare function ${component}\\([^)]*&\\s*\\{([^}]*)\\}`),
    );
    if (inline) props.push(...members(inline[1], dts, dir));
  }

  /* a prop can be declared by both cva and the interface; the cva one wins, it
   * carries the values */
  const seen = new Set();
  const unique = props.filter((p) =>
    seen.has(p.name) ? false : (seen.add(p.name), true),
  );
  if (!unique.length) return null;

  /* 4. defaults, from the component's own destructuring pattern in the bundle */
  const fn = functionOf(component);
  if (fn)
    for (const [, name, value] of fn.params.matchAll(
      /(\w+)\s*:\s*[$\w]+\s*=\s*"([^"]+)"/g,
    )) {
      const p = unique.find((x) => x.name === name);
      if (p) p.default = value;
    }

  return unique;
}
