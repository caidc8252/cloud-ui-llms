# PageHeaderBand

Full-bleed page-header band for level-2/3 pages — built-in back button, title, actions, and a tabs row on its bottom edge.

`PageHeaderBand` is driven by props. It also re-exports the `HeaderAction` type. Import them from `@cloud/ui`.

## Development guidelines

**Page tiering is a hard rule.** A level-1 list or index page uses `PageHeader`. **Everything else** — create, edit, sub-page, entity detail — uses `PageHeaderBand`. The distinction the rule encodes is the back button: `PageHeaderBand`'s is **built in and cannot be omitted**. `backTo` gives it a destination (rendered as a `Link`), `onBack` overrides it with a handler, and with neither it goes back in history. There is no children slot: the band is fully prop-driven — `title`, `description`, `titleAdornment`, `avatar`, `meta`, `actions`, `tabs`.

`variant` picks the title-block shape, and **the two are genuinely different headers**, not one with a size knob:

- **`variant="page"`** (the default) — a non-detail level-2 page: new, edit, a sub-page. The title block is the shared `ContentHeader`: `title` + `description`, with `titleAdornment` and `actions` flush right.
- **`variant="detail"`** — the entity **identity band**. Purpose-built, and deliberately *not* a `ContentHeader`: an optional leading `avatar` tile, the title with its status badge **inline** beside it via `titleAdornment`, a `meta` facts row beneath (created date, reference, category), `actions` on the right, and `tabs` docked on the bottom edge.

`avatar` and `meta` are **detail-only** and are ignored on the page variant. On detail, `meta` **replaces** `description` as the subline: pass one or the other, and `meta` wins when both are set.

There is **no `sticky` prop** on either variant, and nothing to configure: the band is a **sibling of `PageBody`** inside a `<main>` that clips instead of scrolling. Only `PageBody` scrolls, so the band — tab row and all — stays docked under the `AppHeader` for free.

**The band owns the tabs track line.** Its own `border-b` *is* the rail, and the band suppresses the docked `TabsList`'s underline for you (a `line` list would otherwise draw a second rule one pixel above the band's border, giving a 2px two-tone line under the tabs). So pass a plain `TabsList` — no `shadow-none`, no variant gymnastics. The active indicator still sits on the rule. A standalone `Tabs` outside a band keeps its own underline.

`actions` is **not JSX** — it is a `HeaderAction[]` of descriptors:

```ts
type HeaderAction = {
  label: string;
  icon: React.ReactNode; // REQUIRED — every header action carries an icon
  to?: string; // route → renders a Link
  onClick?: () => void; // handler → renders a <button>; ignored when `to` is set
  variant?: "primary" | "secondary" | "ghost" | "ghost-danger" | "danger" | "link"; // default "secondary"
  disabled?: boolean;
  ariaLabel?: string;
};
```

There is deliberately **no `size` field**: the slot renders `md` buttons and nothing else, which is the compile-time enforcement of the header size rule. The built-in back control is the single exception — it is an `icon` button. And `icon` is **required**, so a header action can never ship bare (Publish → `CheckCircle2`, Save → `Save`, Cancel → `X`, and a verb-appropriate glyph otherwise).

## General guidelines

### Do

- Put `PageHeaderBand` outside `PageBody`, as a direct child of `<main>`, so it doesn't scroll.
- Use `variant="detail"` for an entity page, and let `avatar` + `titleAdornment` + `meta` build the identity — that is what the variant is for.
- Wrap the band **and** the `TabsContent` panels in one `Tabs` root when you use `tabs`.
- Give `backTo` a destination whenever the parent page is known; fall back to history only when it isn't.
- Pass `actions` as `HeaderAction` descriptors, each with an `icon`.

### Don't

- Don't use it on a level-1 list page. That's `PageHeader`.
- Don't hand-build an identity block with `ContentHeader` on a detail page; the identity band is richer than title + description, and `ContentHeader` is banned as a standalone page header.
- Don't add `shadow-none` or a special variant to the docked `TabsList` — the band already suppresses the list's line.
- Don't try to hide the back button; it is not optional.
- Don't pass `avatar` or `meta` on `variant="page"`; they are ignored.
- Don't nest the band inside `PageBody`; the gutters will break the full bleed.

## Features

- #### Detail identity band with tabs

  ```tsx
  import {
    PageHeaderBand,
    PageBody,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    ObjectTile,
    Badge,
  } from "@cloud/ui";
  import { CheckCircle2, Tag } from "lucide-react";

  <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-0">
    <PageHeaderBand
      variant="detail"
      title={merchant.name}
      backTo="/merchants"
      avatar={<ObjectTile name={merchant.name} tone="auto" colorSeed={merchant.id} size="lg" />}
      titleAdornment={<Badge tone="success">{t("status.live")}</Badge>}
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <Tag className="size-3.5" /> {merchant.type}
          </span>
          <span>{merchant.reference}</span>
        </>
      }
      actions={[
        {
          label: t("merchants.publish"),
          onClick: publish,
          variant: "primary",
          disabled: blockers.length > 0,
          icon: <CheckCircle2 size={16} />,
        },
      ]}
      tabs={
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="contracts">{t("tabs.contracts")}</TabsTrigger>
        </TabsList>
      }
    />
    <TabsContent value="overview" className="flex min-h-0 flex-col">
      <PageBody>…</PageBody>
    </TabsContent>
    <TabsContent value="contracts" className="flex min-h-0 flex-col">
      <PageBody>…</PageBody>
    </TabsContent>
  </Tabs>;
  ```

- #### Page variant

  The default. A create, edit, or sub-page: title, description, back button, and — when the page commits from the header rather than an `ActionFooter` — actions. No tabs, no identity block.

  ```tsx
  <PageHeaderBand
    title={t("merchants.create")}
    description={t("merchants.createSteps")}
    backTo="/merchants"
  />
  ```

- #### Back button

  It is always rendered. `backTo` makes it a `Link`; `onBack` makes it a handler (useful for a wizard step that goes back a step rather than a page); with neither it calls history back.

  ```tsx
  <PageHeaderBand title={t("wizard.step2")} onBack={() => setStep(1)} />
  ```

- #### Without tabs

  Omit `tabs` and the band is just the header row — a detail page that needs no tab strip.

### States

- **Always in view** — the band, including the tab row, stays docked beneath the app header as the body scrolls. Not a prop and not a mode: it simply doesn't live in the scroll root.
- **Disabled action** — a descriptor with `disabled` renders a disabled `md` button (a `to` action ignores it).

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- The title is the object's name as the user knows it, and it should match the last breadcrumb.
- `meta` is facts, not prose — short label-less values (type, category, reference, price range), each with a small leading icon.
- Tab labels: one or two words, parallel in form, with the default tab first.

## Accessibility guidelines

### General accessibility guidelines

- `title` renders the page's `<h1>` in both variants, so there is exactly one page header per page.
- The back button is a real button (or link) with an `aria-label` of `Back`, and it comes first in the reading order.
- The tabs come from `Tabs`, so their roles and panel relationships are correct — but the `Tabs` root must wrap both the band and the panels, or the trigger has nothing to control.
- Actions are real `Button`s in the reading order, before the content, each with an icon **and** a text label.

### Component-specific guidelines

- The band is always on screen, so a tall identity block permanently eats the viewport the scrolling body has left. Keep `avatar` + title + `meta` to the one identity row the component lays out — don't stuff extra rows into `titleAdornment`.
- Don't rely on `titleAdornment`'s color to carry status; the badge has text.
