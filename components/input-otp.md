# InputOTP

Segmented input for a one-time passcode or verification code.

`InputOTP` is powered by `input-otp`. It is a set of composable parts — `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, and `InputOTPSeparator`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`InputOTP` renders one box per character of a code, behind a single real input. Assemble it yourself: `InputOTP` takes `maxLength` and a controlled `value` / `onChange` (the change handler receives the **whole string**, not one character). Inside it, put an `InputOTPGroup` holding one `InputOTPSlot` per character, indexed from `0`. **The number of slots must equal `maxLength`** — a mismatch leaves characters with nowhere to render. Put an `InputOTPSeparator` between groups when the code reads in chunks.

The component is presentation and per-slot entry only. It does not resend, count down, auto-submit, or validate — that is the page's job. Restrict what can be typed with `pattern`, and wire it into `react-hook-form` with a `Controller`.

Error styling has a **single owner**: when a slot inside the group carries `aria-invalid`, the `InputOTPGroup` draws one red border and ring around the whole group via `:has()`. Individual slots deliberately do not draw their own error border — if they did, you would get the group's outline plus a second one per matching slot. Don't add an error border to a slot's `className`.

Use `InputOTP` only for short, fixed-length codes. For any other text, use `Input`.

## General guidelines

### Do

- Keep the slot count equal to `maxLength`.
- Control the value; `onChange` gives you the whole code string.
- Use `pattern` to restrict input to digits when the code is numeric.
- Group long codes and separate the groups with `InputOTPSeparator`.

### Don't

- Don't put an error border on a slot; the group owns the invalid treatment.
- Don't use it for ordinary text or a password. Use `Input`.
- Don't expect resend, countdown, or auto-submit from the component — build them around it.

## Features

- #### Slots and length

  ```tsx
  import { InputOTP, InputOTPGroup, InputOTPSlot } from "@cloud/ui";

  <InputOTP maxLength={6} value={code} onChange={setCode}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>;
  ```

- #### Separated groups

  Split a long code into chunks with more than one `InputOTPGroup`, divided by an `InputOTPSeparator` (a dash).

  ```tsx
  <InputOTP maxLength={6} value={code} onChange={setCode}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  ```

- #### Restricting input

  Pass `pattern` to limit the accepted characters — digits only, for instance.

### States

- **Active** — the slot receiving input takes a primary border and ring, and shows a blinking caret.
- **Invalid** — `aria-invalid` on a slot makes the whole `InputOTPGroup` draw one destructive border and ring.
- **Disabled** — the container dims and the input is not interactive.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

- Label the field with what the code is and where it came from, such as `Verification code` with helper text naming the channel.
- On error, say what went wrong and what to do — `That code is incorrect or expired. Request a new one.` — in a `FieldError`, not only as a red border.

## Accessibility guidelines

### General accessibility guidelines

- The visible boxes are presentation; there is one real input behind them, so the code is entered, pasted, and read as a single value.
- Give the field a visible label. Inside a `Field`, `FieldLabel` associates it for you.
- Don't rely on the red border alone to signal an invalid code; give a `FieldError` message.

### Component-specific guidelines

#### Keyboard interaction

- Typing fills the slots left to right; Backspace clears backwards.
- The arrow keys move between slots, and pasting a full code fills every slot at once.
