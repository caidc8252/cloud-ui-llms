# Elevation

Elevation uses the shared shadow ladder to show surface depth, interaction, and focus without page-local shadow values. The definitions are in the [global stylesheet](design-tokens.md); the public Card mapping is in [Card](../components/card.md), and application constraints are in the [portal page-style rule](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md).

## Overview

Choose elevation by interaction depth, not decoration. Resting cards sit at the low end of the ladder, lifted surfaces use the next public Card elevation, overlays own their larger shadows, and focus uses its dedicated treatment.

## Reference

| Level or mechanism  | Token or prop         | Intended use                                                                             | Avoid                                                                                      |
| ------------------- | --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Flat                | `shadow-none`         | Surfaces that require no elevation, including `Card elevation={0}`.                      | Adding a decorative shadow to create hierarchy better expressed by surface or line tokens. |
| Resting surface     | `shadow-1`            | Default resting Card surface; `Card elevation={1}` is the default.                       | Treating it as a general overlay shadow.                                                   |
| Subtle lift         | `shadow-2`            | A shared shadow step when a public primitive specifies it.                               | Inventing an equivalent arbitrary shadow in application markup.                            |
| Lifted surface      | `shadow-3`            | `Card elevation={2}`, interactive Card hover, and component-owned small lifted surfaces. | Skipping from a resting Card to a page-local shadow.                                       |
| AlertDialog         | `shadow-4`            | `AlertDialogContent` at its defined dialog depth.                                        | Treating it as a shared dialog or overlay shadow.                                          |
| High overlay        | `shadow-5`            | High-depth overlay primitives such as command surfaces.                                  | Applying it to standard cards or manually recreating an overlay.                           |
| Active emphasis     | `shadow-cta`          | Component-owned primary or danger actions, checked switches, and active step indicators. | Adding it directly to application controls or non-action content.                          |
| Keyboard focus      | `shadow-focus`        | Focus-visible feedback on interactive controls.                                          | Removing focus treatment or substituting a decorative shadow.                              |
| Selected table row  | `shadow-row-selected` | Component-owned selected-row leading accent.                                             | Using it as general selected-card elevation.                                               |
| Sticky table column | `shadow-sticky-col`   | Component-owned edge between a sticky column and scrolling content.                      | Recreating the edge with an arbitrary `shadow-[...]` value.                                |

## Usage guidance

For Cards, use the public mapping exactly: `elevation={0}` maps to `shadow-none`, `elevation={1}` maps to `shadow-1` and is the default resting state, and `elevation={2}` maps to `shadow-3` for a lifted state. An interactive Card supplies its own hover lift to `shadow-3`.

Overlay primitives own individually defined shadows: `Modal` uses `shadow-1`, while `AlertDialogContent` uses `shadow-4`. Do not treat either as a generic overlay depth or add page-local arbitrary shadow values; use a public component or the named shadow utility already associated with the intended mechanism. Keep `shadow-focus`, `shadow-row-selected`, and `shadow-sticky-col` attached to their respective interaction or table behaviors.

Keep `shadow-cta` inside the components that define primary, danger, active, or selected emphasis, such as [Button](../components/button.md), [Switch](../components/switch.md), and [StepIndicator](../components/step-indicator.md).

## Examples

```tsx
import { Card, CardContent } from "@cloud/ui";

export function ReviewPanel() {
  return (
    <div className="grid gap-3">
      <Card elevation={1}>
        <CardContent className="text-md font-semibold text-content-primary">
          Review queue
        </CardContent>
      </Card>
      <Card elevation={2}>
        <CardContent className="text-md font-semibold text-content-primary">
          Active review
        </CardContent>
      </Card>
    </div>
  );
}
```

## Do and do not

| Do                                                                                                  | Do not                                                   |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Use `Card elevation={1}` for a normal resting card and `elevation={2}` for its public lifted state. | Apply `shadow-4` or `shadow-5` to ordinary page cards.   |
| Let each overlay primitive own its individually defined shadow.                                     | Recreate an overlay with a page-local arbitrary shadow.  |
| Preserve `shadow-focus` and component-owned table accent shadows for their specific behavior.       | Use focus or table-accent shadows as generic decoration. |

## Related foundations

- [Design tokens](./design-tokens.md) explains the shared shadow token family.
- [Spacing and sizing](./spacing-and-sizing.md) covers the dimensions of the surfaces that use elevation.
- [Colors](./colors.md) covers surface and line tokens used alongside elevation.
