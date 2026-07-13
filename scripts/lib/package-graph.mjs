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

  /* the barrels — which .d.ts declares each name */
  const dtsOf = new Map();
  const readBarrel = (file) => {
    const s = readFileSync(file, "utf8");
    const dir = dirname(file);
    const at = (spec) => {
      const t = join(dir, spec);
      return existsSync(t + ".d.ts") ? t + ".d.ts" : join(t, "index.d.ts");
    };
    for (const m of s.matchAll(
      /export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']/g,
    )) {
      const target = at(m[2]);
      for (const raw of m[1].split(",")) {
        const n = raw.trim().replace(/^type\s+/, "");
        if (n && /^[A-Z]/.test(n)) dtsOf.set(n, target);
      }
    }
    for (const m of s.matchAll(/export\s*\*\s*from\s*["']([^"']+)["']/g)) {
      const next = at(m[1]);
      if (existsSync(next)) readBarrel(next);
    }
  };
  readBarrel(join(DIST, "index.d.ts"));

  return { publicOf, fromChunk, chunks, dtsOf };
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
