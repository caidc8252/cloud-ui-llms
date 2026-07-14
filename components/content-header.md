# ContentHeader

The header family's shared title block — a heading, optional subtext, and a flush-right action cluster.

`ContentHeader` is driven by props: `title` (required), `description`, `children`, `className`. Import it from `@cloud/ui`.

## Development guidelines

**Never use `ContentHeader` on its own as a page header.** This is a hard rule. It is the _title block_ the header bands are built from — a bare `flex items-center justify-between` row with an `<h1>`, a muted description and a flush-right `children` cluster. It has **no band chrome of its own**: no padding, no background, no bottom border, no sticky, no back button. Standing alone at the top of a page it reads as an unfinished skeleton.

There are exactly two legal ways to use it:

1. **Composed inside a band** — and the bands already do this for you. `PageHeader` renders a `ContentHeader`, and so does `PageHeaderBand` in its default `variant="page"`. You pass `title` / `description` / `actions` to the band; the band builds the `ContentHeader`. You don't hand-assemble it.
2. **As a section title inside `PageBody`** — a heading for a block of content on a page that already has its band above it. Mind the `<h1>` (see Accessibility).

Pick the band by page level:

- **`PageHeader`** — full-bleed band for **level-1 pages only** (list / index). No back button: a level-1 page is a navigation root. `sticky` docks it under the app header.
- **`PageHeaderBand`** — full-bleed band for **every other page** (new, edit, sub-page, detail). The back button is built in and always rendered — `backTo` gives it a destination, otherwise it goes back in history. `variant="page"` (default) uses the shared `ContentHeader`; `variant="detail"` is a purpose-built identity band (leading `avatar`, inline `titleAdornment` badge, a `meta` facts row, `tabs` docked on the bottom edge) and does **not** go through `ContentHeader` at all.

So a detail page never gets a `ContentHeader` — an entity identity band is richer than title + description. Reach for `PageHeaderBand variant="detail"` instead.

When a band builds the `ContentHeader`, the action slot is fed from `HeaderAction[]` descriptors (`{ label, icon, to?, onClick?, variant?, disabled? }`) — `icon` is required and there is no `size` field, which is how the md-only rule for header actions is enforced at compile time. You never pass raw JSX buttons into a band's action slot.

## General guidelines

### Do

- Let `PageHeader` / `PageHeaderBand` build the `ContentHeader` for you — pass `title`, `description` and `actions` to the band.
- Use `ContentHeader` directly only as a section title inside `PageBody`.
- Keep `children` to one primary action.

### Don't

- **Don't use it alone as a page header.** It has no band chrome — no padding, border, background, sticky or back. Use `PageHeader` (level-1) or `PageHeaderBand` (everything else).
- Don't force a detail page into it; use `PageHeaderBand variant="detail"`.
- Don't combine it with a `PageHeader` on the same page; you'd render two `<h1>`s.
- Don't put it outside `PageBody` when you do use it directly; it has no gutters of its own.
- Don't expect it to stick; the band it sits in owns the sticky behaviour, not the title block.

## Features

- #### Composed by the band (the normal path)

  ```tsx
  import { PageHeader, PageBody, Card } from "@cloud/ui";
  import { Plus } from "lucide-react";

  <>
    <PageHeader
      title={t("merchants.title")}
      description={t("merchants.description")}
      actions={
        <Button variant="primary" iconLeft={<Plus className="size-4" />}>
          {t("merchants.create")}
        </Button>
      }
      sticky
    />
    <PageBody>
      <Card>…</Card>
    </PageBody>
  </>;
  ```

  `PageHeader` renders the `ContentHeader` internally and fills its `children` slot from the `HeaderAction[]`.

- #### As a section title

  ```tsx
  import { PageBody, ContentHeader, Button, Card } from "@cloud/ui";

  <PageBody>
    <ContentHeader
      title={t("settings.integrations")}
      description={t("settings.integrationsHint")}
    >
      <Button variant="secondary">{t("settings.addIntegration")}</Button>
    </ContentHeader>
    <Card>…</Card>
  </PageBody>;
  ```

  The title is hard-coded to `<h1>` at `text-3xl`, and the page's band already rendered one — so this use costs you a second `<h1>` and a page-sized heading in the middle of the body. Do it only when the section really is a peer of the page title; otherwise write the heading at the level the position calls for.

- #### Actions

  `children` renders as a flush-right cluster next to the title. Inside a band, that cluster is the band's `HeaderActions`, not yours.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation on the title.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Title: name the page, matching the navigation label that got the user here.
- Description: one line on what the page is for. Leave it out when the title says it all.
- Actions: verb-first labels, and only one primary button. In a band, every action label pairs with a required `icon` — `Plus` to create, `Save` to save, `ChevronLeft` to go back, `X` to cancel.

## Accessibility guidelines

### General accessibility guidelines

- The title renders as an `<h1>`. There must be exactly one per page — and on a real page the band already rendered it, so a second `ContentHeader` on the same page is a second `<h1>`.
- Actions are real buttons in the reading order of the content.

### Component-specific guidelines

- If you need a heading _below_ the page's `<h1>` — a section title inside a card, say — don't use `ContentHeader`. Write the right heading level for the position.
