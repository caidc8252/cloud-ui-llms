# Permission gating

How the interface presents actions and content that are not available to every user.

## Key UX concepts

### Hide unavailable capabilities; disable unmet conditions

Hide an action when the user cannot perform it in the current access context. Disable an action when it could become available after a visible condition changes, and explain that condition.

- **Hidden:** the user does not have access to _Delete role_ in this context.
- **Disabled:** _Delete role_ becomes available after the role has no assigned users.

Disabling an inaccessible action advertises a capability the user cannot unlock from this screen. Hiding an action that is temporarily unavailable makes the interface look incomplete. Choose from the user's ability to change the condition.

### Remove the whole empty branch

When gating removes the only action in a menu, remove the menu trigger. When it removes an entire card or section, remove the heading and container too. Empty chrome leaves keyboard stops and headings that lead nowhere.

### Navigation follows the same visible capability set

Do not show a navigation item that leads only to an access-denied page. If a user opens a restricted destination from a saved link or stale history entry, show a dedicated access-denied surface rather than an empty page.

### Preserve layout without preserving ghosts

Permission-aware variants should not leave unexplained gaps where controls used to be. Toolbars reflow, action groups close up, and cards expand into the available space. Do not render invisible placeholders merely to keep the privileged layout's geometry.

### Access-denied is not empty

An empty state says the user can see a collection and it contains no matching records. An access-denied state says the content is unavailable to this user. These states require different copy and different actions.

## Building blocks

#### A. Display gate

A conditional wrapper around a button, menu item, navigation item, or content block.

#### B. Disabled action

A `Button` with `disabled` plus nearby text or another keyboard-readable explanation of the condition that must change.

#### C. Access-denied surface

A page or panel that explains that access is unavailable and offers a safe destination, such as returning to the previous page or going to the collection root.

#### D. Permission-aware action group

A toolbar, menu, or header action array built only from actions available in the current context, with no empty separators or orphaned group labels.

## General guidelines

### Do

- Hide actions the user cannot perform in this context.
- Disable actions whose visible prerequisites are not yet met, and explain why.
- Remove empty containers, headings, separators, and menu triggers after gating.
- Reflow action groups when an item is absent.
- Use a dedicated access-denied surface for restricted content.
- Keep the visible navigation and visible page actions consistent.

### Don't

- Don't show an inaccessible action merely to advertise it.
- Don't disable an inaccessible action without a condition the user can satisfy.
- Don't leave a blank card or heading when all of its content is gated.
- Don't leave empty separators in a menu or toolbar.
- Don't present access denied as an empty collection or a generic error.
- Don't hide a temporarily unavailable action when an explanation would help the user proceed.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Describe the capability in product language, not in internal role or policy syntax.

### Component-specific guidelines

#### Disabled reasons

- Name the condition that must change: _Remove assigned users before deleting this role._
- Keep the explanation beside the action or in a focusable, keyboard-readable hint. Do not rely on hover alone.

#### Access-denied copy

- Say what is unavailable and give a useful next step. _You don't have access to Roles. Return to Users or contact an administrator._ beats _Forbidden_.
- Do not expose internal permission identifiers.

## Accessibility guidelines

### General accessibility guidelines

- A hidden action is absent for everyone, including assistive technology.
- Every visible disabled state has a reason available without pointer hover.
- Removing an action must not leave an empty keyboard stop.

### Component-specific guidelines

- If a gate empties a whole block, remove the block's heading so screen-reader navigation does not lead to empty content.
- When a focused action disappears after context changes, move focus to the nearest stable control.
- An access-denied page has a descriptive heading and a focusable way to leave it.

## Related patterns and components

- [Side navigation](side-navigation.md) — keeping navigation aligned with available destinations.
- [Errors and validation](errors-and-validation.md) — choosing a dedicated unavailable surface rather than a transient error.
- [Action weight](action-weight.md) — choose the action's weight before deciding whether it is shown.
- Components: `Button`, `Alert`, `Sidebar`, `DropdownMenu`, `PageHeader`, `PageHeaderBand`.
