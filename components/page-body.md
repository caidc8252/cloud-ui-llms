# PageBody

The padded content column of a page.

`PageBody` is a plain `<div>` with the page's standard padding and vertical rhythm. It also exports `PAGE_BODY_CLASS_NAME` and `PAGE_BODY_PADDING_CLASS_NAME`. Import them from `@cloud/ui`.

## Development guidelines

`Layout`'s scroll root is deliberately **unpadded and full-width**, so full-bleed bands can touch the edges. `PageBody` is where the padding lives: it applies the page gutters (`px-6 pt-6 pb-8`) and stacks its children in a column with a consistent gap.

So the shape of a page is: the full-bleed bands (`PageHeader`, `PageHeaderBand`, `ListConditionBand`) sit **outside** `PageBody`, and everything else goes **inside** it. An `ActionFooter` is a _sibling_ of `PageBody`, after it — never nested in its gutters.

The two exported constants are for the cases where you need the same metrics without the element. `PAGE_BODY_CLASS_NAME` is the full thing — flex column, gap, and padding. `PAGE_BODY_PADDING_CLASS_NAME` is the padding alone, for aligning something to the page gutters without inheriting the column layout.

## General guidelines

### Do

- Put the page's content in `PageBody`, and the full-bleed bands outside it.
- Use `PAGE_BODY_PADDING_CLASS_NAME` when something needs the page gutters but not the column layout.
- Let the built-in gap do the vertical rhythm; don't add margins between the children.

### Don't

- Don't nest an `ActionFooter` inside `PageBody`; it belongs after it, as a sibling.
- Don't put a full-bleed band inside it — the gutters will inset the band.
- Don't re-pad the scroll root; that's this component's job.

## Features

- #### Page content

  ```tsx
  import { PageHeader, PageBody, ActionFooter, Button } from "@cloud/ui";

  <>
    <PageHeader title={t("merchants.title")} />
    <PageBody>
      <Card>…</Card>
      <Card>…</Card>
    </PageBody>
    <ActionFooter>
      <Button variant="ghost">{t("common.cancel")}</Button>
      <Button>{t("common.save")}</Button>
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
