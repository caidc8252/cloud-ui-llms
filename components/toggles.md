# Toggles

Inline-labelled checkbox, radio group, and switch — the one-prop form of the primitives.

`Toggles` is the module that exports `ToggleCheckbox`, `ToggleRadioGroup`, `ToggleRadio`, and `ToggleSwitch`, along with their prop types. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

These three are the _convenience_ wrappers over `Checkbox`, `RadioGroup`, and `Switch`: each takes an optional inline `label` and renders the control and its label together, correctly associated, with no `Label` to wire up yourself. They support both controlled (`checked` / `value`) and uncontrolled (`defaultChecked` / `defaultValue`) modes. Each generates its own `id` to bind label to control, so you only pass `id` when something outside needs to point at it.

- **`ToggleCheckbox`** — a checkbox with a `label`. `indeterminate` shows the dash indicator, for a "some but not all" parent in a nested selection.
- **`ToggleRadioGroup`** + **`ToggleRadio`** — the group manages the selected `value`; each `ToggleRadio` needs a `value` and takes an optional `label`. The group lays its options out as a wrapping **row**; give it `className="flex-col items-start"` to stack them. `disabled` on the group disables every option in it, and `disabled` on a single `ToggleRadio` disables just that one.
- **`ToggleSwitch`** — a switch with a `label`. `size` is `sm` (24×14px) or `default` (36×20px). It is the only one of the four with a `size`.

Mind where `className` lands. On `ToggleRadioGroup` it goes to the group's flex container, which is why the stacking override above works. But on `ToggleCheckbox`, `ToggleRadio`, and `ToggleSwitch` it goes to the **control itself**, not to the row that holds the control and its label — so a layout class you meant for the row will end up resizing the box instead. Wrap those in your own element when you need to lay them out.

None of the four takes an `invalid` prop; validation display is `Field`'s job.

Reach for these when the control is a standalone setting with a short label sitting next to it. When the control belongs to a form — with a label above, helper text, and validation — use `Field` with the underlying `Checkbox`, `RadioGroup`, or `Switch`, which is what `Field` is built to lay out.

Note the semantic split these inherit: a **checkbox** sets a value in a form, and a **switch** turns something on immediately. Choosing the wrong one changes what the user expects to happen when they click it.

## General guidelines

### Do

- Use these when the control needs a short inline label and nothing else.
- Use `indeterminate` on a parent checkbox whose children are partly selected.
- Use `ToggleSwitch` for a setting that takes effect at once, and `ToggleCheckbox` for a value that is saved with the form.
- Give every `ToggleRadio` a `value`.

### Don't

- Don't use these inside a `Field` — the labels will fight. Use the plain primitives there.
- Don't leave a checkbox or switch unlabelled; if the label truly can't be visible, pass an `aria-label` to the primitive instead.
- Don't reach for `className` to lay out a `ToggleCheckbox`, `ToggleRadio`, or `ToggleSwitch` — it lands on the control, not on the row. Wrap it instead.
- Don't use a switch where a checkbox belongs. A switch that only takes effect on Save is a broken promise.

## Features

- #### ToggleCheckbox

  ```tsx
  import { ToggleCheckbox } from "@cloud/ui";

  <ToggleCheckbox
    label={t("settings.notifyOnFailure")}
    checked={notify}
    onCheckedChange={setNotify}
  />;
  ```

- #### Indeterminate

  `indeterminate` shows a dash instead of a check — the state of a parent whose children are partly selected.

  ```tsx
  <ToggleCheckbox
    label={t("table.selectAll")}
    checked={allSelected}
    indeterminate={someSelected && !allSelected}
    onCheckedChange={toggleAll}
  />
  ```

- #### ToggleRadioGroup

  The options sit in a wrapping row by default. `disabled` on the group covers every option; on an option it covers only that one.

  ```tsx
  import { ToggleRadioGroup, ToggleRadio } from "@cloud/ui";

  <ToggleRadioGroup value={plan} onValueChange={setPlan} className="flex-col items-start">
    <ToggleRadio value="monthly" label={t("plan.monthly")} />
    <ToggleRadio value="annual" label={t("plan.annual")} />
    <ToggleRadio value="trial" label={t("plan.trial")} disabled />
  </ToggleRadioGroup>;
  ```

- #### ToggleSwitch

  `size` is `sm` or `default`.

  ```tsx
  import { ToggleSwitch } from "@cloud/ui";

  <ToggleSwitch
    label={t("settings.enabled")}
    checked={enabled}
    onCheckedChange={setEnabled}
    size="sm"
  />;
  ```

### States

- **Checked / unchecked** — the standard control states.
- **Indeterminate** — `ToggleCheckbox` only: the dash indicator.
- **Disabled** — the control and its label are dimmed and not interactive. On `ToggleRadioGroup`, `disabled` applies to the whole group.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label the _on_ state, positively — `Notify me on failure`, not `Don't notify me`. A negated label under a checkbox forces the user to work out a double negative.
- Keep radio labels parallel and mutually exclusive.

## Accessibility guidelines

### General accessibility guidelines

- The inline label is associated with its control, so clicking the text toggles it and a screen reader announces the pair.
- These wrap the same Base UI primitives as `Checkbox`, `RadioGroup`, and `Switch`, so the roles and checked states are correct.
- `indeterminate` is announced as a mixed state, not as unchecked.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus to the control; Space toggles a checkbox or switch.
- Within a `ToggleRadioGroup`, the arrow keys move between options and select as they go.
