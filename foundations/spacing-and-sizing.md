# Spacing and sizing

Use the shared spacing, control, container, and breakpoint scales to keep application layouts measurable and compatible with `@cloud/ui` primitives. The canonical values are defined in the [global stylesheet](design-tokens.md), while page and Card ownership is defined by [PageBody](../components/page-body.md), [Card](../components/card.md), and the [portal page-style rule](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md).

## Overview

Spacing separates related application blocks; sizing establishes predictable controls and content bounds. Let `PageBody` own page gutters and its default block gap, then use component size props and named utilities for the dimensions local to a component.

## Reference

| Scale or mechanism         | Values or utilities                                                                                                                                                                                                   | Intended use                                                                                                  | Guidance                                                                                                                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raw spacing scale          | `--space-0` 0; `--space-1` 4px; `--space-2` 8px; `--space-3` 12px; `--space-4` 16px; `--space-5` 20px; `--space-6` 24px; `--space-8` 32px; `--space-10` 40px; `--space-12` 48px; `--space-16` 64px; `--space-20` 80px | Shared layout spacing for direct variable consumers.                                                          | Use the scale rather than inventing a pixel value; application gaps follow the matching Tailwind scale utilities.                                                                                                                                                |
| Common application gaps    | `gap-3`, `gap-3.5`, `gap-4`, `gap-5`, `gap-6`                                                                                                                                                                         | Stat-card grids, coupled parent/child cards, condition bands, side-by-side blocks, and short embedded blocks. | Follow the [portal page-style rule](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md): `gap-3` for stat-card grids, `gap-3.5` for tightly coupled cards, `gap-4` or `gap-6` for a condition band and list card, and `gap-5` for side-by-side cards. |
| Control height             | `h-control-xs` 22px; `h-control-sm` 28px; `h-control-md` 36px; `h-control-lg` 44px                                                                                                                                    | Fixed-height controls.                                                                                        | Prefer the size prop of a primitive; use a named control-height utility only when the public component pattern calls for it.                                                                                                                                     |
| Control horizontal padding | `px-cx-sm` 10px; `px-cx-md` 14px; `px-cx-lg` 18px                                                                                                                                                                     | Horizontal inset for controls at their shared size steps.                                                     | Pair with the corresponding public control size or component sizing behavior, not an arbitrary `px-[...]` value.                                                                                                                                                 |
| Content container          | `max-w-content` 1280px                                                                                                                                                                                                | Main application content width.                                                                               | Use the named container utility when a content region needs the shared maximum width.                                                                                                                                                                            |
| Breakpoints                | `xs` 480px; `sm` 640px; `md` 768px; `lg` 1024px; `xl` 1280px; `2xl` 1536px                                                                                                                                            | Responsive utility variants such as `md:grid-cols-2`.                                                         | Change composition at a shared breakpoint; do not create a page-local media threshold.                                                                                                                                                                           |
| Page body                  | `PageBody`: `gap-6 px-6 pt-6 pb-8`; `PAGE_BODY_PADDING_CLASS_NAME`: `px-6 pt-6 pb-8`                                                                                                                                  | Page-level padding and vertical block rhythm.                                                                 | The `Layout` scroll area has no padding. Render the page body through `PageBody`; use the exported padding class only when padding must live on a different required surface.                                                                                    |
| Card size and slots        | `size="sm"`: 12px slot padding; `size="md"`: 20px slot padding; `size="lg"`: 24px slot padding; `CardHeader` at `md`: 20px horizontal and 14px vertical padding                                                       | Card radius and internal padding.                                                                             | Let `Card`, `CardHeader`, `CardContent`, and `CardFooter` own their padding. Use `flush` for full-bleed table or row content, never `p-0` to override it.                                                                                                        |

## Usage guidance

Use `PageBody` for page-level space and write only the gaps between component blocks. For a standard page, its built-in `gap-6` already separates vertically stacked blocks. When a component exposes `size`, select that prop before adding sizing classes.

Use scale utilities and named application utilities such as `h-control-md`, `px-cx-md`, and `max-w-content` instead of arbitrary JSX values. The raw `--space-*` variables are available for direct variable consumers; ordinary markup should use the corresponding shared utility scale.

## Examples

```tsx
import { Card, CardContent, PageBody } from "@cloud/ui";

export function AccountsPage() {
  return (
    <PageBody>
      <div className="max-w-content">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardContent>Open accounts</CardContent>
          </Card>
          <Card size="sm">
            <CardContent>Pending review</CardContent>
          </Card>
        </div>
      </div>
    </PageBody>
  );
}
```

## Do and do not

| Do                                                                                    | Do not                                                                                         |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Use `PageBody` for page padding and its built-in block gap.                           | Add page-level `p-*` classes to the `Layout` scroll area or recreate its padding in each page. |
| Choose `size` and `flush` on `Card` slots to use its owned dimensions.                | Override Card slot padding with `p-0` or local padding values.                                 |
| Snap a needed gap, width, padding, height, or responsive threshold to a shared scale. | Add arbitrary values such as `gap-[18px]`, `max-w-[459px]`, or a page-local breakpoint.        |

## Related foundations

- [Design tokens](./design-tokens.md) explains how named sizing and breakpoint tokens become utilities.
- [Typography](./typography.md) covers the type scale that fits inside these shared dimensions.
- [Elevation](./elevation.md) covers surface depth for the blocks composed with this spacing.
