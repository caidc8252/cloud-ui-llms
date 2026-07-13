/**
 * The playground: change a prop, watch the component change, copy the code.
 *
 * The controls are generated from the props, and the props are read out of the
 * package's own .d.ts — so this is not a hand-built Button demo. Ship a new
 * variant and it appears in the dropdown on the next install; there is nothing
 * here to remember to update.
 */

import React, { useMemo, useState } from "react";
import * as UI from "@cloud/ui";
import { Check, Copy, Search } from "lucide-react";

/* A node prop cannot be typed into a text box. The playground offers the icon it
 * would actually be — a real lucide glyph at the size the docs prescribe. */
const NODE_CHOICES = {
  none: null,
  Search: <Search className="size-4" />,
};

const codeFor = (name, props, children) => {
  const attrs = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== false && v !== "" && v !== "none")
    .map(([k, v]) =>
      typeof v === "boolean" ? ` ${k}` : ` ${k}=${JSON.stringify(v)}`,
    )
    .join("");
  return `<${name}${attrs}>${children}</${name}>`;
};

export function Playground({ component, props: spec }) {
  const Component = UI[component];
  const [state, setState] = useState(() =>
    Object.fromEntries(
      spec.map((p) => [
        p.name,
        p.default ?? (p.type === "boolean" ? false : p.type === "node" ? "none" : ""),
      ]),
    ),
  );
  const [label, setLabel] = useState(component);
  const [copied, setCopied] = useState(false);

  const live = useMemo(() => {
    const out = {};
    for (const p of spec) {
      const v = state[p.name];
      if (v === "" || v === "none" || v === false) continue;
      out[p.name] = p.type === "node" ? NODE_CHOICES[v] : v;
    }
    return out;
  }, [state, spec]);

  const code = codeFor(
    component,
    Object.fromEntries(
      spec
        .map((p) => [p.name, state[p.name]])
        .filter(([, v]) => v !== "" && v !== "none" && v !== false),
    ),
    label,
  );

  const set = (name, value) => setState((s) => ({ ...s, [name]: value }));

  return (
    <div className="pg">
      <div className="pg-controls">
        <h3>Configuration</h3>

        <label className="pg-field">
          <span>children</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>

        {spec.map((p) => (
          <label className="pg-field" key={p.name}>
            <span>{p.name}</span>
            {p.type === "enum" ? (
              <select
                value={state[p.name] ?? ""}
                onChange={(e) => set(p.name, e.target.value)}
              >
                <option value="">—</option>
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ) : p.type === "boolean" ? (
              <input
                type="checkbox"
                checked={Boolean(state[p.name])}
                onChange={(e) => set(p.name, e.target.checked)}
              />
            ) : p.type === "node" ? (
              <select
                value={state[p.name] ?? "none"}
                onChange={(e) => set(p.name, e.target.value)}
              >
                {Object.keys(NODE_CHOICES).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={state[p.name] ?? ""}
                onChange={(e) => set(p.name, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <div className="pg-right">
        <div className="pg-preview">
          <h3>Preview</h3>
          <div className="pg-stage">
            <Component {...live}>{label}</Component>
          </div>
        </div>

        <div className="pg-code">
          <h3>
            Code
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              }}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </h3>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
