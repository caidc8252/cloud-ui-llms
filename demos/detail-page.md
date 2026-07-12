# Detail page demo

A page for viewing one resource and its related information. The demo keeps related sections in tabs while the resource identity, status, and actions remain in the page header.

[View pattern](../patterns/detail-page.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### One resource, one route

Use one detail route for the resource and tabs for peer sections of its information. Tabs keep the resource context stable and avoid creating routes that differ only by one content panel.

### The header and tabs are one context

The header identifies the resource and holds page-level actions. The tab strip follows it so users can switch sections without losing the resource name, status, or available actions.

### Overview prioritizes scanability

Use key-value pairs for essential metadata and small stat cards for concise metrics. Related resources belong in their own collection section rather than being mixed into the primary properties.

### Mutations have a clear boundary

The page can initiate an edit or related-item action, but mutations must follow the application's permission and request rules. The demo's static handlers do not represent an authorization implementation.

## Building blocks

#### A. Tabs root

Use `Tabs` as the page root so the header and panels share one resource context.

#### B. Detail header

Use a sticky header band with a back link, title, status badge, supporting metadata, and page-level actions.

#### C. Tab strip

Use `TabsList` and `TabsTrigger` for peer sections such as overview, related items, and collections. Add a compact count only when it helps users judge available content.

#### D. Overview panel

Use `Card`, key-value content, and `StatCard` for the primary resource summary.

#### E. Related collection

Use a card with a contextual add action and direct rows for a short related collection. Use a full list page when the collection requires filtering or pagination.

#### F. Empty panel

Use `Empty` when a tab has no content and provide a recovery action only when the user can act on that state.

## General guidelines

### Do

- Fetch and authorize the resource before rendering sensitive details.
- Keep the resource title, status, and primary actions in the header.
- Use tabs for peer content groups and retain the active tab during a same-resource action when practical.
- Use key-value pairs for stable properties and a dedicated collection for repeating related data.

### Don't

- Don't use browser history as the only back destination.
- Don't create a tab for every small field group or duplicate header information in every panel.
- Don't put long, filterable, or pageable related data into an overview card.
- Don't expose actions that the current user cannot perform.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Use concise noun phrases for labels and tabs.
- Use complete sentences with punctuation for descriptions and empty-state explanations.

### Component-specific guidelines

#### Page title

Use the resource's identifying name. Put an identifier or reference in supporting metadata when it helps distinguish similar resources.

#### Tab labels

Use short plural nouns for collections, such as `Members` or `Items`, and a clear singular label for an overview.

#### Key-value labels

Use the business term users recognize, not the database field name.

## Accessibility guidelines

### General accessibility guidelines

- Keep the back link, header actions, tabs, and panel controls available in a predictable tab order.
- Preserve visible focus and use text or icons as well as color for status.
- Ensure every icon-only action has a specific accessible name.

### Component-specific guidelines

#### Tabs

Use the tabs component's built-in keyboard behavior and ensure every trigger clearly identifies the panel it reveals.

#### Related rows

Give row actions labels that include the related resource name so repeated actions are distinguishable to screen-reader users.

## Related patterns

- [List page](../patterns/list-page.md)
- [Create form](../patterns/create-form.md)
- [Empty states](../patterns/empty-states.md)
- [Permission gating](../patterns/permission-gating.md)
