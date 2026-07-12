# Modal

Centered dialog with a close affordance, in four widths.

`Modal` is a client component built on `@base-ui/react`'s `Dialog`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Modal` is a single, prop-driven component rather than a set of parts. Control it with `open` and `onClose`, and pass `title`, `description`, `footer`, and body `children`. The header (title, description, and close button) renders only when there is something to show; the body scrolls; the footer sticks to the bottom.

Choose the width with `size`: `sm` (360px), `md` (480px, default), `lg` (640px), `xl` (880px), or `fullscreen` (a 32px frame on every side). On mobile the width always caps at the viewport minus a margin.

Dismissal is configurable and independent: `closeOnOverlay` (default `true`), `closeOnEscape` (default `true`), and `showCloseButton` (default `true`). For a dialog that must not be dismissed casually — a forced decision — use `AlertDialog` instead.

## General guidelines

### Do

- Use a modal for a focused task or confirmation that interrupts the current flow.
- Give it a `title`, and a `footer` with the actions.
- Pick a `size` that fits the content without becoming a page.
- Set `closeOnEscape={false}` and `closeOnOverlay={false}` for flows that must not be lost to a stray dismissal, such as a multi-step form or an in-flight submit.

### Don't

- Don't use a modal for a forced, un-dismissable choice. Use `AlertDialog`.
- Don't stack modals. Finish or close one before opening another.
- Don't put a whole page of content in a modal; use a route or a `Sheet`.
- Don't remove every dismissal affordance while leaving it a `Modal`; that is what `AlertDialog` is for.

## Features

- #### Size

  `size` is `sm` (360px), `md` (480px, default), `lg` (640px), `xl` (880px), or `fullscreen`.

  ```tsx
  import { Modal, Button } from "@cloud/ui";

  <Modal
    open={open}
    onClose={() => setOpen(false)}
    title="Rename project"
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={save}>Save</Button>
      </>
    }
  >
    <Input defaultValue={name} />
  </Modal>;
  ```

- #### Header slots

  `title` and `description` render in the header; `showCloseButton` (default `true`) adds the corner close control. Omit all three to render a headerless modal.

- #### Dismissal

  `closeOnOverlay`, `closeOnEscape`, and `showCloseButton` each gate one dismissal path and are independent of one another.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short; put detail in the description or body.

### Component-specific guidelines

- Title: name the task, such as `Rename project` or `Delete user`.
- Footer actions: use concrete verbs, and keep one primary action.
- Don't restate the title as the first line of the body.

## Accessibility guidelines

### General accessibility guidelines

- The dialog manages focus trapping and restoration through the Base UI primitive.
- Provide a `title` so the dialog has an accessible name; add a `description` when context is needed.
- Keep a visible, reachable way to dismiss unless the flow deliberately forbids it.

### Component-specific guidelines

#### Keyboard interaction

- Escape closes the modal when `closeOnEscape` is `true`.
- Focus is moved into the dialog on open and returned to the trigger on close.
- When `closeOnEscape={false}`, provide an explicit cancel action so keyboard users can still leave.
