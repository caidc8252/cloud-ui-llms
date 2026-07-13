import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * A component's props, read out of the package's own .d.ts.
 *
 * This is the part I expected to be hard. `variant` and `size` are declared
 * through cva — `VariantProps<typeof buttonVariants>` — and their values live in
 * a config object, not in a type. Resolving that from source needs the
 * TypeScript compiler API.
 *
 * It turns out the build already did it. tsc flattens the cva config when it
 * emits declarations, so the shipped .d.ts carries the resolved unions:
 *
 *   variant?: "primary" | "secondary" | "ghost" | "ghost-danger" | "danger" | "link"
 *
 * So the props table and the playground's controls both come from the package
 * you install. Nothing is hand-listed, and nothing can drift from the component
 * — if Button grows a variant, it appears here on the next `npm i`.
 *
 * Inherited DOM props (ButtonPrimitive.Props — every onClick, every aria-*) are
 * deliberately NOT expanded. Fifty of them would bury the four that matter.
 */

const DIST = "node_modules/@cloud/ui/dist/components";

/** Where a component's declaration lives. Only the shapes we actually need. */
const KNOWN = {
  Button: "ui/primitives/button.d.ts",
};

const parseUnion = (s) =>
  [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

export async function loadProps(component) {
  const rel = KNOWN[component];
  if (!rel) return null;
  const file = join(DIST, rel);
  if (!existsSync(file)) return null;

  const dts = await readFile(file, "utf8");
  const props = [];

  /* The cva-derived props, with their values already resolved by tsc. */
  const variants = dts.match(/declare const \w+Variants[\s\S]*?\}\s*&/);
  if (variants) {
    for (const [, name, union] of variants[0].matchAll(
      /(\w+)\?:\s*((?:"[^"]*"\s*\|\s*)+)/g,
    )) {
      props.push({
        name,
        type: "enum",
        values: parseUnion(union),
        default: null,
      });
    }
  }

  /* The component's own props. Everything it does not inherit. */
  const own = dts.match(
    new RegExp(`interface ${component}Props[^{]*\\{([\\s\\S]*?)\\n\\}`),
  );
  if (own) {
    for (const line of own[1].split("\n")) {
      const m = line.match(/^\s*(\w+)(\??):\s*(.+?);\s*$/);
      if (!m) continue;
      const [, name, opt, type] = m;
      props.push({
        name,
        type:
          type === "boolean"
            ? "boolean"
            : /ReactNode/.test(type)
              ? "node"
              : type === "string"
                ? "string"
                : "other",
        raw: type,
        optional: opt === "?",
        default: null,
      });
    }
  }

  /* Defaults live in the cva config's `defaultVariants`, which is JavaScript —
   * tsc strips default values out of a declaration, so the .d.ts cannot tell us
   * that a Button with no variant is a primary one. They have to come from the
   * bundle.
   *
   * Found by *checking* rather than by guessing an anchor. The first attempt
   * looked for a quoted variant name and failed, because cva's keys are bare
   * identifiers — `link:`, not `"link":`. So instead: read every defaultVariants
   * block in dist, and accept the one whose keys are exactly this component's
   * enum props and whose values all fall inside those props' unions. That cannot
   * match the wrong component, and it does not care what the bundle is called —
   * the filename carries a content hash and changes on every build.
   */
  const enums = props.filter((p) => p.type === "enum");
  if (enums.length) {
    const dir = join("node_modules", "@cloud", "ui", "dist");
    outer: for (const f of await readdir(dir)) {
      if (!f.endsWith(".js")) continue;
      const js = await readFile(join(dir, f), "utf8");
      for (const [, block] of js.matchAll(/defaultVariants:\s*\{([^}]*)\}/g)) {
        const pairs = [...block.matchAll(/(\w+)\s*:\s*"([^"]+)"/g)];
        if (!pairs.length) continue;
        const fits = pairs.every(([, k, v]) =>
          enums.find((e) => e.name === k)?.values.includes(v),
        );
        if (!fits || pairs.length !== enums.length) continue;
        for (const [, k, v] of pairs) {
          props.find((x) => x.name === k).default = v;
        }
        break outer;
      }
    }
  }

  return props.length ? props : null;
}
