# Accessibility

`@cloud/ui` primitives preserve common semantic controls and their visible focus treatment. This reference covers the public behavior in the [Field](../components/field.md), [Input](../components/input.md), [Button](../components/button.md), and [Modal](../components/modal.md), alongside the portal [UI and page rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md).

## Overview

Start with the semantic primitive that matches the interaction, then provide a programmatic name, validation feedback, and keyboard-visible focus. Keep visual feedback in addition to semantics, not in place of them. The primitive source is the authority for supported props and behavior.

## Reference

| Requirement                    | Expected behavior                                                                                         | Preferred mechanism                                                                                                               | Common failure                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Labels and control association | A text control has a visible label associated with its `id`.                                              | Pass the same value to `Field htmlFor` and `Input id`. `Field` renders the label with `htmlFor`.                                  | Showing label-looking text that is not associated with the input.                                                                  |
| Invalid form feedback          | The invalid control exposes `aria-invalid`; the error is announced as an alert.                           | Set `Input invalid` and pass the message through `Field error`, which renders `role="alert"`.                                     | Styling a border red without setting invalid state or exposing the message.                                                        |
| Icon-only actions              | An action with no visible text has an accessible name.                                                    | Use `Button` with an icon size and a specific `aria-label`.                                                                       | Relying on the icon shape or a tooltip as the only accessible name.                                                                |
| Keyboard focus                 | Keyboard users can find the active control through a visible focus treatment.                             | Keep the primitive's `focus-visible` styles; use native buttons, inputs, and links for their matching interactions.               | Removing focus styles or replacing a button with a clickable `div`.                                                                |
| Dialog focus and Escape        | A modal is named and its open state has a usable focus path; Escape closes it by default.                 | Use `Modal title` and its built-in close control. Keep `closeOnEscape` enabled unless the flow must prevent accidental dismissal. | Opening an unnamed modal, trapping a user on an inoperable first control, or disabling Escape without a deliberate dismissal path. |
| Hints for unfamiliar controls  | An unfamiliar visual control can expose a short visual hint without replacing its accessible name.        | Pair the named trigger with `Tooltip`, `TooltipTrigger`, and `TooltipContent`.                                                    | Adding tooltips to familiar controls instead of giving unfamiliar icon controls a label.                                           |
| Status and validation feedback | Important feedback is communicated semantically as well as by color.                                      | Use `Field error` for field errors and `Alert` for prominent status feedback; both render `role="alert"`.                         | Conveying an error or status only through a color change.                                                                          |
| Disabled and read-only states  | Disabled controls do not invite interaction; read-only inputs retain their native read-only meaning.      | Use the native `disabled` or `readOnly` prop on the primitive that owns the control.                                              | Simulating either state with opacity, pointer events, or a non-interactive wrapper.                                                |
| Reduced motion                 | Shared motion respects the user's reduced-motion preference; app-specific animation has its own fallback. | Use the shared duration utilities and pair new keyframes with `prefers-reduced-motion`.                                           | Assuming the component defaults disable a page-specific animation.                                                                 |
| Primitive semantics            | Components retain the semantics and interaction model their primitive provides.                           | Compose the public `@cloud/ui` primitive instead of recreating its behavior in application markup.                                | Adding conflicting ARIA roles, hand-built keyboard handlers, or custom controls for an existing primitive.                         |

## Usage guidance

Give every control a name before refining its visual treatment. For a single input, `Field` owns the label, hint, and error presentation; the application supplies the matching `id` and `htmlFor`. `Field required` renders the visible required indicator only, so also set the control's native `required` or `aria-required` state. For compound controls such as radio groups, omit `htmlFor` when there is no single target, as documented by `Field`.

Use an icon-only button only when the action is familiar enough to scan quickly. Its `aria-label` names the action for assistive technology; a [Tooltip](../components/tooltip.md) can explain an unfamiliar symbol to sighted pointer users. Do not use the tooltip as the name.

For overlays, use [Modal](../components/modal.md) rather than constructing dialog behavior from a positioned `div`. `closeOnEscape` defaults to `true`; when a flow intentionally keeps it open, provide a clear, operable completion or cancel path. Use the modal's `footer` slot for dialog actions.

Keep native disabled and read-only states distinct. A disabled `Button` or `Input` cannot be used; `Input readOnly` communicates that its value is available but not editable. Preserve the primitive's keyboard focus styles and use semantic `Alert` or field error feedback rather than color alone.

## Examples

Associate a field label with its input, and expose both invalid state and the error message:

```tsx
import { Field, Input } from "@cloud/ui";

export function CompanyNameField() {
  return (
    <Field htmlFor="company-name" label="Company name" error="Enter a company name." required>
      <Input id="company-name" invalid required />
    </Field>
  );
}
```

Name an icon-only action directly. Add a tooltip only when the icon needs a visual explanation:

```tsx
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@cloud/ui";
import { Trash2 } from "lucide-react";

export function RemoveMemberButton() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="ghost-danger" size="icon-sm" aria-label="Remove member" />}
      >
        <Trash2 />
      </TooltipTrigger>
      <TooltipContent>Remove member</TooltipContent>
    </Tooltip>
  );
}
```

## Do and do not

| Do                                                                             | Do not                                                                                         |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Associate each single control's `Field htmlFor` with the control `id`.         | Treat adjacent label text as an equivalent association.                                        |
| Use `Input invalid` with `Field error` for a field validation failure.         | Use an error color without invalid state or an announced message.                              |
| Give every icon-only `Button` a specific `aria-label`.                         | Depend on an icon, title attribute, or tooltip as its only name.                               |
| Keep primitive focus-visible styling and native disabled/read-only attributes. | Hide focus, simulate native states with CSS, or hand-roll common controls.                     |
| Use the modal footer for modal actions and respect reduced-motion preferences. | Put page-level sticky actions in a modal or assume custom keyframes are reduced automatically. |

## Related foundations

- [Motion](./motion.md) documents the shared reduced-motion behavior and the requirement for application-specific fallbacks.
- [Colors](./colors.md) explains semantic status colors, which must not be the only feedback channel.
- [Layout](./layout.md) covers accessible application-shell and overlay composition.
- [Responsive layout](./responsive-layout.md) covers CSS-responsive composition without a client-rendered mobile tree.
