# ActionFooter

Full-bleed action band pinned to the bottom of the page — the commit cluster.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/action-footer.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/index.ts)

`ActionFooter` takes `children` and renders them as a right-aligned cluster. Import it, and the `ActionFooterProps` type, from `@cloud/ui`.

## Development guidelines

`ActionFooter` is the bottom counterpart to the sticky header bands. It carries a right-aligned commit cluster: a ghost Cancel or Back to the left of one primary action.

**Placement matters.** It must be a **sibling of `PageBody`** — a direct child of `Layout`'s `<main>` scroll root, _after_ `PageBody`, never nested inside its gutters. The layout keys off the footer's `data-action-footer` attribute and turns `<main>` into a flex column only when a footer is present. That is what makes both halves of its behaviour work: `mt-auto` pins the band to the bottom of the viewport on a short page, while `sticky bottom-0` keeps it in view as a long page scrolls beneath it. Nest it inside `PageBody` and you get neither. Pages without a footer are untouched.

**Inside a modal there is no `ActionFooter`** — a dialog uses `Modal`'s own footer.

## General guidelines

### Do

- Put it directly in the scroll root, after `PageBody`.
- Keep it to one primary action, with subordinate ghost controls to its left.
- Use it for the page-level commit on a form — Save, Submit, Continue.

### Don't

- Don't nest it inside `PageBody`; the pinning and the sticky behaviour both depend on it being a sibling.
- Don't use it in a modal. Use the `Modal` footer.
- Don't put more than one primary button in it; if everything is primary, nothing is.

## Features

- #### Commit cluster

  ```tsx
  import { PageHeader, PageBody, ActionFooter, Button } from "@cloud/ui";

  <>
    <PageHeader title={t("merchants.create")} />
    <PageBody>{form}</PageBody>
    <ActionFooter>
      <Button variant="ghost" onClick={cancel}>
        {t("common.cancel")}
      </Button>
      <Button type="submit" form="merchant-form">
        {t("common.submit")}
      </Button>
    </ActionFooter>
  </>;
  ```

### States

- **Short page** — `mt-auto` pins the band to the bottom of the viewport.
- **Long page** — `sticky bottom-0` keeps it in view while the content scrolls beneath it.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Primary label: name the commit — `Save changes`, `Create merchant`, `Continue`. Not `OK`.
- Subordinate label: `Cancel` or `Back`, whichever it actually does.

## Accessibility guidelines

### General accessibility guidelines

- The footer is a real `<footer>` element containing real buttons, in the reading order after the content.
- Because the band is sticky, keep it to one row — a tall footer eats the viewport and can hide the field a keyboard user just focused.
- The primary action must be reachable by Tab without scrolling to the end of a long form; the sticky band is what guarantees that, which is why the placement rule matters.

### Component-specific guidelines

- A disabled submit button with no explanation is a dead end. If the form isn't valid, say what's missing — in a `FieldError` on the offending field, not by silently graying the button.
