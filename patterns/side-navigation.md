# Side navigation

The left menu. It is not written by hand anywhere — it is **projected** from what the current session is actually allowed to see, out of declarations each module makes about itself.

[Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md) | [CoC declaration](../../../../.claude/team-rule/coding-rules/coc_coc-declaration.md)

## Key UX concepts

### The menu is a projection, not a list

There is no file holding "the menu". A module declares itself in its `manifest.ts` — a `menuCode`, a `parentMenuCode`, an `icon`, an `order`, an entry URL, and its permission codes. The session's effective permissions (roles intersected with the party's contract scope — see [Permission gating](permission-gating.md)) are then projected against those declarations to produce the tree this user gets.

Two users in the same company can therefore see different menus, and the same user can see a different menu after switching company. That is the design, not a bug to normalize away.

### Adding a page means editing a manifest, not a menu

To make a page appear, declare it in the module's `manifest.ts` and run `pnpm gen:coc`. The generated files under `manifest/_generated/` are never edited by hand — they are outputs, and hand-editing them is a rule violation that the gate catches. The directory nodes (the L1 groups) live in `manifest/catalog/menu-tree.ts`.

### Three levels, and only three

- **L1** — group heading. No icon. A section of the product.
- **L2** — the menu item. **Has an icon.** This is what a module's manifest declares.
- **L3** — a nested child under an L2. No icon.

Icons are the visual anchor for scanning the rail, and they belong to exactly one level. An icon on an L1 heading or an L3 child breaks the scan.

### Every L2 icon must have a case

A module's `manifest.ts` declares `icon: "users"` as a **string**. That string has to have a matching `case` in `getMenuIcon`. If it doesn't, it falls through to the `LayoutDashboard` default — which renders, looks plausible, and is wrong. Nothing fails; the module just quietly gets the generic icon.

So adding a module is two edits, not one: the manifest's `icon`, and the corresponding case in `menu-icon.tsx`. Icons come from `lucide-react`.

### Permission codes are add-only

A code that has shipped is never renamed or deleted — it is marked `@deprecated`. A renamed code silently revokes access for everyone whose role still refers to the old name.

## Building blocks

#### A. Module declaration

`modules/<cat>/<mod>/manifest.ts` — `menuCode`, `parentMenuCode`, `icon`, `order`, `entry.url`, and the module's 4-segment permission codes, each bound to a menu with `belongToMenuCode`.

#### B. Directory nodes

`manifest/catalog/menu-tree.ts` — the L1 groups that L2 items hang from.

#### C. Generated projection input

`manifest/_generated/*` — produced by `pnpm gen:coc`. Never hand-edited.

#### D. Icon map

`app/(dashboard)/_components/menu-icon.tsx` — `getMenuIcon` maps the manifest's icon string to a `lucide-react` component. Every declared icon needs a case here.

#### E. The rail

`Sidebar` from `@cloud/ui` — brand slot, sections, nav items, sub-items, footer. `SidebarTrigger` collapses and expands it; `SidebarProvider` and the `SIDEBAR_COOKIE` persist that state.

#### F. The shell

`app/(dashboard)/layout.tsx` — where the projected tree is handed to `Sidebar`.

## General guidelines

### Do

- Declare the menu in the module's `manifest.ts`, and re-run `pnpm gen:coc` after changing it.
- Add a `case` to `getMenuIcon` for every new icon string you declare.
- Keep the icon on L2 only.
- Use `order` to place an item, rather than relying on file or declaration order.
- Bind every permission code to the menu it belongs to with `belongToMenuCode`, so the projection can decide whether the menu is reachable.
- Mark a retired code `@deprecated` and leave it in place.

### Don't

- Don't hand-write a menu array anywhere.
- Don't edit anything under `manifest/_generated/`. It is regenerated, and the gate blocks it.
- Don't rename or delete a shipped permission code.
- Don't let a new icon fall through to the `LayoutDashboard` default — it will look intentional.
- Don't give a `commons` module a menu. Commons is a leaf layer: no menu of its own, no contract gate, and it never calls back into a business module.
- Don't assume the menu is the same for two users, or for the same user in two companies.

## Writing guidelines

### General writing guidelines

- Use sentence case. Menu labels come from the i18n catalog, never hardcoded strings.

### Component-specific guidelines

#### L1 group headings

- Use a broad noun naming the area of the product: _System_, _Identity_.

#### L2 items

- Use the plural noun for the resource the page manages: _Users_, _Roles_.
- Keep it to one or two words. The rail is narrow and truncation is worse than brevity.

#### L3 children

- Use a noun phrase that reads as a part of its parent, and don't repeat the parent's word.

## Accessibility guidelines

### General accessibility guidelines

- The rail is a navigation landmark, and the current page is marked as current — not merely highlighted.
- Every item is reachable by keyboard in visual order, including the collapse trigger.

### Component-specific guidelines

- When the rail collapses to icons, each item still needs an accessible name. An icon with no label is not a menu item to a screen reader.
- The collapse trigger needs an `aria-label` and an expanded state.
- Don't rely on the icon alone to distinguish two items — if two modules share an icon, the labels must carry the distinction, which is another reason a fall-through to the default icon is harmful.

## Related patterns and components

- [Permission gating](permission-gating.md) — the effective-permission model that the menu is projected from.
- Components: `Sidebar`, `SidebarTrigger`, `Layout`, `AppHeader`, `Breadcrumbs`.
