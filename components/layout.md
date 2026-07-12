# Layout

The full-page shell — sidebar, sticky header, and the scroll root everything else lives in.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/layout.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/index.ts)

`Layout` is a client component. It takes a `sidebar` slot, a `header` slot, and `children`. Import it from `@cloud/ui`.

## Development guidelines

`Layout` is a fixed-height viewport: the page does not scroll, `<main>` does. Pass the navigation as `sidebar` and the app bar as `header` (typically an `AppHeader`), and the page's own content as `children`.

The desktop rail's width follows `useSidebar().collapsed`, applied as an **inline style** so it is correct on the server and doesn't flash on hydration. Below the `md` breakpoint the rail is hidden by CSS and **the same sidebar node renders inside a left `Sheet` drawer** — you pass the sidebar once and get both. The header is a sticky `h-14` bar.

The scroll area is **full-width and unpadded**: pages own their own padding. That is deliberate, so a full-bleed band — a `PageHeader`, a white detail header — can touch the edges without negative-margin tricks. Put your padded content in `PageBody`; put the bands outside it.

`<main>` is the scroll root, and it is what a sticky band docks to: `sticky top-0` inside the page lands _under_ the app header, not under the viewport top. It also scrolls back to the top on every route change.

`<main>` becomes a flex column **only when an `ActionFooter` is present** — the layout keys that off the footer's `data-action-footer` attribute. That's what lets the footer's `mt-auto` pin it to the bottom of a short page. Pages without a footer are untouched.

## General guidelines

### Do

- Mount `Layout` once, in the app shell, and let every page render into it.
- Pass the sidebar once; the drawer on mobile is handled for you.
- Put padded content in `PageBody`, and full-bleed bands outside it.
- Put an `ActionFooter` as a **sibling** of `PageBody`, never inside it.

### Don't

- Don't add padding to the scroll root; pages own their padding.
- Don't scroll the document; `<main>` is the scroll root, and sticky offsets depend on it.
- Don't render a second sidebar for mobile — the drawer reuses the one you passed.

## Features

- #### The shell

  ```tsx
  import { Layout, AppHeader, SidebarTrigger, PageBody } from "@cloud/ui";

  <Layout
    sidebar={<AppSidebar />}
    header={<AppHeader leading={<SidebarTrigger />} breadcrumbs={<Breadcrumbs items={items} />} />}
  >
    <PageHeader title={title} />
    <PageBody>{content}</PageBody>
  </Layout>;
  ```

- #### Collapsed rail and mobile drawer

  The rail's width follows `useSidebar().collapsed`. Below `md`, the same sidebar renders in a left `Sheet`, opened by `SidebarTrigger`.

- #### With an action footer

  ```tsx
  <Layout sidebar={<AppSidebar />} header={<AppHeader />}>
    <PageHeader title={title} sticky />
    <PageBody>{form}</PageBody>
    <ActionFooter>
      <Button variant="ghost">{t("common.cancel")}</Button>
      <Button>{t("common.save")}</Button>
    </ActionFooter>
  </Layout>
  ```

### States

- **Collapsed** — the desktop rail narrows to the icon width, with a width transition.
- **Mobile** — the rail is hidden and the drawer takes over.
- **With footer** — `<main>` becomes a flex column so the footer pins to the bottom.

## Writing guidelines

`Layout` renders no text of its own, apart from the mobile drawer's screen-reader-only `Navigation` title.

## Accessibility guidelines

### General accessibility guidelines

- The shell renders real `<aside>`, `<header>`, and `<main>` landmarks, so a screen-reader user can jump straight to the content.
- The mobile drawer carries a screen-reader-only title, so the dialog has an accessible name.
- The scroll root resets to the top on navigation, so a keyboard user doesn't land mid-page after following a link.

### Component-specific guidelines

- Keep `<main>` the only scroll container. Nesting another full-height scroll area inside it gives keyboard users two scrollports to fight with, and breaks the sticky bands.
