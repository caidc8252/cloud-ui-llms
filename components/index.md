# Components (81)

Components are built with React and implement the design tokens and patterns of `@cloud/ui`. They are grouped into primitives (single-purpose building blocks), recipes (composed, opinionated assemblies), layout (the page shell), and the list-filter family (the quick bar and advanced filter sheet). All of them import from `@cloud/ui`.

Headings use the exported name, so the heading is what you type in the import. The package also exports hooks (`useTheme`, `useIsMobile`, `useSidebar`, `useListFilters`, `useInfiniteScroll`, `useCarousel`), the `cn` class merger, and the `ThemeProvider` / `SidebarProvider` / `TooltipProvider` context providers, which are not listed here.

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

Right-side sheet holding the advanced filter form, with grouped fields and apply and reset actions.

[View Documentation](./advanced-filter-sheet.md)

### Alert

Highlighted message box for status feedback, with an optional action button in the top-right corner.

[View Documentation](./alert.md)

### AlertDialog

Centered, forced-action dialog. Unlike `Modal` it has no close affordance, so the user must choose an action.

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

### Carousel

Horizontally scrollable slide container, with previous and next controls and optional dot indicators.

[View Documentation](./carousel.md)

### Checkbox

Binary form control for independent options. Supports an indeterminate state.

[View Documentation](./checkbox.md)

### Collapsible

Headless show and hide behavior. Callers own all of the visual styling.

[View Documentation](./collapsible.md)

### Combobox

Searchable single-select dropdown. Options are filtered by their label text.

[View Documentation](./combobox.md)

### Command

Keyboard-driven command palette with fuzzy search over its items.

[View Documentation](./command.md)

### ContentHeader

Page-level title section placed below the `AppHeader`, with an optional description and an action slot.

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

Composite input container with one unified border. Focus, invalid, and disabled states are managed at the group level.

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

Condition band above a list, holding the quick-filter toolbar and the applied-filter row.

[View Documentation](./list-condition-band.md)

### ListSummaryBar

Fixed-height summary bar above a list, showing the result count and bulk actions. Its height must match the table's sticky header offset.

[View Documentation](./list-summary-bar.md)

### LoadMore

Append-on-click pagination footer, with an optional summary line and a load-more button.

[View Documentation](./load-more.md)

### LogConsole

Structured log viewer with a level filter, a text filter, and a download action.

[View Documentation](./log-console.md)

### Menubar

Horizontal menu bar with nested dropdowns. Use it for desktop application-style menus.

[View Documentation](./menubar.md)

### Modal

Centered dialog with a close affordance, in four widths.

[View Documentation](./modal.md)

### NavigationMenu

Top-level site navigation with flyout panels. Use it for primary site header navigation.

[View Documentation](./navigation-menu.md)

### ObjectTile

Square, filled entity tile. Use it as the identity mark for a company, an app, or an object.

[View Documentation](./object-tile.md)

### PageBody

Scrollable body region of a page, carrying the standard content padding.

[View Documentation](./page-body.md)

### PageHeader

Full-bleed page-header band for list and create pages.

[View Documentation](./page-header.md)

### PageHeaderBand

Full-bleed page-header band for detail pages, with a tabs slot that renders flush on the band's bottom edge.

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

### Resizable

Draggable split-pane layout. Panels are separated by a draggable handle.

[View Documentation](./resizable.md)

### RichPagination

Pagination with a page-size selector and a total-count summary alongside the page controls.

[View Documentation](./rich-pagination.md)

### ScrollArea

Overflow container with custom-styled scrollbars that match the design system.

[View Documentation](./scroll-area.md)

### SearchInput

Quick-bar search field of fixed width, for the list condition band.

[View Documentation](./search-input.md)

### Select

Dropdown select with a trigger button, grouped items, labels, and separators.

[View Documentation](./select.md)

### Separator

Horizontal or vertical divider line, with optional centered label text.

[View Documentation](./separator.md)

### Sheet

Side panel that slides in from an edge. It can be anchored to any of the four sides.

[View Documentation](./sheet.md)

### Sidebar

Collapsible application navigation rail, with sections, nav items, sub-items, a brand slot, and a footer. `SidebarTrigger` collapses and expands it.

[View Documentation](./sidebar.md)

### Skeleton

Animated pulsing placeholder that mimics the shape of content while it loads.

[View Documentation](./skeleton.md)

### Slider

Draggable track and thumb for selecting a numeric value or range.

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

Data table with columns, sorting, row keys, density presets, and a sticky header.

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

Labeled form variants of the selection controls: `ToggleCheckbox`, `ToggleRadioGroup`, `ToggleRadio`, and `ToggleSwitch`. Prefer these over the bare primitives in form rows.

[View Documentation](./toggles.md)

### Tooltip

Short text hint shown on hover or focus.

[View Documentation](./tooltip.md)

### VirtualTable

Windowed data table that shares the column, sort, and row-key contract with `Table`. Use it for very long lists.

[View Documentation](./virtual-table.md)
