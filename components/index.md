# Components (93)

Components are built with React and implement the design tokens and patterns of `@cloud/ui`. They are grouped into primitives (single-purpose building blocks), recipes (composed, opinionated assemblies), layout (the page shell), the list-filter family (the quick bar and advanced filter sheet), and charts. All of them import from `@cloud/ui` — **except the `Chart*` family, which lives only at `@cloud/ui/components/chart`** and is deliberately kept out of the root barrel, because Recharts' `Tooltip` / `Legend` would collide with the ones exported there.

Headings use the exported name, so the heading is what you type in the import. The package also exports hooks (`useTheme`, `useIsMobile`, `useSidebar`, `useInfiniteScroll`, `useCarousel`), the `cn` class merger, and the `ThemeProvider` / `SidebarProvider` / `TooltipProvider` context providers, which are not listed here. The one hook that *is* listed is `useListFilters`: the list-filter family is built on its state machine, so it carries a contract of its own.

### Accordion

Collapsible content sections. Each item expands and collapses to show or hide its content on trigger click.

[View Documentation](./accordion.md)

### ActionFooter

Full-bleed action band pinned to the bottom of the scroll root, for the primary and secondary actions of a page.

[View Documentation](./action-footer.md)

### AdvancedFilterButton

Trigger for the advanced filter sheet, with rest, active-count, and applied states.

[View Documentation](./advanced-filter-button.md)

### AdvancedFilterSheet

Right-side sheet holding the advanced filter form, with grouped fields and Reset / Apply & Search actions. `AdvancedFilterField` is not a `Field`, so give every `Select` inside it `w-full`.

[View Documentation](./advanced-filter-sheet.md)

### Alert

Highlighted message box for status feedback, with an optional action button in the top-right corner.

[View Documentation](./alert.md)

### AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance and ignores outside clicks, so the user has to choose an action.

[View Documentation](./alert-dialog.md)

### AppHeader

Top application bar, with slots for breadcrumbs, actions, and the account menu.

[View Documentation](./app-header.md)

### AppliedFilters

Row of applied-filter chips. Renders only when at least one filter is applied.

[View Documentation](./applied-filters.md)

### AspectRatio

Constrains child content to a fixed width-to-height ratio, such as a video thumbnail.

[View Documentation](./aspect-ratio.md)

### Avatar

Circular profile image with a fallback to initials. `AvatarGroup` stacks several of them into an overlapping row.

[View Documentation](./avatar.md)

### Badge

Chip for status, counts, and labels. Color is driven entirely by `tone`.

[View Documentation](./badge.md)

### Breadcrumb

Horizontal navigation trail showing where the current page sits in the hierarchy.

[View Documentation](./breadcrumb.md)

### Breadcrumbs

Prebuilt breadcrumb trail for the `AppHeader` breadcrumbs slot. Takes an items array instead of composed children.

[View Documentation](./breadcrumbs.md)

### Button

Allows users to initiate actions in the user interface.

[View Documentation](./button.md)

### Calendar

Interactive month view for selecting a single date or a range.

[View Documentation](./calendar.md)

### Card

Groups related content and actions on a single bordered surface.

[View Documentation](./card.md)

### CardStrip

Horizontal strip of selectable entity cards — pick a store, an account, a project. Past `toolbarThreshold` items it grows a toolbar and hoists the add button out of the row.

[View Documentation](./card-strip.md)

### Carousel

Horizontally scrollable slide container, with previous and next controls and optional dot indicators.

[View Documentation](./carousel.md)

### ChartBar

Themed bars, with the stacked-corner problem already solved. Only the topmost visible segment of a stack gets rounded free ends.

[View Documentation](./chart-bar.md)

### ChartContainer

The wrapper every chart needs — config, responsive sizing, semantic series colors, and the shared chart context. Nothing in a chart works outside it.

[View Documentation](./chart.md)

### ChartLegend

Themed series key, optionally clickable to toggle series. Use `ChartLegend` + `ChartLegendContent`, never Recharts' `Legend`.

[View Documentation](./chart-legend.md)

### ChartPieCalloutLabel

Labels and connector lines outside a pie or donut, for slices too thin to label inline.

[View Documentation](./chart-pie-callout.md)

### ChartSkeleton

`ChartSkeleton` while the data loads, `ChartEmpty` when there is none. A chart with no data is not an empty page.

[View Documentation](./chart-states.md)

### ChartSparkline

A trend with no chart chrome — no axes, grid, or legend. For a `StatCard`, a table cell, or a list row.

[View Documentation](./chart-sparkline.md)

### ChartTooltip

The themed hover readout. Use `ChartTooltip` + `ChartTooltipContent`, never Recharts' `Tooltip` — it is unthemed and collides with `@cloud/ui`'s own `Tooltip`.

[View Documentation](./chart-tooltip.md)

### Checkbox

Binary form control for independent options. Supports an indeterminate state.

[View Documentation](./checkbox.md)

### Collapsible

Headless show and hide behavior. Callers own all of the visual styling.

[View Documentation](./collapsible.md)

### Combobox

Searchable dropdown, single **or multi-select**. Options are filtered by their label text; `multiple` makes `value` a `string[]` and renders the picks as removable chips. This — not `Select` — is the multi-select control.

[View Documentation](./combobox.md)

### Command

Keyboard-driven command palette with fuzzy search over its items.

[View Documentation](./command.md)

### ContentHeader

The header family's shared title block (title, description, flush-right actions), composed inside `PageHeader` / `PageHeaderBand`. Never a page header on its own.

[View Documentation](./content-header.md)

### ContextMenu

Right-click contextual action menu. Wrap any element to attach the menu to it.

[View Documentation](./context-menu.md)

### DatePicker

Single-date picker. The trigger is a button styled to look like an `Input`.

[View Documentation](./date-picker.md)

### DateRangePicker

Start-and-end date picker with built-in relative presets, such as the last 7 days.

[View Documentation](./date-range-picker.md)

### DateTimePicker

Single date and time picker in one control.

[View Documentation](./date-time-picker.md)

### Drawer

Bottom-sheet style panel. Use it for mobile-friendly side panels and overlays.

[View Documentation](./drawer.md)

### DropdownMenu

Triggered menu with grouped actions, checkbox and radio items, sub-menus, and keyboard navigation.

[View Documentation](./dropdown-menu.md)

### Dropzone

Presentation-only file-select area that emits the picked files. It does not upload them. `FileList` and `FileRow` render the selection.

[View Documentation](./dropzone.md)

### Empty

Empty-state placeholder with a dashed border. Use it inside tables, lists, and panels when there is no data.

[View Documentation](./empty.md)

### Field

Form field wrapper that stacks the label, the control, and the hint or error message.

[View Documentation](./field.md)

### FilterChip

Single applied-filter chip with a remove control.

[View Documentation](./filter-chip.md)

### HoverCard

Rich popover that opens on hover. Use it for preview cards and detail popovers.

[View Documentation](./hover-card.md)

### Input

Single-line text input, with validation tones beyond the invalid state.

[View Documentation](./input.md)

### InputGroup

Composite input container with one unified border. Focus, invalid, and disabled are owned by the group and key off the control slot, so use `InputGroupInput` / `InputGroupTextarea`, never a bare `Input`.

[View Documentation](./input-group.md)

### InputOTP

Segmented one-time-password and verification-code input.

[View Documentation](./input-otp.md)

### KvGrid

Read-only key-value grid for detail and overview pages. `KeyValue` renders one pair.

[View Documentation](./key-value.md)

### Label

Accessible form field label. Link it to a control with `htmlFor` to enable click-to-focus.

[View Documentation](./label.md)

### Layout

Full-page shell: a fixed-height viewport with an optional sidebar and a sticky header.

[View Documentation](./layout.md)

### ListConditionBand

Condition band above a list, holding the quick-filter toolbar and the applied-filter row. Drive it with `useListFilters` — the toolbar writes the draft, and only the Search button or Enter applies it.

[View Documentation](./list-condition-band.md)

### ListSummaryBar

Fixed-height summary bar above a list, showing the result count and bulk actions. Its height must match the table's sticky header offset.

[View Documentation](./list-summary-bar.md)

### LoadMore

Append-on-click pagination footer, with an optional summary line and a load-more button. Not the default footer — `RichPagination` is; reach for this only for feeds, unknown totals, or cursor-only backends.

[View Documentation](./load-more.md)

### LogConsole

Structured log viewer with a level filter, a text filter, and a download action.

[View Documentation](./log-console.md)

### Menubar

Horizontal menu bar with nested dropdowns. Use it for desktop application-style menus.

[View Documentation](./menubar.md)

### Modal

Centered dialog with a close affordance, in four widths (sm/md/lg/xl) plus fullscreen.

[View Documentation](./modal.md)

### NavigationMenu

Top-level site navigation with flyout panels. The root positions the panel for you — don't compose a second positioner.

[View Documentation](./navigation-menu.md)

### ObjectTile

Square, filled entity tile. `tone="auto"` content-hashes a categorical color — seed it from a stable id so the same entity keeps the same tile on its list row and its detail header.

[View Documentation](./object-tile.md)

### PageBody

Scrollable body region of a page, carrying the standard content padding.

[View Documentation](./page-body.md)

### PageHeader

Full-bleed header band for level-1 list and index pages: title, description, and `HeaderAction[]` actions. No back button — every other page uses `PageHeaderBand`.

[View Documentation](./page-header.md)

### PageHeaderBand

Full-bleed header band for every level-2/3 page, with a built-in back button. `variant="page"` for create and edit pages; the sticky `variant="detail"` identity band adds an avatar, a meta row, and tabs flush on the band's bottom edge.

[View Documentation](./page-header-band.md)

### Pagination

Page-number navigation controls for paginated lists and tables.

[View Documentation](./pagination.md)

### Popover

Floating panel anchored to a trigger, with header, title, and description slots. `MenuItem` renders an action row inside it.

[View Documentation](./popover.md)

### Progress

Determinate progress bar with a label and value slot. Omitting `tone` yields the default brand color.

[View Documentation](./progress.md)

### RadioGroup

Mutually exclusive option group. Prefer `ToggleRadioGroup` for labeled radio fields.

[View Documentation](./radio-group.md)

### ResizablePanelGroup

Draggable split-pane layout — compose `ResizablePanelGroup` + `ResizablePanel` + `ResizableHandle`. **There is no bare `Resizable` export.**

[View Documentation](./resizable.md)

### RichPagination

The default footer for a result region: page-size selector, "showing X–Y of Z" summary, and the page controls in one bar.

[View Documentation](./rich-pagination.md)

### ScrollArea

Overflow container with custom-styled scrollbars that match the design system.

[View Documentation](./scroll-area.md)

### SearchInput

Quick-bar search field for the list condition band. Takes only `value`, `onChange`, `onSearch`, and `placeholder`; typing writes the draft, Enter applies it.

[View Documentation](./search-input.md)

### Select

Single-choice dropdown. Pass `items` (value → label) to the root or the trigger prints the raw value; `SelectTrigger` is `w-fit`, so give it a width outside a `Field`.

[View Documentation](./select.md)

### Separator

Horizontal or vertical divider line. Passing `label` switches to a centered-text divider that ignores `orientation`, `className`, and every other prop.

[View Documentation](./separator.md)

### Sheet

Side panel that slides in from an edge. It can be anchored to any of the four sides.

[View Documentation](./sheet.md)

### Sidebar

Collapsible application navigation rail, with sections, nav items, sub-items, a brand slot, and a footer. `SidebarTrigger` collapses and expands it.

[View Documentation](./sidebar.md)

### SidebarTrigger

Icon button that collapses and expands the sidebar. Also bound to the global `[` shortcut.

[View Documentation](./sidebar-trigger.md)

### Skeleton

Animated pulsing placeholder that mimics the shape of content while it loads.

[View Documentation](./skeleton.md)

### Slider

Draggable track and thumb for selecting a numeric value or range. Pass `value` / `defaultValue` as an array — one element per thumb.

[View Documentation](./slider.md)

### Spinner

Circular loading indicator with `role="status"`, in four sizes.

[View Documentation](./spinner.md)

### StatCard

Single KPI card showing a value, a label, and an optional trend. `StatGrid` lays several of them out in a row.

[View Documentation](./stat-card.md)

### StatusCard

Header-less card of content and footer, for repeating status lists. Supports a stretched-link interactive state.

[View Documentation](./status-card.md)

### StepIndicator

Horizontal progress indicator for a multi-step flow. Each step shows its number, its icon, or a check once complete.

[View Documentation](./step-indicator.md)

### Stepper

Numeric input with plus and minus buttons, clamped to a minimum and maximum.

[View Documentation](./stepper.md)

### Switch

Binary toggle switch. Prefer `ToggleSwitch` for fields that need an inline label.

[View Documentation](./switch.md)

### Table

Data table with columns, sorting, row keys, density presets, and a sticky header. `onRowClick` makes the whole row navigable and auto-appends a passive trailing chevron; `rowActions` puts inline verbs in that same tail cell.

[View Documentation](./table.md)

### Tabs

Tab bar and panels, in an underline variant and a pill variant.

[View Documentation](./tabs.md)

### Textarea

Multi-line text input, with an optional character counter when `maxLength` is set.

[View Documentation](./textarea.md)

### ThemeToggle

Icon button that switches between the light and dark themes.

[View Documentation](./theme-toggle.md)

### Timeline

Vertical event log for device history, audit trails, and ticket activity.

[View Documentation](./timeline.md)

### TimePicker

Time-only field for a cutoff or opening hours. Its value is an `"HH:mm"` string, not a `Date`.

[View Documentation](./time-picker.md)

### Toaster

Toast notification container. Place it once in the root layout, then call `toast()` anywhere to show a notification.

[View Documentation](./toaster.md)

### Toggle

Press-toggle button with an on and off state. Use it standalone or inside a `ToggleGroup`.

[View Documentation](./toggle.md)

### ToggleGroup

Row of toggle buttons behaving as a single-select or multi-select control.

[View Documentation](./toggle-group.md)

### Toggles

Inline-labelled variants of the selection controls: `ToggleCheckbox`, `ToggleRadioGroup`, `ToggleRadio`, and `ToggleSwitch`. Use them for a **standalone setting**; a control inside a form takes `Field` + the bare primitive, and the two must not be nested.

[View Documentation](./toggles.md)

### Tone

The status vocabulary shared by every status-bearing component: `neutral`, `success`, `warning`, `error`, `info`. Read it before inventing a status color.

[View Documentation](./semantic-tone.md)

### Tooltip

Short text hint shown on hover or focus.

[View Documentation](./tooltip.md)

### useListFilters

The draft/applied state machine every list page's filters run on. `setDraft` is `(key, value)`; the list queries `applied`, never `draft`; `reset` rolls back the draft alone, while `clearAll` clears draft **and** applied.

[View Documentation](./use-list-filters.md)

### VirtualTable

Windowed data table that shares the column, sort, and row-key contract with `Table`. Use it for very long lists.

[View Documentation](./virtual-table.md)
