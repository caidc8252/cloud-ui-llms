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

/**
 * The example a Playground should open on.
 *
 * A playground only earns its tab if it *shows the component*. Nine components had a
 * hand-written recipe and got one; the other sixty-odd had nothing, even though their
 * docs already carried a working example that renders — it was just further down the
 * Usage tab, under a heading, where you had to go looking for it.
 *
 * So the first example that compiles becomes the component's demo. It is the one the
 * author wrote first, which is the one they thought you should see first.
 */
export function firstExample(md) {
  for (const [, source] of md.matchAll(/```tsx\n([\s\S]*?)```/g)) {
    /* a fence nested in a list arrives indented; the code is not */
    const tsx = source.replace(/^ {2}/gm, "").trimEnd();
    const code = compileExample(tsx);
    if (code) return { source: tsx, code };
  }
  return null;
}

export function compileExample(tsx) {
  const body = stripImports(tsx).trim();

  /* The example has to end in JSX. A `const` or a type above it is fine; a bare
   * statement with nothing to render is not something we can preview.
   *
   * The `<` must be at **column zero**. Allowing an indented one — `/^\s*</m` — meant
   * the split landed on the first JSX *nested inside* a preceding const:
   *
   *   const columns: TableColumn<Merchant>[] = [
   *     { key: "status", render: (row) => (
   *       <Badge tone="success">{row.status}</Badge>     ← taken as the start
   *     ) },
   *   ];
   *
   *   <Table columns={columns} rows={rows} />            ← the actual expression
   *
   * The head was then half an array literal, esbuild threw, and the preview came back
   * empty with no error. A top-level expression is at column zero; anything indented
   * belongs to something above it. */
  const start = body.search(/^</m);
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
