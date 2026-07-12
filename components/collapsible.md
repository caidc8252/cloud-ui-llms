# Collapsible

Headless show and hide behavior. Callers own all of the visual styling.

`Collapsible` is a client component built on `@base-ui/react`'s `Collapsible`. It is a set of three components — `Collapsible` (root), `CollapsibleTrigger`, and `CollapsibleContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Collapsible` is behavior only. It wires the open state, the trigger, and the panel together and applies no visual styling — every surface, border, spacing, and animation is yours through `className`.

Use it for a single show-and-hide region. For a grouped, pre-styled set of sections with a chevron and dividers, use `Accordion` instead.

Open and close state, controlled or uncontrolled, comes from the Base UI root props (`open`, `defaultOpen`, `onOpenChange`, `disabled`). `CollapsibleContent` is Base UI's `Collapsible.Panel`, so its props (`keepMounted`, `hiddenUntilFound`) are available on it.

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

  Pass `open` and `onOpenChange` to drive the region from your own state; omit them for uncontrolled use with `defaultOpen`. `onOpenChange` is called with the next open state and a Base UI event-details object.

- #### Panel mounting

  `CollapsibleContent` unmounts its children while closed. Two Base UI props change that:
  - `keepMounted` keeps the panel in the DOM while hidden. Use it when the content must stay mounted, such as a form whose values should survive a collapse.
  - `hiddenUntilFound` keeps the panel in the DOM as `hidden="until-found"` so the browser's find-in-page can reach and expand it. It overrides `keepMounted`.

  ```tsx
  <CollapsibleContent keepMounted className="pt-2">
    …
  </CollapsibleContent>
  ```

- #### Height animation

  The panel publishes its measured size as the `--collapsible-panel-height` and `--collapsible-panel-width` CSS variables, so a height transition is written against the variable rather than a hardcoded value.

  ```tsx
  <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] data-[ending-style]:h-0 data-[starting-style]:h-0">
    …
  </CollapsibleContent>
  ```

### States

- #### Expanded

  The trigger reflects the open state through `aria-expanded`, and the panel unmounts when closed unless `keepMounted` or `hiddenUntilFound` is set. The visual treatment of each state is yours to style.

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
