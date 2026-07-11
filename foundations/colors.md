# Colors

Colors establish visual hierarchy, identify interaction, communicate status, and distinguish data. The @cloud/ui palette is defined as semantic design tokens so the same component markup remains meaningful in light and dark themes.

## Visual mode compliance

Use semantic utilities or public component props in application code. Light values are the default. A root with `.dark` or `[data-theme="dark"]` activates the dark values.

The tables list the resolved value for every color token currently declared by @cloud/ui. Alias tokens are resolved to their underlying mode-specific value. Derived `color-mix()` tokens remain expressions, with their referenced token values expanded for each mode.

The canonical source is [index.css](../../cloud-scaffold.worktrees/develop/packages/ui/src/components/styles/index.css). These values are reference data, not an invitation to copy OKLCH literals into business UI.

## System color palette

### Primary palette

| Token                 | Light value            | Dark value             | Description                                                          |
| --------------------- | ---------------------- | ---------------------- | -------------------------------------------------------------------- |
| `--color-primary-50`  | `oklch(97% 0.012 262)` | `oklch(20% 0.005 260)` | Lightest primary tint for selected and low-emphasis surfaces.        |
| `--color-primary-100` | `oklch(94% 0.025 262)` | `oklch(26% 0.006 260)` | Soft primary tint for subtle supporting emphasis.                    |
| `--color-primary-200` | `oklch(86% 0.06 262)`  | `oklch(34% 0.006 260)` | Subtle primary step for component-owned fills or boundaries.         |
| `--color-primary-300` | `oklch(72% 0.10 262)`  | `oklch(50% 0.005 260)` | Low-to-medium primary emphasis within component states.              |
| `--color-primary-400` | `oklch(55% 0.14 262)`  | `oklch(66% 0.005 260)` | Medium primary step used by component interaction states.            |
| `--color-primary-500` | `oklch(40% 0.14 262)`  | `oklch(78% 0.004 260)` | Core primary palette value for strong brand emphasis.                |
| `--color-primary-600` | `oklch(32% 0.10 262)`  | `oklch(92% 0.004 260)` | Strong primary step for emphasized interaction states.               |
| `--color-primary-700` | `oklch(24% 0.06 262)`  | `oklch(88% 0.004 260)` | Default primary action and brand value exposed by the primary alias. |
| `--color-primary-800` | `oklch(18% 0.04 262)`  | `oklch(82% 0.005 260)` | Deeper primary step for pressed or high-emphasis states.             |
| `--color-primary-900` | `oklch(12% 0.025 262)` | `oklch(74% 0.005 260)` | Deepest primary palette step for component-owned contrast.           |

### Secondary palette

| Token                   | Light value            | Dark value             | Description                                                            |
| ----------------------- | ---------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `--color-secondary-50`  | `oklch(97% 0.005 250)` | `oklch(22% 0.008 250)` | Lightest neutral-secondary tint used by the secondary component alias. |
| `--color-secondary-100` | `oklch(94% 0.008 250)` | `oklch(26% 0.010 250)` | Soft neutral-secondary tint for subtle component surfaces.             |
| `--color-secondary-500` | `oklch(56% 0.02 250)`  | `oklch(60% 0.012 250)` | Middle neutral-secondary step for balanced emphasis.                   |
| `--color-secondary-700` | `oklch(38% 0.018 250)` | `oklch(76% 0.012 250)` | Strong neutral-secondary step for supporting foregrounds.              |
| `--color-secondary-900` | `oklch(22% 0.012 250)` | `oklch(92% 0.005 250)` | Deepest neutral-secondary step used by the secondary foreground alias. |

### Accent palette

| Token                | Light value           | Dark value            | Description                                                |
| -------------------- | --------------------- | --------------------- | ---------------------------------------------------------- |
| `--color-accent-50`  | `oklch(97% 0.02 265)` | `oklch(22% 0.05 264)` | Lightest accent tint used by the accent component alias.   |
| `--color-accent-100` | `oklch(93% 0.05 265)` | `oklch(28% 0.08 264)` | Soft accent tint for low-emphasis AI or chart treatment.   |
| `--color-accent-200` | `oklch(86% 0.10 265)` | `oklch(36% 0.12 264)` | Stronger accent tint for component-owned visual treatment. |
| `--color-accent-500` | `oklch(58% 0.22 270)` | `oklch(70% 0.13 264)` | Core accent hue reserved for charts and AI affordances.    |
| `--color-accent-600` | `oklch(52% 0.24 272)` | `oklch(74% 0.12 264)` | Strong accent hue for component-owned emphasis.            |
| `--color-accent-700` | `oklch(46% 0.24 274)` | `oklch(82% 0.10 264)` | High-contrast accent foreground used by the accent alias.  |

### Status palettes

| Token                 | Light value            | Dark value            | Description                                                      |
| --------------------- | ---------------------- | --------------------- | ---------------------------------------------------------------- |
| `--color-success-50`  | `oklch(96% 0.03 152)`  | `oklch(24% 0.05 152)` | Success palette background tint for status and severity.         |
| `--color-success-500` | `oklch(58% 0.14 152)`  | `oklch(68% 0.13 152)` | Success palette base indicator for status and severity.          |
| `--color-success-700` | `oklch(46% 0.13 152)`  | `oklch(78% 0.11 152)` | Success palette strong foreground for status and severity.       |
| `--color-warning-50`  | `oklch(96.5% 0.04 80)` | `oklch(26% 0.06 70)`  | Warning palette background tint for status and severity.         |
| `--color-warning-500` | `oklch(70% 0.16 70)`   | `oklch(76% 0.13 70)`  | Warning palette base indicator for status and severity.          |
| `--color-warning-700` | `oklch(56% 0.15 60)`   | `oklch(84% 0.11 70)`  | Warning palette strong foreground for status and severity.       |
| `--color-error-50`    | `oklch(96% 0.04 25)`   | `oklch(24% 0.07 25)`  | Error palette background tint for status and severity.           |
| `--color-error-500`   | `oklch(58% 0.20 25)`   | `oklch(68% 0.16 25)`  | Error palette base indicator for status and severity.            |
| `--color-error-700`   | `oklch(46% 0.19 25)`   | `oklch(78% 0.14 25)`  | Error palette strong foreground for status and severity.         |
| `--color-info-50`     | `oklch(96% 0.03 230)`  | `oklch(24% 0.05 235)` | Informational palette background tint for status and severity.   |
| `--color-info-500`    | `oklch(60% 0.14 230)`  | `oklch(70% 0.12 235)` | Informational palette base indicator for status and severity.    |
| `--color-info-700`    | `oklch(48% 0.13 230)`  | `oklch(80% 0.10 235)` | Informational palette strong foreground for status and severity. |

### Decorative category hues

| Token                | Light value           | Dark value            | Description                                                       |
| -------------------- | --------------------- | --------------------- | ----------------------------------------------------------------- |
| `--color-teal-50`    | `oklch(95% 0.04 190)` | `oklch(24% 0.05 190)` | Teal decorative category soft background; not a status color.     |
| `--color-teal-500`   | `oklch(60% 0.12 190)` | `oklch(70% 0.12 190)` | Teal decorative category base hue; not a status color.            |
| `--color-teal-700`   | `oklch(46% 0.12 190)` | `oklch(80% 0.10 190)` | Teal decorative category strong foreground; not a status color.   |
| `--color-violet-50`  | `oklch(95% 0.04 280)` | `oklch(24% 0.05 280)` | Violet decorative category soft background; not a status color.   |
| `--color-violet-500` | `oklch(58% 0.14 280)` | `oklch(70% 0.12 280)` | Violet decorative category base hue; not a status color.          |
| `--color-violet-700` | `oklch(40% 0.16 280)` | `oklch(80% 0.10 280)` | Violet decorative category strong foreground; not a status color. |

### Semantic status aliases

| Token                    | Light value                                                            | Dark value                                                              | Description                                                        |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `--color-success`        | `oklch(58% 0.14 152)`                                                  | `oklch(68% 0.13 152)`                                                   | Base success indicator alias.                                      |
| `--color-success-bg`     | `oklch(96% 0.03 152)`                                                  | `oklch(24% 0.05 152)`                                                   | Success status background alias.                                   |
| `--color-success-strong` | `oklch(46% 0.13 152)`                                                  | `oklch(78% 0.11 152)`                                                   | Strong success text or icon alias.                                 |
| `--color-warning`        | `oklch(70% 0.16 70)`                                                   | `oklch(76% 0.13 70)`                                                    | Base warning indicator alias.                                      |
| `--color-warning-bg`     | `oklch(96.5% 0.04 80)`                                                 | `oklch(26% 0.06 70)`                                                    | Warning status background alias.                                   |
| `--color-warning-strong` | `oklch(56% 0.15 60)`                                                   | `oklch(84% 0.11 70)`                                                    | Strong warning text or icon alias.                                 |
| `--color-error`          | `oklch(58% 0.20 25)`                                                   | `oklch(68% 0.16 25)`                                                    | Base error indicator alias.                                        |
| `--color-error-bg`       | `oklch(96% 0.04 25)`                                                   | `oklch(24% 0.07 25)`                                                    | Error status background alias.                                     |
| `--color-error-strong`   | `oklch(46% 0.19 25)`                                                   | `oklch(78% 0.14 25)`                                                    | Strong error text or icon alias.                                   |
| `--color-error-active`   | `color-mix(in oklch, oklch(46% 0.19 25) 82%, oklch(18% 0.01 270) 18%)` | `color-mix(in oklch, oklch(78% 0.14 25) 82%, oklch(94% 0.003 260) 18%)` | Pressed danger-action color derived from error and content tokens. |
| `--color-info`           | `oklch(60% 0.14 230)`                                                  | `oklch(70% 0.12 235)`                                                   | Base informational indicator alias.                                |
| `--color-info-bg`        | `oklch(96% 0.03 230)`                                                  | `oklch(24% 0.05 235)`                                                   | Informational status background alias.                             |
| `--color-info-strong`    | `oklch(48% 0.13 230)`                                                  | `oklch(80% 0.10 235)`                                                   | Strong informational text or icon alias.                           |

### Surfaces and interaction states

| Token                     | Light value                                                           | Dark value                                                                | Description                                                               |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `--color-surface-1`       | `oklch(99% 0.003 90)`                                                 | `oklch(14% 0.003 260)`                                                    | Application canvas and page background.                                   |
| `--color-surface-2`       | `oklch(100% 0 0)`                                                     | `oklch(17% 0.004 260)`                                                    | Primary component surface for cards, popovers, and content blocks.        |
| `--color-surface-3`       | `oklch(97.2% 0.004 90)`                                               | `oklch(11% 0.003 260)`                                                    | Nested, muted, or recessed component surface.                             |
| `--color-surface-hover`   | `oklch(95.8% 0.005 90)`                                               | `oklch(22% 0.006 260)`                                                    | Component-owned hover surface for an interactive element.                 |
| `--color-surface-active`  | `oklch(93.5% 0.006 90)`                                               | `oklch(26% 0.008 260)`                                                    | Component-owned pressed or active interaction surface.                    |
| `--color-surface-overlay` | `oklch(15% 0.01 270 / 0.45)`                                          | `oklch(0% 0 0 / 0.55)`                                                    | Scrim behind modal and overlay content.                                   |
| `--color-state-selected`  | `color-mix(in oklch, oklch(97% 0.012 262) 70%, oklch(100% 0 0) 30%)`  | `color-mix(in oklch, oklch(20% 0.005 260) 70%, oklch(17% 0.004 260) 30%)` | Selected row or item surface derived from primary and component surfaces. |
| `--color-state-row-hover` | `color-mix(in oklch, oklch(95.8% 0.005 90) 75%, oklch(100% 0 0) 25%)` | `color-mix(in oklch, oklch(22% 0.006 260) 75%, oklch(17% 0.004 260) 25%)` | Low-emphasis row hover wash that remains weaker than nested action hover. |

### Content and avatar

| Token                        | Light value             | Dark value             | Description                                                       |
| ---------------------------- | ----------------------- | ---------------------- | ----------------------------------------------------------------- |
| `--color-content-primary`    | `oklch(18% 0.01 270)`   | `oklch(94% 0.003 260)` | Primary text and icon color for the highest content emphasis.     |
| `--color-content-secondary`  | `oklch(42% 0.008 270)`  | `oklch(66% 0.005 260)` | Supporting text and icon color.                                   |
| `--color-content-tertiary`   | `oklch(58% 0.006 270)`  | `oklch(50% 0.005 260)` | Low-emphasis metadata, labels, and chart annotation color.        |
| `--color-content-disabled`   | `oklch(72% 0.005 270)`  | `oklch(42% 0.008 260)` | Disabled text and icon color; do not substitute tertiary content. |
| `--color-content-inverse`    | `oklch(99% 0 0)`        | `oklch(18% 0.01 270)`  | Foreground placed on a dark or inverse surface.                   |
| `--color-content-on-primary` | `oklch(99% 0 0)`        | `oklch(15% 0.01 270)`  | Foreground placed on the primary action surface.                  |
| `--color-avatar-bg`          | `oklch(97.2% 0.004 90)` | `oklch(30% 0.006 260)` | Default avatar background.                                        |
| `--color-avatar-fg`          | `oklch(42% 0.008 270)`  | `oklch(84% 0.005 260)` | Default avatar foreground, initials, or fallback icon.            |

### Lines and monochrome brand

| Token                       | Light value            | Dark value             | Description                                                              |
| --------------------------- | ---------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `--color-line-subtle`       | `oklch(93% 0.005 90)`  | `oklch(20% 0.006 260)` | Low-emphasis separators and structural chart grid lines.                 |
| `--color-line-default`      | `oklch(89% 0.005 90)`  | `oklch(24% 0.008 260)` | Standard control and component boundary.                                 |
| `--color-line-strong`       | `oklch(80% 0.006 90)`  | `oklch(32% 0.01 260)`  | High-emphasis boundary where a component requires stronger separation.   |
| `--color-line-focus`        | `oklch(40% 0.14 262)`  | `oklch(70% 0.13 262)`  | Focus-visible border color; normally owned by the interactive primitive. |
| `--color-brand-mono`        | `oklch(22% 0.015 270)` | `oklch(86% 0.005 260)` | Default monochrome brand mark color.                                     |
| `--color-brand-mono-strong` | `oklch(14% 0.012 270)` | `oklch(96% 0.003 260)` | Highest-emphasis monochrome brand mark color.                            |
| `--color-brand-mono-soft`   | `oklch(28% 0.02 270)`  | `oklch(70% 0.006 260)` | Lower-emphasis monochrome brand mark color.                              |

### Categorical chart palette

| Token             | Light value           | Dark value            | Description                                                              |
| ----------------- | --------------------- | --------------------- | ------------------------------------------------------------------------ |
| `--color-chart-1` | `oklch(58% 0.18 262)` | `oklch(66% 0.14 262)` | Categorical chart series 1 (indigo); assign series in numeric order.     |
| `--color-chart-2` | `oklch(64% 0.15 152)` | `oklch(68% 0.12 152)` | Categorical chart series 2 (teal-green); assign series in numeric order. |
| `--color-chart-3` | `oklch(64% 0.15 230)` | `oklch(68% 0.12 230)` | Categorical chart series 3 (sky blue); assign series in numeric order.   |
| `--color-chart-4` | `oklch(74% 0.15 70)`  | `oklch(74% 0.12 70)`  | Categorical chart series 4 (amber); assign series in numeric order.      |
| `--color-chart-5` | `oklch(64% 0.17 320)` | `oklch(68% 0.13 320)` | Categorical chart series 5 (magenta); assign series in numeric order.    |
| `--color-chart-6` | `oklch(62% 0.18 25)`  | `oklch(66% 0.14 25)`  | Categorical chart series 6 (red); assign series in numeric order.        |
| `--color-chart-7` | `oklch(56% 0.10 200)` | `oklch(62% 0.09 200)` | Categorical chart series 7 (slate blue); assign series in numeric order. |
| `--color-chart-8` | `oklch(64% 0.13 290)` | `oklch(68% 0.11 290)` | Categorical chart series 8 (violet); assign series in numeric order.     |

### Sequential chart palette

| Token                   | Light value           | Dark value            | Description                                                     |
| ----------------------- | --------------------- | --------------------- | --------------------------------------------------------------- |
| `--color-chart-seq-100` | `oklch(95% 0.03 262)` | `oklch(30% 0.06 262)` | Sequential chart ramp step 100 for heatmaps and density values. |
| `--color-chart-seq-200` | `oklch(89% 0.06 262)` | `oklch(38% 0.09 262)` | Sequential chart ramp step 200 for heatmaps and density values. |
| `--color-chart-seq-300` | `oklch(82% 0.09 262)` | `oklch(46% 0.13 262)` | Sequential chart ramp step 300 for heatmaps and density values. |
| `--color-chart-seq-400` | `oklch(74% 0.12 262)` | `oklch(56% 0.16 262)` | Sequential chart ramp step 400 for heatmaps and density values. |
| `--color-chart-seq-500` | `oklch(66% 0.15 262)` | `oklch(66% 0.16 262)` | Sequential chart ramp step 500 for heatmaps and density values. |
| `--color-chart-seq-600` | `oklch(58% 0.17 262)` | `oklch(76% 0.13 262)` | Sequential chart ramp step 600 for heatmaps and density values. |
| `--color-chart-seq-700` | `oklch(50% 0.18 262)` | `oklch(86% 0.09 262)` | Sequential chart ramp step 700 for heatmaps and density values. |

### Diverging chart palette

| Token                   | Light value            | Dark value             | Description                                    |
| ----------------------- | ---------------------- | ---------------------- | ---------------------------------------------- |
| `--color-chart-div-neg` | `oklch(62% 0.15 25)`   | `oklch(70% 0.14 25)`   | Negative end of the diverging chart scale.     |
| `--color-chart-div-mid` | `oklch(80% 0.004 260)` | `oklch(46% 0.004 260)` | Neutral midpoint of the diverging chart scale. |
| `--color-chart-div-pos` | `oklch(58% 0.18 262)`  | `oklch(70% 0.16 262)`  | Positive end of the diverging chart scale.     |

### Chart structure

| Token                       | Light value                                                  | Dark value                                                   | Description                                           |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| `--color-chart-grid`        | `oklch(93% 0.005 90)`                                        | `oklch(20% 0.006 260)`                                       | Chart grid line mapped to the subtle line token.      |
| `--color-chart-axis`        | `oklch(58% 0.006 270)`                                       | `oklch(50% 0.005 260)`                                       | Chart axis text and marks mapped to tertiary content. |
| `--color-chart-label`       | `oklch(58% 0.006 270)`                                       | `oklch(50% 0.005 260)`                                       | Chart label color mapped to tertiary content.         |
| `--color-chart-dim`         | `color-mix(in oklch, oklch(58% 0.006 270) 35%, transparent)` | `color-mix(in oklch, oklch(50% 0.005 260) 35%, transparent)` | De-emphasized chart series color.                     |
| `--color-chart-tooltip-bg`  | `oklch(18% 0.01 270)`                                        | `oklch(26% 0.006 260)`                                       | Chart tooltip background.                             |
| `--color-chart-tooltip-fg`  | `oklch(99% 0 0)`                                             | `oklch(94% 0.003 260)`                                       | Chart tooltip foreground.                             |
| `--color-chart-zoom-fill`   | `color-mix(in oklch, oklch(24% 0.06 262) 8%, transparent)`   | `color-mix(in oklch, oklch(88% 0.004 260) 8%, transparent)`  | Translucent chart zoom-selection fill.                |
| `--color-chart-zoom-stroke` | `color-mix(in oklch, oklch(24% 0.06 262) 60%, transparent)`  | `color-mix(in oklch, oklch(88% 0.004 260) 60%, transparent)` | Chart zoom-selection boundary.                        |

### Category identity palette

| Token              | Light value           | Dark value             | Description                                                |
| ------------------ | --------------------- | ---------------------- | ---------------------------------------------------------- |
| `--color-cat-1`    | `oklch(96% 0.03 206)` | `oklch(30% 0.035 206)` | Blue category identity background selected by ColorTile.   |
| `--color-cat-1-fg` | `oklch(38% 0.08 206)` | `oklch(80% 0.06 206)`  | Blue category identity foreground paired with cat-1.       |
| `--color-cat-2`    | `oklch(96% 0.03 32)`  | `oklch(30% 0.035 32)`  | Orange category identity background selected by ColorTile. |
| `--color-cat-2-fg` | `oklch(38% 0.08 32)`  | `oklch(80% 0.06 32)`   | Orange category identity foreground paired with cat-2.     |
| `--color-cat-3`    | `oklch(96% 0.03 125)` | `oklch(30% 0.035 125)` | Green category identity background selected by ColorTile.  |
| `--color-cat-3-fg` | `oklch(38% 0.08 125)` | `oklch(80% 0.06 125)`  | Green category identity foreground paired with cat-3.      |
| `--color-cat-4`    | `oklch(96% 0.03 218)` | `oklch(30% 0.035 218)` | Azure category identity background selected by ColorTile.  |
| `--color-cat-4-fg` | `oklch(38% 0.08 218)` | `oklch(80% 0.06 218)`  | Azure category identity foreground paired with cat-4.      |
| `--color-cat-5`    | `oklch(96% 0.03 84)`  | `oklch(30% 0.035 84)`  | Lime category identity background selected by ColorTile.   |
| `--color-cat-5-fg` | `oklch(38% 0.08 84)`  | `oklch(80% 0.06 84)`   | Lime category identity foreground paired with cat-5.       |
| `--color-cat-6`    | `oklch(96% 0.03 0)`   | `oklch(30% 0.035 0)`   | Red category identity background selected by ColorTile.    |
| `--color-cat-6-fg` | `oklch(38% 0.08 0)`   | `oklch(80% 0.06 0)`    | Red category identity foreground paired with cat-6.        |
| `--color-cat-line` | `oklch(93% 0.005 90)` | `oklch(20% 0.004 260)` | Shared hairline for category identity tiles and labels.    |

### Component compatibility aliases

| Token                          | Light value             | Dark value             | Description                                                 |
| ------------------------------ | ----------------------- | ---------------------- | ----------------------------------------------------------- |
| `--color-background`           | `oklch(99% 0.003 90)`   | `oklch(14% 0.003 260)` | Compatibility alias for the application canvas.             |
| `--color-foreground`           | `oklch(18% 0.01 270)`   | `oklch(94% 0.003 260)` | Compatibility alias for default content.                    |
| `--color-card`                 | `oklch(100% 0 0)`       | `oklch(17% 0.004 260)` | Compatibility alias for a card surface.                     |
| `--color-card-foreground`      | `oklch(18% 0.01 270)`   | `oklch(94% 0.003 260)` | Compatibility alias for card content.                       |
| `--color-popover`              | `oklch(100% 0 0)`       | `oklch(17% 0.004 260)` | Compatibility alias for popover surfaces.                   |
| `--color-popover-foreground`   | `oklch(18% 0.01 270)`   | `oklch(94% 0.003 260)` | Compatibility alias for popover content.                    |
| `--color-primary`              | `oklch(24% 0.06 262)`   | `oklch(88% 0.004 260)` | Compatibility alias for the default primary action surface. |
| `--color-primary-foreground`   | `oklch(99% 0 0)`        | `oklch(15% 0.01 270)`  | Compatibility alias for content on the primary surface.     |
| `--color-secondary`            | `oklch(97% 0.005 250)`  | `oklch(22% 0.008 250)` | Compatibility alias for the secondary action surface.       |
| `--color-secondary-foreground` | `oklch(22% 0.012 250)`  | `oklch(92% 0.005 250)` | Compatibility alias for secondary action content.           |
| `--color-muted`                | `oklch(97.2% 0.004 90)` | `oklch(11% 0.003 260)` | Compatibility alias for a muted or nested surface.          |
| `--color-muted-foreground`     | `oklch(58% 0.006 270)`  | `oklch(50% 0.005 260)` | Compatibility alias for low-emphasis content.               |
| `--color-accent`               | `oklch(97% 0.02 265)`   | `oklch(22% 0.05 264)`  | Compatibility alias for the accent surface.                 |
| `--color-accent-foreground`    | `oklch(46% 0.24 274)`   | `oklch(82% 0.10 264)`  | Compatibility alias for accent content.                     |
| `--color-destructive`          | `oklch(58% 0.20 25)`    | `oklch(68% 0.16 25)`   | Compatibility alias for destructive action emphasis.        |
| `--color-border`               | `oklch(89% 0.005 90)`   | `oklch(24% 0.008 260)` | Compatibility alias for the default boundary.               |
| `--color-input`                | `oklch(89% 0.005 90)`   | `oklch(24% 0.008 260)` | Compatibility alias for the default input boundary.         |
| `--color-ring`                 | `oklch(40% 0.14 262)`   | `oklch(70% 0.13 262)`  | Compatibility alias for focus-visible color.                |

## Using color

### Build hierarchy with neutral colors

Most application UI should use surface, content, and line tokens. Use `surface-1` for the page canvas, `surface-2` for primary component surfaces, and `surface-3` for nested or muted regions. Pair them with the matching content hierarchy instead of lowering opacity or choosing a palette step by appearance.

### Highlight actions and interaction

Primary color calls attention to the screen's main action and component-owned interactive states. Keep hover, active, selected, and focus colors attached to their state selectors. Selected styling must remain distinct from hover and must override hover where both can apply.

Accent colors are reserved for chart and AI affordances. They are not a second primary color for ordinary business screens.

### Encode status and associations

Use success, warning, error, and info only for actual status or severity. Pair a status color with text, an icon, or another explicit cue. A category, contract kind, or ordinary metadata value should remain neutral unless a component deliberately assigns stable category identity.

### Identify categories

The `cat-*` background and foreground pairs belong to component-owned identity treatments such as ColorTile. Keep each foreground paired with its matching background and use `cat-line` for the shared boundary. Decorative teal and violet hues are also category colors, not status colors.

### Visualize data

Use `chart-1` through `chart-8` in numeric order for categorical series. Use the sequential ramp for ordered magnitude and the diverging ramp for negative-to-positive comparisons. Chart colors do not belong in normal application chrome.

Scoped semantic CSS-variable references are allowed when a documented chart or component API requires them. Prefer the component contract over duplicating a resolved OKLCH value.

## Accessibility

Color must not be the only way information is communicated. Add text, an icon, a label, or a component state so the meaning remains available when color cannot be perceived.

Maintain sufficient contrast between foregrounds and their intended backgrounds. Preserve component-owned focus-visible treatment, including `border-line-focus` and `shadow-focus` where the primitive provides them. Do not use tertiary content in place of the dedicated disabled color.

## Implementation

Consume token names through generated utilities such as `bg-surface-2`, `text-content-primary`, and `border-line-default`, or through public component props such as `tone` and `variant`.

Do not introduce raw hex or OKLCH values, arbitrary color utilities, or page-local color variables in business application code. Direct semantic variable references are limited to documented APIs that require scoped CSS values, including chart composition.

## Related foundations

- [Design tokens](./design-tokens.md) explains how token definitions become utilities.
- [Theming](./theming.md) explains how applications activate light and dark values.
- [Accessibility](./accessibility.md) covers labels, focus, and non-color feedback.
