# Layout

Layout refers to the arrangement of elements on the interface to serve a specific purpose. It's the integration of the spatial and organizational principles of the system that result in a final visual composition.

[Spacing](spacing.md) | [Design tokens](design-tokens.md)

## Introduction

A page in this system is not laid out freehand. It is assembled from a small set of shell components that already own the scroll root, the padding, and the sticky behaviour. The job of a page is to pick the right shell and fill its slots — not to reconstruct the shell out of divs.

The consequence worth stating up front: **you almost never write page-level padding, and you never write a page-level scroll container.** If you find yourself adding `p-6` to a page wrapper, the shell you needed already exists and you are working around it.

## Anatomy of a layout

### Application layout

`Layout` is the outermost shell: a fixed-height viewport (`h-screen overflow-hidden`) holding an optional `Sidebar` and a sticky header slot. The scroll area inside it **carries no padding of its own** — that is deliberate, so that a full-bleed band (a page header, an action footer) can reach the edges while the content column does not.

- `Sidebar` — the projected navigation rail. See [Side navigation](../patterns/side-navigation.md).
- `SidebarTrigger` — collapses the rail to an icon column; the state persists in `SIDEBAR_COOKIE`.
- `AppHeader` — what you put **in** the header slot: breadcrumbs, search, actions, the account menu. The **56px height (`h-14`) belongs to `Layout`'s header wrapper, not to `AppHeader`** — do not try to set the height on `AppHeader` itself.

**The sidebar is one tree, not two.** `Layout` renders it as a desktop `aside` from `md` upward and renders the _same_ sidebar inside a left `Sheet` below it. Do not build a separate mobile navigation; trigger the drawer that already exists.

### Content layout

Inside the shell, a page is a stack of full-bleed bands and one padded body.

- **`PageHeader`** — the full-bleed band for **level-1 pages only**: a list, an index, a dashboard, a settings root. Title, description, and `HeaderAction[]` actions. **No back button** — a level-1 page is a navigation root. Its `sticky` prop docks it to the scrollport.
- **`PageHeaderBand`** — the full-bleed band for **every other page**: create, edit, sub-page, detail. Its **back button is built in and cannot be omitted**. `variant="page"` (the default) is the create/edit band and is **not sticky unless you ask**; `variant="detail"` is the entity identity band and **is** sticky by default. Pass a plain `TabsList` to its `tabs` slot — the band's own bottom border is the tab rail and it suppresses the list's line for you. Do not reach for `variant="line"` or `shadow-none`.
- **`ContentHeader`** — the shared **title block** the two bands are built from, not a header in its own right. It has no band chrome, so it is **never a page header on its own**. The bands build it for you; you use it directly only as a **section title inside `PageBody`**. See [ContentHeader](../components/content-header.md).
- **`PageBody`** — the padded content region. It owns the page-level padding _and_ the gap between blocks. If padding must live somewhere else for a structural reason, reuse `PAGE_BODY_PADDING_CLASS_NAME` rather than retyping the value — that is what a tabbed detail page does, because its panels sit below the tab strip.
- **`ActionFooter`** — the full-bleed band pinned to the bottom of the scroll root, holding the escape and the commit for a form. It is a **sibling** of `PageBody`, never a child of it, and it never goes inside a `Modal` — a dialog's actions belong to `Modal`'s own `footer`.

**Picking the header is a decision about the page's level, not about how the header looks.** Level-1 (a root you navigate *from*) takes `PageHeader`. Everything you drill *into* — create, edit, detail, sub-page — takes `PageHeaderBand`, and gets its back button whether you want one or not. `ContentHeader` is never the answer to "which header does this page get".

### Which shell for which page

The page type picks the shell. This is the table to read before composing anything.

| Page type                      | Header                                                                                | Body                                                                                                                                                         | Start from                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Resource list**              | `PageHeader` — title, and the screen's one primary create action.                     | `PageBody` holding the list family: condition band, results `Card`, summary bar, `Table`, `RichPagination`.                                                  | [List page](../demos/list-page.md), [advanced-filter list](../demos/advanced-filter-list.md) |
| **Single-step create**         | `PageHeaderBand variant="page"` — built-in back button, **no actions**. Not sticky by default; the header holds nothing the user needs at field twenty. | `PageBody` with one column of section cards, then a sibling `ActionFooter` owning Cancel and the commit.                                                     | [Create form](../demos/create-form.md)                                                       |
| **Edit**                       | **Usually no page at all** — an overlay (`Modal`, or `Sheet` when it needs room) is the default. A multi-section edit takes a page, and then it is the create shell above. | Same as create when it is a page; otherwise the overlay's own body, committing from `Modal`'s footer — **never an `ActionFooter`**.                          | [Edit resource](../patterns/edit-resource.md)                                                |
| **Wizard**                     | `PageHeaderBand`, sticky, carrying the flow's exit and title.                         | `PageBody` with `StepIndicator` and the current step, then a persistent `ActionFooter`. **Stages only** — see [Create wizard](../patterns/create-wizard.md). | [Create wizard](../demos/create-wizard.md)                                                   |
| **Detail**                     | `PageHeaderBand variant="detail"` — sticky identity band; pass a plain `TabsList` to its `tabs` slot when there are sibling sections. | `PageBody` — or `PAGE_BODY_PADDING_CLASS_NAME` on each `TabsContent`, since the tabs sit above the body.                                                     | [Detail page](../demos/detail-page.md)                                                       |
| **Dashboard or settings**      | `PageHeader` — these are level-1 roots. `ContentHeader` is **not** a page header; use it only for the section titles *inside* the body. | Cards, settings groups, or dashboard blocks, arranged for scanning.                                                                                          | No maintained template — compose from `PageHeader` + `PageBody`.                             |

### Column layout and grid

There is no general grid component, and that is on purpose — Tailwind's `grid` and `flex` utilities are the grid. What the system does supply is the cases where hand-writing the grid goes wrong:

- **`KvGrid`** (the `grid-auto-fit-kv` utility) — key-value grids on detail pages. Columns auto-fit to the **container's** width, not to viewport breakpoints, so a card in a narrow column reflows on its own. Hand-writing `grid-cols-[repeat(auto-fit,minmax(...))]` is banned by the arbitrary-value lint, and the hand-written version usually omits the `min(22rem, 100%)` that keeps a column from overflowing a phone-width container.
- **`StatGrid`** — the row of `StatCard`s.
- **`ResizablePanelGroup` / `ResizablePanel` / `ResizableHandle`** — a user-draggable split pane, for the rare layout the user gets to control. There is no bare `Resizable` export; you compose the three.

The content column sits inside `PageBody`'s 24px gutters. A shared maximum width exists — `max-w-content`, 1280px, from `--container-content` — but **nothing applies it today**, so the column is uncapped in practice and grows with the viewport. If a region should stop at 1280px, apply the utility deliberately; do not assume the shell already did. See [Spacing](spacing.md#sizing).

## Layout principles

### Predictable

The same kind of page has the same skeleton everywhere. A user who has learned one list page has learned all of them: the filters are in the same band, the count is in the same bar, the pager is in the same place. The [page patterns](../patterns/list-page.md) exist so this is not a matter of taste.

### Consistent

Structure comes from components, not from repeated utility classes. Two pages that "look the same" because two developers typed the same padding will drift the first time one of them is edited. Two pages that use `PageBody` cannot drift.

### Responsive

Reflow is driven by the **container** wherever the system can manage it — `KvGrid`'s auto-fit, `Card`'s internal layout — and by viewport breakpoints (`--breakpoint-xs` through `-2xl`) only where the viewport is genuinely what changed. A component that reflows on a viewport breakpoint while sitting in a narrow column will reflow at the wrong moment.

When content outgrows its space, **change the content, not the spacing**: split it into blocks, move it behind tabs, or paginate it. Tightening the padding to fit more in is how a dense page becomes an unreadable one.

## General guidelines

### Do

- Pick the shell first: `Layout` → header component → `PageBody` → blocks.
- Let `PageBody` own the page padding and the gap between blocks.
- Use the gap scale between blocks: `gap-5` for side-by-side block cards, `gap-3.5` for a tightly coupled parent and child card, `gap-4` (sticky) or `gap-6` (short) between the condition band and the list card, `gap-3` for a stat-card grid.
- Give every wrapper `div` a job — a spacing group, a scroll container, a flex width. A wrapper with one child whose classes could merge into that child is noise; delete it.
- Apply `max-w-content` deliberately when a region should stop at 1280px. Nothing upstream does it for you.
- Use `KvGrid` for key-value grids and let it fit the container.

### Don't

- Don't hand-write page-level padding, and don't add a second scroll container inside the shell.
- Don't use arbitrary values for structure (`max-w-[459px]`, `h-[52px]`). Snap to a token, a scale step, or a component prop — a 459px modal is `Modal size="md"`.
- Don't tighten spacing to fit more content. Split the content.
- Don't reach for a viewport breakpoint when the thing that varies is the container's width.
- Don't put a full-bleed band inside `PageBody`. Bands are siblings of the body, not children of it — and an `ActionFooter` never goes inside a `Modal`; a dialog's actions belong to `Modal`'s own `footer`.
- Don't build a second, mobile-only sidebar. `Layout` already renders the same tree in a `Sheet` below `md`.

## Related pages

### Spacing

The scale that the gaps above come from, and the rules for which gap means what. See [Spacing](spacing.md).

### Design tokens

`--container-content`, `--breakpoint-*`, and the control-sizing tokens that keep a button, an input, and a select the same height. See [Design tokens](design-tokens.md).

### List page, Detail page, Create form

The three assembled skeletons this foundation exists to produce. See [patterns](../patterns/list-page.md).

### Components

`Layout`, `Sidebar`, `SidebarTrigger`, `AppHeader`, `PageHeader`, `PageHeaderBand`, `ContentHeader`, `PageBody`, `ActionFooter`, `KvGrid`, `StatGrid`, `ResizablePanelGroup`, `Separator`.
