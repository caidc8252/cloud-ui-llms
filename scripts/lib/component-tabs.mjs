import { esc } from "./read.mjs";
import { exportNamed } from "./package-graph.mjs";
import { loadProps } from "./props.mjs";
import { inheritedProps } from "./inherited.mjs";
import { styleTab } from "./style-tab.mjs";
import { compileExample, firstExample } from "./preview.mjs";
import { previewsAvailable } from "./preview-available.mjs";

/**
 * A component page as Cloudscape shapes one: Playground / API / Style / Usage.
 *
 * Three of the four are derived from the package you install — the props, their
 * types, their defaults, the sentence the author wrote about each one, and what
 * every choice resolves to in CSS. Add a variant and it appears in the dropdown, in
 * the table, and in the style table on the next install. There is nothing here to
 * remember to update.
 *
 * The fourth cannot be derived, and pretending otherwise is how you ship a broken
 * page. A playground has to *render something* — and what a Table renders is a Table
 * with columns and rows, what an Input renders is an Input with no children at all
 * (React throws: a void element "must neither have children nor use
 * dangerouslySetInnerHTML"), and what a Modal renders is nothing, because it is
 * closed. None of that is in the types.
 *
 * So the recipes below are hand-written, and only they are. They say the one thing
 * the package cannot: what a meaningful demo of this component looks like. A
 * component with no recipe still gets API, Style and Usage — it just does not get a
 * playground, which is better than getting a broken one.
 */

/** How to render a live example. The only hand-maintained list in this pipeline. */
const PLAYGROUND = {
  Button: { children: "Button" },
  Badge: { children: "Badge" },
  Toggle: { children: "Toggle" },
  Alert: { children: "Your session expires in five minutes." },
  /* Void or self-closing: children would be a React error, not a bad demo. */
  Input: { children: false, fixed: { placeholder: "Enter a value" } },
  Textarea: { children: false, fixed: { placeholder: "Enter a description" } },
  Switch: { children: false },
  Checkbox: { children: false },
  Spinner: { children: false },
};

/**
 * Components whose honest state is *invisible*.
 *
 * A Modal is closed. A Toaster has no toast. A Command palette is shut. Render their
 * doc example and you get a preview panel with nothing in it — which is not a
 * preview, it is a blank box that looks like a bug.
 *
 * They need a trigger, and a trigger is a thing to write, not a thing to derive. So
 * these are written: a snippet that opens the component, shown as the demo and as the
 * code. Held as source so the reader can copy it, and compiled from that same source
 * so the two can never disagree.
 */
const DEMOS = {
  Modal: `import { useState } from "react";
import { Button, Modal } from "@cloud/ui";

const [open, setOpen] = useState(false);

<>
  <Button variant="primary" onClick={() => setOpen(true)}>Open modal</Button>
  <Modal
    open={open}
    onClose={() => setOpen(false)}
    title="Delete merchant?"
    description="This removes the merchant and every contract on it. It cannot be undone."
    footer={
      <>
        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
      </>
    }
  />
</>;`,

  Toaster: `import { Button, Toaster, toast } from "@cloud/ui";

<>
  <Toaster />
  <Button variant="secondary" onClick={() => toast.success("Merchant saved.")}>
    Show a toast
  </Button>
</>;`,

  Sheet: `import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@cloud/ui";

<Sheet>
  <SheetTrigger render={<Button variant="secondary">Filters</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Refine the results.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>;`,

  Command: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@cloud/ui";

<Command className="rounded-md border border-line-default">
  <CommandInput placeholder="Search merchants, contracts, users…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Merchants">
      <CommandItem>Northwind Trading</CommandItem>
      <CommandItem>Acme Retail</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>;`,

  FilterChip: `import { AppliedFilters, FilterChip } from "@cloud/ui";

<AppliedFilters onClearAll={() => {}}>
  <FilterChip label="Status: Live" onRemove={() => {}} />
  <FilterChip label="Search: northwind" onRemove={() => {}} />
</AppliedFilters>;`,

  AppliedFilters: `import { AppliedFilters, FilterChip } from "@cloud/ui";

<AppliedFilters onClearAll={() => {}}>
  <FilterChip label="Status: Live" onRemove={() => {}} />
  <FilterChip label="Region: EU" onRemove={() => {}} />
</AppliedFilters>;`,

  /* Not invisible — empty. The doc's example builds its columns from a `rows` that
   * only exists in the reader's app, so the preview drew a header and no table. A
   * table with no rows is the one thing a table is not. */
  Table: `import { Badge, Table, type TableColumn } from "@cloud/ui";

type Merchant = { id: string; name: string; mid: string; volume: number; status: "live" | "pending" };

const columns: TableColumn<Merchant>[] = [
  { key: "name", title: "Name", field: "name", sortable: true },
  { key: "mid", title: "MID", field: "mid" },
  { key: "volume", title: "Volume", numeric: true, render: (row) => row.volume.toLocaleString() },
  {
    key: "status",
    title: "Status",
    render: (row) => (
      <Badge tone={row.status === "live" ? "success" : "warning"}>{row.status}</Badge>
    ),
  },
];

const rows: Merchant[] = [
  { id: "1", name: "Northwind Trading", mid: "MER-0001", volume: 128400, status: "live" },
  { id: "2", name: "Acme Retail", mid: "MER-0002", volume: 94100, status: "live" },
  { id: "3", name: "Blue Harbour Foods", mid: "MER-0003", volume: 12750, status: "pending" },
];

<Table columns={columns} rows={rows} rowKey={(row) => row.id} />;`,

  AdvancedFilterSheet: `import { useState } from "react";
import { AdvancedFilterField, AdvancedFilterGroup, AdvancedFilterSheet, Button, Input } from "@cloud/ui";

const [open, setOpen] = useState(false);

<>
  <Button variant="secondary" onClick={() => setOpen(true)}>Advanced filters</Button>
  <AdvancedFilterSheet
    open={open}
    onOpenChange={setOpen}
    onApply={() => setOpen(false)}
    onReset={() => {}}
  >
    <AdvancedFilterGroup label="Merchant">
      <AdvancedFilterField label="Reference">
        <Input placeholder="MER-0001" />
      </AdvancedFilterField>
    </AdvancedFilterGroup>
  </AdvancedFilterSheet>
</>;`,
};

function apiTable(props) {
  const rows = props
    .map((p) => {
      const type =
        p.type === "enum"
          ? p.values.map((v) => `<code>${esc(v)}</code>`).join(" | ")
          : `<code>${esc(p.raw ?? p.type)}</code>`;

      const dflt = p.default ? `<code>${esc(p.default)}</code>` : "—";

      /* The JSDoc is the author's own sentence about the prop. It was sitting in the
       * .d.ts the whole time; the first version of this table threw it away and left
       * a column of types, which tells you what you may pass and never why.
       *
       * They wrote it as markdown — "Omit (or `neutral`) for the default text
       * color" — so the backticks are honoured rather than printed. */
      const note = [
        p.deprecated ? `<strong class="dep">Deprecated.</strong>` : "",
        p.doc ? esc(p.doc).replace(/`([^`]+)`/g, "<code>$1</code>") : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `<tr${p.deprecated ? ' class="row-dep"' : ""}>
<td><code>${esc(p.name)}</code>${p.optional === false ? '<span class="req">required</span>' : ""}</td>
<td>${type}</td><td>${dflt}</td><td>${note || '<span class="muted">—</span>'}</td></tr>`;
    })
    .join("");

  return `<div class="table-scroll"><table>
<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
<tbody>${rows}</tbody>
</table></div>`;
}

/**
 * The props the component does not declare, because the library it wraps does.
 *
 * The table used to end on a note saying these were deliberately left out — "fifty
 * aria-* would bury the four that matter". That is true of Button. It is the exact
 * opposite of true for Select, which declares *nothing*: @cloud/ui re-skins Base UI,
 * and for a pass-through the inherited props are not noise around the API, they are
 * the API. The rule silenced the pages that needed a table most.
 *
 * They are kept in their own section rather than merged, so a component that does
 * have props of its own still leads with them.
 */
function inheritedTable(inherited) {
  if (!inherited) return "";
  return `<h3>Inherited</h3>
<p class="note-inline">${esc(inherited.from)} declares these, and <code>@cloud/ui</code>
passes them straight through. The styling props it does own — <code>className</code>,
<code>render</code> — are not listed: those decisions are already made.</p>
${apiTable(inherited.props)}`;
}

export function componentTabs({ title, md, usageHtml }) {
  /* The doc's H1 is usually the export name, but not always — chart.md is titled
   * "Chart container" and the export is ChartContainer.
   *
   * A title that resolves to nothing is not the end of it, though. Some pages are
   * about a *family* rather than one export — chart-states is ChartSkeleton and
   * ChartEmpty; resizable is ResizablePanelGroup, Panel and Handle. There is no props
   * table to draw for a family, but there is very much a component to *show*, and
   * bailing here meant three pages with a working example rendered nothing at all. */
  const name = exportNamed(title);

  const props = name ? loadProps(name) : null;
  const inherited = name ? inheritedProps(name) : null;

  /* A written demo wins: it exists precisely because the doc's own example renders
   * nothing you can see. Compiled from the same source string that is shown, so the
   * code and the thing above it cannot drift apart. */
  const written = DEMOS[name];
  const example = !previewsAvailable
    ? null
    : written
      ? { source: written, code: compileExample(written) }
      : firstExample(md);

  /* A page earns tabs if it has anything to put in one. */
  if (!props && !inherited && !example) return null;

  const tabs = [];

  /* The playground.
   *
   * A recipe drives the props panel — change a variant, watch it change. Only nine
   * components have one, because what a *configurable* demo of a Table looks like is
   * a judgement no type can make.
   *
   * But that was being used as a reason to give the other sixty nothing at all, and
   * it is not one. Their docs already carry an example that renders; it was just
   * buried in Usage, three headings down. So a component with no recipe still opens
   * on its example — preview and code, no panel. Fewer controls, same first question
   * answered: what does this look like, and what do I type to get it?
   */
  const recipe = PLAYGROUND[name];
  if (recipe || example)
    tabs.push({
      id: "playground",
      label: "Playground",
      body: `<div data-playground="${encodeURIComponent(
        JSON.stringify(
          recipe
            ? { component: name, props, ...recipe }
            : { component: name, example },
        ),
      )}"></div>`,
    });

  if (props || inherited)
    tabs.push({
      id: "api",
      label: "API",
      body:
        (props ? apiTable(props) : "") +
        inheritedTable(inherited) +
        `<p class="note-inline">Read out of the type declarations that ship in the
package, so this cannot drift from the component.</p>`,
    });

  /* Cloudscape's Style tab is a `style` prop — a typed escape hatch. There is none
   * here, and that is the design. So the tab answers the question the reader came
   * with — "what decides how this looks?" — with the system's real answer. */
  const style = props ? styleTab(name, props) : null;
  if (style) tabs.push({ id: "style", label: "Style", body: style });

  tabs.push({ id: "usage", label: "Usage", body: usageHtml });

  return tabs;
}
