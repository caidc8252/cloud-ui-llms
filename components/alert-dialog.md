# AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance, so the user must choose an action.

`AlertDialog` is a client component built on `@base-ui/react`'s `AlertDialog`. It is a set of composable parts — `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`, plus `AlertDialogPortal` and `AlertDialogOverlay`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`AlertDialog` is a forced decision. It shares `Modal`'s surface but cannot be dismissed by clicking the overlay or pressing Escape and has no corner close button — the user must pick `AlertDialogAction` or `AlertDialogCancel`. Reserve it for consequential or destructive confirmations.

`AlertDialogAction` closes the dialog and runs its `onClick`; it defaults to the primary button styling, and takes `variant="danger"` for a destructive confirm. `AlertDialogCancel` closes without acting, in secondary styling.

Both action buttons close on click. For an async confirmation that needs a loading state, control `open` yourself and render a plain `Button` in the footer instead of `AlertDialogAction`, so the dialog stays open until the work resolves.

## General guidelines

### Do

- Use an alert dialog to confirm a consequential or irreversible action, such as deleting a resource.
- State the consequence in the description.
- Use `variant="danger"` on `AlertDialogAction` for destructive confirms.
- Label the action with the concrete verb, and keep `AlertDialogCancel` as the safe way out.

### Don't

- Don't use it for routine dialogs that can be dismissed. Use `Modal`.
- Don't rely on the built-in `AlertDialogAction` when the confirm is async and needs a spinner; control `open` and use a plain `Button`.
- Don't use a vague `Yes`/`No`; name the action.

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

  `AlertDialogAction` is the confirm (primary by default, or `variant="danger"`); `AlertDialogCancel` is the safe dismissal (secondary). Both close the dialog on click.

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
- Because there is no casual dismissal, always render a clear `AlertDialogCancel`.
- Don't rely on color alone for a destructive action; the label text carries the meaning.

### Component-specific guidelines

#### Keyboard interaction

- Focus moves into the dialog on open; tab cycles between the cancel and action buttons.
- Escape does not dismiss an alert dialog by design, so the cancel button is the keyboard exit.
