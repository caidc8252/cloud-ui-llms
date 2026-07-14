# PageHeader

Full-bleed page-header band for level-1 list and index pages — title, description, and actions.

`PageHeader` is driven by props. It also re-exports the `HeaderAction` type. Import them from `@cloud/ui`.

## Development guidelines

`PageHeader` is the band that sits flush under the `AppHeader`, spanning edge to edge. Put it **outside** `PageBody`, as a direct child of `Layout`'s `<main>` — so it doesn't scroll. `<main>` clips rather than scrolls; `PageBody`, its sibling, is the page's one scroll root. `<main>` is also unpadded (`PageBody` owns the page gutters), which is what lets the band touch the edges.

**Page tiering is a hard rule.** `PageHeader` is for **level-1 pages only** — a list or an index, the roots of navigation, which is why it has **no back button**. Every other page — create, edit, detail, sub-page — is a drill-down and uses `PageHeaderBand`, whose back button is built in. A create form does **not** get a `PageHeader`.

The props are exactly three: `title` (required), `description` (the muted subtext beneath it), and `actions`. There is **no `sticky`** — the band never scrolls, so it has nothing to stick to. There is **no `titleAdornment`** and no children slot — the title block is the shared `ContentHeader`, which renders the `<h1>`. A status chip beside the title is a detail-page affordance; it lives on `PageHeaderBand`'s `variant="detail"`.

`actions` is **not JSX** — it is a `HeaderAction[]` of descriptors:

```ts
type HeaderAction = {
  label: string;
  icon: React.ReactNode; // REQUIRED — every header action carries an icon
  to?: string; // route → renders a Link
  onClick?: () => void; // handler → renders a <button>; ignored when `to` is set
  variant?: "primary" | "secondary" | "ghost" | "ghost-danger" | "danger" | "link"; // default "secondary"
  disabled?: boolean;
  ariaLabel?: string;
};
```

That shape is the enforcement mechanism for two hard rules. **Size**: there is deliberately no `size` field, so the slot renders `md` buttons and nothing else — `sm`/`xs`/`lg` cannot enter a page header. **Icons**: `icon` is required at compile time, so a header action can never ship bare. The conventions are Create → `Plus`, Save → `Save`, Publish → `CheckCircle2`, and a verb-appropriate glyph otherwise.

There is **no sticky prop, and no sticky behaviour to configure**. The band is a sibling of `PageBody` inside a `<main>` that does not scroll, so it stays docked under the app header for free while the body scrolls beneath it.

Three headers, three jobs — don't mix them up:

- **`PageHeader`** — the level-1 band: title, description, actions, no back button, no tabs.
- **`PageHeaderBand`** — the level-2/3 band, with a built-in back button: `variant="page"` for create/edit/sub-pages, `variant="detail"` for the entity identity band with `tabs` on its bottom edge.
- **`ContentHeader`** — the shared title block the two bands compose. It is **never a page header on its own** (no band chrome — no padding, border, or back); use it inside `PageBody` as a section title.

## General guidelines

### Do

- Put `PageHeader` outside `PageBody`, as a direct child of `<main>`, so it doesn't scroll.
- Use it only on a level-1 list or index page.
- Pass `actions` as `HeaderAction` descriptors, each with an `icon`.
- Put the base page surface's primary action in `actions` with `variant: "primary"`, and keep it to one.

### Don't

- Don't use `PageHeader` on a create, edit, or detail page. Those are drill-downs — use `PageHeaderBand`, which has the back button.
- Don't nest it inside `PageBody`; the gutters will inset the band and break the full bleed.
- Don't stack `PageHeader` and `ContentHeader` as two titles — one page title per page.
- Don't reach for a status chip here; there is no `titleAdornment` on this component.

## Features

- #### Title, description, and actions

  ```tsx
  import { PageHeader } from "@cloud/ui";
  import { FolderTree, PackagePlus } from "lucide-react";

  <PageHeader
    title={t("merchants.title")}
    description={t("merchants.description")}
    actions={[
      {
        label: t("merchants.categories"),
        to: "/merchants/categories",
        variant: "secondary",
        icon: <FolderTree size={16} />,
      },
      {
        label: t("merchants.create"),
        to: "/merchants/new",
        variant: "primary",
        icon: <PackagePlus size={16} />,
      },
    ]}
  />;
  ```

- #### Action descriptors

  A descriptor with `to` renders a router `Link`; one with `onClick` renders a `<button>`. `to` wins when both are set. `variant` defaults to `secondary`, and the buttons are always `md`.

  ```tsx
  import { Download } from "lucide-react";

  <PageHeader
    title={t("reports.title")}
    actions={[
      {
        label: t("reports.export"),
        onClick: exportCsv,
        disabled: rows.length === 0,
        icon: <Download size={16} />,
      },
    ]}
  />;
  ```

- #### Always in view

  The band never scrolls: it sits beside `PageBody` in a non-scrolling `<main>`, so the title and the create action stay reachable while the list scrolls. Nothing to opt into.

  ```tsx
  <PageHeader title={t("merchants.title")} actions={actions} />
  ```

### States

- **Disabled action** — a descriptor with `disabled` renders a disabled `md` button; a `to` action ignores it, so gate route actions by omitting them.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation on the title.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Title: name the page, matching the breadcrumb and the navigation label that got the user here.
- Description: one line on what the page is for. Leave it out when the title says it all.
- Actions: verb-first labels, and only one `primary`.

## Accessibility guidelines

### General accessibility guidelines

- The title renders as the page's `<h1>` (via `ContentHeader`), so there must be exactly one page header per page.
- Actions are real `Button`s in the reading order of the page, not chrome — a keyboard user reaches them before the content.
- Every action carries an icon **and** a text label, so the icon is never the only carrier of meaning. Use `ariaLabel` only to give a terser label a fuller name.

### Component-specific guidelines

- The band is always on screen, so every row it costs is a row the scrolling body never gets back. Keep the title block to one row.
