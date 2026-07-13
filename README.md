# @cloud/ui documentation

The markdown is the source. `llms.txt` is the index an agent starts from, and every
doc under `components/`, `patterns/`, `foundations/`, and `demos/` is written to be
read directly.

The HTML is a **view** of that markdown — generated from it, never the other way round.

## Preview it locally

```bash
npm install
npm run serve
```

- **`http://localhost:4321/`** — the HTML view, styled with the `@cloud/ui` tokens.
  The landing page is `llms.txt` itself, rendered.
- **`http://localhost:4321/llms.txt`** — what an agent reads.
- **`http://localhost:4321/foundations/spacing.md`** — any doc, raw. Served straight
  from the repo, byte for byte, with no build in between.

The server watches the doc trees and rebuilds on save. `npm run build` alone writes
`_site/` and exits.

## Why md → html, and not the other way

Cloudscape builds an HTML site and converts the rendered pages **back down** to
markdown for LLMs. That direction is lossy, and you can see the damage in their own
docs: the images are gone, the previews are gone, and in their spacing table the
`Size (px)` column — the one number the table exists to carry — is **empty**, because
those cells held visual swatches that did not survive the conversion. Their LLM
documentation is a degraded copy of their human documentation.

Here the markdown is what was written. Rendering it to HTML loses nothing, because
everything the page says is already in the text. Agents keep reading exactly what
they read before; humans get a page they can stand to look at.

## Editing

Edit the `.md`. That is all — the HTML follows.

Two rules earn their keep:

- **A new doc must be added to `llms.txt`.** A doc that is not in the index is worse
  than one that does not exist: it is written, it is good, and no agent will ever
  find it. This has already happened once, to `layout.md`.
- **Check a claim against the source before writing it down.** Most of the sharpest
  rules in these docs — that `component-defaults.css` sizes every unsized icon to
  14px, that `max-w-content` is never actually applied, that `data-icon` is declared
  and never set — came out of reading `packages/ui`, and several contradicted what
  the docs already said.

## Layout

```
llms.txt          the index; the entry point for agents, and the landing page
api-surface.md    every importable name, and the entry point it comes from
components/       one doc per component
patterns/         page-level and task-level decisions
foundations/      colour, spacing, layout, typography, iconography, motion, …
demos/            compilable page templates
assets/docs.css   the HTML view's stylesheet — tokens copied from @cloud/ui
scripts/          the renderer and the preview server
```
