# Components (81)

Components are built with React and implement the design tokens and patterns of `@cloud/ui`. They are grouped into primitives (single-purpose building blocks), recipes (composed, opinionated assemblies), layout (the page shell), and the list-filter family (the quick bar and advanced filter sheet). All of them import from `@cloud/ui`.

Headings use the exported name, so the heading is what you type in the import. The package also exports hooks (`useTheme`, `useIsMobile`, `useSidebar`, `useListFilters`, `useInfiniteScroll`, `useCarousel`), the `cn` class merger, and the `ThemeProvider` / `SidebarProvider` / `TooltipProvider` context providers, which are not listed here.

### Accordion

Collapsible content sections. Each item expands and collapses to show or hide its content on trigger click.

[View Documentation]()

### ActionFooter

Full-bleed action band pinned to the bottom of the scroll root, for the primary and secondary actions of a page.

[View Documentation]()

### AdvancedFilterButton

Trigger for the advanced filter sheet, with rest, active-count, and applied states.

[View Documentation]()

### AdvancedFilterSheet

Right-side sheet holding the advanced filter form, with grouped fields and apply and reset actions.

[View Documentation]()

### Alert

Highlighted message box for status feedback, with an optional action button in the top-right corner.

[View Documentation]()

### AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance, so the user must choose an action.

[View Documentation]()

### AppHeader

Top application bar, with slots for breadcrumbs, actions, and the account menu.

[View Documentation]()

### AppliedFilters

Row of applied-filter chips. Renders only when at least one filter is applied.

[View Documentation]()

### AspectRatio

Constrains child content to a fixed width-to-height ratio, such as a video thumbnail.

[View Documentation]()

### Avatar

Circular profile image with a fallback to initials. `AvatarGroup` stacks several of them into an overlapping row.

[View Documentation]()

### Badge

Chip for status, counts, and labels. Color is driven entirely by `tone`.

[View Documentation]()

### Breadcrumb

Horizontal navigation trail showing where the current page sits in the hierarchy.

[View Documentation]()

### Breadcrumbs

Prebuilt breadcrumb trail for the `AppHeader` breadcrumbs slot. Takes an items array instead of composed children.

[View Documentation]()

### Button

Allows users to initiate actions in the user interface.

[View Documentation]()

### Calendar

Interactive month view for selecting a single date or a range.

[View Documentation]()

### Card

Groups related content and actions on a single bordered surface.

[View Documentation]()

### Carousel

Horizontally scrollable slide container, with previous and next controls and optional dot indicators.

[View Documentation]()

### Checkbox

Binary form control for independent options. Supports an indeterminate state.

[View Documentation]()

### Collapsible

Headless show and hide behavior. Callers own all of the visual styling.

[View Documentation]()

### Combobox

Searchable single-select dropdown. Options are filtered by their label text.

[View Documentation]()

### Command

Keyboard-driven command palette with fuzzy search over its items.

[View Documentation]()

### ContentHeader

Page-level title section placed below the `AppHeader`, with an optional description and an action slot.

[View Documentation]()

### ContextMenu

Right-click contextual action menu. Wrap any element to attach the menu to it.

[View Documentation]()

### DatePicker

Single-date picker. The trigger is a button styled to look like an `Input`.

[View Documentation]()

### DateRangePicker

Start-and-end date picker with built-in relative presets, such as the last 7 days.

[View Documentation]()

### DateTimePicker

Single date and time picker in one control.

[View Documentation]()

### Drawer

Bottom-sheet style panel. Use it for mobile-friendly side panels and overlays.

[View Documentation]()

### DropdownMenu

Triggered menu with grouped actions, checkbox and radio items, sub-menus, and keyboard navigation.

[View Documentation]()

### Dropzone

Presentation-only file-select area that emits the picked files. It does not upload them. `FileList` and `FileRow` render the selection.

[View Documentation]()

### Empty

Empty-state placeholder with a dashed border. Use it inside tables, lists, and panels when there is no data.

[View Documentation]()

### Field

Form field wrapper that stacks the label, the control, and the hint or error message.

[View Documentation]()

### FilterChip

Single applied-filter chip with a remove control.

[View Documentation]()

### HoverCard

Rich popover that opens on hover. Use it for preview cards and detail popovers.

[View Documentation]()

### Input

Single-line text input, with validation tones beyond the invalid state.

[View Documentation]()

### InputGroup

Composite input container with one unified border. Focus, invalid, and disabled states are managed at the group level.

[View Documentation]()

### InputOTP

Segmented one-time-password and verification-code input.

[View Documentation]()

### KvGrid

Read-only key-value grid for detail and overview pages. `KeyValue` renders one pair.

[View Documentation]()

### Label

Accessible form field label. Link it to a control with `htmlFor` to enable click-to-focus.

[View Documentation]()

### Layout

Full-page shell: a fixed-height viewport with an optional sidebar and a sticky header.

[View Documentation]()

### ListConditionBand

Condition band above a list, holding the quick-filter toolbar and the applied-filter row.

[View Documentation]()

### ListSummaryBar

Fixed-height summary bar above a list, showing the result count and bulk actions. Its height must match the table's sticky header offset.

[View Documentation]()

### LoadMore

Append-on-click pagination footer, with an optional summary line and a load-more button.

[View Documentation]()

### LogConsole

Structured log viewer with a level filter, a text filter, and a download action.

[View Documentation]()

### Menubar

Horizontal menu bar with nested dropdowns. Use it for desktop application-style menus.

[View Documentation]()

### Modal

Centered dialog with a close affordance, in four widths.

[View Documentation]()

### NavigationMenu

Top-level site navigation with flyout panels. Use it for primary site header navigation.

[View Documentation]()

### ObjectTile

Square, filled entity tile. Use it as the identity mark for a company, an app, or an object.

[View Documentation]()

### PageBody

Scrollable body region of a page, carrying the standard content padding.

[View Documentation]()

### PageHeader

Full-bleed page-header band for list and create pages.

[View Documentation]()

### PageHeaderBand

Full-bleed page-header band for detail pages, with a tabs slot that renders flush on the band's bottom edge.

[View Documentation]()

### Pagination

Page-number navigation controls for paginated lists and tables.

[View Documentation]()

### Popover

Floating panel anchored to a trigger, with header, title, and description slots. `MenuItem` renders an action row inside it.

[View Documentation]()

### Progress

Determinate progress bar with a label and value slot. Omitting `tone` yields the default brand color.

[View Documentation]()

### RadioGroup

Mutually exclusive option group. Prefer `ToggleRadioGroup` for labeled radio fields.

[View Documentation]()

### Resizable

Draggable split-pane layout. Panels are separated by a draggable handle.

[View Documentation]()

### RichPagination

Pagination with a page-size selector and a total-count summary alongside the page controls.

[View Documentation]()

### ScrollArea

Overflow container with custom-styled scrollbars that match the design system.

[View Documentation]()

### SearchInput

Quick-bar search field of fixed width, for the list condition band.

[View Documentation]()

### Select

Dropdown select with a trigger button, grouped items, labels, and separators.

[View Documentation]()

### Separator

Horizontal or vertical divider line, with optional centered label text.

[View Documentation]()

### Sheet

Side panel that slides in from an edge. It can be anchored to any of the four sides.

[View Documentation]()

### Sidebar

Collapsible application navigation rail, with sections, nav items, sub-items, a brand slot, and a footer. `SidebarTrigger` collapses and expands it.

[View Documentation]()

### Skeleton

Animated pulsing placeholder that mimics the shape of content while it loads.

[View Documentation]()

### Slider

Draggable track and thumb for selecting a numeric value or range.

[View Documentation]()

### Spinner

Circular loading indicator with `role="status"`, in four sizes.

[View Documentation]()

### StatCard

Single KPI card showing a value, a label, and an optional trend. `StatGrid` lays several of them out in a row.

[View Documentation]()

### StatusCard

Header-less card of content and footer, for repeating status lists. Supports a stretched-link interactive state.

[View Documentation]()

### StepIndicator

Horizontal progress indicator for a multi-step flow. Each step shows its number, its icon, or a check once complete.

[View Documentation]()

### Stepper

Numeric input with plus and minus buttons, clamped to a minimum and maximum.

[View Documentation]()

### Switch

Binary toggle switch. Prefer `ToggleSwitch` for fields that need an inline label.

[View Documentation]()

### Table

Data table with columns, sorting, row keys, density presets, and a sticky header.

[View Documentation]()

### Tabs

Tab bar and panels, in an underline variant and a pill variant.

[View Documentation]()

### Textarea

Multi-line text input, with an optional character counter when `maxLength` is set.

[View Documentation]()

### ThemeToggle

Icon button that switches between the light and dark themes.

[View Documentation]()

### Timeline

Vertical event log for device history, audit trails, and ticket activity.

[View Documentation]()

### Toaster

Toast notification container. Place it once in the root layout, then call `toast()` anywhere to show a notification.

[View Documentation]()

### Toggle

Press-toggle button with an on and off state. Use it standalone or inside a `ToggleGroup`.

[View Documentation]()

### ToggleGroup

Row of toggle buttons behaving as a single-select or multi-select control.

[View Documentation]()

### Toggles

Labeled form variants of the selection controls: `ToggleCheckbox`, `ToggleRadioGroup`, `ToggleRadio`, and `ToggleSwitch`. Prefer these over the bare primitives in form rows.

[View Documentation]()

### Tooltip

Short text hint shown on hover or focus.

[View Documentation]()

### VirtualTable

Windowed data table that shares the column, sort, and row-key contract with `Table`. Use it for very long lists.

[View Documentation]()
