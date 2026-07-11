# Empty states

A surface with nothing in it. There are three different nothings, they mean different things to the user, and they get different copy and different actions.

[Empty component](../index.md)

## Key UX concepts

### Three nothings, not one

- **No data** — the resource has never been created. This is a first-run state, and it is an **invitation**: offer the create action.
- **No match** — data exists, but the applied filters exclude all of it. This is a **dead end the user made**, and the way out is to clear the filters, not to create a record.
- **No access** — the user may not see this. That is not an empty state at all; it is a redirect to `/403`. Never render an empty table to someone who lacks the permission — it tells them the resource doesn't exist, which is both wrong and confusing.

Collapsing the first two into one message ("No data") is the common failure. A user who has just filtered and sees "No users yet. Invite a user." will reasonably conclude their company has no users.

### The empty state is a slot, not a page

`Table` takes an `empty` prop. The empty state renders **inside** the table, under the column headers, so the user keeps the context of what they were looking at — the columns, the filters, the count bar. Replacing the whole page with a centered graphic throws all of that away.

### It has to be actionable

An empty state that only says "nothing here" wastes the one moment the user is guaranteed to be looking. Give it the action that resolves it: create the first record, or clear the filters.

### Loading is not empty

While the request is in flight, the surface is _unknown_, not _empty_. Render `Skeleton` rows. Flashing an empty state before the data arrives reads as "you have no users" and then corrects itself, which is worse than showing nothing.

Note: `Table` has no `loading` prop — the loading skeleton is the page's job, rendered in place of (or above) the table while the fetch is pending.

## Building blocks

#### A. Empty

The `Empty` component — `icon`, `title` (required), `description`, and `action`.

#### B. Table slot

`Table`'s `empty` prop takes the node. It defaults to a plain _No data_ string, which is almost never the right copy for either case.

#### C. Filter-aware branch

The page picks the copy: if any filter is applied, render the no-match variant with a _Clear filters_ action wired to `clearAll` from `useListFilters`; otherwise render the no-data variant with the create action.

#### D. Chart empty

`ChartEmpty` from `@cloud/ui/components/chart`, for the same situation in a chart.

#### E. Loading

`Skeleton` rows, or `ChartSkeleton` for a chart.

## General guidelines

### Do

- Branch on whether filters are applied, and write two different messages.
- Give the no-data state the create action, and the no-match state a _Clear filters_ action.
- Keep the empty state inside the table, under the headers.
- Show skeletons while loading, not an empty state.
- Say _why_ it is empty when you know: _No transactions in this period._
- Use the same empty treatment inside a card or a panel that you use in a table — an empty block is still an empty state.

### Don't

- Don't use one message for both the no-data and the no-match cases.
- Don't offer _Create_ as the way out of a zero-results filter. The user's problem is the filter.
- Don't render an empty list to a user who lacks permission. Redirect to `/403`.
- Don't leave the default _No data_ string in a shipped table.
- Don't fill an empty state with a large illustration in a backoffice list. It is a working surface, not a marketing page.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Don't use _please_ or exclamation points.

### Component-specific guidelines

#### No data

- Name what would be there, then how to make one.
- For example: _No users yet._ / _Invite a user to get started._

#### No match

- Name the filters as the cause. Don't blame the data.
- For example: _No users match these filters._ / _Try removing a filter._
- Don't state the count of things that exist but are hidden — that is what the summary bar is for.

#### Titles

- One short sentence. The title carries the meaning; the description carries the way out.

#### Actions

- The action names the act: _Invite user_, _Clear filters_. Not _OK_, not _Go_.

## Accessibility guidelines

### General accessibility guidelines

- The empty state replaces the rows, so its arrival is a content change — announce the new state rather than silently swapping the body.
- The action inside the empty state is a real button, keyboard reachable in the flow of the table.

### Component-specific guidelines

- An icon in an empty state is decorative and takes `aria-hidden`; the title carries the meaning.
- Don't rely on the illustration or the icon to distinguish no-data from no-match. The words do that.

## Related patterns and components

- [List page](list-page.md) — where both empty states live.
- [Advanced filtering](advanced-filtering.md) — what produces the no-match state.
- [Permission gating](permission-gating.md) — why the no-access case is a redirect, not an empty state.
- Components: `Empty`, `Table`, `Skeleton`, `ChartEmpty`, `ChartSkeleton`.
