# Secondary panels

Secondary panels expose features or information that support the current page but are not essential to completing its primary task.

This system currently supports one desktop secondary-panel shape: a right-side `Sheet`. It is closest in purpose to a Cloudscape drawer, but it is implemented as a dialog here: while open, it owns focus and blocks interaction with the page behind it. The local `Drawer` is a separate mobile-first draggable bottom sheet.

## Objectives

Use a secondary panel when the user needs to:

- Access a supplementary feature related to the current page, such as advanced filters or column preferences.
- Inspect optional supporting information without navigating away, such as an import summary.
- Complete one focused sub-task whose meaning depends on the parent page, such as creating a sub-resource during a parent create flow.

The page must remain the conceptual primary context. A panel may make the task faster or better informed, but the page must still make sense and remain usable without opening it.

## Choose the surface

| Need | Use | Boundary |
|---|---|---|
| Supplementary controls or information relevant to the current page. | Right-side `Sheet` | Keep one specific use case with no sub-navigation or independent URL. |
| Persistent contextual details for one or more selected resources. | Detail page | Cloudscape uses a split panel for this; this system has no sanctioned equivalent. Do not turn `Sheet` into a persistent master-detail surface. |
| Help or tutorial content. | Existing inline guidance or external documentation | This system has no dedicated help-panel pattern. Do not create another generic sheet solely to imitate that slot. |
| A compact task that must interrupt and block the page until completion or cancellation. | `Modal` | This is a primary blocking child task, not supplementary content. |
| A primary task, multi-property edit, or work needing history and recovery. | Dedicated page | The task has become a destination. |

## Sheet anatomy

#### A. Trigger

A named button or icon button on the page. Keep the trigger close to the content or control it supplements and expose the open state with `aria-expanded` when the trigger contract supports it.

#### B. Header

`SheetHeader` with a `SheetTitle`, an optional `SheetDescription`, and its built-in close affordance. The title names the feature or information, not the container: _Filters_, _Column preferences_, or _Import summary_ — never _Panel_.

#### C. Body

One continuous, vertically scrolling use case. Visual groups may improve scanning, but they must not become page sections, steps, tabs, or sub-navigation.

#### D. Footer

Use `SheetFooter` only when the panel has a commit or explicit reset. A read-only supporting panel may omit it. Advanced filters use deferred Apply and Reset; do not generalize those actions to every sheet.

#### E. Return

Closing restores focus to the trigger and returns the user to the same route, selection, filters, and page position. Guard every dismissal path when the panel contains a dirty draft.

## General guidelines

### Do

- Keep every panel relevant to the current page.
- Give each panel one specific user need.
- Use the right side for supplementary task panels.
- Keep the body scrollable between a stable header and footer when necessary.
- Consider `Modal` or a dedicated page before adding another panel.
- Use [Unsaved changes](unsaved-changes.md) when closing could discard a draft.

### Don't

- Don't use `Sheet` because a form no longer fits comfortably in `Modal`.
- Don't put a multi-property resource edit in a sheet; use [Edit resource](edit-resource.md).
- Don't use a sheet as a persistent selected-resource details panel; navigate to [Detail page](detail-page.md).
- Don't add steps, tabs, sub-navigation, or an independent URL inside a sheet.
- Don't stack sheets. Finish or close the active panel first.
- Don't require users to discover a secondary panel before they can complete the page's primary task.

## Related patterns and components

- [Advanced filtering](advanced-filtering.md) — the canonical supplementary control panel with deferred apply.
- [Create form](create-form.md) — when a sub-resource create may remain supplementary to a parent create.
- [Edit resource](edit-resource.md) — why multiple or interdependent properties use a page.
- [Detail page](detail-page.md) — the supported destination for resource details.
- [Unsaved changes](unsaved-changes.md) — guards every dirty dismissal path.
- Components: [`Sheet`](../components/sheet.md), [`AdvancedFilterSheet`](../components/advanced-filter-sheet.md), [`Modal`](../components/modal.md), [`Drawer`](../components/drawer.md).
