# Switch

Binary toggle switch. Prefer `ToggleSwitch` for fields that need an inline label.

`Switch` is a client component built on `@base-ui/react`'s `Switch`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Switch` is a bare on/off toggle — it has no `label` prop of its own. For a labeled form row, prefer the `ToggleSwitch` recipe, which takes a `label` alongside `checked` / `defaultChecked` / `onCheckedChange` / `disabled` / `size` and wires the label to the control. Use `Switch` directly in custom layouts.

Use a switch for a setting that takes effect immediately, such as enabling a feature. Use a `Checkbox` when the choice is part of a form the user submits later.

`size` is `default` (36×20px) or `sm` (24×14px). The enlarged hit target is preserved at both sizes — the switch reaches past its track on every side, so a small switch is still comfortable to hit.

## General guidelines

### Do

- Use a switch for an immediate on/off setting.
- Prefer `ToggleSwitch` for a labeled field.
- Keep the "on" state as the affirmative, enabled option.

### Don't

- Don't use a switch inside a form that is submitted later. Use a `Checkbox`.
- Don't use a switch for mutually exclusive choices. Use `RadioGroup`.
- Don't rely on position alone; keep a label beside the switch.

## Features

- #### Size

  There are two sizes: `default` (36×20px, the default) and `sm` (24×14px).

  ```tsx
  import { Switch } from "@cloud/ui";

  <Switch size="sm" aria-label="Enable notifications" />;
  ```

- #### Controlled state

  Drive the switch with the Base UI `checked` and `onCheckedChange` props, or leave it uncontrolled with `defaultChecked`.

### States

- #### Checked

  The track fills with the primary color and the thumb slides to the on position.

- #### Invalid

  A passed `aria-invalid` applies the destructive border and ring.

- #### Disabled

  A disabled switch shows a not-allowed cursor and reduced opacity.

## Writing guidelines

### General writing guidelines

- Use sentence case for the switch's label.
- Name the setting, not the action, such as `Email notifications`.

### Component-specific guidelines

- Give a bare `Switch` an accessible name with `aria-label` when there is no visible label.
- Avoid "on/off" in the label; the switch state conveys that.

## Accessibility guidelines

### General accessibility guidelines

- Every switch needs an accessible name.
- Preserve keyboard behavior from the Base UI primitive: it is reachable by tab and toggled with space or enter.
- Don't rely on color alone for the on state; the thumb position and native state carry it.

### Component-specific guidelines

#### Keyboard interaction

- Tab focuses the switch; space or enter toggles it.
- When toggling takes immediate effect, ensure any resulting change is announced or visible without needing to move focus.
