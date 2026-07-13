# @cloud/ui documentation

The markdown is the source. `llms.txt` is the index an agent starts from, and every
doc under `components/`, `patterns/`, `foundations/`, and `demos/` is written to be
read directly.

The HTML is a **view** of that markdown — generated from it, never the other way round.

## Live previews (optional)

The tsx examples in the component docs can render as **real components** — the
actual `@cloud/ui`, with the actual Tailwind CSS. Nothing is authored for this:
the 212 examples already in the docs are the previews.

It is off unless you vendor the package, because **`@cloud/ui` is private and
this repo is public — the tarball must never be committed**:

```bash
# from the monorepo:  pnpm --filter @cloud/ui pack
cp ../cloud-next-scaffold/cloud-ui-0.0.1.tgz .
npm run preview:install
npm run serve
```

`*.tgz` is gitignored. Without it the docs site builds exactly as before —
every example keeps its code block and nothing 404s. The previews are an
enhancement, never a dependency.

> Vendoring is a stopgap. A tarball is a snapshot, so the day `Button` changes,
> these previews are showing an old one — and a design system whose docs are
> behind its code is worse than one with no previews at all. Publish `@cloud/ui`
> to a private registry, or move these docs into the monorepo, and the problem
> stops existing.

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
