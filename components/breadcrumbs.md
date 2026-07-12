# Breadcrumbs

Renders a trail of items and separators for `AppHeader`'s `breadcrumbs` slot.

`Breadcrumbs` takes an `items` array and returns the crumb elements. It exports the `BreadcrumbsItem` type alongside it. Import them from `@cloud/ui`.

Note the plural. **`Breadcrumbs` (this one) is the data-driven shortcut; `Breadcrumb` (singular) is the set of primitives it is built from.**

## Development guidelines

`Breadcrumbs` maps `BreadcrumbsItem[]` into `BreadcrumbItem`s with separators between them. It renders **only the items** — it does not wrap them in `<Breadcrumb><BreadcrumbList>`, because `AppHeader`'s `breadcrumbs` slot already does that. Pass it straight into that slot.

Each item is `{ label, href?, render? }`:

- The **last** item always renders as a `BreadcrumbPage`, regardless of whether it has an `href`. It is the page the user is on, so it is not a link.
- An item with an `href` renders as a `BreadcrumbLink`.
- An item with neither — a non-navigable ancestor, a grouping segment — renders as plain text.

Pass `render` to hand the link your router's component, for example `render={<Link href="/merchants" />}`, so client-side navigation works.

When you need full control — icons in a crumb, async labels, a custom segment — skip this and compose the `Breadcrumb` primitives directly.

## General guidelines

### Do

- Pass `Breadcrumbs` into `AppHeader`'s `breadcrumbs` slot, unwrapped.
- Give every navigable ancestor an `href`, and a `render` for client-side routing.
- Use the destination page's own title as the label.

### Don't

- Don't wrap it in a `Breadcrumb` yourself; the header slot does that, and you'd nest two `<nav>`s.
- Don't give the last item an `href` expecting a link — it always renders as the current page.
- Don't use it when a crumb needs custom content. Compose the primitives instead.

## Features

- #### Items

  ```tsx
  import { AppHeader, Breadcrumbs, type BreadcrumbsItem } from "@cloud/ui";
  import Link from "next/link";

  const items: BreadcrumbsItem[] = [
    { label: t("nav.merchants"), href: "/merchants", render: <Link href="/merchants" /> },
    { label: merchant.name },
  ];

  <AppHeader breadcrumbs={<Breadcrumbs items={items} />} />;
  ```

- #### Non-navigable segments

  An item with no `href` and no `render` renders as plain text — for a grouping level that isn't a page.

### States

- **Link** — an ancestor with an `href`.
- **Current** — the last item, always a `BreadcrumbPage` with `aria-current="page"`.
- **Plain** — an ancestor with no `href`.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label each crumb with the destination page's title, so the label predicts the page.
- Keep the trail short. Three or four crumbs is a location; eight is a maze.

## Accessibility guidelines

### General accessibility guidelines

- The trail renders through the `Breadcrumb` primitives, so it lands in a `<nav aria-label="breadcrumb">` with an ordered list, and the last crumb carries `aria-current="page"`.
- Separators are `aria-hidden`, so they aren't read out.
- A plain-text crumb is not focusable, which is correct — it goes nowhere.

### Component-specific guidelines

- Pass `render` with your router's link so the crumb is a real anchor. A crumb that navigates through an `onClick` on a `<span>` is invisible to keyboard and screen-reader users.
