# Errors and validation

Where an error is thrown, how it becomes a response, and where the user finally sees it. One schema, one code, one place per failure.

[Binding rules](../../../../.claude/team-rule/coding-rules/server_error-handling.md)

## Key UX concepts

### The code is the protocol, not the message

Every expected failure carries a stable error **code**. The message is a localized rendering of that code and can change; the code cannot. Clients, tests, and monitoring branch on the code. Branching on the message means a copy edit breaks the client.

Codes are 5 hex digits — a 2-hex module id plus a 3-hex per-module sequence — and they are **add-only**. Reuse the shared codes (`@cloud/request/error-codes`) before minting a module-specific one.

### Nobody writes try/catch

`withApiHandler` catches every throw in a route handler and runs it through a mapper chain in priority order: authorization errors, then business and middleware errors, then a caller-supplied mapper, then Prisma, then unknown → a generic 500. Hand-writing `try { … } catch (e) { return handleApiError(e) }` in a route file duplicates that chain and is a rule violation.

The corollary is how you fail: `throw new BusinessError(code, status?, params?)` from the controller, the service, or the policy. Never `throw new Error("some text")` for a business failure — it has no code, so it maps to a generic 500 and the client cannot tell it apart from a crash.

### Validate at the boundary, once

Zod parses the request at the route handler, from a schema shared with the client form. That schema is the single source of what a valid payload is. A form that enforces rules the server doesn't have will let bad data through the API; a server that enforces rules the form doesn't show will reject a form the user thought was complete.

### Infrastructure failures are masked

A database, cache, or mail failure throws `MiddlewareError` and is masked to a generic 503. The user does not learn that Redis is down, and they should not — but you still log the diagnostic yourself, through the logger, because `BusinessError` carries no developer message. The log line shares the request's trace id, so the diagnostic correlates to the error the user actually saw.

### Where the user sees it

- **Field-level** — the value is wrong. `Field`'s `error` prop, next to the control, tied to it programmatically.
- **Form-level** — the submit failed as a whole (a conflict, a permission failure). An `Alert` at the top of the form, or a `toast` if the form is not the focus.
- **Transient** — the action succeeded or failed and the user does not need to act on it. `toast()`.
- **Page-level** — the resource is gone or forbidden. Not an error message: `notFound()` or a redirect to `/403`.

An error that requires the user to fix something must never be a toast. Toasts vanish.

### 401 is centralized

The client's unauthorized handler turns a 401 into a logout, once, in one place (`setUnauthorizedHandler`). Individual call sites don't check for it.

## Building blocks

#### A. Shared schema

A zod schema in the domain's `schemas/`, imported by both the route handler and the form.

#### B. Route parse

The handler parses the request against the schema before doing anything else — after the auth guard, before the service call.

#### C. Business throw

`BusinessError(code, status, params)` from the controller, service, or policy. Status is one of the expected set (400/401/403/404/409/422/423/429), defaulting to 400.

#### D. Handler chain

`withApiHandler` — catches, maps, and responds. No per-file try/catch.

#### E. Client throw

`@cloud/request/client` throws a typed `RequestError` carrying the code. The call site branches on the code.

#### F. Field error

`Field`'s `error` prop renders the message and ties it to the control.

#### G. Transient feedback

`toast()` from `@cloud/ui` for success and for failures that need no action.

## General guidelines

### Do

- Give every expected failure a stable code, and branch on the code.
- Reuse the shared codes before minting new ones.
- Parse with zod at the route handler, using the same schema the form validates against.
- Throw `BusinessError` for expected failures and `MiddlewareError` for infrastructure faults.
- Log the diagnostic yourself, with the logger, when you throw.
- Put a field's error next to the field, and a whole-form failure at the top of the form.
- Re-throw Next's control-flow throws (`redirect`, `notFound`) — never swallow them in a local catch.

### Don't

- Don't hand-write try/catch in a route handler.
- Don't `throw new Error("...")` for a business failure.
- Don't branch on an error message.
- Don't rename or renumber a shipped code.
- Don't put an actionable error in a toast.
- Don't tell the user which infrastructure component failed.
- Don't let the form and the server disagree about what is valid.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Don't use _please_, exclamation points, or _etc._

### Component-specific guidelines

#### Field errors

- Say what is wrong and what would be right. _Must be 8 characters or more._ beats _Invalid._
- Don't repeat the field's name in its own error. The error sits under the label already.

#### Form-level errors

- Name the cause and the next step. _That login name is taken. Choose another._
- Don't leak internals — no stack, no SQL, no service name.

#### Toasts

- Confirm what happened, in the past tense: _Role created._
- Keep it to one line. A toast with two sentences is an alert wearing a disguise.

#### 403 and 404 pages

- Say what is missing and who can grant it, rather than _Forbidden_.

## Accessibility guidelines

### General accessibility guidelines

- An error is announced, not only painted. Field errors are associated with their control so focus reads them.
- Colour is never the only signal of an invalid field.
- On a failed submit, move focus to the first invalid field.

### Component-specific guidelines

- Toasts must be in a live region, but nothing that requires action may live only there — a toast can be missed entirely.
- A form-level `Alert` must be reachable by keyboard and, on submit failure, should receive focus.

## Related patterns and components

- [Create form](create-form.md) and [Create wizard](create-wizard.md) — where validation surfaces.
- [Permission gating](permission-gating.md) — the source of the 401 and 403 errors this handles.
- [Empty states](empty-states.md) — the not-an-error case that is often mistaken for one.
- Components: `Field`, `Alert`, `Toaster` / `toast`, `Empty`.
