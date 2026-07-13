# Layout

The full-page shell — sidebar, sticky header, and the clipped `<main>` everything else lives in.

`Layout` is a client component. It takes a `sidebar` slot, a `header` slot, `children`, and a `className` — **every one of them optional**. Omit `sidebar` and no `<aside>` (and no drawer) is rendered; omit `header` and no `<header>` is rendered. Import it from `@cloud/ui`.

## Development guidelines

`Layout` is a fixed-height viewport: **nothing in the shell scrolls.** The document doesn't scroll, and neither does `<main>` — `<main>` is `flex flex-1 flex-col overflow-hidden`, a fixed-height flex column that **clips**. The one scroll root is `PageBody`, inside it. Pass the navigation as `sidebar` and the app bar as `header` (typically an `AppHeader`), and the page's own content as `children`.

**Wrap it in a `SidebarProvider`.** `Layout` reads `useSidebar()` for the collapsed and drawer state, and `useSidebar()` falls back to a **no-op** outside a provider — so without one nothing crashes, the rail simply never collapses and the mobile drawer never opens. Give the provider your router's `pathname` so the drawer closes on navigation. The provider also binds the global `[` shortcut that toggles the sidebar.

The desktop rail's width follows `useSidebar().collapsed`, applied as an **inline style** so it is correct on the server and doesn't flash on hydration: **248px expanded, 56px collapsed**, with a 180ms width transition. Below the `md` breakpoint the rail is hidden by CSS and **the same sidebar node renders inside a left `Sheet` drawer** (`w-64`, with a screen-reader-only "Navigation" title) — you pass the sidebar once and get both. The header is a sticky `h-14` bar carrying the surface background and the bottom border.

`<main>` is **full-width and unpadded**: pages own their own padding. That is deliberate, so a full-bleed band — a `PageHeader`, a white detail header — can touch the edges without negative-margin tricks. Put your padded content in `PageBody`; put the bands outside it.

**`PageBody` is the page's one scroll root** (it carries `data-layout-scroll-root`). `PageHeader`, `PageHeaderBand` and `ActionFooter` are its **siblings** inside `<main>` — they sit outside the scroll root, so they never scroll and stay in view for free. That is why **there is no `sticky` prop on `PageHeader` or `PageHeaderBand`; it has been deleted.** The consequence to internalise: **page content must go through `PageBody`** — anything else rendered into `<main>`, an error page included, is clipped and unreachable. `PageBody` scrolls back to the top on every route change; the layout finds it by querying the live `[data-layout-scroll-root]` node.

Sticky elements _inside_ the body — `Table stickyHeader`, `ListSummaryBar`, `ListConditionBand` — dock to `PageBody`'s **padding-box top edge**, flush under the band. `PageBody` is also a **size container**, so a sticky side pane inside it docks with `sticky top-0` and caps its height with `max-h-sticky-pane` (`100cqh`) — never `100dvh` minus a hand-counted header height. Note `top-0` is not "flush against the band": the sticky datum already includes `PageBody`'s `pt-6`, so `top-0` docks 24px under the band, and any `top-*` stacks on top of that.

`PageBody` pins its direct children at `shrink-0` (`[&>*]:shrink-0`) — **don't override it.** PageBody is a definite-height flex column, so its children are shrinkable flex items, and a child whose overflow isn't `visible` is a scroll container with an automatic minimum size of zero. `Card` defaults to `overflow-hidden`, so a tall Card would silently collapse to fit and clip its own content instead of letting the page scroll.

`<main>` is **always** a flex column, footer or not. An `ActionFooter` is `shrink-0` and simply sits below the scroll region — always in view, on short and long pages alike; no `mt-auto`, no `sticky bottom-0`, no conditional column keyed off `data-action-footer`.

## General guidelines

### Do

- Mount `Layout` once, in the app shell, inside a `SidebarProvider`, and let every page render into it.
- Pass the router's `pathname` to `SidebarProvider` so the mobile drawer closes on navigation.
- Pass the sidebar once; the drawer on mobile is handled for you.
- Put padded content in `PageBody`, and full-bleed bands outside it.
- Route **all** page content through `PageBody` — including error and empty pages. Outside it, content is clipped.
- Put an `ActionFooter` as a **sibling** of `PageBody`, never inside it.
- Give every page a band: `PageHeader` on a level-1 list, `PageHeaderBand` on everything else.

### Don't

- Don't add padding to `<main>`; pages own their padding.
- Don't pass `sticky` to `PageHeader` or `PageHeaderBand` — the prop is gone. The bands are outside the scroll root; they never scroll.
- Don't override `PageBody`'s `[&>*]:shrink-0` on a direct child; an `overflow-hidden` block would collapse instead of letting the page scroll.
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
      header={<AppHeader leading={<SidebarTrigger />} breadcrumbs={<Breadcrumbs items={items} />} />}
    >
      <PageHeader
        title={t("merchants.title")}
        actions={[
          { label: t("merchants.create"), icon: <Plus size={16} />, to: "/merchants/new", variant: "primary" },
        ]}
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
  import { Layout, AppHeader, SidebarTrigger, PageHeaderBand, PageBody, ActionFooter, Button } from "@cloud/ui";
  import { X, Save } from "lucide-react";

  <Layout sidebar={<AppSidebar />} header={<AppHeader leading={<SidebarTrigger />} />}>
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
- **With footer** — the footer sits below the scroll region as a `shrink-0` sibling of `PageBody`, in view on short and long pages alike.
- **No sidebar / no header** — both slots are optional; omit either and its element isn't rendered.

## Writing guidelines

`Layout` renders no text of its own, apart from the mobile drawer's screen-reader-only `Navigation` title.

## Accessibility guidelines

### General accessibility guidelines

- The shell renders real `<aside>`, `<header>`, and `<main>` landmarks (the `<aside>` and `<header>` only when you pass those slots), so a screen-reader user can jump straight to the content.
- The mobile drawer carries a screen-reader-only `Navigation` title, so the dialog has an accessible name.
- The scroll root — `PageBody` — resets to the top on every route change, so a keyboard user doesn't land mid-page after following a link.

### Component-specific guidelines

- Keep `PageBody` the page's only scroll container. `<main>` clips and the bands don't scroll, so a second full-height scroll area beside `PageBody` gives keyboard users two scrollports to fight with — inner panes are what `ScrollArea` is for.
- The `[` shortcut that toggles the sidebar comes from `SidebarProvider`, and it is suppressed while the user is typing in an input, textarea or contenteditable — don't rebind it per page.
