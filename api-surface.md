# API surface

What is importable, and from which entry point. **Names and types only** — for what a component does and when to use it, open its doc.

[Components index](components/index.md) | [Design tokens](foundations/design-tokens.md)

## Entry points

| Import from | What lives there |
| --- | --- |
| `@cloud/ui` | The default. Every UI primitive and recipe, the layout shell, the list-filter family, the hooks, the theme, and `cn`. |
| `@cloud/ui/components/ui` | The primitives and recipes alone. Same components as the root barrel — reach for it only when you want to be explicit. |
| `@cloud/ui/components/layout` | The application shell and page-layout components. Also re-exported from the root. |
| `@cloud/ui/components/chart` | **Charts, and only here.** |
| `@cloud/ui/components/list-filter` | The list filtering family — but **import it from the root barrel**. See below. |

### Import the list-filter family from the root

`ListConditionBand`, `SearchInput`, `AdvancedFilterButton` / `Sheet` / `Group` / `Field`, `AppliedFilters`, `FilterChip`, `ListSummaryBar` and the `useListFilters` hook are all re-exported from `@cloud/ui`, and that is the import you want:

```tsx
import { ListConditionBand, SearchInput, AppliedFilters, useListFilters } from "@cloud/ui"
```

The `@cloud/ui/components/list-filter` subpath names a real directory in the source tree, but whether it *resolves* depends on the consuming app's alias or exports map — apps commonly alias only `@cloud/ui`, `/components/layout` and `/components/chart`, and a deep import then fails to resolve (or, worse, prefix-matches into something meaningless). The root barrel always works.

### Charts are a deliberate exception

Charts are **not** in the root barrel, and you must never `import ... from "recharts"`.

Recharts exports its own `Tooltip` and `Legend`, which would collide with `@cloud/ui`'s `Tooltip`. So `@cloud/ui/components/chart` re-exports the Recharts composition primitives you need — `BarChart`, `Bar`, `XAxis`, `Pie`, `ResponsiveContainer`, and the rest — under their own names, and exposes the themed replacements as `ChartTooltip` and `ChartLegend`. Compose a whole chart out of that one subpath. See [Chart container](components/chart.md).

## Stylesheets, in this order

```ts
import "@cloud/ui/component-defaults.css";  // first
import "@cloud/ui/globals.css";             // second
```

`component-defaults.css` carries shared component-level defaults and must load **before** `globals.css`, which brings Tailwind, the fonts, the semantic tokens, dark mode, and the base styles. Reversing them means the defaults win over the tokens.

## Hooks, theme, and utilities

These have no component doc — they are the whole of their own API.

| Export | Use it to |
| --- | --- |
| `cn` | merge conditional Tailwind classes without conflicting utilities |
| `ThemeProvider`, `useTheme`, `Theme` | activate and read the light/dark theme. See [Theming](foundations/theming.md). |
| `SidebarProvider`, `useSidebar`, `SidebarContextValue` | coordinate expanded / collapsed / mobile navigation state |
| `SIDEBAR_COOKIE` | the persisted sidebar-state key, when server and client must agree on it |
| `useIsMobile` | respond to the mobile breakpoint in **behaviour**, where CSS alone cannot. Prefer CSS for layout. |
| `useInfiniteScroll`, `UseInfiniteScrollOptions`, `UseInfiniteScrollResult` | load incremental results from an observed sentinel — on a list that is **not** a table. For a table, use `VirtualTable`'s `onReachEnd`. |
| `useListFilters`, `ListFilters`, `UseListFiltersOptions` | manage separate **draft** and **applied** filter state, which is what makes deferred apply work. See [Advanced filtering](patterns/advanced-filtering.md). |

## Localization

The components ship their own default strings in **`en`**, **`zh-CN`**, and **`ja`** — the pager's "showing X–Y of Z", the empty states, the clear-filters action, and so on. They are consumed through `@cloud/i18n`; you do not import them by hand.

**Never hardcode a user-facing string** in a component you build on top of these. Add the key to the `en` base first. See [i18n](foundations/theming.md) for how the locale reaches the tree.

## `@cloud/ui/components/ui` — 243 values, 54 types

`Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`, `Alert`, `AlertAction`, `AlertDescription`, `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`, `AlertTitle`, `AspectRatio`, `Avatar`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `Badge`, `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`, `Button`, `Calendar`, `CalendarDayButton`, `Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardStrip`, `CardTitle`, `Carousel`, `CarouselContent`, `CarouselDots`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `Checkbox`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `Combobox`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`, `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`, `DEFAULT_RANGE_PRESETS`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`, `DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `Dropzone`, `Empty`, `Field`, `FileList`, `FileRow`, `HoverCard`, `HoverCardContent`, `HoverCardTrigger`, `Input`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`, `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`, `KeyValue`, `KpiTile`, `KvGrid`, `Label`, `LoadMore`, `LogConsole`, `MenuItem`, `Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarPortal`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger`, `Modal`, `NavigationMenu`, `NavigationMenuContent`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuList`, `NavigationMenuPositioner`, `NavigationMenuTrigger`, `ObjectTile`, `Pagination`, `Popover`, `PopoverContent`, `PopoverDescription`, `PopoverHeader`, `PopoverTitle`, `PopoverTrigger`, `Progress`, `ProgressIndicator`, `ProgressLabel`, `ProgressTrack`, `ProgressValue`, `RadioGroup`, `RadioGroupItem`, `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`, `RichPagination`, `ScrollArea`, `ScrollBar`, `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`, `Separator`, `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `Skeleton`, `Slider`, `Spinner`, `StatCard`, `StatGrid`, `StatusCard`, `StepIndicator`, `Stepper`, `Switch`, `Table`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Textarea`, `ThemeToggle`, `TimePicker`, `Timeline`, `TimelineActor`, `TimelineContent`, `TimelineDescription`, `TimelineHeader`, `TimelineItem`, `TimelineMarker`, `TimelineTime`, `TimelineTimeRow`, `TimelineTitle`, `Toaster`, `Toggle`, `ToggleCheckbox`, `ToggleGroup`, `ToggleRadio`, `ToggleRadioGroup`, `ToggleSwitch`, `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`, `VirtualTable`, `buttonVariants`, `navigationMenuTriggerStyle`, `stepDotVariants`, `tabsListVariants`, `timelineMarkerVariants`, `toast`, `toggleVariants`, `useCarousel`

**Types:** `AccordionTriggerProps`, `BadgeShape`, `BadgeTone`, `CardStripItem`, `CardStripProps`, `CarouselApi`, `ComboboxOption`, `ComboboxProps`, `DatePickerProps`, `DateRange`, `DateRangePickerProps`, `DateRangePreset`, `DateTimePickerProps`, `DropzoneProps`, `EmptyProps`, `FieldProps`, `FileRowProps`, `FileStatus`, `KeyValueProps`, `KpiTileProps`, `KvGridProps`, `LoadMoreProps`, `LogConsoleProps`, `LogLevel`, `LogLine`, `MenuItemProps`, `ModalProps`, `ObjectTileProps`, `PaginationProps`, `ProgressProps`, `ProgressTone`, `RichPaginationProps`, `SortDir`, `SpinnerProps`, `StatCardProps`, `StatCardTone`, `StatCardTrend`, `StatTrendDirection`, `StatusCardProps`, `StatusCardSize`, `StepIndicatorProps`, `StepIndicatorStep`, `StepperProps`, `TableColumn`, `TableProps`, `TimePickerProps`, `TimelineEntry`, `TimelineProps`, `TimelineTone`, `ToggleCheckboxProps`, `ToggleGroupProps`, `ToggleProps`, `ToggleRadioGroupProps`, `ToggleRadioProps`, `ToggleSwitchProps`, `Tone`, `VirtualTableProps`

## `@cloud/ui/components/layout` — 12 values, 7 types

`ActionFooter`, `AppHeader`, `Breadcrumbs`, `ContentHeader`, `Layout`, `PAGE_BODY_CLASS_NAME`, `PAGE_BODY_PADDING_CLASS_NAME`, `PageBody`, `PageHeader`, `PageHeaderBand`, `Sidebar`, `SidebarTrigger`

**Types:** `ActionFooterProps`, `BreadcrumbsItem`, `SidebarBrand`, `SidebarNavItem`, `SidebarProps`, `SidebarSection`, `SidebarSubItem`

## `@cloud/ui/components/list-filter` — 10 values

`AdvancedFilterButton`, `AdvancedFilterField`, `AdvancedFilterGroup`, `AdvancedFilterSheet`, `AppliedFilters`, `FilterChip`, `LIST_SUMMARY_BAR_HEIGHT`, `ListConditionBand`, `ListSummaryBar`, `SearchInput`

## `@cloud/ui/components/chart` — 50 values, 15 types

The `Chart*` names are ours. The rest are Recharts primitives, re-exported so you never import `recharts` directly.

`Area`, `AreaChart`, `Bar`, `BarChart`, `Brush`, `CartesianGrid`, `ChartBar`, `ChartContainer`, `ChartEmpty`, `ChartLegend`, `ChartLegendContent`, `ChartPieCalloutLabel`, `ChartPieCalloutLabelLine`, `ChartSkeleton`, `ChartSparkline`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent`, `ComposedChart`, `Label`, `LabelList`, `Line`, `LineChart`, `Pie`, `PieChart`, `PolarAngleAxis`, `PolarGrid`, `PolarRadiusAxis`, `Radar`, `RadarChart`, `RadialBar`, `RadialBarChart`, `Rectangle`, `ReferenceArea`, `ReferenceDot`, `ReferenceLine`, `ResponsiveContainer`, `Scatter`, `ScatterChart`, `XAxis`, `YAxis`, `ZAxis`, `buildChartVars`, `createStackedBarShape`, `formatPieCalloutValue`, `getPieCalloutGeometry`, `getStackedBarRadius`, `resolvePieCalloutLineColor`, `resolvePieCalloutName`, `useChart`

**Types:** `BarCellResolver`, `ChartBarProps`, `ChartConfig`, `ChartEmptyProps`, `ChartLegendContentProps`, `ChartPieCalloutGeometry`, `ChartPieCalloutGeometryOptions`, `ChartPieCalloutLabelLineProps`, `ChartPieCalloutLabelProps`, `ChartPieCalloutSectorProps`, `ChartSparklineProps`, `ChartTooltipContentProps`, `StackedBarOrientation`, `StackedBarRadius`, `StackedBarShapeOptions`
