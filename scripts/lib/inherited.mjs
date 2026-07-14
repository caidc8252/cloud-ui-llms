import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { declarationOf, declarationPathOf } from "./package-graph.mjs";
import { members } from "./props.mjs";

/**
 * The props a component inherits, from the package it wraps.
 *
 * This exists because a rule I wrote turned out to be exactly backwards. The API
 * table said, in as many words:
 *
 *   Props inherited from the underlying Base UI element — every onClick, every
 *   aria-* — are not listed: fifty of them would bury the ones that are actually
 *   this component's.
 *
 * That is right for Button, which has six props of its own and inherits DOM noise.
 * It is *wrong* for Select, Tooltip, Popover, Accordion, Slider, Tabs and thirty
 * others, because those add **nothing** — @cloud/ui re-skins Base UI, and for a pure
 * pass-through the inherited props are not noise around the API, they *are* the API.
 * Applying the rule to them produced a page with no table at all, and the components
 * that most needed documenting — the compound, stateful ones — got the least.
 *
 * Base UI documents its own props properly. `SelectRootProps` has twenty-six, each
 * with a written sentence, sitting in node_modules the whole time.
 *
 * The chain is all lookups, no guessing:
 *
 *   select.d.ts   declare const Select: typeof SelectPrimitive.Root
 *                 import { Select as SelectPrimitive } from "@base-ui/react/select"
 *   index.parts   export { SelectRoot as Root } from "./root/SelectRoot.js"
 *   SelectRoot    namespace SelectRoot { type Props<…> = SelectRootProps<…> }
 *                 interface SelectRootProps { … }
 *
 * DOM props are still not expanded. `React.ComponentProps<"div">` really is fifty
 * aria-*, and Skeleton inheriting them tells you nothing you did not know.
 */

/**
 * The primitive a component wraps, and where it came from.
 *
 * Two spellings, because a Base UI package can be a family or a single component:
 *
 *   SelectPrimitive.Root.Props     Select is a family; Root is the part being wrapped
 *   MenubarPrimitive.Props         Menubar is one component; there is no part
 *
 * Only handling the first left Menubar and RadioGroup with an empty page for no
 * reason other than a dot.
 */
function baseOf(component, dts) {
  const expr =
    dts.match(
      new RegExp(`declare const ${component}:\\s*typeof\\s+(\\w+)\\.(\\w+)`),
    ) ??
    dts.match(
      new RegExp(
        `declare function ${component}\\([^)]*?(\\w+)\\.(\\w+)\\.Props`,
      ),
    ) ??
    dts.match(
      new RegExp(`declare function ${component}\\([^)]*?(\\w+)\\.Props`),
    );
  if (!expr) return null;

  const [, alias, part = null] = expr;

  /* The import tells us both the package and the name it had there:
   *   import { Menu as MenuPrimitive } from "@base-ui/react/menu"
   *
   * Walk the import statements and look inside each, rather than writing one regex
   * that spans from the alias to the `from`. The spanning version slid across the
   * end of its own statement into the *next* one's `from`, and reported that
   * AlertDialog and Tabs were wrappers around `class-variance-authority`. It did not
   * fail — it returned a confident, wrong answer, and the only reason it was caught
   * is that the resolved count went down by two when it should have gone up. */
  for (const m of dts.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g,
  )) {
    if (!new RegExp(`(\\w+)\\s+as\\s+${alias}\\b`).test(m[1])) continue;
    const origin = m[1].match(new RegExp(`(\\w+)\\s+as\\s+${alias}\\b`))[1];
    /* A relative import is another @cloud/ui file, not a wrapped library. And
     * React's own DOM props really are the fifty aria-* the old rule was for. */
    if (m[2].startsWith(".")) return null;
    return { pkg: m[2], part, origin };
  }
  return null;
}

/** `@base-ui/react/select` + `Root` → the interface body that declares its props. */
function interfaceFor({ pkg, part, origin }) {
  const dir = join("node_modules", pkg);

  let ns, file;

  if (part) {
    /* a family: index.parts says which file holds the part
     *   export { SelectRoot as Root } from "./root/SelectRoot.js" */
    const parts = join(dir, "index.parts.d.ts");
    if (!existsSync(parts)) return null;
    const hit = readFileSync(parts, "utf8").match(
      new RegExp(
        `export\\s*\\{\\s*(\\w+)\\s+as\\s+${part}\\s*\\}\\s*from\\s*["']([^"']+)["']`,
      ),
    );
    if (!hit) return null;
    ns = hit[1];
    file = join(dir, hit[2].replace(/\.js$/, ".d.ts"));
  } else {
    /* a single component: the namespace is the name it was imported under, and Base
     * UI puts it in a file of the same name — menubar/Menubar.d.ts */
    ns = origin;
    file = join(dir, `${origin}.d.ts`);
  }

  if (!file || !existsSync(file)) return null;
  const src = readFileSync(file, "utf8");

  /* namespace SelectRoot { type Props<Value, Multiple…> = SelectRootProps<…> }
   *
   * The generic parameters can carry defaults — `Multiple extends boolean = false` —
   * so a lazy `[^=]*=` lands on *that* `=` and captures `false` as the interface
   * name. Select, Popover, Tooltip and Accordion all came back empty because of it,
   * which reads as "this has no inherited props" rather than as a parse failure. */
  const alias = src.match(
    new RegExp(
      `namespace ${ns}\\s*\\{[\\s\\S]*?type Props\\s*(?:<[^>]*>)?\\s*=\\s*(\\w+)`,
    ),
  );
  const name = alias?.[1] ?? `${ns}Props`;

  const iface = src.match(
    new RegExp(`interface ${name}[^{]*\\{([\\s\\S]*?)\\n\\}`),
  );
  return iface ? { body: iface[1], src, dir: dirname(file), from: pkg } : null;
}

export function inheritedProps(component) {
  const dts = declarationOf(component);
  const path = declarationPathOf(component);
  if (!dts || !path) return null;

  const base = baseOf(component, dts);
  if (!base) return null;

  const found = interfaceFor(base);
  if (!found) return null;

  const props = members(found.body, found.src, found.dir)
    /* `render` and `className` are how every Base UI part is styled, and @cloud/ui
     * has already made those decisions. Listing them invites undoing them. */
    .filter((p) => !["className", "render", "children"].includes(p.name));

  return props.length ? { from: found.from, props } : null;
}
