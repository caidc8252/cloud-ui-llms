# AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance and cannot be dismissed by clicking outside, so the user has to choose an action.

`AlertDialog` is a client component built on `@base-ui/react`'s `AlertDialog`. It is a set of composable parts — `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`, plus `AlertDialogPortal` and `AlertDialogOverlay`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`AlertDialog` is a forced decision. It shares `Modal`'s surface (`rounded-xl`, subtle border, popover fill, elevation 4, capped at 440px) but has no corner close button and ignores clicks on the overlay — the intended exit is `AlertDialogAction` or `AlertDialogCancel`. Escape still closes it, because the Base UI primitive keeps the keyboard escape hatch that assistive-technology users rely on; treat Escape as equivalent to cancel and never leave the app in a half-committed state when it fires. Reserve the component for consequential or destructive confirmations.

`AlertDialogAction` closes the dialog and runs its `onClick`. It defaults to `variant="primary"` and accepts any `Button` variant — pass `variant="danger"` for a destructive confirm. `AlertDialogCancel` closes without acting and is always secondary styling; it takes no `variant`.

Both action buttons close on click. For an async confirmation that needs a loading state, control `open` yourself and render a plain `Button` in the footer instead of `AlertDialogAction`, so the dialog stays open until the work resolves.

**Controlled or uncontrolled.** Left alone, the dialog is uncontrolled: `AlertDialogTrigger` opens it and the two footer buttons close it. The root also takes the Base UI open props — `open`, `defaultOpen`, and `onOpenChange` — for when something other than a trigger decides its fate: an async confirm, a dialog opened from a table row's menu, or a delete the user must unlock first. Drive it with `open` + `onOpenChange` and you can drop `AlertDialogTrigger` entirely. `onOpenChange` is called as `(open, eventDetails)` — the second argument says what caused the change and can be ignored, and a plain `setOpen` reference is a fine handler. There is **no `modal` prop and no way to re-enable pointer dismissal**; an alert dialog is always modal, and Escape remains the one keyboard exit.

**`AlertDialogAction` and `AlertDialogCancel` both take `disabled`.** They render a native `<button>`, so `disabled` reaches the DOM: the click never fires, the dialog does not close, and the button picks up the recipe's disabled styling. That is the mechanism behind a type-to-confirm delete — keep the action `disabled` until the typed text matches the record's name, and the user cannot commit. See [Delete with additional confirmation](../patterns/delete-with-additional-confirmation.md).

## General guidelines

### Do

- Use an alert dialog to confirm a consequential or irreversible action, such as deleting a resource.
- State the consequence in the description.
- Use `variant="danger"` on `AlertDialogAction` for destructive confirms.
- Label the action with the concrete verb, and keep `AlertDialogCancel` as the safe way out.
- Treat an Escape press as a cancel: the primitive closes on Escape, so nothing may commit on close.
- Drive `open` + `onOpenChange` from the root when a trigger is not what opens the dialog, and reset any gate state when it closes.
- Gate a far-reaching confirm with `disabled` on `AlertDialogAction`, rather than a hand-rolled button.

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

- #### Controlled open

  Pass `open` and `onOpenChange` on the root to drive the dialog yourself — from a row's menu item, or so you can keep it open while an async confirm resolves. With `open` in your hands, `AlertDialogTrigger` is unnecessary.

  ```tsx
  const [open, setOpen] = useState(false);

  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {model.name}</AlertDialogTitle>
        <AlertDialogDescription>
          Every firmware version under this model is deleted with it.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="danger" onClick={() => remove(model.id)}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  ```

- #### Gated confirm — type the name to unlock

  `AlertDialogAction` accepts `disabled`, and it lands on the real `<button>`: while it is set, the click does not fire and the dialog does not close. Combine it with controlled `open` for a delete that reaches past the record.

  ```tsx
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const confirmed = typed === model.code;

  <AlertDialog
    open={open}
    onOpenChange={(next) => {
      setOpen(next);
      if (!next) setTyped(""); // Escape counts as cancel — clear the gate
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {model.name}</AlertDialogTitle>
        <AlertDialogDescription>
          This deletes 11 firmware versions and revokes them from every deployed company.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Field label={`Type ${model.code} to confirm`}>
        <Input value={typed} onChange={(e) => setTyped(e.target.value)} />
      </Field>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="danger" disabled={!confirmed} onClick={() => remove(model.id)}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  ```

- #### Async confirm — the dialog must outlive the click

  `AlertDialogAction` closes on click, so it cannot hold a dialog open while a request is in flight. Any confirm that awaits the server drops it for a plain `Button` and drives `open` by hand. Three things fall out of that, and all three are the point: the confirm carries `loading` (which spins **and** disables it, so a double-click cannot delete twice), the dialog closes **only on success** (a failure leaves it open with the error in view, instead of dumping the user back to a list that still shows the record), and `onOpenChange` ignores the close request while the request is in flight — otherwise Escape yanks the dialog out from under a delete that is already on the wire.

  ```tsx
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setDeleting(true);
    const result = await deleteRole(role.id);
    setDeleting(false);
    if (result.ok) {
      setOpen(false); // close on success only
      toast.success("Role deleted");
    } else {
      setError(result.message); // failure keeps the dialog open
    }
  }

  <AlertDialog
    open={open}
    onOpenChange={(next) => {
      if (!deleting) setOpen(next); // Escape is inert while the delete is on the wire
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete role</AlertDialogTitle>
        <AlertDialogDescription>
          Delete <strong>{role.name}</strong>? The role is not assigned to anyone, so no
          permissions change.
        </AlertDialogDescription>
      </AlertDialogHeader>
      {error && <Alert variant="danger">{error}</Alert>}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
        <Button variant="danger" loading={deleting} onClick={confirm}>
          Delete role
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  ```

- #### Action and cancel

  `AlertDialogAction` is the confirm (primary by default, or `variant="danger"`); `AlertDialogCancel` is the safe dismissal (secondary, and it takes no `variant`). Both are Base UI `Close` parts styled with the button recipe, so both close the dialog on click, and both accept the usual button `className`, `disabled`, and children. Neither takes `size`, `loading`, or the `Button` icon slots: they render at the default `md` control height. When you need a spinner, control `open` and put a plain `Button` in the footer.

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
