# PageBody

The page's scroll root, and its padded content column.

`PageBody` is a plain `<div>` with the page's standard padding and vertical rhythm. It takes the standard `div` props (`className`, `children`, and the rest of `HTMLAttributes<HTMLDivElement>`) — there are no bespoke props. It also exports `PAGE_BODY_CLASS_NAME` and `PAGE_BODY_PADDING_CLASS_NAME`. Import them from `@cloud/ui`.

## Development guidelines

**`PageBody` is the page's one scroll root.** Nothing above it scrolls: `Layout`'s `<main>` is a fixed-height flex column that clips (`overflow-hidden`), and the document never scrolls. Page content therefore **must** go through `PageBody` — including error and empty pages that replace `<main>`'s whole content. Anything outside it is clipped and unreachable.

Its class list is `container-scroll-viewport flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto scrollbar-gutter-stable px-6 pt-6 pb-8 [&>*]:shrink-0`, and it carries `data-layout-scroll-root` (that attribute is how route changes find the node to reset). `min-h-0` is load-bearing: without it the flex item sizes to its content and never scrolls.

`<main>` is deliberately **unpadded and full-width**, so full-bleed bands can touch the edges. `PageBody` is where the padding lives: `px-6 pt-6 pb-8` plus a column that spaces its children by `gap-6`.

So the shape of a page is: the full-bleed bands (`PageHeader`, `PageHeaderBand`) sit **outside** `PageBody`, and everything else goes **inside** it — including `ListConditionBand`, which is a filter band, not a full-bleed one. An `ActionFooter` is a _sibling_ of `PageBody`, after it — never nested in its gutters. The bands and the footer are outside because they must not scroll; being siblings of the scroll region, they stay in view for free, with no `sticky` of their own.

**`PageBody` pins its direct children at `shrink-0`, and you must not override it.** It is a definite-height flex column, so its children are shrinkable flex items, and a child whose overflow isn't `visible` is a scroll container — whose automatic minimum size is zero. `Card` defaults to `overflow-hidden`, so a tall Card dropped into `PageBody` would silently collapse to fit and clip its own content instead of letting the page scroll. `[&>*]:shrink-0` is what prevents that. (The list `Card` escapes the trap only because it must run `overflow-clip`, which is not a scroll container, so sticky things inside it still dock.)

Sticky things **inside** the body — `Table stickyHeader`, `ListSummaryBar`, `ListConditionBand` — dock to `PageBody`'s padding-box top edge, i.e. flush under the header band. `PageBody` is also a **size container** (`container-scroll-viewport` = `container-type: size`), so a sticky side pane docks with `sticky top-0` and caps its height with `max-h-sticky-pane` (= `100cqh`) — never `100dvh` minus a hand-counted constant, which goes stale the moment a band grows a line. Note that `top-0` is not "flush against the band": the sticky datum already includes `PageBody`'s `pt-6`, so `top-0` docks where page content starts, 24px under the band, and any `top-*` you add stacks on top of that 24px.

**Content fills the available width.** Don't wrap the body or its cards in a `max-w-*` lock; the layout is meant to span. Width constraints are for individual field-level controls (a price input), not for the page column.

On a tabbed detail page the `Tabs` root wraps the whole page — the `PageHeaderBand` (with the `TabsList` in its `tabs` slot) and the panels below it — and **each panel hosts its own `PageBody`**. Only the active panel is mounted, so there is still exactly one scroll root at a time. `Tabs` root is `flex min-h-0 flex-1 flex-col` (the flex column that fills `<main>`) and each `TabsContent` is `flex min-h-0 flex-col`. Giving a panel a bare `PAGE_BODY_PADDING_CLASS_NAME` instead leaves the page with no scroll container at all, and everything below the fold is clipped.

The two exported constants are for the cases where you need the same metrics without the element. `PAGE_BODY_CLASS_NAME` is the full class list above — scroll root, size container, flex column, gap, padding, pinned children. `PAGE_BODY_PADDING_CLASS_NAME` is the padding alone (`px-6 pt-6 pb-8`), for the rare host that must own the page gutters itself; it does **not** create a scroll root, so it can never stand in for a `PageBody`.

## General guidelines

### Do

- Route every page's content through `PageBody` — error and empty pages included; it is the only thing that scrolls.
- Put the full-bleed header bands, and the `ActionFooter`, outside it as siblings.
- Use `PAGE_BODY_PADDING_CLASS_NAME` when something needs the page gutters but not the column layout — and never as a page's scroll root.
- Let the built-in `gap-6` do the vertical rhythm; don't add margins between the children.
- Give each `TabsContent` its own `PageBody` on a tabbed detail page.
- Cap a sticky side pane with `max-h-sticky-pane` (`100cqh`), measured against `PageBody`'s size container.

### Don't

- Don't nest an `ActionFooter` inside `PageBody`; it belongs after it, as a sibling.
- Don't put a full-bleed header band inside it — the gutters will inset the band.
- Don't re-pad `<main>`; the page padding is this component's job.
- Don't override the pinned `shrink-0` on a direct child — a `Card` (which is `overflow-hidden`) will collapse and clip itself instead of letting the page scroll.
- Don't drop `min-h-0` when you build on `PAGE_BODY_CLASS_NAME`; without it the body sizes to its content and stops scrolling.
- Don't add a `max-w-*` lock to the content column; pages fill the width.

## Features

- #### Page content

  ```tsx
  import { PageHeaderBand, PageBody, ActionFooter, Button, Card } from "@cloud/ui";
  import { Save, X } from "lucide-react";

  <>
    <PageHeaderBand title={t("merchants.create")} backTo="/merchants" />
    <PageBody>
      <Card>…</Card>
      <Card>…</Card>
    </PageBody>
    <ActionFooter>
      <Button variant="ghost" iconLeft={<X className="size-4" />}>
        {t("common.cancel")}
      </Button>
      <Button iconLeft={<Save className="size-4" />}>{t("common.save")}</Button>
    </ActionFooter>
  </>;
  ```

- #### Tabbed detail page

  `Tabs` wraps the whole page and fills `<main>`; each panel carries the scroll root.

  ```tsx
  import { Tabs, TabsList, TabsTrigger, TabsContent, PageHeaderBand, PageBody, Card } from "@cloud/ui";

  <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-0">
    <PageHeaderBand
      title={merchant.name}
      backTo="/merchants"
      tabs={
        <TabsList>
          <TabsTrigger value="overview">{t("merchants.overview")}</TabsTrigger>
          <TabsTrigger value="skus">{t("merchants.skus")}</TabsTrigger>
        </TabsList>
      }
    />
    <TabsContent value="overview" className="flex min-h-0 flex-col">
      <PageBody>
        <Card>…</Card>
      </PageBody>
    </TabsContent>
    <TabsContent value="skus" className="flex min-h-0 flex-col">
      <PageBody>…</PageBody>
    </TabsContent>
  </Tabs>;
  ```

- #### Sticky side pane

  `PageBody` is a size container, so the pane caps itself in `cqh` — no hand-counted viewport maths.

  ```tsx
  <PageBody>
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div>…</div>
      <aside className="sticky top-0 max-h-sticky-pane overflow-y-auto">…</aside>
    </div>
  </PageBody>;
  ```

- #### The class constants

  `PAGE_BODY_CLASS_NAME` is the whole recipe; `PAGE_BODY_PADDING_CLASS_NAME` is the gutters alone, and makes no scroll root.

  ```tsx
  import { PAGE_BODY_PADDING_CLASS_NAME, cn } from "@cloud/ui";

  <div className={cn(PAGE_BODY_PADDING_CLASS_NAME, "grid grid-cols-3 gap-4")}>…</div>;
  ```

## Writing guidelines

`PageBody` renders no text of its own.

## Accessibility guidelines

`PageBody` is a layout container with no semantics. It sits inside `Layout`'s `<main>` landmark, so don't add another landmark role to it.
