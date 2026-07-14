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
/**
 * Drop the import statements — all of each one.
 *
 * The first version filtered *lines* beginning with `import`, which works right up
 * until an example wraps its import across several:
 *
 *   import {
 *     Sheet,
 *     SheetTrigger,
 *   } from "@cloud/ui";
 *
 * It removed line one and left the other four behind as loose syntax. esbuild threw,
 * compileExample returned null, and the page quietly kept a code block instead of a
 * preview — no error anywhere. Nine component pages had *no live example at all* for
 * this reason, and they are exactly the ones with enough parts to need one: Sheet,
 * Chart, ChartBar, ListSummaryBar.
 */
function stripImports(tsx) {
  const out = [];
  let inImport = false;

  for (const line of tsx.split("\n")) {
    if (inImport) {
      /* the statement ends where the module specifier does */
      if (
        /from\s*["'][^"']+["']\s*;?\s*$/.test(line) ||
        /^\s*["'][^"']+["']/.test(line)
      )
        inImport = false;
      continue;
    }
    if (/^\s*import\s/.test(line)) {
      /* a one-liner ends on the same line; anything else runs on */
      if (!/from\s*["'][^"']+["']\s*;?\s*$/.test(line) && !/;\s*$/.test(line))
        inImport = true;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

export function compileExample(tsx) {
  const body = stripImports(tsx).trim();

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
     * runtime's scope, so createElement needs no import at all.
     *
     * The fragment is not decoration. An example is free to show two things side by
     * side — advanced-filter-button renders the button *and* the sheet it opens —
     * and `return (<A /> <B />)` is a syntax error. Wrapping is a no-op for the
     * single-element case and the only way the two-element case compiles at all. */
    const { code } = transformSync(`${head}\nreturn (<>${expr}</>);`, {
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
