# LogConsole

Structured logcat viewer — a filter toolbar over a dense, level-colored row list.

`LogConsole` is a client component driven by props. It exports the `LogConsoleProps`, `LogLine`, and `LogLevel` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`LogConsole` renders a toolbar — a level filter and a text filter, plus a download button **only when you pass `onDownload`** — over a monospace row list. Each `LogLine` parses into a fixed grid (time · pid/tid · level · tag · message), so the columns align down the list no matter how ragged the content.

A `LogLine` is `{ time, pid, level, tag, msg, detail? }`. All five required fields are strings (`pid` is one string — format it as `pid-tid` yourself). `level` is a logcat level: `V`, `D`, `I`, `W`, `E`, or `F`. The presence of `detail` — the full message or a stack — is what **makes a row expandable**; a row without it doesn't expand.

Levels are colored by severity: `V`, `D`, and `I` read muted, while `W`, `E`, and `F` get a colored left rail, and `E` and `F` also get a faint row wash. A log where every line shouts is a log nobody reads.

**Filtering runs internally.** Both the level filter and the text filter (over tag and message, case-insensitive) are applied inside the component, over `lines`. Expansion is internal UI state too. You may _optionally control_ the filters: pass `levels` (multi-select, defaulting to all six on) with `onLevelsChange`, and `query` with `onQueryChange` — do that when the filters belong in the URL or must survive a remount. Either can be controlled without the other. `onDownload` receives the **currently filtered** lines, not the full array.

`maxHeight` (default `'24rem'`) bounds the scrolling viewport — a number is read as pixels, a string as a CSS length. `emptyLabel` is what shows when the filters match nothing (default: `"No log lines match the filter."` — pass a translated one).

## General guidelines

### Do

- Give a row a `detail` when there is more to show — a stack, a full payload — and leave it off otherwise.
- Control `levels` and `query` when the filter state should be shareable or survive a remount.
- Bound the viewport with `maxHeight` so the console doesn't swallow the page.
- Pass a translated `emptyLabel`.

### Don't

- Don't pre-filter `lines` yourself and _also_ control the filters; the component filters internally and you'll double-filter.
- Don't expect `onDownload` to receive everything — it gets what's on screen after filtering.
- Don't expect a download button without `onDownload`; the button only renders when the handler is there.
- Don't tag ordinary events as `E`; the color scale only works if it's honest.

## Features

- #### Lines

  ```tsx
  import { LogConsole, type LogLine } from "@cloud/ui";

  const lines: LogLine[] = entries.map((e) => ({
    time: e.time,
    pid: `${e.pid}-${e.tid}`,
    level: e.level,
    tag: e.tag,
    msg: e.message,
    detail: e.stack,
  }));

  <LogConsole lines={lines} emptyLabel={t("logs.empty")} />;
  ```

- #### Controlled filters

  Pass `levels` / `onLevelsChange` and `query` / `onQueryChange` to hold the filter state yourself — in the URL, for instance.

  ```tsx
  <LogConsole
    lines={lines}
    levels={levels}
    onLevelsChange={setLevels}
    query={query}
    onQueryChange={setQuery}
  />
  ```

- #### Download

  `onDownload` receives the filtered lines, so the export matches what the user is looking at.

  ```tsx
  <LogConsole lines={lines} onDownload={(filtered) => downloadCsv(filtered)} />
  ```

- #### Viewport

  `maxHeight` (default `'24rem'`) caps the scrolling area. A number is pixels; a string is any CSS length.

  ```tsx
  <LogConsole lines={lines} maxHeight={480} />
  ```

### States

- **Expanded** — a row with `detail` opens to show it, below the grid. Expansion is tracked by the row's position in the *filtered* list, so changing a filter does not carry an open row along with it.
- **By level** — `W` gets a warning rail, `E` and `F` an error rail plus a faint wash; `V` / `D` / `I` stay muted.
- **Empty** — `emptyLabel` shows when the filters match nothing.

## Writing guidelines

### General writing guidelines

- Never hardcode user-facing strings.

### Component-specific guidelines

- The log content is machine output — don't rewrite it. Keep `tag` and `msg` verbatim, so a line here matches a line in the raw log.
- `emptyLabel`: say that the filters matched nothing, such as `No log lines match these filters` — not just `No data`, which reads as "there are no logs".

## Accessibility guidelines

### General accessibility guidelines

- The level and text filters are real controls, and an expandable row is a real button that announces its expanded state.
- Don't rely on the level's color alone: the level letter is in the row, and it is what carries the severity.
- Give the console a bounded, scrollable viewport that is reachable and scrollable by keyboard.

### Component-specific guidelines

- Monospace, dense rows are hard to read at small sizes. Don't shrink the type further with a `className` override.
