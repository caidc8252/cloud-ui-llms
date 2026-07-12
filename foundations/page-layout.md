# Page layout

`@cloud/ui` composes application pages from the [Layout source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/layout.tsx), [page header sources](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/page-header.tsx), [PageHeaderBand source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/page-header-band.tsx), [PageBody source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/page-body.tsx), and [ActionFooter source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/action-footer.tsx). The maintained examples and the portal [UI and page rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md) are the canonical page recipes.

## Overview

Use `Layout` for the application shell and let page primitives establish page-level structure. Resource lists and single-step create or edit pages use `PageHeader`; detail pages and documented wizard flows use `PageHeaderBand`. Dashboard and settings content uses `ContentHeader` inside `PageBody`. Choose a single-step form unless staged dependencies or review make a wizard necessary.

## Reference

| Page type                  | Header                                                                                          | Body or structure                                                                                                                               | Maintained example                                                                                                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource list              | `PageHeader` with the page title and primary create action.                                     | `PageBody` containing the shared list family: condition band, results `Card`, summary, `Table`, and `RichPagination`.                           | [List page](../examples/list-page.tsx) and [advanced-filter list](../examples/list-page-advanced-filter.tsx).                                                                                                   |
| Single-step create or edit | Sticky `PageHeader` provides the title and description while the form scrolls.                  | `PageBody` with a centered sequence of concern-based cards, followed by sibling `ActionFooter` that owns Cancel and the primary commit action.  | [Create form](../examples/create-form.tsx).                                                                                                                                                                     |
| Wizard                     | `PageHeaderBand` or the documented pattern header, normally sticky for the flow exit and title. | `PageBody` with `StepIndicator` and the current step content, followed by persistent `ActionFooter` navigation. Use only for meaningful stages. | [Create wizard](../examples/create-wizard.tsx).                                                                                                                                                                 |
| Detail                     | `PageHeaderBand`, with tabs in its `tabs` slot when the detail has sibling sections.            | `PageBody` or `PAGE_BODY_PADDING_CLASS_NAME` around overview blocks, tabs, and `KvGrid` facts.                                                  | [Detail page](../examples/detail-page.tsx).                                                                                                                                                                     |
| Dashboard or settings      | `ContentHeader` inside `PageBody`, not a full-bleed resource header.                            | A scanning-focused arrangement of the page's cards, settings groups, or dashboard blocks.                                                       | There is no dedicated maintained dashboard template; use the [ContentHeader source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/content-header.tsx) and [PageBody source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/page-body.tsx) contracts. |

## Usage guidance

`Layout` is the fixed-height, unpadded scroll shell. Do not add page padding to its scroll area. Start the page's content with `PageBody`, which owns the standard page padding and block gap; use `PAGE_BODY_PADDING_CLASS_NAME` only where page padding must live on another structural element, such as a tab panel.

When a sidebar is supplied, `Layout` renders it as a desktop `aside` from `md` upward and also renders it in a left [Sheet](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/sheet.tsx) for mobile. Keep the shared sidebar in that shell and trigger the existing mobile drawer rather than creating separate page navigation trees.

Place `ActionFooter` after `PageBody` as its sibling in the layout scroll root. The footer becomes the persistent page-level commit area on short and long forms. It is never a child of `PageBody`, and it is never used inside `Modal`; `Modal footer` owns dialog actions.

For a single-step create or edit page, sticky `PageHeader` owns the title and description while sibling `ActionFooter` owns Cancel and the primary commit action. Use list, create, wizard, and detail templates as composition references rather than copying their placeholder data or comments. Choose `ContentHeader` only for plain content pages such as dashboard and settings.

## Examples

Compose a single-step create page with a full-bleed sticky `PageHeader`, padded body, and an `ActionFooter`-owned commit area:

```tsx
import { ActionFooter, Button, Card, PageBody, PageHeader } from "@cloud/ui";

export function CreateProjectPage() {
  return (
    <>
      <PageHeader title="New project" description="Create a project." sticky />
      <PageBody>
        <Card>{/* Form sections */}</Card>
      </PageBody>
      <ActionFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Create project</Button>
      </ActionFooter>
    </>
  );
}
```

For complete page shapes, start from the maintained [list](../examples/list-page.tsx), [single-step create](../examples/create-form.tsx), [wizard](../examples/create-wizard.tsx), and [detail](../examples/detail-page.tsx) examples.

## Do and do not

| Do                                                                                                                                                                                                                                                      | Do not                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Keep `Layout` as the unpadded scroll shell and introduce page padding with `PageBody`.                                                                                                                                                                  | Add page-level padding directly to the `Layout` scroll area.                                            |
| Use the shared desktop sidebar and mobile `Sheet` behavior supplied by `Layout`.                                                                                                                                                                        | Build separate desktop and mobile sidebar trees in each page.                                           |
| Use sticky `PageHeader` for a single-step page's title and description, then use sibling `ActionFooter` for Cancel and primary commit; use `PageHeaderBand` for detail and documented wizard flows, and `ContentHeader` for dashboard/settings content. | Put single-step Cancel or primary commit actions in `PageHeader` or use `PageHeaderBand` as its header. |
| Keep independent fields in a single-step form; reserve a wizard for meaningful stages.                                                                                                                                                                  | Turn a long but independent form into a wizard.                                                         |
| Render `ActionFooter` after `PageBody` as a sibling and use `Modal footer` for dialog actions.                                                                                                                                                          | Nest `ActionFooter` in `PageBody` or place it inside a `Modal`.                                         |

## Related foundations

- [Responsive layout](./responsive-layout.md) covers the shared `md` breakpoint and CSS-responsive composition used by the shell.
- [Spacing and sizing](./spacing-and-sizing.md) explains shared page spacing and content constraints.
- [Accessibility](./accessibility.md) covers focus, named icon actions, dialog behavior, and feedback semantics.
- [Design tokens](./design-tokens.md) covers the semantic utilities used by page primitives.
