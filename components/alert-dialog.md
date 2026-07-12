# AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance and cannot be dismissed by clicking outside, so the user has to choose an action.

`AlertDialog` is a client component built on `@base-ui/react`'s `AlertDialog`. It is a set of composable parts — `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`, plus `AlertDialogPortal` and `AlertDialogOverlay`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`AlertDialog` is a forced decision. It shares `Modal`'s surface (`rounded-xl`, subtle border, popover fill, elevation 4, capped at 440px) but has no corner close button and ignores clicks on the overlay — the intended exit is `AlertDialogAction` or `AlertDialogCancel`. Escape still closes it, because the Base UI primitive keeps the keyboard escape hatch that assistive-technology users rely on; treat Escape as equivalent to cancel and never leave the app in a half-committed state when it fires. Reserve the component for consequential or destructive confirmations.

`AlertDialogAction` closes the dialog and runs its `onClick`. It defaults to `variant="primary"` and accepts any `Button` variant — pass `variant="danger"` for a destructive confirm. `AlertDialogCancel` closes without acting and is always secondary styling; it takes no `variant`.

Both action buttons close on click. For an async confirmation that needs a loading state, control `open` yourself and render a plain `Button` in the footer instead of `AlertDialogAction`, so the dialog stays open until the work resolves.

## General guidelines

### Do

- Use an alert dialog to confirm a consequential or irreversible action, such as deleting a resource.
- State the consequence in the description.
- Use `variant="danger"` on `AlertDialogAction` for destructive confirms.
- Label the action with the concrete verb, and keep `AlertDialogCancel` as the safe way out.
- Treat an Escape press as a cancel: the primitive closes on Escape, so nothing may commit on close.

### Don't

- Don't use it for routine dialogs that can be dismissed. Use `Modal`.
- Don't rely on the built-in `AlertDialogAction` when the confirm is async and needs a spinner; control `open` and use a plain `Button`.
- Don't use a vague `Yes`/`No`; name the action.
- Don't tell users an alert dialog is inescapable. Outside clicks are ignored, but Escape closes it.

## Features

- #### Structure

  ```tsx
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
  } from "@cloud/ui";

  <AlertDialog>
    <AlertDialogTrigger render={<Button variant="danger">Delete</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete role</AlertDialogTitle>
        <AlertDialogDescription>
          This removes the role from every member. It cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="danger" onClick={remove}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  ```

- #### Action and cancel

  `AlertDialogAction` is the confirm (primary by default, or `variant="danger"`); `AlertDialogCancel` is the safe dismissal (secondary). Both are Base UI `Close` parts styled with the button recipe, so both close the dialog on click, and both accept the usual button `className` and children. Neither takes `size`: they render at the default `md` control height.

- #### Dismissal

  Pointer dismissal is off — clicking the overlay does nothing, and there is no corner close button. Escape closes the dialog through the Base UI primitive, exactly as if the user had chosen cancel.

- #### Portal and overlay

  `AlertDialogContent` already renders its own `AlertDialogPortal` and `AlertDialogOverlay`. Compose the content directly inside `AlertDialog`; only reach for the exported `AlertDialogPortal` and `AlertDialogOverlay` if you are building a bespoke surface instead of using `AlertDialogContent`.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short and state the consequence in the description.

### Component-specific guidelines

- Title: name the decision, such as `Delete role`.
- Description: state what happens and whether it is reversible.
- Action label: use the concrete verb (`Delete`, `Reboot`), not `Yes`.

## Accessibility guidelines

### General accessibility guidelines

- The dialog traps and restores focus through the Base UI primitive and has an accessible name from `AlertDialogTitle`.
- Because there is no casual pointer dismissal, always render a clear `AlertDialogCancel`.
- Don't rely on color alone for a destructive action; the label text carries the meaning.

### Component-specific guidelines

#### Keyboard interaction

- Focus moves into the dialog on open; tab cycles between the cancel and action buttons.
- Escape closes the dialog. Base UI keeps that escape hatch, so treat it as a cancel — never as a confirm — and make sure your `onOpenChange` handling agrees.
