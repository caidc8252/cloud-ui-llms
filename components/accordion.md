# Accordion

Collapsible content sections. Each item expands and collapses to show or hide its content on trigger click.

`Accordion` is built on `@base-ui/react`'s `Accordion`. It is a set of four components — `Accordion` (root), `AccordionItem`, `AccordionTrigger`, and `AccordionContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

Compose the four parts: an `Accordion` wraps one or more `AccordionItem`s, and each item holds an `AccordionTrigger` (the clickable header) and an `AccordionContent` (the panel). The root owns the bordered, divided shell; the trigger and content own their surfaces.

The root forwards Base UI `Accordion.Root` props, so single-open versus multiple-open behavior, controlled or uncontrolled `value`, and a disabled state come from the primitive. Reach for those before styling.

Use the component props before adding custom classes. Reach for the trigger's `showArrow`, `arrow`, `arrowPosition`, and `arrowClassName` first, then use `className` only for local adjustments.

For a single, unstyled show-and-hide region, use `Collapsible` instead. Accordion is for a grouped, styled set of sections.

## General guidelines

### Do

- Use an accordion to group related sections that a user reads one at a time.
- Give every `AccordionTrigger` a short, descriptive label.
- Keep panel content in `AccordionContent` so it inherits the open and close animation.
- Set open behavior (single or multiple) on the root through the Base UI props.

### Don't

- Don't place an `AccordionTrigger` outside an `AccordionItem`; the item owns the expanded state the arrow reads.
- Don't hide primary page actions inside a collapsed panel a user may never open.
- Don't use an accordion for a single region. Use `Collapsible`.
- Don't remove the focus-visible ring when restyling the trigger.

## Features

- #### Structure

  ```tsx
  import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@cloud/ui";

  <Accordion>
    <AccordionItem value="overview">
      <AccordionTrigger>Overview</AccordionTrigger>
      <AccordionContent>Summary of the resource.</AccordionContent>
    </AccordionItem>
  </Accordion>;
  ```

- #### Arrow

  The trigger shows a trailing chevron that rotates 180° when its item is open.
  - `showArrow` (default `true`) toggles the indicator.
  - `arrow` replaces the default `ChevronDownIcon` with your own node.
  - `arrowPosition` (`"right"` default | `"left"`) places the indicator after or before the label.
  - `arrowClassName` adjusts the indicator wrapper.

  ```tsx
  <AccordionTrigger arrowPosition="left">Details</AccordionTrigger>
  ```

- #### Open behavior

  Single-open versus multiple-open, and controlled versus uncontrolled state, come from the Base UI root props such as `openMultiple`, `value`, and `defaultValue`.

### States

- #### Expanded

  The open item sets `aria-expanded`, which rotates the arrow and reveals the animated panel.

- #### Disabled

  A disabled trigger receives `aria-disabled` styling — a `not-allowed` cursor and reduced opacity — and does not toggle.

- #### Focus

  Focus-visible styling is a built-in inset ring on the trigger. Preserve it when restyling.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use present-tense verbs and active voice.
- Avoid terminal punctuation in trigger labels.
- Avoid device-specific language such as "click".

### Component-specific guidelines

- Use a short noun phrase for each trigger, naming the section it reveals.
- Keep labels parallel across the items in one accordion.
- Don't restate the trigger label as the first line of its panel.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button: it is reachable by tab and toggles with enter or space.
- Don't rely on the arrow rotation alone; the label must name the section.
- Keep the reading order of trigger then content.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus to each trigger; enter or space toggles the panel.
- Movement between headers follows the Base UI accordion behavior.

#### Headings

- `AccordionTrigger` renders inside a Base UI header element. If the accordion is a navigable section of the page, ensure the surrounding heading structure still makes sense.
