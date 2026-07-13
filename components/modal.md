# Modal

Centered dialog with a close affordance, in four widths plus fullscreen.

`Modal` is a client component built on `@base-ui/react`'s `Dialog`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Modal` is a single, prop-driven component rather than a set of parts. Control it with `open` and `onClose` (a bare `() => void` — there is no `onOpenChange`), and pass `title`, `description`, `footer`, and body `children`. Each region is conditional: the header renders when there is a `title`, a `description`, or the close button; the body renders only when there are `children`; the footer renders only when there is a `footer`. The body scrolls, the header and footer do not. `className` lands on the dialog popup, and the props type is exported as `ModalProps`.

Choose the width with `size`: `sm` (360px), `md` (480px, default), `lg` (640px), `xl` (880px), or `fullscreen` (a 32px frame on every side). The four presets are `sm:` breakpoint caps; below that, and always, the width caps at the viewport minus a 1rem margin per side, and the height at the viewport minus 96px.

Dismissal is configurable and independent: `closeOnOverlay` (default `true`), `closeOnEscape` (default `true`), and `showCloseButton` (default `true`). For a dialog that must not be dismissed casually — a forced decision — use `AlertDialog` instead.

## General guidelines

### Do

- Use a modal for a focused task that interrupts the current flow — a form, a preview, a picker. For a confirmation, and for anything destructive, use [`AlertDialog`](alert-dialog.md): a modal can be dismissed by an outside click, which a confirmation must not be.
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

  `title` and `description` render in the header; `showCloseButton` (default `true`) adds the corner close control. To render a headerless modal you must omit `title` and `description` **and** pass `showCloseButton={false}` — the close button alone keeps the header row alive.

- #### Dismissal

  `closeOnOverlay` (default `true`), `closeOnEscape` (default `true`), and `showCloseButton` (default `true`) each gate one dismissal path and are independent of one another. `closeOnEscape={false}` is implemented by inspecting the close reason and cancelling the underlying dismissal, so it suppresses Escape only — the overlay and the close button keep working unless you turn them off too.

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
