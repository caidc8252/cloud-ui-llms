import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Where a component actually lives — its declaration, and its code.
 *
 * Nothing here is a list. Both halves are read out of the package's own module
 * graph, which is the one thing that cannot be out of date with the package.
 *
 * The declaration is easy: the barrels say it.
 *
 *   export { Button, buttonVariants } from './primitives/button';
 *
 * The code is the hard half, and the first two attempts were wrong. The bundle is
 * minified, so `Button` is a function called `m`, and there are no .js sourcemaps
 * to undo that. Matching the function by its prop names looked like it worked —
 * Badge has `tone`, `shape`, `dot`, and exactly one function destructures those
 * three. But `Switch`'s only own prop is `size`, and *twenty-two* functions in the
 * bundle destructure a `size`. Subset-matching cannot identify a component; it
 * just happens to succeed on the ones with unusual props.
 *
 * The module graph, though, is not ambiguous. Rollup renames symbols but it has to
 * keep the wiring intact, so the rename is written down — three hops, all lookups,
 * no guessing:
 *
 *   chunk    export { Ie as Mn }               internal    → chunk export
 *   index    import { Mn as G } from "./chunk" chunk export → index local
 *   index    export { G as Badge }             index local  → public name
 *
 * Follow it backwards from `Badge` and you land on `Ie`, which is the function
 * that implements it. That is an identity, not a heuristic.
 */

const DIST = "node_modules/@cloud/ui/dist";

const pairs = (block) =>
  [...block.matchAll(/([$\w]+)\s+as\s+([$\w]+)/g)].map((m) => [m[1], m[2]]);

const EMPTY = {
  publicOf: new Map(),
  fromChunk: new Map(),
  chunks: {},
  dtsOf: new Map(),
};

let graph = null;

function build() {
  /* @cloud/ui is private and this repo is public, so the tarball is not committed
   * and a fresh clone builds without it. Everything downstream already treats "no
   * props" as "no tabs" — but only if this returns instead of throwing. It threw,
   * and the whole build died on a package that was never promised to be here. */
  if (!existsSync(join(DIST, "index.js"))) return EMPTY;

  const index = readFileSync(join(DIST, "index.js"), "utf8");

  /* index.js — what each local name is exported as, and where it came from */
  const publicOf = new Map();
  for (const m of index.matchAll(/export\s*\{([\s\S]*?)\}/g))
    for (const [local, pub] of pairs(m[1])) publicOf.set(local, pub);

  const fromChunk = new Map();
  for (const m of index.matchAll(
    /import\s*\{([\s\S]*?)\}\s*from\s*["']\.\/([^"']+)["']/g,
  ))
    for (const [exp, local] of pairs(m[1])) fromChunk.set(local, [m[2], exp]);

  /* every chunk — what each export name is called inside */
  const chunks = {};
  for (const f of readdirSync(DIST).filter((f) => f.endsWith(".js"))) {
    const js = readFileSync(join(DIST, f), "utf8");
    const internalOf = new Map();
    for (const m of js.matchAll(/export\s*\{([\s\S]*?)\};?\s*$/gm))
      for (const [internal, exp] of pairs(m[1])) internalOf.set(exp, internal);
    chunks[f] = { js, internalOf };
  }

  /* the barrels — which .d.ts declares each name
   *
   * Two shapes, and only handling the first one hid a third of the package.
   *
   *   components/ui      export { Button } from './primitives/button'   re-export
   *   components/layout  export * from './sidebar'                      …and then
   *                      sidebar.d.ts ends: export { Sidebar, … };      a LOCAL export
   *
   * The second has no `from` clause, because the names are declared in that very
   * file. Requiring one meant every layout component — Sidebar, PageHeader,
   * AppHeader, ActionFooter — resolved to nothing, and their doc pages silently got
   * no tabs. `ui` worked only because its barrel happens to be written the other way.
   */
  const dtsOf = new Map();
  const seen = new Set();

  const readBarrel = (file) => {
    if (seen.has(file)) return;
    seen.add(file);

    const s = readFileSync(file, "utf8");
    const dir = dirname(file);

    /* Only a *relative* specifier points into this package. The chart barrel does
     *
     *   export { …, Label, LabelList, Rectangle, … } from "recharts";
     *
     * and treating that bare specifier as a path built a local filename that does
     * not exist — and then overwrote the real `Label`, which is a @cloud/ui
     * component, with it. Label's doc page went blank the moment charts were
     * reachable. Names that come from another package are not ours to document. */
    const at = (spec) => {
      if (!spec.startsWith(".")) return null;
      const t = join(dir, spec);
      return existsSync(t + ".d.ts") ? t + ".d.ts" : join(t, "index.d.ts");
    };

    const take = (list, target) => {
      if (!target || !existsSync(target)) return;
      for (const raw of list.split(",")) {
        const n = raw.trim().replace(/^type\s+/, "");
        if (n && /^[A-Z]/.test(n)) dtsOf.set(n, target);
      }
    };

    for (const m of s.matchAll(
      /export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']/g,
    ))
      take(m[1], at(m[2]));

    /* a local export list: the names are declared in this very file */
    for (const m of s.matchAll(/export\s*\{([^}]*)\}\s*;/g)) take(m[1], file);

    /* …or declared and exported in one breath, with no list at all:
     *   export declare function Sidebar({ … }: SidebarProps): JSX.Element
     * Every layout component is written this way. Requiring an `export { … }`
     * meant Sidebar, SidebarTrigger and Resizable resolved to nothing. */
    for (const m of s.matchAll(
      /export\s+declare\s+(?:function|const)\s+([A-Z]\w*)/g,
    ))
      dtsOf.set(m[1], file);

    for (const m of s.matchAll(/export\s*\*\s*from\s*["']([^"']+)["']/g)) {
      const next = at(m[1]);
      if (next && existsSync(next)) readBarrel(next);
    }
  };

  /* Seed from every entry point the package publishes, not just the root. Charts
   * are exported from "./components/chart" and are *not* re-exported by the root
   * barrel — starting at index.d.ts alone, all seven of them do not exist. */
  const pkg = JSON.parse(
    readFileSync(join("node_modules", "@cloud", "ui", "package.json"), "utf8"),
  );
  for (const entry of Object.keys(pkg.exports ?? { ".": {} })) {
    if (entry.includes("*") || /\.(css|json)$/.test(entry)) continue;
    const file = join(DIST, entry.replace(/^\.\/?/, ""), "index.d.ts");
    const flat = join(DIST, entry.replace(/^\.\/?/, "")) + ".d.ts";
    if (existsSync(file)) readBarrel(file);
    else if (existsSync(flat)) readBarrel(flat);
  }

  return { publicOf, fromChunk, chunks, dtsOf };
}

/**
 * The export a doc page is about.
 *
 * Most component docs are titled with the export name — `# Button`, `# StatCard` —
 * and resolve directly. A few are titled in prose: `chart.md` says "Chart container",
 * and the export is `ChartContainer`. So a title that does not resolve is tried again
 * with its words joined. A title that resolves to nothing either way is not a
 * component, and there are plenty of those: `layout.md`, `semantic-tone.md`.
 */
export function exportNamed(title) {
  graph ??= build();
  if (graph.dtsOf.has(title)) return title;

  const joined = title
    .trim()
    .split(/[\s-]+/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return graph.dtsOf.has(joined) ? joined : null;
}

/** The path of the .d.ts that declares this component, or null. */
export function declarationPathOf(name) {
  graph ??= build();
  const f = graph.dtsOf.get(name);
  return f && existsSync(f) ? f : null;
}

/** The source of that .d.ts, or null. */
export function declarationOf(name) {
  const f = declarationPathOf(name);
  return f ? readFileSync(f, "utf8") : null;
}

/** The chunk source, and the internal name of this component's function. */
export function implementationOf(name) {
  graph ??= build();
  for (const [local, pub] of graph.publicOf) {
    if (pub !== name) continue;
    const hit = graph.fromChunk.get(local);
    if (!hit) continue;
    const [file, exp] = hit;
    const chunk = graph.chunks[file];
    if (!chunk) continue;
    return { js: chunk.js, internal: chunk.internalOf.get(exp) ?? exp };
  }
  return null;
}

/** The body of a brace-delimited block, starting at the `{` on or after `from`. */
export function blockAt(src, from) {
  const start = src.indexOf("{", from);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0)
      return { body: src.slice(start + 1, i), end: i };
  }
  return null;
}

/** A component's function: its destructuring pattern and its body. */
export function functionOf(name) {
  const impl = implementationOf(name);
  if (!impl) return null;
  const re = new RegExp(
    `function ${impl.internal.replace(/\$/g, "\\$")}\\s*\\(`,
  );
  const at = impl.js.search(re);
  if (at < 0) return null;

  /* the destructuring pattern is the first {...} after the paren */
  const params = blockAt(impl.js, at + impl.js.slice(at).indexOf("("));
  if (!params) return null;
  const body = blockAt(impl.js, params.end);
  return { js: impl.js, params: params.body, body: body?.body ?? "" };
}
