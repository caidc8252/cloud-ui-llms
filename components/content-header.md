# ContentHeader

In-content page title — a heading, optional subtext, and a flush-right action cluster.

`ContentHeader` is driven by props. Import it from `@cloud/ui`.

## Development guidelines

`ContentHeader` is a title section that lives **inside** the content column, not a full-bleed band. Put it in `PageBody`. `title` is required, `description` is optional muted subtext, and `children` is the action cluster, rendered flush right.

Compare it to the two bands:

- **`ContentHeader`** — in-content, sits inside `PageBody`'s gutters, scrolls with the content, can't be sticky.
- **`PageHeader`** — a full-bleed band for list and create pages, outside `PageBody`, can be sticky.
- **`PageHeaderBand`** — a full-bleed band for detail pages, with a tabs row.

Use `ContentHeader` when the page shouldn't have a chrome band — a dashboard, a settings page, a simple content page — or for a section title _within_ a page that already has a band above it. In that second case, remember the `<h1>`: this component renders one, so a page with a `PageHeader` and a `ContentHeader` has two, which is wrong. One page, one `<h1>`.

## General guidelines

### Do

- Put `ContentHeader` inside `PageBody`.
- Use it when a full-bleed band would be too heavy for the page.
- Put the page's primary action in `children`, and keep it to one.

### Don't

- Don't combine it with a `PageHeader` on the same page; you'd render two `<h1>`s.
- Don't put it outside `PageBody`; it has no gutters of its own.
- Don't expect it to stick; it scrolls with the content.

## Features

- #### Title and description

  ```tsx
  import { PageBody, ContentHeader, Button } from "@cloud/ui";

  <PageBody>
    <ContentHeader title={t("settings.title")} description={t("settings.description")}>
      <Button>{t("settings.save")}</Button>
    </ContentHeader>
    <Card>…</Card>
  </PageBody>;
  ```

- #### Actions

  `children` renders as a flush-right cluster next to the title.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation on the title.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Title: name the page, matching the navigation label that got the user here.
- Description: one line on what the page is for. Leave it out when the title says it all.
- Actions: verb-first labels, and only one primary button.

## Accessibility guidelines

### General accessibility guidelines

- The title renders as an `<h1>`. There must be exactly one per page — so don't pair this with a `PageHeader`.
- Actions are real buttons in the reading order of the content.

### Component-specific guidelines

- If you need a heading _below_ the page's `<h1>` — a section title inside a card, say — don't use `ContentHeader`. Write the right heading level for the position.
