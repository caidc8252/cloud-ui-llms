# Design tokens

A design token is an abstraction of a visual property, such as color, size, or motion.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/main/packages/ui/src/components/styles/index.css)

## Key UX concepts

### Overview

A design token is an abstraction of a visual property such as color, size, or motion. Instead of hard-coded values, such as a hex color or a pixel radius, tokens are key-value pairs that represent reusable design decisions in the form of a variable. The key stays constant in your code while the value can change at a system level or at runtime for theming.

The `@cloud/ui` token sheet, exported as `@cloud/ui/globals.css`, is the single source of truth. Its `@theme` blocks do two things at once: they emit CSS custom properties on `:root`, and they generate the matching Tailwind utilities. Defining `--color-surface-2` is what makes `bg-surface-2` exist. There is no second place to look and no separate token build step.

Dark mode is applied through the normal cascade. `[data-theme="dark"]` (and `.dark`) redefines only the values that change, so a token that is not listed in the dark block keeps its light value. Tokens defined with `var()` or `color-mix()` of other tokens follow the theme automatically and never need a dark override.

Adding a token is not a routine act. See the constraints in the [`@cloud/ui` README](../README.md): the default answer is to reuse the closest existing token, and a genuinely missing token is a conversation with the operator, not a commit.

### Naming structure

Tokens are named `--<namespace>-<group>-<step or role>`.

- **Namespace** — the Tailwind theme namespace, which decides which family of utilities gets generated.
  - For example: `color` generates `bg-*` / `text-*` / `border-*`, `radius` generates `rounded-*`, `shadow` generates `shadow-*`, and `spacing` generates `h-*` / `p-*` / `gap-*`.
- **Group** — the role the value plays in the system, not the thing it is painted on.
  - For example: `surface`, `content`, `line`, `primary`, `chart`.
- **Step or role** — either a numeric step on a ramp or a named role.
  - Numeric steps run `50` (lightest) to `900` (darkest) for palettes, and `1` to `5` for surfaces and shadows.
  - Named roles are the states and variants: `hover`, `active`, `strong`, `subtle`, `bg`, `disabled`, `inverse`, `on-primary`.

Two conventions follow from this and are worth stating outright. The numeric steps are **positions on a ramp, not brightness promises**: in dark mode the primary ramp is inverted, so `primary-700` is a near-white gray rather than a dark blue. And the semantic groups (`surface`, `content`, `line`) are what components should reach for; the raw palette ramps (`primary-*`, `accent-*`) exist to feed them.

## Tokens

Values are `oklch()` throughout. The **Utility** column shows the representative Tailwind class the token generates; most color tokens also generate `text-*` and `border-*` variants of the same name. The **Dark mode** column shows the override from the `[data-theme="dark"]` block, or _Inherits_ when the token is not overridden there.

### Colors (132)

#### Palette · Primary (10)

The brand ramp. **In dark mode this ramp is inverted and desaturated**: it becomes a neutral light-gray scale, so a `bg-primary` button renders near-white on the dark canvas. Do not assume a step keeps its hue across themes.

| Name                  | Description                                      | Utility          | Light mode             | Dark mode              |
| --------------------- | ------------------------------------------------ | ---------------- | ---------------------- | ---------------------- |
| `--color-primary-50`  | Lightest brand tint; feeds the selected-row wash | `bg-primary-50`  | `oklch(97% 0.012 262)` | `oklch(20% 0.005 260)` |
| `--color-primary-100` | Brand tint                                       | `bg-primary-100` | `oklch(94% 0.025 262)` | `oklch(26% 0.006 260)` |
| `--color-primary-200` | Brand tint                                       | `bg-primary-200` | `oklch(86% 0.06 262)`  | `oklch(34% 0.006 260)` |
| `--color-primary-300` | Brand mid-light                                  | `bg-primary-300` | `oklch(72% 0.10 262)`  | `oklch(50% 0.005 260)` |
| `--color-primary-400` | Brand mid                                        | `bg-primary-400` | `oklch(55% 0.14 262)`  | `oklch(66% 0.005 260)` |
| `--color-primary-500` | Brand base; source of `--color-line-focus`       | `bg-primary-500` | `oklch(40% 0.14 262)`  | `oklch(78% 0.004 260)` |
| `--color-primary-600` | Brand deep                                       | `bg-primary-600` | `oklch(32% 0.10 262)`  | `oklch(92% 0.004 260)` |
| `--color-primary-700` | Brand action color; backs `--color-primary`      | `bg-primary-700` | `oklch(24% 0.06 262)`  | `oklch(88% 0.004 260)` |
| `--color-primary-800` | Brand deepest                                    | `bg-primary-800` | `oklch(18% 0.04 262)`  | `oklch(82% 0.005 260)` |
| `--color-primary-900` | Brand near-black                                 | `bg-primary-900` | `oklch(12% 0.025 262)` | `oklch(74% 0.005 260)` |

#### Palette · Secondary (5)

| Name                    | Description                             | Utility              | Light mode             | Dark mode              |
| ----------------------- | --------------------------------------- | -------------------- | ---------------------- | ---------------------- |
| `--color-secondary-50`  | Secondary button surface                | `bg-secondary-50`    | `oklch(97% 0.005 250)` | `oklch(22% 0.008 250)` |
| `--color-secondary-100` | Secondary tint                          | `bg-secondary-100`   | `oklch(94% 0.008 250)` | `oklch(26% 0.010 250)` |
| `--color-secondary-500` | Secondary base                          | `bg-secondary-500`   | `oklch(56% 0.02 250)`  | `oklch(60% 0.012 250)` |
| `--color-secondary-700` | Secondary deep                          | `bg-secondary-700`   | `oklch(38% 0.018 250)` | `oklch(76% 0.012 250)` |
| `--color-secondary-900` | Secondary text on the secondary surface | `text-secondary-900` | `oklch(22% 0.012 250)` | `oklch(92% 0.005 250)` |

#### Palette · Accent (6)

| Name                 | Description                      | Utility           | Light mode            | Dark mode             |
| -------------------- | -------------------------------- | ----------------- | --------------------- | --------------------- |
| `--color-accent-50`  | Accent surface                   | `bg-accent-50`    | `oklch(97% 0.02 265)` | `oklch(22% 0.05 264)` |
| `--color-accent-100` | Accent tint                      | `bg-accent-100`   | `oklch(93% 0.05 265)` | `oklch(28% 0.08 264)` |
| `--color-accent-200` | Accent tint                      | `bg-accent-200`   | `oklch(86% 0.10 265)` | `oklch(36% 0.12 264)` |
| `--color-accent-500` | Accent base                      | `bg-accent-500`   | `oklch(58% 0.22 270)` | `oklch(70% 0.13 264)` |
| `--color-accent-600` | Accent deep                      | `bg-accent-600`   | `oklch(52% 0.24 272)` | `oklch(74% 0.12 264)` |
| `--color-accent-700` | Accent ink on the accent surface | `text-accent-700` | `oklch(46% 0.24 274)` | `oklch(82% 0.10 264)` |

#### Palette · Semantic (12)

Each status carries three steps: `50` is the surface, `500` is the base, and `700` is the readable ink on that surface.

| Name                  | Description                             | Utility            | Light mode             | Dark mode             |
| --------------------- | --------------------------------------- | ------------------ | ---------------------- | --------------------- |
| `--color-success-50`  | Success surface                         | `bg-success-50`    | `oklch(96% 0.03 152)`  | `oklch(24% 0.05 152)` |
| `--color-success-500` | Success base                            | `bg-success-500`   | `oklch(58% 0.14 152)`  | `oklch(68% 0.13 152)` |
| `--color-success-700` | Success ink                             | `text-success-700` | `oklch(46% 0.13 152)`  | `oklch(78% 0.11 152)` |
| `--color-warning-50`  | Warning surface                         | `bg-warning-50`    | `oklch(96.5% 0.04 80)` | `oklch(26% 0.06 70)`  |
| `--color-warning-500` | Warning base                            | `bg-warning-500`   | `oklch(70% 0.16 70)`   | `oklch(76% 0.13 70)`  |
| `--color-warning-700` | Warning ink                             | `text-warning-700` | `oklch(56% 0.15 60)`   | `oklch(84% 0.11 70)`  |
| `--color-error-50`    | Error surface                           | `bg-error-50`      | `oklch(96% 0.04 25)`   | `oklch(24% 0.07 25)`  |
| `--color-error-500`   | Error base; backs `--color-destructive` | `bg-error-500`     | `oklch(58% 0.20 25)`   | `oklch(68% 0.16 25)`  |
| `--color-error-700`   | Error ink                               | `text-error-700`   | `oklch(46% 0.19 25)`   | `oklch(78% 0.14 25)`  |
| `--color-info-50`     | Info surface                            | `bg-info-50`       | `oklch(96% 0.03 230)`  | `oklch(24% 0.05 235)` |
| `--color-info-500`    | Info base                               | `bg-info-500`      | `oklch(60% 0.14 230)`  | `oklch(70% 0.12 235)` |
| `--color-info-700`    | Info ink                                | `text-info-700`    | `oklch(48% 0.13 230)`  | `oklch(80% 0.10 235)` |

#### Palette · Category hues (6)

Decorative label hues for classifications that have no semantic meaning, such as contract kinds or pilot markers. Don't use them to signal status.

| Name                 | Description    | Utility           | Light mode            | Dark mode             |
| -------------------- | -------------- | ----------------- | --------------------- | --------------------- |
| `--color-teal-50`    | Teal surface   | `bg-teal-50`      | `oklch(95% 0.04 190)` | `oklch(24% 0.05 190)` |
| `--color-teal-500`   | Teal base      | `bg-teal-500`     | `oklch(60% 0.12 190)` | `oklch(70% 0.12 190)` |
| `--color-teal-700`   | Teal ink       | `text-teal-700`   | `oklch(46% 0.12 190)` | `oklch(80% 0.10 190)` |
| `--color-violet-50`  | Violet surface | `bg-violet-50`    | `oklch(95% 0.04 280)` | `oklch(24% 0.05 280)` |
| `--color-violet-500` | Violet base    | `bg-violet-500`   | `oklch(58% 0.14 280)` | `oklch(70% 0.12 280)` |
| `--color-violet-700` | Violet ink     | `text-violet-700` | `oklch(40% 0.16 280)` | `oklch(80% 0.10 280)` |

#### Semantic shortcuts (13)

Aliases so a component can write `bg-success` / `bg-success-bg` / `text-success-strong` instead of remembering which numeric step plays which role. These are `var()` aliases, so they follow the theme through the palette above.

| Name                     | Description                                                            | Utility               | Value                                                                               |
| ------------------------ | ---------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `--color-success`        | Success base                                                           | `bg-success`          | `var(--color-success-500)`                                                          |
| `--color-success-bg`     | Success surface                                                        | `bg-success-bg`       | `var(--color-success-50)`                                                           |
| `--color-success-strong` | Success ink                                                            | `text-success-strong` | `var(--color-success-700)`                                                          |
| `--color-warning`        | Warning base                                                           | `bg-warning`          | `var(--color-warning-500)`                                                          |
| `--color-warning-bg`     | Warning surface                                                        | `bg-warning-bg`       | `var(--color-warning-50)`                                                           |
| `--color-warning-strong` | Warning ink                                                            | `text-warning-strong` | `var(--color-warning-700)`                                                          |
| `--color-error`          | Error base                                                             | `bg-error`            | `var(--color-error-500)`                                                            |
| `--color-error-bg`       | Error surface                                                          | `bg-error-bg`         | `var(--color-error-50)`                                                             |
| `--color-error-strong`   | Error ink                                                              | `text-error-strong`   | `var(--color-error-700)`                                                            |
| `--color-error-active`   | Danger button pressed state; error ink nudged toward the content color | `bg-error-active`     | `color-mix(in oklch, var(--color-error-700) 82%, var(--color-content-primary) 18%)` |
| `--color-info`           | Info base                                                              | `bg-info`             | `var(--color-info-500)`                                                             |
| `--color-info-bg`        | Info surface                                                           | `bg-info-bg`          | `var(--color-info-50)`                                                              |
| `--color-info-strong`    | Info ink                                                               | `text-info-strong`    | `var(--color-info-700)`                                                             |

#### Surfaces (8)

The background ladder. Depth is how the page hierarchy is read, so pick by role, not by which one looks right.

| Name                      | Description                                                                                                                             | Utility              | Light mode                                                                        | Dark mode                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------- | --------------------------- |
| `--color-surface-1`       | Page canvas; backs `--color-background`                                                                                                 | `bg-surface-1`       | `oklch(99% 0.003 90)`                                                             | `oklch(14% 0.003 260)`      |
| `--color-surface-2`       | Raised surface: cards, popovers, modals                                                                                                 | `bg-surface-2`       | `oklch(100% 0 0)`                                                                 | `oklch(17% 0.004 260)`      |
| `--color-surface-3`       | Recessed surface: table headers, muted wells                                                                                            | `bg-surface-3`       | `oklch(97.2% 0.004 90)`                                                           | `oklch(11% 0.003 260)`      |
| `--color-surface-hover`   | Hover wash for interactive surfaces                                                                                                     | `bg-surface-hover`   | `oklch(95.8% 0.005 90)`                                                           | `oklch(22% 0.006 260)`      |
| `--color-surface-active`  | Pressed wash                                                                                                                            | `bg-surface-active`  | `oklch(93.5% 0.006 90)`                                                           | `oklch(26% 0.008 260)`      |
| `--color-surface-overlay` | Scrim behind modals and sheets                                                                                                          | `bg-surface-overlay` | `oklch(15% 0.01 270 / 0.45)`                                                      | `oklch(0% 0 0 / 0.55)`      |
| `--color-state-selected`  | Selected row or item wash                                                                                                               | `bg-state-selected`  | `color-mix(in oklch, var(--color-primary-50) 70%, var(--color-surface-2) 30%)`    | Inherits (follows its vars) |
| `--color-state-row-hover` | Row hover wash. Deliberately **weaker** than `surface-hover` so a ghost icon button inside the row can hover deeper than the row itself | `bg-state-row-hover` | `color-mix(in oklch, var(--color-surface-hover) 75%, var(--color-surface-2) 25%)` | Inherits (follows its vars) |

#### Content (6)

| Name                         | Description                                       | Utility                   | Light mode             | Dark mode              |
| ---------------------------- | ------------------------------------------------- | ------------------------- | ---------------------- | ---------------------- |
| `--color-content-primary`    | Body and heading text; backs `--color-foreground` | `text-content-primary`    | `oklch(18% 0.01 270)`  | `oklch(94% 0.003 260)` |
| `--color-content-secondary`  | Supporting text                                   | `text-content-secondary`  | `oklch(42% 0.008 270)` | `oklch(66% 0.005 260)` |
| `--color-content-tertiary`   | Meta text, hints, captions                        | `text-content-tertiary`   | `oklch(58% 0.006 270)` | `oklch(50% 0.005 260)` |
| `--color-content-disabled`   | Text in a disabled control                        | `text-content-disabled`   | `oklch(72% 0.005 270)` | `oklch(42% 0.008 260)` |
| `--color-content-inverse`    | Text on an inverted surface, such as a tooltip    | `text-content-inverse`    | `oklch(99% 0 0)`       | `oklch(18% 0.01 270)`  |
| `--color-content-on-primary` | Text on a filled primary surface                  | `text-content-on-primary` | `oklch(99% 0 0)`       | `oklch(15% 0.01 270)`  |

#### Lines (4)

| Name                   | Description                                                                       | Utility               | Light mode            | Dark mode              |
| ---------------------- | --------------------------------------------------------------------------------- | --------------------- | --------------------- | ---------------------- |
| `--color-line-subtle`  | Internal dividers: card slot borders, table row rules                             | `border-line-subtle`  | `oklch(93% 0.005 90)` | `oklch(20% 0.006 260)` |
| `--color-line-default` | Standard container and control border; backs `--color-border` and `--color-input` | `border-line-default` | `oklch(89% 0.005 90)` | `oklch(24% 0.008 260)` |
| `--color-line-strong`  | Hover and emphasis border                                                         | `border-line-strong`  | `oklch(80% 0.006 90)` | `oklch(32% 0.01 260)`  |
| `--color-line-focus`   | Focus ring color; backs `--color-ring`                                            | `border-line-focus`   | `oklch(40% 0.14 262)` | `oklch(70% 0.13 262)`  |

#### Avatar (2)

| Name                | Description             | Utility          | Light mode                       | Dark mode              |
| ------------------- | ----------------------- | ---------------- | -------------------------------- | ---------------------- |
| `--color-avatar-bg` | Avatar fallback surface | `bg-avatar-bg`   | `var(--color-surface-3)`         | `oklch(30% 0.006 260)` |
| `--color-avatar-fg` | Avatar initials         | `text-avatar-fg` | `var(--color-content-secondary)` | `oklch(84% 0.005 260)` |

#### Brand mono (3)

| Name                        | Description                       | Utility                  | Light mode             | Dark mode              |
| --------------------------- | --------------------------------- | ------------------------ | ---------------------- | ---------------------- |
| `--color-brand-mono`        | Monochrome brand mark             | `text-brand-mono`        | `oklch(22% 0.015 270)` | `oklch(86% 0.005 260)` |
| `--color-brand-mono-strong` | Monochrome brand mark, emphasized | `text-brand-mono-strong` | `oklch(14% 0.012 270)` | `oklch(96% 0.003 260)` |
| `--color-brand-mono-soft`   | Monochrome brand mark, muted      | `text-brand-mono-soft`   | `oklch(28% 0.02 270)`  | `oklch(70% 0.006 260)` |

#### Charts · Categorical (8)

An ordinal set. **Always start at `chart-1` and step in order**; the set is tuned for at least 3:1 distinguishability at 8px markers and 1.5px strokes, and picking out of order breaks that. These live in a `@theme static` block because the palette is referenced at runtime, which the class scanner cannot see.

| Name              | Description                     | Utility      | Light mode            | Dark mode             |
| ----------------- | ------------------------------- | ------------ | --------------------- | --------------------- |
| `--color-chart-1` | Series 1 — indigo, brand family | `bg-chart-1` | `oklch(58% 0.18 262)` | `oklch(66% 0.14 262)` |
| `--color-chart-2` | Series 2 — teal-green           | `bg-chart-2` | `oklch(64% 0.15 152)` | `oklch(68% 0.12 152)` |
| `--color-chart-3` | Series 3 — sky-blue             | `bg-chart-3` | `oklch(64% 0.15 230)` | `oklch(68% 0.12 230)` |
| `--color-chart-4` | Series 4 — amber                | `bg-chart-4` | `oklch(74% 0.15 70)`  | `oklch(74% 0.12 70)`  |
| `--color-chart-5` | Series 5 — magenta              | `bg-chart-5` | `oklch(64% 0.17 320)` | `oklch(68% 0.13 320)` |
| `--color-chart-6` | Series 6 — red                  | `bg-chart-6` | `oklch(62% 0.18 25)`  | `oklch(66% 0.14 25)`  |
| `--color-chart-7` | Series 7 — slate-blue           | `bg-chart-7` | `oklch(56% 0.10 200)` | `oklch(62% 0.09 200)` |
| `--color-chart-8` | Series 8 — violet               | `bg-chart-8` | `oklch(64% 0.13 290)` | `oklch(68% 0.11 290)` |

#### Charts · Sequential ramp (7)

For heatmaps and density. `100` is lightest, `700` is darkest. The dark-mode ramp runs the other way in lightness so the perceptual order survives the theme switch.

| Name                    | Description       | Utility            | Light mode            | Dark mode             |
| ----------------------- | ----------------- | ------------------ | --------------------- | --------------------- |
| `--color-chart-seq-100` | Sequential step 1 | `bg-chart-seq-100` | `oklch(95% 0.03 262)` | `oklch(30% 0.06 262)` |
| `--color-chart-seq-200` | Sequential step 2 | `bg-chart-seq-200` | `oklch(89% 0.06 262)` | `oklch(38% 0.09 262)` |
| `--color-chart-seq-300` | Sequential step 3 | `bg-chart-seq-300` | `oklch(82% 0.09 262)` | `oklch(46% 0.13 262)` |
| `--color-chart-seq-400` | Sequential step 4 | `bg-chart-seq-400` | `oklch(74% 0.12 262)` | `oklch(56% 0.16 262)` |
| `--color-chart-seq-500` | Sequential step 5 | `bg-chart-seq-500` | `oklch(66% 0.15 262)` | `oklch(66% 0.16 262)` |
| `--color-chart-seq-600` | Sequential step 6 | `bg-chart-seq-600` | `oklch(58% 0.17 262)` | `oklch(76% 0.13 262)` |
| `--color-chart-seq-700` | Sequential step 7 | `bg-chart-seq-700` | `oklch(50% 0.18 262)` | `oklch(86% 0.09 262)` |

#### Charts · Diverging ramp (3)

For variance against a target.

| Name                    | Description      | Utility            | Light mode             | Dark mode              |
| ----------------------- | ---------------- | ------------------ | ---------------------- | ---------------------- |
| `--color-chart-div-neg` | Negative end     | `bg-chart-div-neg` | `oklch(62% 0.15 25)`   | `oklch(70% 0.14 25)`   |
| `--color-chart-div-mid` | Neutral midpoint | `bg-chart-div-mid` | `oklch(80% 0.004 260)` | `oklch(46% 0.004 260)` |
| `--color-chart-div-pos` | Positive end     | `bg-chart-div-pos` | `oklch(58% 0.18 262)`  | `oklch(70% 0.16 262)`  |

#### Charts · Structural (8)

The chart frame. Four of these are `var()` aliases onto the line and content tokens, so they follow dark mode with no override.

| Name                        | Description                    | Utility                    | Light mode                                                            | Dark mode              |
| --------------------------- | ------------------------------ | -------------------------- | --------------------------------------------------------------------- | ---------------------- |
| `--color-chart-grid`        | Grid lines                     | `stroke-chart-grid`        | `var(--color-line-subtle)`                                            | Inherits               |
| `--color-chart-axis`        | Axis lines                     | `stroke-chart-axis`        | `var(--color-content-tertiary)`                                       | Inherits               |
| `--color-chart-label`       | Tick and legend labels         | `text-chart-label`         | `var(--color-content-tertiary)`                                       | Inherits               |
| `--color-chart-dim`         | Dimmed or de-emphasized series | `text-chart-dim`           | `color-mix(in oklch, var(--color-content-tertiary) 35%, transparent)` | Inherits               |
| `--color-chart-tooltip-bg`  | Tooltip surface                | `bg-chart-tooltip-bg`      | `oklch(18% 0.01 270)`                                                 | `oklch(26% 0.006 260)` |
| `--color-chart-tooltip-fg`  | Tooltip text                   | `text-chart-tooltip-fg`    | `oklch(99% 0 0)`                                                      | `oklch(94% 0.003 260)` |
| `--color-chart-zoom-fill`   | Zoom or brush selection fill   | `bg-chart-zoom-fill`       | `color-mix(in oklch, var(--color-primary-700) 8%, transparent)`       | Inherits               |
| `--color-chart-zoom-stroke` | Zoom or brush selection edge   | `stroke-chart-zoom-stroke` | `color-mix(in oklch, var(--color-primary-700) 60%, transparent)`      | Inherits               |

#### Categorical soft (13)

Pale tinted surfaces with readable same-hue ink, for per-label identity tiles picked by hashing the label text. These are **not** the chart palette: chart colors are saturated fills for data marks, these are pale surfaces meant to sit behind text.

| Name                                 | Description                   | Utility                      | Light mode                                    | Dark mode                                      |
| ------------------------------------ | ----------------------------- | ---------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `--color-cat-1` / `--color-cat-1-fg` | Blue tile surface / ink       | `bg-cat-1` / `text-cat-1-fg` | `oklch(96% 0.03 206)` / `oklch(38% 0.08 206)` | `oklch(30% 0.035 206)` / `oklch(80% 0.06 206)` |
| `--color-cat-2` / `--color-cat-2-fg` | Orange tile surface / ink     | `bg-cat-2` / `text-cat-2-fg` | `oklch(96% 0.03 32)` / `oklch(38% 0.08 32)`   | `oklch(30% 0.035 32)` / `oklch(80% 0.06 32)`   |
| `--color-cat-3` / `--color-cat-3-fg` | Green tile surface / ink      | `bg-cat-3` / `text-cat-3-fg` | `oklch(96% 0.03 125)` / `oklch(38% 0.08 125)` | `oklch(30% 0.035 125)` / `oklch(80% 0.06 125)` |
| `--color-cat-4` / `--color-cat-4-fg` | Azure tile surface / ink      | `bg-cat-4` / `text-cat-4-fg` | `oklch(96% 0.03 218)` / `oklch(38% 0.08 218)` | `oklch(30% 0.035 218)` / `oklch(80% 0.06 218)` |
| `--color-cat-5` / `--color-cat-5-fg` | Lime tile surface / ink       | `bg-cat-5` / `text-cat-5-fg` | `oklch(96% 0.03 84)` / `oklch(38% 0.08 84)`   | `oklch(30% 0.035 84)` / `oklch(80% 0.06 84)`   |
| `--color-cat-6` / `--color-cat-6-fg` | Red tile surface / ink        | `bg-cat-6` / `text-cat-6-fg` | `oklch(96% 0.03 0)` / `oklch(38% 0.08 0)`     | `oklch(30% 0.035 0)` / `oklch(80% 0.06 0)`     |
| `--color-cat-line`                   | Shared hairline for the tiles | `border-cat-line`            | `oklch(93% 0.005 90)`                         | `oklch(20% 0.004 260)`                         |

#### shadcn aliases (18)

The names shadcn components expect, pointed at the tokens above. They exist so vendored shadcn markup keeps working. **New code should use the semantic token, not the alias** — write `bg-surface-2`, not `bg-card`.

| Name                           | Description              | Utility                     | Value                             |
| ------------------------------ | ------------------------ | --------------------------- | --------------------------------- |
| `--color-background`           | Page background          | `bg-background`             | `var(--color-surface-1)`          |
| `--color-foreground`           | Body text                | `text-foreground`           | `var(--color-content-primary)`    |
| `--color-card`                 | Card surface             | `bg-card`                   | `var(--color-surface-2)`          |
| `--color-card-foreground`      | Card text                | `text-card-foreground`      | `var(--color-content-primary)`    |
| `--color-popover`              | Popover surface          | `bg-popover`                | `var(--color-surface-2)`          |
| `--color-popover-foreground`   | Popover text             | `text-popover-foreground`   | `var(--color-content-primary)`    |
| `--color-primary`              | Primary action fill      | `bg-primary`                | `var(--color-primary-700)`        |
| `--color-primary-foreground`   | Text on a primary fill   | `text-primary-foreground`   | `var(--color-content-on-primary)` |
| `--color-secondary`            | Secondary action fill    | `bg-secondary`              | `var(--color-secondary-50)`       |
| `--color-secondary-foreground` | Text on a secondary fill | `text-secondary-foreground` | `var(--color-secondary-900)`      |
| `--color-muted`                | Muted surface            | `bg-muted`                  | `var(--color-surface-3)`          |
| `--color-muted-foreground`     | Muted text               | `text-muted-foreground`     | `var(--color-content-tertiary)`   |
| `--color-accent`               | Accent surface           | `bg-accent`                 | `var(--color-accent-50)`          |
| `--color-accent-foreground`    | Accent text              | `text-accent-foreground`    | `var(--color-accent-700)`         |
| `--color-destructive`          | Destructive fill         | `bg-destructive`            | `var(--color-error-500)`          |
| `--color-border`               | Default border           | `border-border`             | `var(--color-line-default)`       |
| `--color-input`                | Input border             | `border-input`              | `var(--color-line-default)`       |
| `--color-ring`                 | Focus ring               | `ring-ring`                 | `var(--color-line-focus)`         |

### Typography (18)

#### Type scale (10)

Even-number steps only. There is no 11px and no 13px step.

| Name         | Description                                                                                                                                                                 | Utility    | Value  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| `--text-2xs` | Dense overline and sub-caption, one step below `xs` for meta rows                                                                                                           | `text-2xs` | `10px` |
| `--text-xs`  | Caption, hint, and helper text                                                                                                                                              | `text-xs`  | `12px` |
| `--text-sm`  | **Deprecated.** The 13px step was dropped, so `sm` now aliases `md`. Kept defined only so a stray reference resolves to 14px instead of breaking. Do not use it in new code | `text-sm`  | `14px` |
| `--text-md`  | Body text. The default for components                                                                                                                                       | `text-md`  | `14px` |
| `--text-lg`  | Emphasized body, small headings                                                                                                                                             | `text-lg`  | `16px` |
| `--text-xl`  | Section heading                                                                                                                                                             | `text-xl`  | `18px` |
| `--text-2xl` | Page heading                                                                                                                                                                | `text-2xl` | `24px` |
| `--text-3xl` | Display heading                                                                                                                                                             | `text-3xl` | `28px` |
| `--text-4xl` | Large display, KPI values                                                                                                                                                   | `text-4xl` | `36px` |
| `--text-5xl` | Largest display                                                                                                                                                             | `text-5xl` | `48px` |

#### Font families (8)

`--font-family-*` are the raw stacks; the short `--font-*` names are what generate the Tailwind utilities.

Two of them are **semantic faces**, and both resolve to the sans stack by default, so no component renders monospace out of the box. Repointing one of them at `--font-family-mono` brings a mono face back for that bucket alone. **Never write `font-mono` at a call site** — reach for `font-code` or `font-chart` instead. Digit alignment is a separate concern: use `tabular-nums`, not a font face.

| Name                  | Description                                                                              | Utility      | Value                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `--font-family-sans`  | Sans stack                                                                               | —            | `"Geist Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` |
| `--font-family-mono`  | Mono stack                                                                               | —            | `"Geist Mono Variable", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`              |
| `--font-family-code`  | Semantic face for identifiers, permission codes, log lines, keyboard keys, and OTP input | —            | `var(--font-family-sans)`                                                                         |
| `--font-family-chart` | Semantic face for chart ticks, legends, and tooltip readouts                             | —            | `var(--font-family-sans)`                                                                         |
| `--font-sans`         | Default document face                                                                    | `font-sans`  | `var(--font-family-sans)`                                                                         |
| `--font-mono`         | Mono face                                                                                | `font-mono`  | `var(--font-family-mono)`                                                                         |
| `--font-code`         | Code bucket face                                                                         | `font-code`  | `var(--font-family-code)`                                                                         |
| `--font-chart`        | Chart bucket face                                                                        | `font-chart` | `var(--font-family-chart)`                                                                        |

### Spacing and sizing (21)

#### Control sizing (8)

The control ladder. Heights and horizontal insets are tokens rather than raw Tailwind steps so that a button, an input, and a select trigger of the same size line up exactly.

| Name                   | Description                      | Utility        | Value  |
| ---------------------- | -------------------------------- | -------------- | ------ |
| `--spacing-control-xs` | Extra-small control height       | `h-control-xs` | `22px` |
| `--spacing-control-sm` | Small control height             | `h-control-sm` | `28px` |
| `--spacing-control-md` | Default control height           | `h-control-md` | `36px` |
| `--spacing-control-lg` | Large control height             | `h-control-lg` | `44px` |
| `--spacing-cx-sm`      | Small control horizontal inset   | `px-cx-sm`     | `10px` |
| `--spacing-cx-md`      | Default control horizontal inset | `px-cx-md`     | `14px` |
| `--spacing-cx-lg`      | Large control horizontal inset   | `px-cx-lg`     | `18px` |
| `--spacing-stat-card`  | Fixed height of a `StatCard`     | `h-stat-card`  | `92px` |

#### Raw spacing scale (12)

Declared on `:root` rather than in `@theme`, so these generate **no** Tailwind utilities. They exist for direct `var()` consumption in layout primitives. For everything else, use Tailwind's own spacing scale (`p-4`, `gap-2`), which runs on the default 4px step.

| Name         | Description | Utility | Value  |
| ------------ | ----------- | ------- | ------ |
| `--space-0`  | —           | None    | `0`    |
| `--space-1`  | —           | None    | `4px`  |
| `--space-2`  | —           | None    | `8px`  |
| `--space-3`  | —           | None    | `12px` |
| `--space-4`  | —           | None    | `16px` |
| `--space-5`  | —           | None    | `20px` |
| `--space-6`  | —           | None    | `24px` |
| `--space-8`  | —           | None    | `32px` |
| `--space-10` | —           | None    | `40px` |
| `--space-12` | —           | None    | `48px` |
| `--space-16` | —           | None    | `64px` |
| `--space-20` | —           | None    | `80px` |

#### Container (1)

| Name                  | Description                                 | Utility         | Value    |
| --------------------- | ------------------------------------------- | --------------- | -------- |
| `--container-content` | Content max-width, paired with 24px gutters | `max-w-content` | `1280px` |

### Borders (6)

The radius ladder is ordered by nesting depth: control 10 sits inside inner/icon 12, which sits inside card 16, which sits inside modal 20. Picking a radius means picking a level in that nesting, not picking a look.

| Name            | Description                               | Utility        | Value    |
| --------------- | ----------------------------------------- | -------------- | -------- |
| `--radius-sm`   | Tight radius: badges, chips, small insets | `rounded-sm`   | `4px`    |
| `--radius-md`   | Control radius: buttons, inputs, selects  | `rounded-md`   | `10px`   |
| `--radius-lg`   | Inner and icon radius; also the `sm` card | `rounded-lg`   | `12px`   |
| `--radius-xl`   | Card radius (default `md` card)           | `rounded-xl`   | `16px`   |
| `--radius-2xl`  | Modal radius; also the `lg` card          | `rounded-2xl`  | `20px`   |
| `--radius-full` | Pill and circle                           | `rounded-full` | `9999px` |

### Shadows (9)

Elevation is ordinal. In dark mode `shadow-1` is not a drop shadow at all but a 1px ring, because a dark canvas separates surfaces with a light edge rather than a cast shadow.

| Name                    | Description                                          | Utility               | Light mode                                                                                              | Dark mode                                                             |
| ----------------------- | ---------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `--shadow-1`            | Resting elevation: cards at rest                     | `shadow-1`            | `0 1px 0 oklch(0% 0 0 / 0.04)`                                                                          | `0 0 0 1px oklch(0% 0 0 / 0.5)`                                       |
| `--shadow-2`            | Low lift                                             | `shadow-2`            | `0 1px 2px oklch(0% 0 0 / 0.05), 0 1px 0 oklch(0% 0 0 / 0.02)`                                          | `0 1px 2px oklch(0% 0 0 / 0.6)`                                       |
| `--shadow-3`            | Hover lift, dropdowns                                | `shadow-3`            | `0 4px 12px oklch(0% 0 0 / 0.06), 0 1px 0 oklch(0% 0 0 / 0.03)`                                         | `0 4px 10px oklch(0% 0 0 / 0.6)`                                      |
| `--shadow-4`            | Popovers, floating panels                            | `shadow-4`            | `0 12px 24px oklch(0% 0 0 / 0.08), 0 2px 4px oklch(0% 0 0 / 0.04)`                                      | `0 8px 18px oklch(0% 0 0 / 0.7)`                                      |
| `--shadow-5`            | Modals, sheets                                       | `shadow-5`            | `0 24px 48px oklch(0% 0 0 / 0.12), 0 4px 8px oklch(0% 0 0 / 0.06)`                                      | `0 24px 48px oklch(0% 0 0 / 0.75)`                                    |
| `--shadow-cta`          | Inner highlight plus edge on a filled primary button | `shadow-cta`          | `inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 1px 2px oklch(0% 0 0 / 0.25), 0 0 0 0.5px oklch(0% 0 0 / 0.4)` | `inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 1px 2px oklch(0% 0 0 / 0.6)` |
| `--shadow-focus`        | Focus ring                                           | `shadow-focus`        | `0 0 0 3px oklch(40% 0.14 262 / 0.25)`                                                                  | `0 0 0 3px oklch(70% 0.13 264 / 0.40)`                                |
| `--shadow-row-selected` | Left bar on a selected table row                     | `shadow-row-selected` | `inset 2px 0 0 var(--color-primary-700)`                                                                | Inherits (follows its var)                                            |
| `--shadow-sticky-col`   | Edge on a sticky table column                        | `shadow-sticky-col`   | `1px 0 0 var(--color-line-subtle)`                                                                      | Inherits (follows its var)                                            |

### Motion (6)

Under `prefers-reduced-motion: reduce`, **all four durations are set to `0ms`** at `:root`. A component that reads these tokens gets reduced-motion support for free; one that hardcodes a duration does not.

| Name                 | Description                             | Utility            | Value                        |
| -------------------- | --------------------------------------- | ------------------ | ---------------------------- |
| `--duration-instant` | State flips with no perceived travel    | `duration-instant` | `80ms`                       |
| `--duration-fast`    | Hover and press feedback                | `duration-fast`    | `120ms`                      |
| `--duration-normal`  | Default transition: open, close, expand | `duration-normal`  | `200ms`                      |
| `--duration-slow`    | Large surfaces: sheets, drawers         | `duration-slow`    | `320ms`                      |
| `--ease-standard`    | Default easing                          | `ease-standard`    | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-emphasized`  | Entrances that should feel decisive     | `ease-emphasized`  | `cubic-bezier(0.3, 0, 0, 1)` |

### Other (14)

#### Z-index (8)

Declared with `@utility` rather than `@theme`, because Tailwind's `--z-*` namespace only generates numeric utilities. Layering is a system-level decision: use the named utility, never a raw `z-[1050]`.

| Name         | Description                       | Utility      | Value  |
| ------------ | --------------------------------- | ------------ | ------ |
| `z-dropdown` | Dropdown menus                    | `z-dropdown` | `1000` |
| `z-sticky`   | Sticky headers and bars           | `z-sticky`   | `1020` |
| `z-overlay`  | Modal and sheet scrims            | `z-overlay`  | `1040` |
| `z-modal`    | Modals                            | `z-modal`    | `1050` |
| `z-popover`  | Popovers                          | `z-popover`  | `1060` |
| `z-tooltip`  | Tooltips                          | `z-tooltip`  | `1070` |
| `z-toast`    | Toasts                            | `z-toast`    | `1080` |
| `z-cmdk`     | Command palette, above everything | `z-cmdk`     | `1090` |

#### Breakpoints (6)

| Name               | Description          | Utility | Value    |
| ------------------ | -------------------- | ------- | -------- |
| `--breakpoint-xs`  | Extra-small viewport | `xs:`   | `480px`  |
| `--breakpoint-sm`  | Small viewport       | `sm:`   | `640px`  |
| `--breakpoint-md`  | Medium viewport      | `md:`   | `768px`  |
| `--breakpoint-lg`  | Large viewport       | `lg:`   | `1024px` |
| `--breakpoint-xl`  | Extra-large viewport | `xl:`   | `1280px` |
| `--breakpoint-2xl` | Widest viewport      | `2xl:`  | `1536px` |

#### Helper utilities

Not tokens, but declared alongside them because they exist to stop callers from hand-writing banned arbitrary values.

| Utility             | Description                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grid-auto-fit-kv`  | Container-driven auto-fit grid for key-value grids. Columns follow the container's width, not the viewport breakpoint. Includes the `min(22rem, 100%)` that keeps a column from overflowing a phone-width container |
| `tracking-overline` | `0.06em` letter-spacing for overline text                                                                                                                                                                           |

## Usage guidelines

### Tip 1: Use the components first

The components in `@cloud/ui` already consume these tokens correctly. If a component gives you the result you need, you should not be touching tokens at all. Reach for tokens when you are composing something the components do not cover, not to restyle something they already do.

### Tip 2: Pick by role, not by appearance

Choose the token whose name matches what the value _means_ in the interface, not the one that happens to look right in the theme you are currently viewing. `text-content-tertiary` because it is meta text, not because it is the shade of gray you wanted. This is what makes the dark theme come out right without a second pass, and it is why the primary ramp inverting in dark mode does not break anything that used it by role.

### Tip 3: The key matters more than the value

The value behind a token is allowed to change; that is the point of the abstraction. Consuming the key (`bg-surface-2`) keeps you correct across a value change. Copying the value (`bg-[oklch(100%_0_0)]`) freezes a decision that was never yours to freeze, and lint bans it.

### Tip 4: A missing token is a conversation, not a commit

The `@theme` block is the only source of design decisions in the system. Adding a variable to it, or changing the value of an existing one, is a system-level change with no local blast radius you can reason about. If you cannot find a token for what you need, find the closest existing one; if there genuinely isn't one, stop and raise it. See the [`@cloud/ui` README](../README.md).

## Development guidelines

### Tailwind utilities

The normal way to consume a token is the generated utility class. The namespace determines the family:

```tsx
<div className="bg-surface-2 text-content-primary border border-line-default rounded-xl shadow-1">
  <span className="text-xs text-content-tertiary">Updated 2 hours ago</span>
</div>
```

### CSS variables

Every token is also a CSS custom property on `:root`, so it can be read directly where a utility does not fit — inline styles driven by data, canvas and chart rendering, or a computed color:

```tsx
<span style={{ color: `var(--color-chart-${seriesIndex + 1})` }} />
```

The raw `--space-*` scale is variable-only by design and has no utilities. Everything else has both.

### Dark mode

Theme switching is a `data-theme` attribute on the root element, driven by `ThemeProvider` / `useTheme` from `@cloud/ui`. Because the dark block only overrides values, a component that consumed tokens by role needs no dark-mode branch of its own:

```tsx
// No dark: variants needed — the tokens already switched.
<div className="bg-surface-2 text-content-primary" />
```

Write a `dark:` variant only when the dark theme needs a genuinely different _decision_, not a different value.

### What lint blocks

The arbitrary-value escape hatches are banned, and this is enforced, not left to discipline: no `bg-[#0f172a]`, no `text-[13px]`, no `rounded-[7px]`, no `shadow-[0_4px_12px_rgba(0,0,0,0.06)]`, no `style={{ color: '#111' }}`. Conventional one-off utilities such as `border`, `border-0`, and `size-px` are not affected.
