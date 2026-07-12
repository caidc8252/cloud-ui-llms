# Spacing

Spacing is used to define paddings and margins of the elements on the interface. Consistent spacing creates predictable layouts, favors visual rhythm and helps you create a clear hierarchy.

[Layout](layout.md) | [Design tokens](design-tokens.md) | [Card](../components/card.md)

## Grid system

There is no grid component. Tailwind's `grid` and `flex` utilities are the grid, and the system supplies a component only where hand-writing the grid reliably goes wrong:

- **`KvGrid`** (the `grid-auto-fit-kv` utility) — key-value grids whose columns auto-fit the **container's** width rather than a viewport breakpoint. Hand-writing `grid-cols-[repeat(auto-fit,minmax(...))]` is blocked by the arbitrary-value lint, and hand-written versions routinely drop the `min(22rem, 100%)` that stops a column overflowing a phone-width container.
- **`StatGrid`** — the `StatCard` row.

The content column is capped at `--container-content` (1280px) with 24px gutters.

### Laying content

Content sits in one padded body (`PageBody`) between full-bleed bands (`PageHeader`, `ActionFooter`). The body owns the page padding and the gap between top-level blocks, so a page composes blocks and writes no page-level padding of its own. See [Layout](layout.md).

## Spacing system

Two scales coexist, and confusing them is the usual source of a stray value.

**Tailwind's own scale** is the working scale, consumed as `p-4`, `gap-2`, `px-5`. This is what you write in components. It is not a set of custom tokens — there is no `--spacing` override in the theme, so `p-3` is 12px because Tailwind says so, and the half steps (`gap-1.5`, `px-2.5`) are Tailwind's, not ours. The step is 4px; the base unit underneath it is 2px, and the half steps carry meaning of their own — see [the scale](#spacing-scale).

**`--space-*`** is a raw variable scale declared on `:root`, **not** in `@theme`. It therefore generates **no utility classes** and exists purely for direct `var()` consumption in layout primitives. If you are writing a component, this is not the scale you want.

**Control sizing** is the third, and it is a genuine set of tokens because it encodes an agreement between components: `--spacing-control-*` for heights and `--spacing-cx-*` for horizontal insets, so that a `Button`, an `Input`, and a `SelectTrigger` of the same size line up exactly. They generate `h-control-md`, `px-cx-md`, and so on.

### Spacing types

- **Padding inside a component** — owned by the component. `Card`'s slot padding follows its `size`; `PageBody`'s padding is built in. You do not add padding to these from outside; to remove it you use the component's own escape hatch (`Card`'s `flush`), because a variant-applied padding cannot be overridden by a plain `p-0`.
- **Gap between components** — this is what you write, and it is the whole of the spacing you own on a page.
- **Margin** — effectively unused. Reach for a gap on the parent rather than a margin on the child; a margin belongs to the wrong element and doesn't collapse predictably in a flex or grid container.

## Spacing scale

The base unit is **2px**, and the working step is **4px**. Every value below is a multiple of 2; the great majority are multiples of 4.

These are not preferences. They are the vocabulary the pages already speak, and a page that invents its own reads as broken next to one that doesn't. Each row says where the step actually appears — reach for the step whose job matches yours, rather than picking a number that looks right.

### The full steps

| Step    | Size | Where it appears                                                                                                                                                                                   |
| ------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap-1` | 4px  | Between a `Badge`'s icon and its text. Between the triggers inside a `TabsList` or a `ToggleGroup`. The tightest gap that still reads as a gap.                                                    |
| `gap-2` | 8px  | Between a `Field`'s label, its control, and its hint — the vertical rhythm of every form row. Between the buttons in an `ActionFooter`. Between an icon and its label in an `Alert` or an `Empty`. |
| `gap-3` | 12px | Between the contents of a `ListSummaryBar`. The `StatCard` grid. `Card size="sm"` slot padding. `Timeline`, `Progress`, `LoadMore`.                                                                |
| `gap-4` | 16px | The **column** gap of a `KvGrid`. The gap from a condition band down to a sticky list card.                                                                                                        |
| `gap-5` | 20px | Between **side-by-side peer cards** — the default gap between blocks that are equals. The **row** gap of a `KvGrid` (`gap-y-5`). `Card size="md"` slot padding.                                    |
| `gap-6` | 24px | Between the **top-level blocks of a page** — `PageBody` owns this one, and you do not write it. The page's own side gutters (`px-6`). `Card size="lg"` slot padding.                               |
| `gap-8` | 32px | `PageBody`'s bottom padding (`pb-8`), so the last block does not sit on the fold.                                                                                                                  |

### The half steps, and what they mean

The half steps are not sloppiness. **A half step says "tighter than the next full step, on purpose" — it signals that two things are one thing.** Almost all of them live _inside_ a control, where a full step would let the parts drift apart:

| Step      | Size | Where it appears                                                                                                                                                                                                                                                             |
| --------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap-0.5` | 2px  | The tightest inset in the system — a `Popover`'s or `Sidebar`'s stacked rows, a toast's lines. Below this there is no space, only touching.                                                                                                                                  |
| `gap-1.5` | 6px  | **The most-used half step.** Between a `Button`'s icon and its label. Between a `Select` or `Combobox` trigger's value and its chevron. Between a `DropdownMenu` item's icon and its label. 4px cramps these; 8px makes the icon look detached from the thing it belongs to. |
| `gap-2.5` | 10px | A `PageHeader`'s action cluster. A `ListConditionBand`'s controls. `Command`, `StepIndicator`. A row of peer controls that must not read as a form.                                                                                                                          |
| `gap-3.5` | 14px | A tightly coupled **parent card and its child card** — the one half step used between blocks rather than inside a control, and it is doing the same job: making two surfaces read as one object. Also `Card size="md"`'s vertical slot padding (`py-3.5`).                   |

If you find yourself wanting a half step _between_ two peer blocks, you are probably not describing peers. Either they are coupled — say so with `gap-3.5` — or they are peers, and the answer is `gap-5`.

### Control sizing

Control tokens are a genuine set of tokens, because they encode an agreement **between** components: a `Button`, an `Input`, and a `SelectTrigger` of the same size line up exactly.

| Token                  | Value | Utility           | Where                                                                                                   |
| ---------------------- | ----- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| `--spacing-control-xs` | 22px  | `size-control-xs` | The small `Avatar`'s box. **No control uses it as a height** — see the note below.                      |
| `--spacing-control-sm` | 28px  | `h-control-sm`    | The `sm` size of `Button`, `Input`, `Select`, `Combobox`, `Toggle`, `TabsList`, and the date fields.    |
| `--spacing-control-md` | 36px  | `h-control-md`    | **The default size** of those same controls, plus `InputGroup` and the pagers.                          |
| `--spacing-control-lg` | 44px  | `h-control-lg`    | The `lg` size of `Button`, `Input`, `TabsList`, and the date fields. Also the comfortable touch target. |
| `--spacing-cx-sm`      | 10px  | `px-cx-sm`        | The horizontal inset of an `sm` control.                                                                |
| `--spacing-cx-md`      | 14px  | `px-cx-md`        | The horizontal inset of an `md` control.                                                                |
| `--spacing-cx-lg`      | 18px  | `px-cx-lg`        | The horizontal inset of an `lg` control.                                                                |

Pair the height and the inset from the same size — `h-control-md` with `px-cx-md`. An `h-control-md` carrying a `px-cx-sm` is a control that has been squeezed, and it will not line up with its neighbours.

> **The `xs` gap.** There is no `xs` control height in practice. `Button`'s `xs` is a raw `h-6` (24px), not the 22px token, so an extra-small button does not line up with anything else claiming to be `xs`. If you need an `xs` control, say so rather than copying the raw height — the token and the button disagree, and one of them is wrong.

### The `--space-*` variables

`--space-*` is a raw variable scale on `:root`. It generates **no utility classes** and exists for direct `var()` consumption inside layout primitives. If you are writing a component, this is not the scale you want — write the Tailwind utility.

| Variable    | Value |     | Variable     | Value |
| ----------- | ----- | --- | ------------ | ----- |
| `--space-0` | 0     |     | `--space-6`  | 24px  |
| `--space-1` | 4px   |     | `--space-8`  | 32px  |
| `--space-2` | 8px   |     | `--space-10` | 40px  |
| `--space-3` | 12px  |     | `--space-12` | 48px  |
| `--space-4` | 16px  |     | `--space-16` | 64px  |
| `--space-5` | 20px  |     | `--space-20` | 80px  |

Arbitrary values (`gap-[13px]`, `p-[7px]`) are banned by lint. Snap to the nearest step — and if no step fits, the layout is asking for a different structure, not a new number.

## Key concepts

### Create relationships

Proximity is the cheapest grouping signal available, and it is read before any border or heading. Two cards at `gap-3.5` are one object with a part; the same two cards at `gap-5` are peers. Choosing the gap **is** choosing what the user believes about the relationship — it is not a visual preference applied afterwards.

### Create hierarchy

Hierarchy comes from grouping, not from padding. Making one card roomier than its neighbours does not promote it; it just makes the page look uneven. To promote something, give it its own block, its own heading, or its own tab.

### Use white space

When content overflows, **adjust the content, not the spacing**. Split it into blocks, move it behind tabs, paginate it. Tightening padding to fit more in is the reflex to resist: it buys one screenful and costs the page's readability permanently. The system's density is already a decision — `Card`'s `size`, the `Table`'s density presets — and those are the levers, not ad-hoc padding.

## Implementation

### Component padding

Padding inside a component belongs to the component:

```tsx
<Card size="lg">        {/* 24px slot padding, everywhere inside */}
  <CardContent flush>  {/* opt out — a plain p-0 cannot override it */}
    <Table … />
  </CardContent>
</Card>
```

`Card`'s slot padding is applied through a `group-data` variant, so tailwind-merge cannot dedupe a caller's `p-0` against it and the variant rule wins. `flush` is the supported way out. See [Card](../components/card.md).

### Gaps between components

```text
<!-- peer block cards -->
<div className="flex gap-5">
  <Card className="flex-1">…</Card>
  <Card className="flex-1">…</Card>
</div>
```

Every wrapper `div` must have a job — a spacing group, a scroll container, a flex width. A wrapper with a single child whose classes could merge into that child is noise; delete it.

### Design tokens

`--space-*` is variable-only and generates no utilities; the control tokens generate `h-control-*` and `px-cx-*`. Everything else is Tailwind's own scale — a 4px step over a 2px base, half steps included. See [Design tokens](design-tokens.md).
