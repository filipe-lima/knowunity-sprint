---
name: build-screen
description: "Applies when building or editing any screen in this voice active-recall prototype (Knowie) -- Cannot-speak sheet, Summary, Recall Hub, Recall history, Loop, or any other screen under app/. Triggers on requests to build a screen, wire up a route, implement a page from SPEC.md, or make changes to an existing screens/ file. Do NOT use for isolated component work in components/ (no screen involved) or for token/design-system edits with no screen attached."
---

# Building a screen in this prototype

This project is a real, token-driven component library (`components/`) for
a mobile-only, dark-mode-only voice recall prototype, matching a Figma file
component-by-component. Screens are compositions of that library, not new
design work. Follow this method in order every time.

## 1. Read `docs/SPEC.md` for this screen

Find this screen's entry: its states, which real components it names, and
what the student can do on it. `SPEC.md` names real Storybook components
and real file paths on purpose — treat those names as binding, not
descriptive. If SPEC.md marks something under its own "Open" section for
this screen, don't resolve it yourself; build around it and flag it in your
final report the same way SPEC.md does.

## 2. Check whether this screen has a Figma frame

Not every screen does. Look under the "COMMITED FLOW FINAL USING
COMPONENTS" frame (Final flow page) in the Figma file
(`u3BZUg8k5p3mrOrKAnYO5c`) for a matching instance. This changes the rest of
the method:

- **Has a frame:** walk it for real content (titles, copy, component
  variants, states) — don't guess or reuse another screen's copy. Screen
  names in the layers panel don't always match their on-screen titles (Hub
  C's layer name is "The queue," its rendered header reads "Recall Hub") —
  check the rendered screen, not just the layer name, before concluding a
  screen isn't there.
- **No frame:** this screen's shape comes from prose, not pixels — go to
  step 8 for how to handle it.

## 3. Query the Storybook MCP for every component you'll use

Never assume a prop exists or guess a default from memory of an earlier
session — the library changes. For each component this screen needs, query
Storybook for its real props, variants, and states before writing any JSX.
If a documented prop isn't there, stop using it — don't invent one.

## 4. Compose only from what's in Storybook

Storybook is the only place to look for something to reuse. Most of the
Figma library was never built in code, so "it's in Figma" is not a reason
to assume a component exists — check Storybook, not Figma, for what's
buildable today.

## 5. When something you need isn't in Storybook

Build it inline inside the screen file, from tokens only, and keep going —
don't stop to ask. Then add one line to `docs/component-gaps.md` (create it
if it doesn't exist) naming what was missing and which screen needed it.

Before adding a new line, check whether that same gap is already listed
from a different screen. If it is, this is now a second real usage — don't
build a second inline version. Instead, build it properly as a real
component (`components/<Name>/<Name>.tsx` + `.stories.tsx`, real Figma
variant data if a component set exists for it, one story per state), reuse
it in both screens, and update the `component-gaps.md` line to note it's
now a real component rather than deleting the record of it having been a
gap.

## 6. Every value from generated tokens

No raw hex, no raw px, no hand-typed color/space/radius/type value, ever.
Look values up in `tokens/tokens.json` via `docs/design-system.md`'s naming
before writing a `var(--...)` reference. If a value doesn't have a token
yet, that's its own flag in `component-gaps.md` — don't invent a token to
cover it.

## 7. Mobile only, 390px, dark mode

One color mode, no breakpoints, no responsive variants. Build to the same
390px canvas every Storybook story already assumes.

## 8. Build every listed state, including failure states

If `SPEC.md` lists a failure path, an empty state, or an edge case for this
screen, build it — don't ship only the happy path and call the screen done.

---

## Finishing up

**If the screen had a Figma frame:** list every difference between what
you built and the frame — content, spacing, component choice, anything —
even small ones. Don't silently resolve a mismatch by picking whichever
side seems more "correct."

**If it didn't:** read `docs/design-brief.md` and
`docs/voice-ux-reference.md` for how this state should behave, and when
you're done, tell me what you had to decide that wasn't written down
anywhere — the actual judgment calls, not just a summary of what you built.
