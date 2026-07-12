# Dropzone

Drag-and-drop file picker, with a list of the picked files and their upload status.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/dropzone.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Dropzone` is a client component. It is a set of three parts — `Dropzone`, `FileList`, and `FileRow`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Dropzone` is **presentation only**. It emits the `File[]` the user picked, through `onFiles`, and does nothing else: it does not upload, it makes no network calls, and it reads no environment. The upload is yours to wire — do it with `@cloud/storage/client` — and you feed the per-file status and progress back into `FileRow`. This split is deliberate: the UI package stays free of transport and credentials.

The zone itself is a `<label>` wrapping a visually hidden file input, so a click opens the picker and a drop fills it, and both paths go through the same `onFiles`. `accept` maps to the native input attribute, which is a **browser-side convenience filter, not validation** — validate the real type and size on the server. `multiple` allows more than one file, and `children` replaces the default upload glyph with your own prompt (pass a translated string; the component ships no copy of its own).

`FileRow` renders one picked file: `name`, an optional `sizeBytes` (formatted for you as `2.0 KB`), a `status` of `pending` / `uploading` / `done` / `error`, a `progress` from 0 to 100 shown as a bar while uploading, an `error` node shown when the status is `error`, and an `onRemove` handler that renders a remove button. Give that button a translated `removeLabel`; it defaults to the untranslated `Remove`.

## General guidelines

### Do

- Wire the upload yourself with `@cloud/storage/client`, and feed `status` and `progress` back into each `FileRow`.
- Pass a translated prompt as `children`, and a translated `removeLabel` on each row.
- Set `accept` to narrow the file picker, and validate type and size again on the server.
- Show a per-file `error` message when an upload fails, so one bad file doesn't obscure the rest.

### Don't

- Don't expect `Dropzone` to upload anything. It only reports the files.
- Don't rely on `accept` as validation; it is a hint to the picker and is trivially bypassed by a drop.
- Don't leave a file in `uploading` with no progress; if you can't compute one, use a different affordance.

## Features

- #### Picking files

  ```tsx
  import { Dropzone, FileList, FileRow } from "@cloud/ui";

  <Dropzone accept="image/*,.csv" multiple onFiles={handleFiles}>
    <UploadCloud className="size-6" aria-hidden />
    <span>{t("dropzone.prompt")}</span>
  </Dropzone>;
  ```

- #### File list and status

  `FileList` is the container; each `FileRow` shows one file's name, size, status, and progress.

  ```tsx
  <FileList>
    {items.map((item) => (
      <FileRow
        key={item.id}
        name={item.name}
        sizeBytes={item.size}
        status={item.status}
        progress={item.progress}
        error={item.error}
        onRemove={() => remove(item.id)}
        removeLabel={t("common.remove")}
      />
    ))}
  </FileList>
  ```

### States

- **Idle** — a dashed border on a raised surface.
- **Drag over** — the border and surface tint primary while a file is over the zone.
- **Disabled** — dimmed, with a not-allowed cursor, and neither click nor drop emits.
- **Row: uploading** — a `Progress` bar under the file name.
- **Row: done / error** — a success or error glyph at the end of the row; an error also shows its message beneath the name.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Never hardcode user-facing strings — pass translated copy in.

### Component-specific guidelines

- Prompt: say what to do and what is accepted, such as `Drag a CSV here, or click to browse`.
- Error: say what went wrong and what to do about it, such as `File is over the 10 MB limit. Choose a smaller file.`

## Accessibility guidelines

### General accessibility guidelines

- The zone is a `<label>` around a real file input, so it is focusable and can be opened from the keyboard — drag-and-drop is an extra, never the only way in.
- Give the remove button a translated `removeLabel`; it is icon-only.
- Status glyphs are `aria-hidden`, so don't let color and glyph be the only carriers of state — the error text says it in words.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus to the zone; Enter or Space opens the file picker.
- Each row's remove button is reachable by Tab and activated with Enter or Space.
