# Empty

Empty-state placeholder with a dashed border. Use it inside tables, lists, and panels when there is no data.

`Empty` is a plain `<div>` — it carries no `"use client"`, so it renders in a server component. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Empty` is the "no data" placeholder: a centered, dashed-border panel with an optional icon chip, a required `title`, an optional `description`, and an optional `action`. Render it where the data would be — inside a table body, a list, or a card — not as a whole-page replacement.

Use the component props before adding custom classes. Provide `title`, and add `icon`, `description`, and `action` as the case needs.

Distinguish an empty state from an error. Use `Empty` when there is legitimately nothing to show; use an error treatment when a request failed.

## General guidelines

### Do

- Use `Empty` when a collection is legitimately empty, such as no results, no members yet, or a cleared filter.
- Give a short `title` that names what is missing.
- Add an `action` that helps the user move forward, such as `Create the first role` or `Clear filters`.
- Use `icon` to reinforce the context with a small glyph.

### Don't

- Don't use `Empty` for a failed request. Show an error state with a retry instead.
- Don't write a long paragraph in `description`; keep it to a sentence.
- Don't omit `title`; it is required.

## Features

- #### Content slots
  - `title` (required, `string`) — the short headline naming what is empty.
  - `description` (optional, `string`) — one sentence of supporting context.
  - `icon` (optional, `ReactNode`) — a small glyph shown in a rounded 36px chip above the title.
  - `action` (optional, `ReactNode`) — a call-to-action element rendered below the description.

  `title` and `description` are plain strings, not nodes: they render as text and cannot carry markup. Everything else on the props is native `<div>` surface, so `className`, `id`, and data attributes pass through to the panel.

  ```tsx
  import { Empty, Button } from "@cloud/ui";
  import { Inbox } from "lucide-react";

  <Empty
    icon={<Inbox className="size-5" />}
    title="No invitations"
    description="Invite a teammate to get started."
    action={
      <Button size="sm" onClick={invite}>
        Invite teammate
      </Button>
    }
  />;
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short and the description to one sentence.
- Avoid device-specific language such as "click".

### Component-specific guidelines

- Title: name the missing thing, such as `No results` or `No devices yet`.
- Description: explain why it is empty or what to do next, without repeating the title.
- Action label: start with a verb, such as `Create role` or `Clear filters`.

## Accessibility guidelines

### General accessibility guidelines

- The `title` and `description` are plain text and are read in order; keep them meaningful without the icon.
- The `icon` is decorative; do not put essential meaning only in it.
- Ensure the `action` is a real, keyboard-reachable control.

### Component-specific guidelines

- When `Empty` replaces the rows of a table or list, place it where the content was so its position in the reading order matches the region it describes.
