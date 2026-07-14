# Side navigation

The persistent navigation rail for moving between the product's primary areas.

## Key UX concepts

### Three levels, and only three

- **L1** — group heading. No icon. A broad area of the product.
- **L2** — primary navigation item. Has an icon.
- **L3** — nested child under an L2 item. No icon.

Icons are the visual anchors for scanning the rail, and they belong to exactly one level. An icon on an L1 heading or an L3 child breaks that rhythm.

### The current location is explicit

Highlight the active destination and mark it as current for assistive technology. When an L3 child is current, its L2 parent stays expanded and carries a parent-active state without competing with the child's stronger selected state.

### Expanded and collapsed modes preserve meaning

The expanded rail shows icons and labels. The collapsed rail keeps the L2 icons and exposes each label on focus and hover. L1 headings and L3 children do not become anonymous icons; use the component's collapsed navigation behaviour rather than squeezing the expanded hierarchy into the narrow rail.

### Mobile navigation is the same tree

On narrow screens, `Layout` presents the sidebar in its mobile sheet. Keep the destinations, order, labels, and current state the same across desktop and mobile. A responsive shell changes the container, not the information architecture.

### Visibility follows destination availability

Show only destinations available in the current context. Remove an empty L1 group when none of its descendants remain, and do not leave separators around an empty section. See [Permission gating](permission-gating.md).

## Building blocks

#### A. Rail

`Sidebar` from `@cloud/ui` — brand slot, sections, nav items, sub-items, and footer.

#### B. Collapse control

`SidebarTrigger` collapses and expands the desktop rail and opens the mobile navigation.

#### C. State provider

`SidebarProvider` coordinates expanded, collapsed, and mobile states for the shell.

#### D. Shell

`Layout` places the sidebar beside the page, supplies the mobile presentation, and keeps the app header aligned with the content region.

#### E. Navigation items

Typed sidebar sections and items carrying label, destination, icon at L2, optional children, and current state.

## General guidelines

### Do

- Keep the hierarchy to L1 group, L2 item, and optional L3 child.
- Put icons on L2 items only, using the shared Lucide icon set.
- Keep labels and order stable across expanded, collapsed, and mobile presentations.
- Mark the current destination and keep its parent expanded.
- Remove empty groups and separators after visibility rules are applied.
- Use `Sidebar`, `SidebarTrigger`, `SidebarProvider`, and `Layout` as one navigation system.

### Don't

- Don't add a fourth navigation level.
- Don't give L1 headings or L3 children icons.
- Don't use an icon without an accessible label in collapsed mode.
- Don't create a separate mobile menu with different destinations or ordering.
- Don't leave an empty group heading after all of its items are hidden.
- Don't rely on colour alone for the current-page state.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Keep labels stable across the sidebar, page title, and breadcrumbs.

### Component-specific guidelines

#### L1 group headings

- Use a broad noun naming the area of the product: _System_, _Identity_.

#### L2 items

- Use the plural noun for the resource the page manages: _Users_, _Roles_.
- Keep it to one or two words. The rail is narrow and truncation is worse than brevity.

#### L3 children

- Use a noun phrase that reads as part of its parent, and do not repeat the parent's word.

## Accessibility guidelines

### General accessibility guidelines

- The rail is a navigation landmark.
- Every item is reachable by keyboard in visual order, including the collapse trigger.
- The current destination is marked semantically, not merely highlighted.

### Component-specific guidelines

- In collapsed mode, every icon item retains an accessible name and exposes its label on focus as well as hover.
- The collapse trigger has an accessible label and communicates its expanded state.
- When an L3 child is active, screen readers encounter the expanded parent before the current child.
- Focus does not move simply because the rail is collapsed or expanded.

## Related patterns and components

- [Permission gating](permission-gating.md) — removing unavailable destinations and empty groups.
- [Interactive surfaces](interactive-surfaces.md) — hover, pressed, selected, and current states.
- Components: `Sidebar`, `SidebarTrigger`, `Layout`, `AppHeader`, `Breadcrumbs`.
