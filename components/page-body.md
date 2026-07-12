# PageBody

The padded content column of a page.

`PageBody` is a plain `<div>` with the page's standard padding and vertical rhythm. It takes the standard `div` props (`className`, `children`, and the rest of `HTMLAttributes<HTMLDivElement>`) — there are no bespoke props. It also exports `PAGE_BODY_CLASS_NAME` and `PAGE_BODY_PADDING_CLASS_NAME`. Import them from `@cloud/ui`.

## Development guidelines

`Layout`'s scroll root is deliberately **unpadded and full-width**, so full-bleed bands can touch the edges. `PageBody` is where the padding lives: it is exactly `flex flex-col gap-6 px-6 pt-6 pb-8` — the page gutters plus a column that spaces its children by `gap-6`.

So the shape of a page is: the full-bleed bands (`PageHeader`, `PageHeaderBand`) sit **outside** `PageBody`, and everything else goes **inside** it — including `ListConditionBand`, which is a filter band, not a full-bleed one. An `ActionFooter` is a _sibling_ of `PageBody`, after it — never nested in its gutters.

**Content fills the available width.** Don't wrap the body or its cards in a `max-w-*` lock; the layout is meant to span. Width constraints are for individual field-level controls (a price input), not for the page column.

On a tabbed detail page the `Tabs` root wraps the `PageHeaderBand` and the panels, so each `TabsContent` gets its own `PageBody` — the body is per-panel, not around the tabs.

The two exported constants are for the cases where you need the same metrics without the element. `PAGE_BODY_CLASS_NAME` is the full thing — flex column, gap, and padding. `PAGE_BODY_PADDING_CLASS_NAME` is the padding alone (`px-6 pt-6 pb-8`), for aligning something to the page gutters without inheriting the column layout.

## General guidelines

### Do

- Put the page's content in `PageBody`, and the full-bleed header bands outside it.
- Use `PAGE_BODY_PADDING_CLASS_NAME` when something needs the page gutters but not the column layout.
- Let the built-in `gap-6` do the vertical rhythm; don't add margins between the children.
- Give each `TabsContent` its own `PageBody` on a tabbed detail page.

### Don't

- Don't nest an `ActionFooter` inside `PageBody`; it belongs after it, as a sibling.
- Don't put a full-bleed header band inside it — the gutters will inset the band.
- Don't re-pad the scroll root; that's this component's job.
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

- #### The class constants

  `PAGE_BODY_CLASS_NAME` is the whole recipe; `PAGE_BODY_PADDING_CLASS_NAME` is the gutters alone.

  ```tsx
  import { PAGE_BODY_PADDING_CLASS_NAME, cn } from "@cloud/ui";

  <div className={cn(PAGE_BODY_PADDING_CLASS_NAME, "grid grid-cols-3 gap-4")}>…</div>;
  ```

## Writing guidelines

`PageBody` renders no text of its own.

## Accessibility guidelines

`PageBody` is a layout container with no semantics. It sits inside `Layout`'s `<main>` landmark, so don't add another landmark role to it.
