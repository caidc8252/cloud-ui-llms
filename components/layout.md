# Layout

The full-page shell — sidebar, sticky header, and the scroll root everything else lives in.

`Layout` is a client component. It takes a `sidebar` slot, a `header` slot, `children`, and a `className` — **every one of them optional**. Omit `sidebar` and no `<aside>` (and no drawer) is rendered; omit `header` and no `<header>` is rendered. Import it from `@cloud/ui`.

## Development guidelines

`Layout` is a fixed-height viewport: the page does not scroll, `<main>` does. Pass the navigation as `sidebar` and the app bar as `header` (typically an `AppHeader`), and the page's own content as `children`.

**Wrap it in a `SidebarProvider`.** `Layout` reads `useSidebar()` for the collapsed and drawer state, and `useSidebar()` falls back to a **no-op** outside a provider — so without one nothing crashes, the rail simply never collapses and the mobile drawer never opens. Give the provider your router's `pathname` so the drawer closes on navigation. The provider also binds the global `[` shortcut that toggles the sidebar.

The desktop rail's width follows `useSidebar().collapsed`, applied as an **inline style** so it is correct on the server and doesn't flash on hydration: **248px expanded, 56px collapsed**, with a 180ms width transition. Below the `md` breakpoint the rail is hidden by CSS and **the same sidebar node renders inside a left `Sheet` drawer** (`w-64`, with a screen-reader-only "Navigation" title) — you pass the sidebar once and get both. The header is a sticky `h-14` bar carrying the surface background and the bottom border.

The scroll area is **full-width and unpadded**: pages own their own padding. That is deliberate, so a full-bleed band — a `PageHeader`, a white detail header — can touch the edges without negative-margin tricks. Put your padded content in `PageBody`; put the bands outside it.

`<main>` is the scroll root, and it is what a sticky band docks to: `sticky top-0` inside the page lands _under_ the app header, not under the viewport top. It also scrolls back to the top on every route change.

`<main>` becomes a flex column **only when an `ActionFooter` is present** — the layout keys that off the footer's `data-action-footer` attribute. That's what lets the footer's `mt-auto` pin it to the bottom of a short page. Pages without a footer are untouched.

## General guidelines

### Do

- Mount `Layout` once, in the app shell, inside a `SidebarProvider`, and let every page render into it.
- Pass the router's `pathname` to `SidebarProvider` so the mobile drawer closes on navigation.
- Pass the sidebar once; the drawer on mobile is handled for you.
- Put padded content in `PageBody`, and full-bleed bands outside it.
- Put an `ActionFooter` as a **sibling** of `PageBody`, never inside it.
- Give every page a band: `PageHeader` on a level-1 list, `PageHeaderBand` on everything else.

### Don't

- Don't add padding to the scroll root; pages own their padding.
- Don't scroll the document; `<main>` is the scroll root, and sticky offsets depend on it.
- Don't render a second sidebar for mobile — the drawer reuses the one you passed.
- Don't mount `Layout` without a `SidebarProvider`; the collapse and the drawer silently do nothing.
- Don't drop a bare `ContentHeader` in as the page header — it has no band chrome. Use `PageHeader` / `PageHeaderBand`.
- Don't lock the content to a `max-w-*` column; pages fill the available width.

## Features

- #### The shell

  ```tsx
  import {
    Layout,
    AppHeader,
    SidebarTrigger,
    Breadcrumbs,
    PageHeader,
    PageBody,
    SidebarProvider,
  } from "@cloud/ui";
  import { Plus } from "lucide-react";

  <SidebarProvider pathname={pathname}>
    <Layout
      sidebar={<AppSidebar />}
      header={
        <AppHeader
          leading={<SidebarTrigger />}
          breadcrumbs={<Breadcrumbs items={items} />}
        />
      }
    >
      <PageHeader
        title={t("merchants.title")}
        actions={
          <Button variant="primary" iconLeft={<Plus className="size-4" />}>
            {t("merchants.create")}
          </Button>
        }
        sticky
      />
      <PageBody>{content}</PageBody>
    </Layout>
  </SidebarProvider>;
  ```

- #### Collapsed rail and mobile drawer

  The rail's width follows `useSidebar().collapsed` — 248px expanded, 56px collapsed. Below `md`, the same sidebar renders in a left `Sheet`, opened by `SidebarTrigger` (or the `[` shortcut).

- #### With an action footer

  A page with a footer is a form page, so its band is a `PageHeaderBand` — and every button in the footer carries an icon.

  ```tsx
  import {
    Layout,
    AppHeader,
    SidebarTrigger,
    PageHeaderBand,
    PageBody,
    ActionFooter,
    Button,
  } from "@cloud/ui";
  import { X, Save } from "lucide-react";

  <Layout
    sidebar={<AppSidebar />}
    header={<AppHeader leading={<SidebarTrigger />} />}
  >
    <PageHeaderBand title={title} backTo="/merchants" />
    <PageBody>{form}</PageBody>
    <ActionFooter>
      <Button variant="ghost" iconLeft={<X size={16} />} onClick={cancel}>
        {t("common.cancel")}
      </Button>
      <Button variant="primary" iconLeft={<Save size={16} />} onClick={save}>
        {t("common.save")}
      </Button>
    </ActionFooter>
  </Layout>;
  ```

### States

- **Collapsed** — the desktop rail narrows from 248px to 56px, with a 180ms width transition.
- **Mobile** — the rail is hidden and the drawer takes over.
- **With footer** — `<main>` becomes a flex column so the footer pins to the bottom.
- **No sidebar / no header** — both slots are optional; omit either and its element isn't rendered.

## Writing guidelines

`Layout` renders no text of its own, apart from the mobile drawer's screen-reader-only `Navigation` title.

## Accessibility guidelines

### General accessibility guidelines

- The shell renders real `<aside>`, `<header>`, and `<main>` landmarks (the `<aside>` and `<header>` only when you pass those slots), so a screen-reader user can jump straight to the content.
- The mobile drawer carries a screen-reader-only `Navigation` title, so the dialog has an accessible name.
- The scroll root resets to the top on every route change, so a keyboard user doesn't land mid-page after following a link.

### Component-specific guidelines

- Keep `<main>` the only scroll container. Nesting another full-height scroll area inside it gives keyboard users two scrollports to fight with, and breaks the sticky bands.
- The `[` shortcut that toggles the sidebar comes from `SidebarProvider`, and it is suppressed while the user is typing in an input, textarea or contenteditable — don't rebind it per page.
