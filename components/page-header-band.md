# PageHeaderBand

Full-bleed page-header band for detail pages — arbitrary header content with a tabs row on its bottom edge.

`PageHeaderBand` is driven by props. Import it from `@cloud/ui`.

## Development guidelines

`PageHeaderBand` is the detail-page header. Unlike `PageHeader`, it doesn't prescribe a title and actions: the whole header — a back button, the object's identity mark, the title, the actions — goes in `children`, so a detail page can compose whatever identity block it needs.

The `tabs` slot renders **flush on the band's bottom edge**. Pass a line-variant `TabsList` with `shadow-none`, so its underline merges into the band's border instead of drawing a second line beneath it.

`sticky` docks the band at the top of the scrollport — which is `Layout`'s `<main>`, so `top-0` lands under the `AppHeader`. **The detail header is sticky by default in the detail, create, and wizard patterns**: the object's identity and its tabs stay visible while the body scrolls. Note the prop itself defaults to `false`, so you have to pass it.

For a list or create page — a title and actions, no tabs row — use `PageHeader`.

## General guidelines

### Do

- Put `PageHeaderBand` outside `PageBody`, directly in the scroll root.
- Pass a line-variant `TabsList` with `shadow-none` into `tabs`.
- Turn on `sticky` for detail pages, so the identity and tabs stay in view.
- Keep the identity block compact — a mark, a title, a status, the actions.

### Don't

- Don't use it for a list page with no tabs. Use `PageHeader`.
- Don't put a shadowed or pill `TabsList` in `tabs`; the underline won't merge with the band.
- Don't nest it inside `PageBody`; the gutters will break the full bleed.

## Features

- #### Header content and tabs

  ```tsx
  import {
    PageHeaderBand,
    Tabs,
    TabsList,
    TabsTrigger,
    ObjectTile,
    Badge,
    Button,
  } from "@cloud/ui";

  <Tabs defaultValue="overview">
    <PageHeaderBand
      sticky
      tabs={
        <TabsList variant="line" className="shadow-none">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="contracts">{t("tabs.contracts")}</TabsTrigger>
        </TabsList>
      }
    >
      <div className="flex items-center gap-3">
        <BackButton />
        <ObjectTile name={merchant.name} tone="auto" colorSeed={merchant.id} />
        <h1 className="text-2xl font-semibold">{merchant.name}</h1>
        <Badge tone="success">{t("status.live")}</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary">{t("common.edit")}</Button>
        </div>
      </div>
    </PageHeaderBand>
    …
  </Tabs>;
  ```

- #### Without tabs

  Omit `tabs` and the band is just the header content — a detail page that doesn't need a tab row.

### States

- **Sticky** — the band, including the tab row, stays docked beneath the app header as the body scrolls.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- The title is the object's name as the user knows it, and it should match the last breadcrumb.
- Tab labels: one or two words, parallel in form, with the default tab first.

## Accessibility guidelines

### General accessibility guidelines

- Put the page's `<h1>` in the header content; the band itself has no heading semantics.
- The tabs come from `Tabs`, so their roles and panel relationships are correct — but the `Tabs` root must wrap both the band and the panels, or the trigger has nothing to control.
- Actions in the header are real buttons in the reading order, before the content.

### Component-specific guidelines

- A sticky band with a tall identity block eats the viewport and hides the field a keyboard user just focused. Keep it to one row.
