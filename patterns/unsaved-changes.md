# Unsaved changes

Catch the user before a dirty form is thrown away. **Required on every create and edit form, in a page or an overlay — and on a page the guard is partial, so know which exits it does not cover.**

[Create form](create-form.md) | [Edit resource](edit-resource.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### One dirty flag, three jobs

The same comparison — draft against the pristine record — drives the commit button's `disabled`, the navigation guard, and the reload prompt. Compute it once, by **value equality**, and derive all three. Two flags will disagree, and the day they do, the user loses work.

Derive it from values, never from "the user has typed": a field typed and untyped is clean, and a guard that fires on a form the user has restored by hand trains them to dismiss it.

### In an overlay, every exit is catchable — so catch all three

A form in a `Modal` or `Sheet` is not navigating anywhere, so none of the holes below apply to it. Its exits are the escape button, the close affordance, and `Esc` — three, all of them yours, all of them catchable. Route every one through the same dismiss handler and have that handler consult the dirty flag. There is no excuse for a dropped draft here.

`Esc` is the one that gets forgotten, because it never appears in the JSX. A `Modal` that guards its _Cancel_ button and lets `Esc` through has a guard in name only.

### On a page the guard is partial, and pretending otherwise loses data

There is no single hook that catches every exit. What the guard actually covers:

| Exit                           | Caught by                           | Notes                                                     |
| ------------------------------ | ----------------------------------- | --------------------------------------------------------- |
| A `<Link>` click               | `onNavigate` + `e.preventDefault()` | Same-origin SPA navigation only.                          |
| A programmatic `router.push()` | **Nothing.**                        | The code doing the push must check the dirty flag itself. |
| Browser back or forward        | **Nothing.**                        | `onNavigate` does not fire for history traversal.         |
| Tab close or reload            | `beforeunload`                      | The browser writes the text; yours is ignored.            |
| Modifier-click, external link  | Not applicable                      | Opens a new tab; the form stays put and stays dirty.      |

Design around the holes rather than papering over them. The two that bite are `router.push()` — every programmatic navigation out of a dirty form is a bug waiting to be written — and the back button, which no App Router API intercepts. **Keep destructive navigation out of a form's own code**: a form that cannot push cannot lose work behind your back.

### `beforeunload` is a browser dialog, not yours

Registering `beforeunload` gets a generic, browser-authored prompt. You cannot set its text, style it, or add a third option, and browsers ignore attempts to. It is a coarse net for tab-close and reload, and it is worth having — but it is not the pattern. The pattern is the in-app dialog, and it must carry the wording that actually helps.

Register the listener **only while the form is dirty** and remove it on save or on clean. A permanently-registered `beforeunload` prompts users who have changed nothing, and it makes the whole app feel broken.

### Three outcomes, and "discard" must be the hard one

The dialog offers three things, and the default must not be the destructive one:

- **Keep editing** — the escape, and where focus lands.
- **Discard changes** — `variant="danger"`. The user is throwing away work.
- **Save and leave** — offer it only when the form is valid. A save that fails validation from inside the leave-dialog leaves the user nowhere.

Use `AlertDialog`. The user has been stopped on their way out and genuinely must pick one of the three — so the dialog offers no outside-click dismissal, which here would be a fourth, silent outcome that resolves nothing. _Keep editing_ is the way back to the form, and Escape means the same thing, so nothing is ever trapped.

### Say what is lost, not that something is lost

_You have unsaved changes_ tells the user nothing they did not know. Name the record and the stakes: _Your changes to **Regional Admin** have not been saved. Leaving now discards them._ A user who cannot remember what they changed is exactly the user who needs to be told.

## Building blocks

#### A. Dirty flag

A value comparison of the draft against the pristine record. Reset it from the **save response**, not from the submitted draft.

#### B. Link guard

`onNavigate={(e) => { if (dirty) { e.preventDefault(); openLeaveDialog(href); } }}` on the `Link`s that leave the form — the reduced header's back button, the sidebar, the breadcrumb.

#### C. Unload guard

A `beforeunload` listener, registered while `dirty` and removed when clean.

#### D. Leave dialog

`AlertDialog` with a `danger` _Discard changes_, an `AlertDialogCancel` carrying _Keep editing_, and — when the form is valid — a _Save and leave_. _Save and leave_ awaits the server, so it is a plain `Button` with `loading`, not an `AlertDialogAction`; see [AlertDialog → Async confirm](../components/alert-dialog.md).

#### E. The pending destination

The href the user tried to reach, held while the dialog is open, and navigated to once they discard or save.

## General guidelines

### Do

- Compute one dirty flag by value comparison, and drive the commit, the guard, and the unload prompt from it.
- Reset the flag from the save response, so a successful save leaves the form clean.
- Register `beforeunload` only while dirty, and remove it on clean.
- Name the record and the stakes in the dialog.
- Make _Discard changes_ the `danger` button, and _Keep editing_ the escape.
- Hold the pending destination so discarding actually completes the navigation the user asked for.
- Check the dirty flag before any programmatic `router.push()` out of the form. Nothing else will.

### Don't

- Don't rely on `onNavigate` for the back button or for `router.push()`. It catches neither.
- Don't try to customise the `beforeunload` text. The browser will ignore you.
- Don't leave `beforeunload` registered on a clean form.
- Don't derive dirty from "has been touched". Typed-and-untyped is clean.
- Don't offer _Save and leave_ on an invalid form.
- Don't make _Discard_ the default or the focused button.
- Don't fire the guard on the form's own submit — the commit is not an exit.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Dialog title

- Name the situation, not the question: _Unsaved changes_. Not _Are you sure?_.

#### Dialog body

- Name the record in bold and state the loss: _Your changes to **Regional Admin** have not been saved. Leaving now discards them._

#### Buttons

- The destructive option names the loss: _Discard changes_. Never _Leave_, never _Yes_.
- The escape is _Keep editing_ — it says what happens, where _Cancel_ would be ambiguous against the form's own Cancel.
- The third option is _Save and leave_.

## Accessibility guidelines

### General accessibility guidelines

- Never remove the focus ring.
- Colour is never the only signal — _Discard changes_ says it in words.

### Component-specific guidelines

- Focus lands on _Keep editing_ when the dialog opens, never on _Discard changes_. A stray Enter must not destroy work.
- On _Keep editing_, focus returns to the form — to the control the user was last in, not to the top of the page.
- The dialog is labelled by its title and described by its body, so a screen reader announces both the situation and the record on open.

## Related patterns and components

- [Edit resource](edit-resource.md) — where the dirty flag is defined, and the commit it gates.
- [Create form](create-form.md) — the other page that needs this guard.
- [Delete patterns](delete-patterns.md) — the other place `AlertDialog` carries a `danger` verb.
- Components: [`AlertDialog`](../components/alert-dialog.md), `Button`.
