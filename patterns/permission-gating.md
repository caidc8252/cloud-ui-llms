# Permission gating

Showing a user only what they can act on, while the server independently enforces that they may. The client hides; the server decides. These are not the same job and they are never done by the same code.

Binding rules (app repo: `.claude/team-rule/coding-rules/auth_auth-guards.md`)

## Key UX concepts

### The client gate is UX, not security

`useCan` and `<Can>` exist to hide a button the user cannot use, so they are not invited to fail. They are **not a security boundary**. A hidden button is one `curl` away from being pressed anyway. Every gated operation is independently guarded on the server, and the client gate can be deleted without changing what a user is able to do.

This has a practical consequence for how you build: wire the server guard and the route first, then add the button visibility last. A page whose buttons are hidden but whose endpoint is open is not "mostly done" — it is unguarded.

### Three tiers, pick exactly one

Every entry point — route handler, page, layout — picks one:

- **Public** — no session. `getSession()` returns `null` when unauthenticated; branch on it, never assume.
- **Authenticated** — login required, no specific code. `requireSession()` redirects rather than returning `null`.
- **Authorized** — a specific `PermissionCode` is required. Pages use `requirePermissions(check)`, which redirects to `/403`. Route handlers use `assertPermissions(check)`, which throws `AuthzError`.

The split matters: a page **redirects** so the user lands somewhere sensible, and a route handler **throws** so the client sees a 403 it can handle.

### Type the codes, or the gate silently never fires

This is the single most common way to get this wrong. Import the client helpers from the app's typed re-export (`@/lib/permissions`), which pins the generic to the app's generated `PermissionCode`. Importing `useCan` / `<Can>` straight from `@cloud/permissions/client` gets you a bare `string` parameter — a typo in a permission code then compiles cleanly and evaluates to `false` forever, so the button is simply always hidden and no one notices until a user asks where it went.

On the server, the same rule: `check` codes are `PermissionCode`, never raw strings.

### The UI code and the server code must be the same code

Before wiring `<Can>` around a button, read the endpoint the button calls and use the code it actually asserts. A button gated on a code the endpoint doesn't check is a button that disappears for people who are allowed to press it — or worse, appears for people who aren't and then fails at the server.

### Effective permissions are computed, not assigned

Guards read `session.permissions`, a snapshot computed when the user picks a company. The model is a scope intersected with roles:

- The party's **contracts** unlock a scope of codes. This is the outer gate, and it applies to everyone.
- An **ADMIN** user gets the whole scope — assigned roles are bypassed, but the contract gate still holds.
- A **NORMAL** user gets their role codes intersected with the scope.

So "give them the role" does not necessarily grant the code: if the party's contracts don't unlock it, no role can.

## Building blocks

#### A. Page guard

`requirePermissions({ all: [...] })` at the top of the RSC page component, before any data read. It returns the `ActiveSession`, which is where `currentPartyId` comes from.

#### B. Route guard

`assertPermissions(check)` at the top of the route handler, before parsing or writing.

#### C. Client display gate

`<Can all={[...]}>` or `useCan(check)` from the app's typed `@/lib/permissions`, wrapping a button, a menu item, or a whole block.

#### D. The codes

`PermissionCode` literals generated from the module manifests. Codes are add-only; a removed or renamed code is marked `@deprecated`, not deleted.

#### E. The 403 surface

The page guard's redirect target. A user who reaches a page they may not see lands somewhere that explains it, rather than on an empty page.

## General guidelines

### Do

- Guard the server first, and add the client gate last.
- Import the client helpers from the app's typed re-export so the codes are checked at compile time.
- Read the endpoint's `assertPermissions` call before choosing the code for the button's `<Can>`.
- Put the guard next to the data — at the page entry or in the route handler.
- Use `PermissionCode` literals everywhere, never a string built at runtime.

### Don't

- Don't treat a hidden button as protection.
- Don't let a `layout` guard be the only protection for a child page or its data access.
- Don't `getSession()` and then perform a sensitive operation. If it needs a permission, it needs `assertPermissions`.
- Don't import `useCan` / `<Can>` directly from `@cloud/permissions/client` in this app — the generic degrades to `string`.
- Don't invent a permission code in the UI. If the code you want doesn't exist, it doesn't exist on the server either.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Hidden versus disabled

- Hide an action the user can never perform in this context. Disable an action they could perform once some condition changes, and say what the condition is.
- A permission the user does not have is a _hide_, not a _disable_. Disabling it advertises a capability they cannot obtain and invites a support ticket.

#### 403 copy

- Say what is missing and who can grant it. _You don't have access to this page. Ask an administrator for the Roles permission._ beats _Forbidden_.

## Accessibility guidelines

### General accessibility guidelines

- A hidden action is hidden for everyone, including assistive technology — that is the point. Don't `aria-hidden` a visible button as a substitute for gating it.
- When gating removes an action from a toolbar, don't leave an empty slot behind that a keyboard user tabs into.

### Component-specific guidelines

- If a gate empties a whole block, remove the block's heading too, or a screen-reader user navigates to a heading with nothing under it.

## Related patterns and components

- [Side navigation](side-navigation.md) — the menu is a projection of the same effective permissions.
- [Errors and validation](errors-and-validation.md) — what the client does with the 401 and 403 the server throws.
- [Action weight](action-weight.md) — choose the button's weight first, then decide whether it is shown at all.
