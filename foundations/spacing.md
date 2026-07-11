# Spacing

Spacing is used to define paddings and margins of the elements on the interface. Consistent spacing creates predictable layouts, favors visual rhythm and helps you create a clear hierarchy.

[Layout](layout.md) | [Design tokens](../design-tokens.md) | [Card](../card.md)

## Grid system

There is no grid component. Tailwind's `grid` and `flex` utilities are the grid, and the system supplies a component only where hand-writing the grid reliably goes wrong:

- **`KvGrid`** (the `grid-auto-fit-kv` utility) — key-value grids whose columns auto-fit the **container's** width rather than a viewport breakpoint. Hand-writing `grid-cols-[repeat(auto-fit,minmax(...))]` is blocked by the arbitrary-value lint, and hand-written versions routinely drop the `min(22rem, 100%)` that stops a column overflowing a phone-width container.
- **`StatGrid`** — the `StatCard` row.

The content column is capped at `--container-content` (1280px) with 24px gutters.

### Laying content

Content sits in one padded body (`PageBody`) between full-bleed bands (`PageHeader`, `ActionFooter`). The body owns the page padding and the gap between top-level blocks, so a page composes blocks and writes no page-level padding of its own. See [Layout](layout.md).

## Spacing system

Two scales coexist, and confusing them is the usual source of a stray value.

**Tailwind's own scale** is the working scale: the default 4px step, consumed as `p-4`, `gap-2`, `px-5`. This is what you write in components. It is not a set of custom tokens — there is no `--spacing` override in the theme, so `p-3` is 12px because Tailwind says so.

**`--space-*`** is a raw variable scale declared on `:root`, **not** in `@theme`. It therefore generates **no utility classes** and exists purely for direct `var()` consumption in layout primitives. If you are writing a component, this is not the scale you want.

**Control sizing** is the third, and it is a genuine set of tokens because it encodes an agreement between components: `--spacing-control-*` for heights and `--spacing-cx-*` for horizontal insets, so that a `Button`, an `Input`, and a `SelectTrigger` of the same size line up exactly. They generate `h-control-md`, `px-cx-md`, and so on.

### Spacing types

- **Padding inside a component** — owned by the component. `Card`'s slot padding follows its `size`; `PageBody`'s padding is built in. You do not add padding to these from outside; to remove it you use the component's own escape hatch (`Card`'s `flush`), because a variant-applied padding cannot be overridden by a plain `p-0`.
- **Gap between components** — this is what you write, and it is the whole of the spacing you own on a page.
- **Margin** — effectively unused. Reach for a gap on the parent rather than a margin on the child; a margin belongs to the wrong element and doesn't collapse predictably in a flex or grid container.

## Spacing scale

The gaps below are not preferences. They are the vocabulary the pages already speak, and a page that invents its own reads as broken next to one that doesn't.

| Gap       | Where                                                                       |
| --------- | --------------------------------------------------------------------------- |
| `gap-3`   | Stat-card grid.                                                             |
| `gap-3.5` | A tightly coupled parent card and its child card — they read as one object. |
| `gap-4`   | Condition band → list card, when the list is sticky.                        |
| `gap-5`   | Side-by-side block cards. The default gap between peers.                    |
| `gap-6`   | Condition band → list card, when the list is short or embedded.             |

Everything is a multiple of 4. Arbitrary values (`gap-[13px]`, `p-[7px]`) are banned by lint; snap to the nearest step.

The control tokens:

| Token                  | Value | Utility        |
| ---------------------- | ----- | -------------- |
| `--spacing-control-xs` | 22px  | `h-control-xs` |
| `--spacing-control-sm` | 28px  | `h-control-sm` |
| `--spacing-control-md` | 36px  | `h-control-md` |
| `--spacing-control-lg` | 44px  | `h-control-lg` |
| `--spacing-cx-sm`      | 10px  | `px-cx-sm`     |
| `--spacing-cx-md`      | 14px  | `px-cx-md`     |
| `--spacing-cx-lg`      | 18px  | `px-cx-lg`     |

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

`Card`'s slot padding is applied through a `group-data` variant, so tailwind-merge cannot dedupe a caller's `p-0` against it and the variant rule wins. `flush` is the supported way out. See [Card](../card.md).

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

`--space-*` is variable-only and generates no utilities; the control tokens generate `h-control-*` and `px-cx-*`. Everything else is Tailwind's 4px scale. See [Design tokens](../design-tokens.md).
