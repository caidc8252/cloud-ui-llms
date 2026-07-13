/**
 * Live previews for the tsx examples already in the docs.
 *
 * The docs carry 211 compilable tsx blocks. They were written to be read, not
 * run — they are fragments, and they reference things that do not exist here
 * (`onClick={applyFilters}`, `data={rows}`). Rather than rewrite 211 examples,
 * the scope answers for whatever they ask for: a Proxy hands back a stub that is
 * callable, iterable and indexable, so `applyFilters` is a no-op and `rows` is an
 * empty array. An example that still throws falls back to its code block — the
 * doc is never worse than it was.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import * as UI from "@cloud/ui";
import * as Icons from "lucide-react";

/* A value that survives being called, spread, mapped over, or read from. */
const stub = new Proxy(function () {}, {
  get: (t, k) => {
    if (k === Symbol.iterator) return function* () {};
    if (k === "length") return 0;
    if (k === Symbol.toPrimitive || k === "toString") return () => "";
    if (k === "then") return undefined; // never look like a promise
    return stub;
  },
  apply: () => stub,
  construct: () => stub,
});

const SCOPE = { React, ...UI, ...Icons };

/* Unknown identifiers resolve to the stub instead of throwing a ReferenceError. */
const scopeProxy = new Proxy(SCOPE, {
  has: () => true, // claim every name, so `with` routes lookups here
  get: (t, k) => (k in t ? t[k] : k === Symbol.unscopables ? undefined : stub),
});

/** Turn a compiled example (JS, JSX already transformed) into a React element. */
function evaluate(code) {
  // The build strips imports; what is left is statements ending in an expression.
  const fn = new Function(
    "__scope",
    `with (__scope) { return (function () { ${code} })(); }`,
  );
  return fn(scopeProxy);
}

for (const host of document.querySelectorAll("[data-preview]")) {
  const code = decodeURIComponent(host.dataset.preview);
  try {
    const el = evaluate(code);
    if (el === undefined || el === null) throw new Error("example produced no element");
    createRoot(host).render(
      <UI.ThemeProvider>
        <UI.TooltipProvider>{el}</UI.TooltipProvider>
      </UI.ThemeProvider>,
    );
    host.classList.add("live");
  } catch (err) {
    // An example that cannot run is not a failure of the doc — it just does not
    // get a preview. Say so quietly rather than shipping a broken box.
    host.remove();
    console.debug("preview skipped:", err.message);
  }
}
