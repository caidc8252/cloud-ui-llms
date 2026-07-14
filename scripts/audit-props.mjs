/**
 * Does the documentation describe the package we actually ship?
 *
 * It was calibrated against something else. Commit 8629a19 — "按 foundation 实现校准
 * 全部组件文档" — took `foundation`, called it "@cloud/ui 的 React 参考实现", and
 * rewrote 88 doc files to match it. Where the two libraries differ, the docs now
 * describe the other one: it added props that do not exist (`HeaderAction`,
 * `CardStrip`, Table's `rowNav`) and deleted props that do (`PageHeader`'s
 * `titleAdornment`, which it called "根本不存在").
 *
 * Both of those were found by accident, because a live preview crashed. That is not a
 * method. This is.
 *
 * It only judges components with a **closed** props interface — one that declares
 * every prop it takes and inherits nothing:
 *
 *     interface PageHeaderProps { title: string; actions?: React.ReactNode; … }   closed
 *     interface ButtonProps extends ButtonPrimitive.Props, VariantProps<…>        open
 *
 * For a closed interface, a prop the docs pass and the interface does not name cannot
 * exist. For an open one it may well be a DOM prop, and a first pass at this flagged
 * `<Button onClick>` — 163 findings, mostly noise. Being confidently wrong is what
 * caused this mess; the audit does not get to do it too.
 *
 *   node scripts/audit-props.mjs
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { exportNamed, declarationOf } from "./lib/package-graph.mjs";

if (!existsSync("node_modules/@cloud/ui")) {
  console.error("@cloud/ui is not installed — nothing to audit against.");
  process.exit(2);
}

const ICONS = new Set();
const icons = await import("lucide-react");
for (const k of Object.keys(icons)) ICONS.add(k);

/* `@cloud/ui/components/chart` re-exports recharts wholesale — XAxis, Bar, Pie. They
 * are real, importable, and documented, but they belong to recharts, so the package
 * graph deliberately does not claim them and their props are not ours to judge. */
const RECHARTS = new Set();
{
  const barrel = "node_modules/@cloud/ui/dist/components/chart/index.d.ts";
  if (existsSync(barrel)) {
    const s = readFileSync(barrel, "utf8");
    for (const m of s.matchAll(
      /export\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"recharts"/g,
    ))
      for (const n of m[1].split(","))
        if (n.trim()) RECHARTS.add(n.trim().replace(/^type\s+/, ""));
  }
}

const UNIVERSAL = new Set(["key", "ref", "className", "style", "children"]);

/** A component whose props interface names everything it takes, or null. */
function closedProps(name) {
  const dts = declarationOf(name);
  if (!dts) return null;

  const m = dts.match(
    new RegExp(`interface ${name}Props(<[^>]*>)?([^{]*)\\{([\\s\\S]*?)\\n\\}`),
  );
  if (!m) return null;
  /* extends anything → it inherits props we cannot see here */
  if (/\bextends\b/.test(m[2])) return null;

  return new Set([...m[3].matchAll(/^\s*(\w+)\??:/gm)].map((x) => x[1]));
}

const cache = new Map();
const closed = (n) => {
  if (!cache.has(n)) cache.set(n, closedProps(n));
  return cache.get(n);
};

const findings = [];
const docs = readdirSync("components").filter((f) => f.endsWith(".md"));

for (const file of docs) {
  const md = readFileSync(join("components", file), "utf8");

  for (const [, block] of md.matchAll(/```tsx\n([\s\S]*?)```/g)) {
    for (const [, tag, raw] of block.matchAll(/<([A-Z]\w*)\b([^>]*?)\/?>/g)) {
      if (ICONS.has(tag) || RECHARTS.has(tag)) continue;

      const real = exportNamed(tag);
      if (!real) {
        /* Only a name the docs treat as a @cloud/ui export. Imported from anywhere
         * else — a router Link, a chart primitive — is not ours to check. */
        if (
          new RegExp(
            `import \\{[^}]*\\b${tag}\\b[^}]*\\} from "@cloud/ui`,
            "s",
          ).test(md)
        )
          findings.push({ file, tag, kind: "ghost-component" });
        continue;
      }

      const known = closed(real);
      if (!known) continue; // open interface — cannot judge, so do not

      /* A component's own attributes end where a nested element begins.
       *
       *   <PageHeader title={…} actions={<Button onClick={…} disabled={…} />} />
       *
       * The lazy `[^>]*?` runs straight through `actions={` and swallows the Button's
       * attributes, which then get charged to PageHeader — three false accusations on
       * an example I had just written *correctly*. Truncating at the first `<` can
       * only under-report, which is the right direction for an audit whose whole
       * purpose is to be trusted. */
      const attrs = raw.split("<")[0];

      for (const [, attr] of attrs.matchAll(/(?:^|\s)([a-zA-Z][\w-]*)=/g)) {
        if (UNIVERSAL.has(attr) || /^(aria|data)-/.test(attr)) continue;
        if (!known.has(attr))
          findings.push({ file, tag, attr, kind: "ghost-prop", real });
      }
    }
  }
}

const ghosts = [
  ...new Set(
    findings.filter((f) => f.kind === "ghost-component").map((f) => f.tag),
  ),
];
const props = findings.filter((f) => f.kind === "ghost-prop");

const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, new Set());
  byFile
    .get(f.file)
    .add(
      f.kind === "ghost-component"
        ? `<${f.tag}> — not exported by @cloud/ui`
        : `<${f.tag} ${f.attr}={…}> — ${f.real}Props does not declare it`,
    );
}

console.log(`component docs:              ${docs.length}`);
console.log(
  `docs describing a prop or a component that does not exist: ${byFile.size}`,
);
console.log(`  props that do not exist:   ${props.length}`);
console.log(
  `  components that do not exist: ${ghosts.length}${ghosts.length ? `  (${ghosts.join(", ")})` : ""}`,
);

for (const [file, lines] of [...byFile].sort((a, b) => b[1].size - a[1].size)) {
  console.log(`\n  ${file}`);
  for (const l of lines) console.log(`    ${l}`);
}

process.exit(byFile.size ? 1 : 0);
