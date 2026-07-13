# ActionFooter

Full-bleed action band at the bottom of the page — the commit cluster.

`ActionFooter` takes `children` (plus an optional `className`) and renders them as a right-aligned cluster. Import it, and the `ActionFooterProps` type, from `@cloud/ui`.

## Development guidelines

`ActionFooter` is the bottom counterpart to the header bands (`PageHeader` / `PageHeaderBand`). It carries a right-aligned commit cluster: a ghost Cancel or Back to the left of one primary action.

**Placement matters.** It must be a **sibling of `PageBody`** — a direct child of `Layout`'s `<main>`, _after_ `PageBody`, never nested inside its gutters. `<main>` is always a fixed-height flex column that clips, and `PageBody` is the one thing in it that scrolls. The footer sits below that scroll region as a `shrink-0` band, so it is simply always in view — no `sticky`, no `mt-auto`, and no difference between a short page and a long one. Nest it inside `PageBody` and it scrolls away with the content.

**Every button in the footer carries an icon.** This is a hard rule for the whole action-band family (`ActionFooter` / `PageHeader` / `PageHeaderBand`). The header bands enforce it at compile time — their `actions` are `HeaderAction` descriptors whose `icon` field is required — but `ActionFooter` is a plain `children` slot, so nothing type-checks it here: it is on you. Use `Button`'s `iconLeft` / `iconRight`. The conventions: **Continue / forward → `ChevronRight` (trailing, `iconRight`) · Back → `ChevronLeft` · Cancel → `X` · Create → `Plus` · Save → `Save` · Publish → `CheckCircle2`**, and a verb-appropriate glyph otherwise.

**Buttons here are `md`** — the default `Button` size. Don't reach for `sm` / `xs` / `lg` in a commit band.

**Inside a modal there is no `ActionFooter`** — a dialog uses `Modal`'s own footer.

## General guidelines

### Do

- Put it directly in `<main>`, as a sibling after `PageBody`.
- Keep it to one primary action, with subordinate ghost controls to its left.
- Use it for the page-level commit on a form — Save, Submit, Continue.
- Give every button an icon, via `iconLeft` / `iconRight`.
- Leave the buttons at the default `md` size.

### Don't

- Don't nest it inside `PageBody`; it would scroll away with the content instead of staying below the scroll region.
- Don't reach for `sticky` / `mt-auto` / `fixed` to hold it down; being a `shrink-0` sibling of `PageBody` already does that.
- Don't use it in a modal. Use the `Modal` footer.
- Don't put more than one primary button in it; if everything is primary, nothing is.
- Don't ship a bare text button here — nothing will fail to compile, and the band will read as unfinished.
- Don't hand-roll a button out of `buttonVariants()` + `className`; use the `Button` component, or `secondary`'s border silently disappears.

## Features

- #### Commit cluster

  ```tsx
  import { PageHeaderBand, PageBody, ActionFooter, Button } from "@cloud/ui";
  import { X, Save } from "lucide-react";

  <>
    <PageHeaderBand title={t("merchants.create")} backTo="/merchants" />
    <PageBody>{form}</PageBody>
    <ActionFooter>
      <Button variant="ghost" iconLeft={<X size={16} />} onClick={cancel}>
        {t("common.cancel")}
      </Button>
      <Button variant="primary" iconLeft={<Save size={16} />} onClick={save}>
        {t("common.save")}
      </Button>
    </ActionFooter>
  </>;
  ```

  Note the header: a create page is not a level-1 page, so it wears a `PageHeaderBand` (with its built-in back), not a `PageHeader`.

- #### Wizard footer

  On a stepped page the footer carries the step navigation, and the icons follow the convention — `ChevronLeft` back, `ChevronRight` trailing on Continue.

  ```tsx
  import { ActionFooter, Button } from "@cloud/ui";
  import { X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

  <ActionFooter>
    <Button
      variant="ghost"
      iconLeft={step === 0 ? <X size={16} /> : <ChevronLeft size={16} />}
      onClick={() => (step === 0 ? cancel() : setStep(step - 1))}
    >
      {step === 0 ? t("common.cancel") : t("common.back")}
    </Button>
    {step < lastStep ? (
      <Button variant="primary" iconRight={<ChevronRight size={16} />} onClick={() => setStep(step + 1)}>
        {t("common.continue")}
      </Button>
    ) : (
      <Button variant="primary" iconLeft={<CheckCircle2 size={16} />} disabled={!canPublish} onClick={publish}>
        {t("common.publish")}
      </Button>
    )}
  </ActionFooter>;
  ```

### States

- **Any page** — the band sits below `PageBody`, the only thing that scrolls, so it is always in view. Short pages and long pages behave identically; there is no second case.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Primary label: name the commit — `Save changes`, `Create merchant`, `Continue`. Not `OK`.
- Subordinate label: `Cancel` or `Back`, whichever it actually does.

## Accessibility guidelines

### General accessibility guidelines

- The footer is a real `<footer>` element containing real buttons, in the reading order after the content.
- Because the band is always on screen, keep it to one row — a tall footer eats the height left for `PageBody` and shrinks the area a keyboard user is scrolling through.
- The primary action must be reachable by Tab without scrolling to the end of a long form; sitting outside the scroll region is what guarantees that, which is why the placement rule matters.

### Component-specific guidelines

- A disabled submit button with no explanation is a dead end. If the form isn't valid, say what's missing — through `Field`'s `error` prop on the offending field, not by silently graying the button. (And only feed `error` once the field has been touched: a form that turns red the moment it opens is treating *unfilled* as *filled in wrong*.)
