import { transformSync } from "esbuild";

/**
 * Turn a tsx example in the docs into something the browser can run.
 *
 * The examples are fragments written to be *read*: they carry imports, and they
 * end in a bare JSX expression rather than returning anything. Two edits make
 * them runnable without touching a single doc:
 *
 *   - drop the imports — the runtime's scope already holds @cloud/ui and lucide
 *   - `return` the trailing expression, so the fragment evaluates to an element
 *
 * Anything that does not survive that keeps its plain code block. A doc is never
 * made worse by failing to gain a preview.
 */
export function compileExample(tsx) {
  const body = tsx
    .split("\n")
    .filter((l) => !/^\s*import\s/.test(l))
    .join("\n")
    .trim();

  // The example has to end in JSX. A `const` or a type above it is fine; a bare
  // statement with nothing to render is not something we can preview.
  const start = body.search(/^\s*</m);
  if (start === -1) return null;

  const head = body.slice(0, start);
  const expr = body.slice(start).replace(/;\s*$/, "");

  try {
    /* Classic JSX, not automatic. The automatic runtime emits
     *   import { jsx } from "react/jsx-runtime"
     * and an import statement is a syntax error inside `new Function` — every
     * example threw and every preview silently vanished. React is already in the
     * runtime's scope, so createElement needs no import at all. */
    const { code } = transformSync(`${head}\nreturn (${expr});`, {
      loader: "tsx",
      jsx: "transform",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    });
    return code;
  } catch {
    return null; // not runnable — the code block stands on its own
  }
}
