# Avatar

Circular profile image with a fallback to initials. `AvatarGroup` stacks several of them into an overlapping row.

`Avatar` is built on `@base-ui/react`'s `Avatar`. It is a set of four components — `Avatar` (root), `AvatarImage`, `AvatarFallback`, and `AvatarGroup`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Avatar` is the round people-and-profile mark. Its square sibling is `ObjectTile`, which is the identity mark for a company, an app, or an object. Keep `Avatar` for a person and `ObjectTile` for a thing.

The root always renders the fallback surface, and `AvatarImage` covers it once the image loads. Give it a fallback either by passing `name` (the root derives two-letter initials, splitting on whitespace and the `.`, `+`, `_`, `-`, `/` separators) or by rendering an explicit `AvatarFallback`. Explicit children win over `name`.

Use the component props before adding custom classes. Set `size` and `name`, then use `className` only for local adjustments.

## General guidelines

### Do

- Use `Avatar` for a person or profile, and `ObjectTile` for a company, app, or object.
- Provide a fallback with `name` or an explicit `AvatarFallback` so a missing image never shows a blank circle.
- Give `AvatarImage` a meaningful `alt`.
- Use `AvatarGroup` to stack participants into an overlapping row.

### Don't

- Don't use an avatar as a square brand or entity tile. Use `ObjectTile`.
- Don't leave the fallback empty; supply `name` or children.
- Don't put more than a couple of characters in the fallback. It is sized for two-letter initials.
- Don't rely on the image alone. The fallback is what shows on load failure.

## Features

- #### Size

  There are four sizes: `sm`, `md` (default, 40px), `lg`, and `xl`. The fallback text scales with the size.

  ```tsx
  import { Avatar, AvatarImage, AvatarFallback } from "@cloud/ui";

  <Avatar size="lg">
    <AvatarImage src={user.avatarUrl} alt={user.name} />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>;
  ```

- #### Initials from name

  Pass `name` to auto-derive the two-letter fallback, instead of writing an `AvatarFallback`.

  ```tsx
  <Avatar name="Acme Corp" />
  ```

- #### AvatarGroup

  `AvatarGroup` lays several avatars into an overlapping row with a ring separating each from the one behind it.

  ```tsx
  <AvatarGroup>
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Alan Turing" />
  </AvatarGroup>
  ```

### States

- #### Loading and fallback

  Until `AvatarImage` loads, the root shows the fallback surface with initials or the fallback child. If the image fails, the fallback remains. There is no separate spinner.

## Writing guidelines

### General writing guidelines

- Use sentence case for any surrounding label.
- Keep names and initials as the person or entity writes them.

### Component-specific guidelines

- Fallback initials are two letters, uppercased. Let `name` derive them rather than abbreviating by hand.
- Use the full display name in the image `alt`, not the initials.

## Accessibility guidelines

### General accessibility guidelines

- Give `AvatarImage` an `alt` that names the person or entity.
- Don't encode meaning in the avatar color alone; it is a neutral identity surface.

### Component-specific guidelines

#### Alternative text

- When the avatar is purely decorative next to a visible name, `alt=""` is acceptable so the name is not announced twice.
- In an `AvatarGroup`, give each avatar an accessible name, or label the group as a whole when individual names are not needed.
