# ObjectTile

Square identity mark for a company, app, or device model. Renders a glyph, name-derived initials, or a short code.

`ObjectTile` is a single component with no parts. It takes `icon`, `name`, or `label` for its content, `tone` for its surface, `colorSeed`, and `size`. The `ObjectTileProps` type is exported alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ObjectTile` is the identity mark for a _thing_ — a company, an application, a device model, a connector. It is always square, with a same-hue tinted fill, a soft same-hue border, and a 12px radius.

Exactly one of three props picks the content mode. They are checked in order — `icon`, then `name`, then `label` — so passing more than one is not an error and not a merge: the later ones are silently ignored.

- `icon` — a glyph node, centered as-is and sized to the tile (20px at `md`).
- `name` — a full name, reduced to two initials. `initialsFromName` takes the first letter of the first two words, splitting on whitespace and on the separators common in app names and package ids (`. + _ - /`), so `Acme Corp` becomes `AC`.
- `label` — a short code shown whole. Its font size is fluid (about 28% of the tile's width, clamped between 8px and 32px), so a multi-character code stays legible and unclipped at any size.

`tone` is `neutral` (default — the neutral avatar surface with a subtle line border) or `auto`, which hashes the seed to one of six categorical tints (`cat-1` … `cat-6`, each with its own foreground and a `cat-line` border). The hash seed defaults to `colorSeed ?? name ?? label`; pass `colorSeed` when the identity you want the color keyed on differs from the text you display — a stable id, for instance, so the tint survives a rename.

> ### `tone="auto"` is the licensed entity-identity mark, and it must be consistent across screens
>
> The categorical palette is what the system licenses for **identity** (semantic tones mean status; they are never borrowed for a category). A company / app / product / device mark is an `ObjectTile` in its `auto` tone — a recognizable colored block, not a flat neutral grey.
>
> The corollary is a continuity rule: **the same entity carries the same colored tile on its list row and on its detail header.** A tile that is colored in the list and grey on the detail page reads as two different entities. Seed both from the same stable id and the hash does the rest.
>
> A screen where every tile is neutral grey is not "clean", it is flat — there is nothing for the eye to land on. Spend the color the system already licenses.

**`ObjectTile` is not `Avatar`.** `Avatar` is a _circular profile picture_ with an image and a caller-supplied fallback, for people. `ObjectTile` is a _square surface with no image_ that renders its own content, for objects. Use the right one; they are not interchangeable.

The tile is `aria-hidden` by design. It is decorative — it mirrors text you are already rendering accessibly next to it — so it carries no accessible name of its own. Always render the real name as text beside it.

## General guidelines

### Do

- Use `ObjectTile` for objects — companies, apps, device models — and `Avatar` for people.
- Render the object's name as text next to the tile; the tile is decorative.
- Use `tone="auto"` for an entity's identity mark, and pass a stable `colorSeed` so it doesn't change when the display name does.
- Give the same entity the same tile everywhere it appears — list row and detail header alike.
- Keep `label` to a few characters; it is a code, not a name.

### Don't

- Don't use `ObjectTile` as a profile picture. Use `Avatar`.
- Don't leave an entity mark on the default `neutral` tone and then color it `auto` somewhere else. Grey here and colored there reads as two different entities.
- Don't rely on the tile alone to identify an item — it is `aria-hidden` and invisible to screen readers.
- Don't use `tone="auto"` to encode status. The tint is an identity hash, not a signal; use `Badge` with a `tone` for status.
- Don't pass `icon` and `name` together expecting both; `icon` wins and `name` is dropped.

## Features

- #### Content modes

  Pass exactly one of `icon`, `name`, or `label`.

  ```tsx
  import { ObjectTile } from "@cloud/ui";

  <ObjectTile icon={<Building2 />} />
  <ObjectTile name="Acme Corp" />      {/* → AC */}
  <ObjectTile label="POS" />
  ```

- #### Tone

  `neutral` (default) uses the neutral avatar surface. `auto` hashes the seed to one of six categorical tints, each with a matching foreground and border.

  ```tsx
  <ObjectTile name="Acme Corp" tone="auto" colorSeed={company.id} />
  ```

- #### The same tile on every screen

  Seed from the entity's id, and the list row and the detail header resolve to the same tint on their own.

  ```tsx
  {/* list row */}
  <ObjectTile name={company.name} tone="auto" colorSeed={company.id} size="sm" />

  {/* detail header — same entity, same colored mark, only bigger */}
  <ObjectTile name={company.name} tone="auto" colorSeed={company.id} size="lg" />
  ```

- #### Size

  `sm` (32px), `md` (40px, canonical), `lg` (48px). The glyph and initials scale with the tile.

  ```tsx
  <ObjectTile name="Acme Corp" size="lg" />
  ```

### States

- `ObjectTile` is a static mark. It has no interactive states. To make it clickable, wrap it — with its adjacent name — in a link or a button.

## Writing guidelines

### General writing guidelines

- Use the object's real name; don't abbreviate it yourself.

### Component-specific guidelines

- `name`: pass the full name and let the component derive the initials. Passing pre-shortened text defeats the derivation and produces inconsistent marks.
- `label`: use an established short code, in the casing the product uses.

## Accessibility guidelines

### General accessibility guidelines

- The tile is `aria-hidden` and contributes nothing to the accessible name. The adjacent text is what screen-reader users hear, so it must always be present.
- Don't rely on the categorical tint to distinguish items; the name does that.

### Component-specific guidelines

- If you find yourself wanting to give a tile an `aria-label`, that means it is carrying information on its own — which it should not. Render the name as text instead.
