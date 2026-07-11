# Card

Groups related content and actions on a single bordered surface.

[Source](../src/components/ui/primitives/card.tsx) | [Public exports](../src/components/ui/index.ts)

`Card` is a set of seven plain components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. None of them carry `"use client"`, so a card renders in a server component as long as its children do. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Card` is a container, not a collection. It renders one surface and does not iterate, select, filter, or paginate items. To show a list of cards, map over the data in the application and lay the cards out with a grid.

Every slot is optional and the shell is a flex column, so slots stack in the order you write them. A card with only `CardContent` is a normal shape. Reach for `CardHeader` when the card genuinely has a title, not to fill out the pattern.

`CardHeader` is a grid that reshapes itself from what it contains. Adding a `CardDescription` gives it a second row, and adding a `CardAction` gives it a second column with the action spanning both rows. Both come from `has-data-[slot=…]` selectors, so the layout follows from rendering the slot and there is no prop to set.

Set `size` once, on the shell. The shell publishes it as `data-size` and every slot reads it back through `group-data-[size=…]/card:` variants, which is why the slots have no `size` prop of their own. Changing `size` on the `Card` re-pads everything underneath it in one move.

Use the component props before adding custom classes. Reach for `size`, `elevation`, `interactive`, and the slots' `flush` first, then use `className` only for local layout adjustments such as width, margin, or grid placement.

To remove a slot's padding, use `flush`. A plain `className="p-0"` cannot override it, because the padding is applied through a `group-data` variant: tailwind-merge does not dedupe across variants, and the variant rule sorts later in the stylesheet.

## General guidelines

### Do

- Use a card to group content and actions that belong to one subject.
- Leave resting cards at the default `elevation={1}`. Depth is how the surface hierarchy is read.
- Use `elevation={0}` for a card nested inside an already-elevated surface, such as a modal, popover, or another card.
- Use `flush` for full-bleed content such as tables and row lists, and let the rows own their padding.
- Place an `<img>` as a direct first or last child of `Card` so it bleeds to the edge and picks up the card radius.
- Use `CardAction` for actions that apply to the whole card, and `CardFooter` for actions that continue the content flow.
- Check the recipes first. `StatusCard` and `StatCard` already assemble the primitive for their cases.
- Provide the interactive semantics yourself when a card is clickable. `interactive` only styles the hover state.

### Don't

- Don't put `size` on a slot. It does nothing there.
- Don't cancel slot padding with `className="p-0"`. Use `flush`.
- Don't nest a default-elevation card inside another card. Drop the inner one to `elevation={0}`.
- Don't set `interactive` on a card that contains its own interactive elements. The hover affordance promises a click target the card does not have, and the inner controls swallow the click.
- Don't use a card title in place of a page or section heading. If the content is the page, the title belongs in the page header.
- Don't hardcode colors, radii, or shadows through `className`. If a card needs a value the tokens do not carry, stop and raise it. See the [`@cloud/ui` README](../README.md).

## Features

- #### Size

  There are three card sizes. Each one sets the radius and the slot padding together:
  - `sm` has a 12px radius and 12px slot padding. Use it for dense chrome, sidebars, and compact tiles.
  - `md` is the default. It has a 16px radius, 20px slot padding, and a denser header rhythm of 20px horizontal by 14px vertical. Use it for standard page and form content.
  - `lg` has a 20px radius and 24px slot padding. Use it for spacious, feature-level surfaces such as a dashboard panel.

  `md` is the only size whose header runs a tighter vertical rhythm than its content slot. That is a deliberate team spec, not a rounding artifact. `sm` and `lg` keep uniform padding on every slot.

  ```tsx
  <Card size="sm">
    <CardContent>Compact tile</CardContent>
  </Card>
  ```

- #### Elevation

  There are three elevation levels:
  - `0` is flat. Use it for a card sitting on an already-elevated surface, such as a modal, a popover, or another card.
  - `1` is the default resting elevation. It is a 1px hairline shadow in light mode and resolves to a 1px ring in dark mode.
  - `2` is lifted, a 4px/12px drop shadow. It is for detached, floating surfaces and is rarely correct for a card at rest.

  ```tsx
  <Card elevation={0}>
    <CardContent>Nested inside a modal</CardContent>
  </Card>
  ```

- #### Header

  `CardHeader` holds the descriptive content and the card-level actions. It carries a bottom border that separates it from the content.
  - `CardTitle` is a short noun phrase naming what the card holds. It renders a `<div>`, not a heading element.
  - `CardDescription` is one sentence of supporting context. Rendering it gives the header a second row.
  - `CardAction` is the card-level action slot. Rendering it gives the header a second column, and the action spans both rows and is centered vertically against the title and description block.

  ```tsx
  import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@cloud/ui";

  <Card>
    <CardHeader>
      <CardTitle>Password state</CardTitle>
      <CardDescription>
        Enforcement is governed by the platform-wide password policy.
      </CardDescription>
      <CardAction>
        <Button variant="secondary" size="sm" onClick={reset}>
          Reset
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>…</CardContent>
  </Card>;
  ```

- #### Flush slots - optional

  `CardHeader`, `CardContent`, and `CardFooter` accept `flush`, which drops the size-based padding for full-bleed content. Borders and layout are kept, so a flush header still has its bottom border and a flush footer is still a flex row. Rows then own their own padding.

  ```tsx
  <Card>
    <CardHeader>
      <CardTitle>Members</CardTitle>
    </CardHeader>
    <CardContent flush>
      <DataTable columns={columns} rows={rows} />
    </CardContent>
  </Card>
  ```

  Re-add padding through `className` when a flush slot still needs some, such as `<CardContent flush className="py-1">`.

- #### Media - optional

  The shell is `overflow-hidden` and rounds a direct child `<img>` that is the first or last child to match the card radius. Media goes directly under `Card`, not inside `CardContent`. Wrapping it in a slot reintroduces the padding and loses the corner rounding.

  ```tsx
  <Card>
    <Image src={cover} alt="" width={640} height={240} />
    <CardContent>Caption and body</CardContent>
  </Card>
  ```

- #### Interactive - optional

  `interactive` is presentation only. On hover it moves the border to `line-strong`, raises the shadow, and sets `cursor-pointer`. It does not add a role, a `tabIndex`, or a key handler.

  Use it only on a card that is genuinely activatable, and supply the semantics yourself. The `StatusCard` recipe does this by stretching an `<a>` over the card. See [`status-card.tsx`](../src/components/ui/recipes/status-card.tsx).

  ```tsx
  <Card interactive className="relative">
    <CardHeader>
      <CardTitle>
        <a href={`/devices/${device.id}`} className="after:absolute after:inset-0">
          {device.name}
        </a>
      </CardTitle>
    </CardHeader>
  </Card>
  ```

### States

- #### Hover

  Hover feedback exists only when `interactive` is set. A resting card does not respond to the pointer, which is what tells users it is not a click target.

- #### Selected

  `Card` has no built-in selected state. When a card acts as an option tile, carry the selection with `aria-pressed` or a nested control and pair the visual with a `Badge` or a check, not color alone.

- #### Loading

  `Card` has no loading state. Render the shell with `Skeleton` children while the data is in flight, so the surface does not shift when the content lands.

  ```tsx
  <Card>
    <CardContent>
      <Skeleton className="h-4 w-32" />
    </CardContent>
  </Card>
  ```

- #### Empty

  `Card` has no empty state. Render the empty message inside `CardContent` and keep the header so the card does not collapse.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use present-tense verbs and active voice.
- Avoid directional language. Use wording that still makes sense if the card layout reflows.
- Avoid device-specific language such as "click". Prefer "choose" or "select".

### Component-specific guidelines

#### Card title

- Use a short noun phrase naming what the card holds, such as `Password state` or `Profile`.
- Don't use end punctuation.
- Don't repeat the page title in the card title.

#### Card description

- Use one full sentence with end punctuation.
- Explain what the card is for or what governs it. Don't restate the title.
- Keep it to a single line where possible. Longer context belongs in the content.

#### Empty values

- Use a hyphen (`-`) for an empty value inside a card rather than leaving the space blank.

## Accessibility guidelines

### General accessibility guidelines

- Provide keyboard access to every action in a card, in a logical and predictable order.
- Don't rely on color alone to communicate the state of a card. Pair a status border or tint with a `Badge` or text.
- Keep the reading order of the slots aligned with the visual order.

### Component-specific guidelines

#### Headings

- `CardTitle` renders a `<div>` and carries no heading level or landmark.
- If the card is a section of the page that users should be able to navigate to, render a real heading inside `CardHeader`, such as an `<h2>` or `<h3>`, or pass your own heading element as the title's child.
- Don't skip heading levels to match the visual size of the title.

#### Interactive cards

- An `interactive` card is not keyboard reachable on its own. A bare `onClick` on the shell is a mouse-only control.
- Supply a real interactive element: a stretched link (`<a className="after:absolute after:inset-0">`) or a button. The stretched link keeps the accessible name on the link while the whole card stays clickable.
- Don't place other interactive elements inside a card that uses full-card activation. They compete with the stretched target.

#### Alternative text

- A decorative image that bleeds to the card edge still needs `alt=""`, not a missing `alt`.
- If the image carries information the card text does not repeat, describe it in `alt`.

#### Keyboard interaction

- The card shell itself is not focusable. Focus moves through the interactive elements inside it in DOM order.
- When a card is activated by a stretched link, the tab key focuses that link and the enter key follows it.
