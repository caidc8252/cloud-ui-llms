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
/* The charts are a separate entry point — the root barrel does not re-export them,
 * so `ChartContainer` and `BarChart` were never in scope and every chart example
 * resolved them to the stub, which renders nothing. */
import * as Charts from "@cloud/ui/components/chart";
import * as Icons from "lucide-react";
import { Playground } from "./configurator.jsx";

/* A value that survives being called, spread, mapped over, or read from.
 *
 * It also has to survive being read as a *date*. The examples pass one around —
 * `<DatePicker value={date} />` — and `date` is not defined here, so it is this
 * stub. Coercing to "" made `new Date(stub)` an Invalid Date, and the component
 * threw `RangeError: Invalid time value` deep inside a formatter. Every date
 * component's preview was an empty box.
 *
 * So the primitive is a real instant: a number where a number is wanted, an ISO
 * string otherwise. A stub that reads as "now" is a plausible value for anything
 * that wanted a date, and harmless to everything that did not. */
const stub = new Proxy(function () {}, {
  get: (t, k) => {
    if (k === Symbol.iterator) return function* () {};
    if (k === "length") return 0;
    if (k === "then") return undefined; // never look like a promise
    if (k === Symbol.toPrimitive)
      return (hint) =>
        hint === "number" ? Date.now() : new Date().toISOString();
    if (k === "toString") return () => new Date().toISOString();
    if (k === "valueOf") return () => Date.now();
    if (k === "getTime") return () => Date.now();
    return stub;
  },
  apply: () => stub,
  construct: () => stub,
});

/* The hooks by bare name, as the examples write them. Without these `useState` is
 * an unknown identifier, resolves to the stub, and `const [date, setDate] =
 * useState()` silently destructures into two undefineds — an example that appears to
 * work and holds no state. */
const { useState, useEffect, useMemo, useRef, useCallback, useId } = React;

/**
 * Order matters, and getting it wrong was silently wrong for weeks.
 *
 * lucide-react exports icons called `Badge`, `Calendar`, `Command`, `Layout`,
 * `Sheet`, `Sidebar` and `Table`. Spread last, they **overwrote the @cloud/ui
 * components of the same name** — so the Badge page rendered a lucide badge glyph,
 * the Table page rendered a little table icon, and both looked like a preview and
 * threw no error. Only Sheet gave it away, because SheetTrigger without its Dialog
 * root throws.
 *
 * The design system's components win in the design system's own docs. Icons fill in
 * around them.
 */
const SCOPE = {
  React,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useId,
  ...Icons,
  ...Charts,
  ...UI,
};

/* Unknown identifiers resolve to the stub instead of throwing a ReferenceError. */
const scopeProxy = new Proxy(SCOPE, {
  has: () => true, // claim every name, so `with` routes lookups here
  get: (t, k) => (k in t ? t[k] : k === Symbol.unscopables ? undefined : stub),
});

/**
 * Turn a compiled example into a React *component*, and render that.
 *
 * Not into an element. The examples call hooks —
 *
 *   const filters = useListFilters({ initial: { q: "", status: "all" } });
 *   <AppliedFilters onClearAll={filters.clearAll}>…</AppliedFilters>
 *
 * — and the first version ran the body as a plain function, outside any render. Every
 * such example died on `Cannot read properties of null (reading 'useState')`: React's
 * dispatcher is only installed while a component is rendering. Making the body the
 * component means the hooks are called exactly where they are legal.
 */
function componentFor(code) {
  // The build strips imports; what is left is statements ending in a return.
  const make = new Function(
    "__scope",
    `with (__scope) { return function Example() { ${code} }; }`,
  );
  return make(scopeProxy);
}

/* The playground mounts where the build left a spec for it. */
for (const host of document.querySelectorAll("[data-playground]")) {
  /* `children` here is the recipe's, not React's — it says what a live example of
   * this component should contain, and `false` means it takes none. Passing it
   * through the JSX `children` prop would let React swallow it, so it is named. */
  const { component, props, children, fixed } = JSON.parse(
    decodeURIComponent(host.dataset.playground),
  );
  createRoot(host).render(
    <UI.ThemeProvider>
      <UI.TooltipProvider>
        <Playground
          component={component}
          props={props}
          slot={children}
          fixed={fixed}
        />
      </UI.TooltipProvider>
    </UI.ThemeProvider>,
  );
}

/**
 * An example that throws while React is rendering it does not throw *here* — the
 * error surfaces asynchronously, escapes this try/catch, and leaves a console error
 * and an empty box on the page. So the boundary catches it where it actually
 * happens, and takes the host down the same way a compile failure does.
 */
class Boundary extends React.Component {
  static getDerivedStateFromError = () => ({ dead: true });
  state = { dead: false };
  componentDidCatch(err) {
    this.props.onDead(err);
  }
  render() {
    return this.state.dead ? null : this.props.children;
  }
}

for (const host of document.querySelectorAll("[data-preview]")) {
  const code = decodeURIComponent(host.dataset.preview);
  try {
    const Example = componentFor(code);
    const onDead = (err) => {
      host.remove();
      console.debug("preview skipped:", err.message);
    };
    createRoot(host).render(
      <UI.ThemeProvider>
        <UI.TooltipProvider>
          <Boundary onDead={onDead}>
            <Example />
          </Boundary>
        </UI.TooltipProvider>
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
