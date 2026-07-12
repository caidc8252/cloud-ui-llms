# StatusCard

Header-less card for repeating status lists — media, title, badge, description, and a control footer.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/recipes/status-card.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`StatusCard` is a client component driven by props, composed over `Card`. It exports the `StatusCardProps` and `StatusCardSize` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`StatusCard` is the repeating card in a list of objects: a media-led heading (`media` + `title` + a status `badge`) over an optional `description`, with a footer split into `footerStart` and `footerEnd` clusters. It has no `CardHeader` — the heading is the card.

`title` is required. `media` is the leading mark — an `ObjectTile` or a logo. `badge` is the status `Badge` beside the title. `trailing` is the chevron at the end; it is decorative and `aria-hidden` when the card is interactive.

The whole card can be **one stretched link**. Pass `href` to navigate or `onSelect` to open a modal — **one or the other, not both**. The title becomes the link, and an `::after` overlay stretches its hit area across the card. The footer controls sit _above_ that overlay, so a switch or a button in `footerStart` / `footerEnd` stays independently clickable. Omit both props for a static card.

When the title alone isn't a good accessible name for the link — a bare id, say, or a name repeated across cards — pass `linkLabel`.

`size` is `sm`, `md` (default), or `lg`, controlling the radius and slot padding. The footer keeps the card's horizontal padding but uses a tighter vertical rhythm: it is one control row, not stacked content.

## General guidelines

### Do

- Pass `href` **or** `onSelect`, never both.
- Put the object's status in a `Badge`, and put the controls in the footer clusters.
- Give the card a `linkLabel` when the title isn't a self-sufficient name.
- Keep the footer to a single row of controls.

### Don't

- Don't nest a link or a button inside `title` — the title _is_ the link.
- Don't rely on the badge color alone for status; the badge has text.
- Don't stack paragraphs of content in a status card; it's a list row, not a detail page.

## Features

- #### Static card

  ```tsx
  import { StatusCard, ObjectTile, Badge } from "@cloud/ui";

  <StatusCard
    media={<ObjectTile name={app.name} tone="auto" colorSeed={app.id} />}
    title={app.name}
    badge={<Badge tone="warning">{t("status.pending")}</Badge>}
    description={app.summary}
  />;
  ```

- #### Whole-card link

  `href` stretches the title's link across the card. Footer controls stay clickable.

  ```tsx
  <StatusCard
    href={`/apps/${app.id}`}
    media={<ObjectTile name={app.name} tone="auto" />}
    title={app.name}
    badge={<Badge tone="success">{t("status.live")}</Badge>}
    trailing={<ChevronRight />}
    footerStart={<Switch checked={app.enabled} onCheckedChange={toggle} />}
    footerEnd={
      <Button variant="ghost" size="sm">
        {t("common.details")}
      </Button>
    }
  />
  ```

- #### Action card

  `onSelect` makes the whole card run an action — opening a modal, for instance — instead of navigating.

- #### Size

  `size` is `sm`, `md` (default), or `lg`, controlling the radius and the slot padding.

### States

- **Static** — no `href` or `onSelect`: no hover, nothing focusable but the footer controls.
- **Interactive** — the whole card is a hit area, and `trailing` becomes decorative.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Title: the object's name, as the user knows it.
- Badge: one or two words of status — `Live`, `Pending review`.
- Description: one line saying what the object is or what needs attention. Not a paragraph.

## Accessibility guidelines

### General accessibility guidelines

- The stretched link is a real link on the title, so it is reachable by Tab and announced with a name — the overlay only widens the pointer hit area.
- Footer controls sit above the overlay and stay independently focusable and clickable.
- Pass `linkLabel` when the title is not a distinguishable name on its own; a list of links all reading `View` is unusable by screen reader.

### Component-specific guidelines

- `trailing` is `aria-hidden` on an interactive card, so don't put meaning in it. It is a chevron, not a message.
