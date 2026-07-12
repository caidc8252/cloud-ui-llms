# Collapsible

Headless show and hide behavior. Callers own all of the visual styling.

`Collapsible` is a client component built on `@base-ui/react`'s `Collapsible`. It is a set of three components — `Collapsible` (root), `CollapsibleTrigger`, and `CollapsibleContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Collapsible` is behavior only. It wires the open state, the trigger, and the panel together and applies no visual styling — every surface, border, spacing, and animation is yours through `className`.

Use it for a single show-and-hide region. For a grouped, pre-styled set of sections with a chevron and dividers, use `Accordion` instead.

Open and close state, controlled or uncontrolled, comes from the Base UI root props (`open`, `defaultOpen`, `onOpenChange`, `disabled`).

## General guidelines

### Do

- Use `Collapsible` when you want the open-and-close behavior but will style the trigger and panel yourself.
- Put the visible control inside `CollapsibleTrigger` so the open state and ARIA wiring are handled for you.
- Control the state with `open` and `onOpenChange` when another part of the UI needs to read or set it.

### Don't

- Don't reach for `Collapsible` when you actually want the styled, multi-section pattern. Use `Accordion`.
- Don't add your own `aria-expanded` to the trigger; the primitive manages it.
- Don't animate height on the wrong element. Animate `CollapsibleContent`.

## Features

- #### Structure

  ```tsx
  import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "@cloud/ui";

  <Collapsible>
    <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
      Advanced options
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-2">…</CollapsibleContent>
  </Collapsible>;
  ```

- #### Controlled state

  Pass `open` and `onOpenChange` to drive the region from your own state; omit them for uncontrolled use with `defaultOpen`.

### States

- #### Expanded

  The trigger reflects the open state through `aria-expanded`, and the content mounts or unmounts per the Base UI behavior. The visual treatment of each state is yours to style.

- #### Disabled

  Pass `disabled` on the root to lock the region closed and mark the trigger disabled.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice on the trigger.
- Avoid terminal punctuation on the trigger label.
- Avoid device-specific language such as "click".

### Component-specific guidelines

- Name what the trigger reveals, such as `Advanced options` or `Show details`.
- Keep the label stable whether the region is open or closed.

## Accessibility guidelines

### General accessibility guidelines

- Because `Collapsible` is headless, you supply the visible trigger. Render it as a real button so it is reachable and operable by keyboard.
- Don't rely on styling alone to convey the open state; the primitive's `aria-expanded` carries it, so keep the trigger a button.

### Component-specific guidelines

#### Keyboard interaction

- The trigger toggles the region with enter or space and is reachable by tab.
- Keep the trigger immediately before the content in DOM order so focus and reading order match.
