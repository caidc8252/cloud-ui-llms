# Responsive layout

`@cloud/ui` uses shared viewport breakpoints, CSS responsive utilities, and component-width adaptation to keep layouts usable across viewports and containers. The canonical breakpoints and grid utility are in the [global stylesheet source](../../src/components/styles/index.css); behavior-only mobile detection is in the [mobile hook source](../../src/lib/use-is-mobile.ts).

## Overview

Keep responsive rendering in CSS. Use the shared breakpoint variants when the viewport should change composition, and use `@container` when a component must respond to its own available width. `useIsMobile` is SSR-safe behavior state for viewports below `768px`, not a rendering switch.

## Reference

| Tool                     | Current behavior                                                                                                            | Use when                                                                                                  | Avoid                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `xs:` breakpoint         | Starts at `480px`.                                                                                                          | A shared viewport composition change belongs at the extra-small threshold.                                | A page-local `480px` media query.                                            |
| `sm:` breakpoint         | Starts at `640px`.                                                                                                          | A shared viewport composition change belongs at the small threshold.                                      | Rendering a mobile and desktop tree from JavaScript.                         |
| `md:` breakpoint         | Starts at `768px`.                                                                                                          | A shared viewport composition change belongs at the medium threshold.                                     | Treating it as a behavior-only mobile hook.                                  |
| `lg:` breakpoint         | Starts at `1024px`.                                                                                                         | A shared viewport composition change belongs at the large threshold.                                      | An arbitrary wide-screen threshold.                                          |
| `xl:` breakpoint         | Starts at `1280px`.                                                                                                         | A shared viewport composition change belongs at the extra-large threshold.                                | A page-local `1280px` media query.                                           |
| `2xl:` breakpoint        | Starts at `1536px`.                                                                                                         | A shared viewport composition change belongs at the two-extra-large threshold.                            | An arbitrary large-display threshold.                                        |
| CSS responsive utilities | Tailwind variants such as `hidden md:flex` change rendering through CSS at the shared breakpoints.                          | Showing, hiding, stacking, or reflowing interface content by viewport width.                              | Using `useIsMobile` to select the rendered tree.                             |
| `grid-auto-fit-kv`       | `display: grid` with `repeat(auto-fit, minmax(min(22rem, 100%), 1fr))`. Each column has a `22rem` minimum capped at `100%`. | Key-value grids that should add or remove columns as their container width changes.                       | Recreating the auto-fit grid with a hand-written arbitrary grid value.       |
| `@container`             | A component can establish a size-query context and adapt to its own width.                                                  | A reusable component can appear in a narrow card, split pane, or wide page independent of viewport width. | Using viewport breakpoints when the container width is the real constraint.  |
| `max-w-content`          | Applies the shared `1280px` content maximum.                                                                                | A main content region needs the shared width bound.                                                       | An arbitrary page-local maximum width.                                       |
| `useIsMobile`            | Uses `(max-width: 767px)`, so it is true below `768px`. It returns `false` before mount, then follows `matchMedia` changes. | Behavior decisions, such as what an already-rendered trigger does.                                        | Responsive rendering, because the pre-mount `false` value can cause a flash. |

## Usage guidance

Use CSS variants for all responsive rendering. For example, `hidden md:flex` keeps both structures in the markup while CSS selects the appropriate one at the `md` breakpoint. This avoids a client-side render switch and matches the hook's intentional initial `false` value.

Use `grid-auto-fit-kv` for key-value layouts whose columns should follow the available container width. Use `@container` inside reusable components when the viewport does not describe their available space. Constrain main application content with `max-w-content` rather than a one-off maximum width.

Use `useIsMobile` only after accepting its SSR-safe lifecycle: it returns `false` before mount, then reports whether the viewport is below `768px`. It is appropriate for behavior decisions, not for choosing whether mobile or desktop markup exists.

## Examples

Use CSS for responsive rendering and the shared content width:

```tsx
export function AccountActions() {
  return (
    <section className="max-w-content">
      <div className="flex md:hidden">Compact actions</div>
      <div className="hidden md:flex">Full actions</div>
    </section>
  );
}
```

Use the named auto-fit grid for a container-responsive key-value layout:

```tsx
export function AccountFacts() {
  return (
    <dl className="grid-auto-fit-kv gap-4 gap-y-5">
      <div>
        <dt className="text-xs text-content-secondary">Account ID</dt>
        <dd className="text-md text-content-primary">ACC-1042</dd>
      </div>
      <div>
        <dt className="text-xs text-content-secondary">Status</dt>
        <dd className="text-md text-content-primary">Active</dd>
      </div>
    </dl>
  );
}
```

## Do and do not

| Do                                                                             | Do not                                                                            |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Use shared breakpoint utilities for viewport-driven composition.               | Create a separate JavaScript-rendered mobile and desktop tree.                    |
| Use `@container` or `grid-auto-fit-kv` when a component follows its own width. | Tie a reusable component to a viewport breakpoint when its container is narrower. |
| Use `useIsMobile` below `768px` for behavior only.                             | Use its pre-mount `false` value to decide responsive rendering.                   |

## Related foundations

- [Spacing and sizing](./spacing-and-sizing.md) covers the same content maximum and breakpoint values in the broader size scale.
- [Design tokens](./design-tokens.md) explains how breakpoint and container tokens become utilities.
- [Motion](./motion.md) covers reduced-motion adaptation for responsive interface changes.
- [Global styles](../get-started/global-styles.md) explains how applications load the shared responsive utilities.
