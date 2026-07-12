# PageHeader

Full-bleed page-header band for list and create pages — title, description, and actions.

`PageHeader` is driven by props. Import it from `@cloud/ui`.

## Development guidelines

`PageHeader` is the band that sits flush under the `AppHeader`, spanning edge to edge. Put it **outside** `PageBody` — the scroll root is unpadded precisely so this band can touch the edges.

`title` is required. `description` is the muted subtext beneath it. `titleAdornment` is an inline chip next to the title, typically a status `Badge`. `actions` is the right-hand cluster of buttons.

`sticky` docks the band to the top of the scrollport. Because `Layout`'s `<main>` is the scroll root, `top-0` lands **under the app header**, not under the viewport top. Turn it on for single-step create and edit forms, where Cancel and Submit live in the header and must stay reachable while the form scrolls.

Three headers, three jobs — don't mix them up:

- **`PageHeader`** — a full-bleed band for list and create pages: title and actions, no tabs.
- **`PageHeaderBand`** — a full-bleed band for detail pages: it takes arbitrary header content plus a `tabs` row flush on its bottom edge.
- **`ContentHeader`** — an in-content title, not a band. It lives inside `PageBody`.

## General guidelines

### Do

- Put `PageHeader` outside `PageBody`, directly in the scroll root.
- Use `sticky` on a single-step form whose commit buttons live in the header.
- Put the page's primary action in `actions`, and keep it to one.
- Use `titleAdornment` for a status chip, not for a second title.

### Don't

- Don't use `PageHeader` on a detail page with tabs. Use `PageHeaderBand`.
- Don't nest it inside `PageBody`; the gutters will inset the band and break the full bleed.
- Don't stack `PageHeader` and `ContentHeader` — one title per page.

## Features

- #### Title, description, and actions

  ```tsx
  import { PageHeader, Button, Badge } from "@cloud/ui";

  <PageHeader
    title={t("merchants.title")}
    description={t("merchants.description")}
    actions={<Button>{t("merchants.create")}</Button>}
  />;
  ```

- #### Title adornment

  An inline chip beside the title.

  ```tsx
  <PageHeader
    title={merchant.name}
    titleAdornment={<Badge tone="success">{t("status.live")}</Badge>}
  />
  ```

- #### Sticky

  `sticky` docks the band under the app header while the page scrolls — for forms whose Cancel and Submit sit in the header.

  ```tsx
  <PageHeader
    title={t("merchants.create")}
    sticky
    actions={
      <>
        <Button variant="ghost">{t("common.cancel")}</Button>
        <Button>{t("common.submit")}</Button>
      </>
    }
  />
  ```

### States

- **Sticky** — the band stays docked beneath the app header as the page scrolls.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation on the title.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Title: name the page, matching the breadcrumb and the navigation label that got the user here.
- Description: one line on what the page is for. Leave it out when the title says it all.
- Actions: verb-first labels, and only one primary button.

## Accessibility guidelines

### General accessibility guidelines

- The title renders as the page's `<h1>`, so there must be exactly one page header per page.
- Actions are real buttons in the reading order of the page, not chrome — a keyboard user reaches them before the content.
- Don't rely on `titleAdornment`'s color to carry status; the badge has text.

### Component-specific guidelines

- A `sticky` header covers content as the page scrolls. Keep it short, or a keyboard user tabbing down the form will find the focused field hidden behind it.
