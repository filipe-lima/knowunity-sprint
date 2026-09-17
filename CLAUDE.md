@AGENTS.md

## What this is

`docs/sprint-context.md` (top of file) — one-line project description and the committed concept.

## Hard rules (always true)

- Voice in, text out — Knowie replies in text and never speaks. `docs/design-brief.md` § "Hard constraints"
- Push-to-talk, explicit send — no auto-endpointing, ever.
- Recall only — no tutoring branch, no open conversation on an answer.
- Mobile iOS, 390px, dark mode only — one colour mode, no other breakpoints this sprint.
- The recall is mocked: no speech-to-text, no audio, no model calls of any kind.
- Sentence case on every label, button, and heading — capitals only for proper nouns.
- Every colour/space/radius/type value comes from `tokens/tokens.json`, named via `docs/design-system.md` — never a hand-typed value, never a CSS fallback (`var(--x, #333)`). `npm run check:tokens` catches raw hex colors in `components/` — run it after building or editing anything there.
- Build from the components already listed in `docs/design-system.md`. If none fits, say so and flag it as a system gap — don't stretch, detach, or invent a new one silently.
- Every screen is built on `scaffold` — no bare frames.
- Locked product decisions and out-of-scope items live in `docs/sprint-context.md` — treat both lists as binding, not advisory.

## Never

- Never add voice output anywhere in the flow.
- Never build a required action with no way out (see `docs/design-brief.md` "Never trap the student").
- Never break a token or component rule — full list: `docs/design-system.md` § "Never do this" (15 rules).
- Never build something on the `docs/sprint-context.md` § "Not building" list without flagging it as new scope first.
- Never edit `AGENTS.md`.

## Component library

When working on UI, use the storybook tools to read the component library before answering or writing anything. Never assume a component prop exists. Query the documentation, and use only props that are documented or shown in a story. If a prop isn't there, stop and ask me.

## File map

| Path | Read it when |
|---|---|
| `AGENTS.md` | Already imported above — Next.js version rules for this repo. |
| `docs/design-brief.md` | Starting any product/UX decision — problem, constraints, mandate. |
| `docs/voice-ux-reference.md` | Designing anything voice-related (permissions, states, generosity of judging). |
| `docs/sprint-context.md` | Before designing any screen or flow — committed decisions + explicit non-goals. |
| `docs/design-system.md` | Before building or styling any screen — component inventory, scaffold/slot rules, naming, the 15 "Never do this" rules. |
| `docs/component-gaps.md` | Before building a new screen — a running list of things built inline (not yet real components) during earlier screen builds; check it before assuming something doesn't exist. |
| `tokens/tokens.json` | Whenever `design-system.md` names a token — look up its real value here. |
| `build/css/tokens.css` | Never edit this file — it's generated from `tokens/tokens.json`. Change the token there and run `npm run tokens` to regenerate it. |
| `docs/reference/*.png` | Comparing your design against the already-shipped beta (numbered flow screenshots). |
| `.claude/skills/ux-designer/` | Designing a new flow — user psychology, IA, patterns. Read before `ui-designer`. |
| `.claude/skills/ui-designer/` | Styling/building a flow already decided — visual system, components, polish. |
| `.claude/skills/ux-motion/` | Implementing any transition or micro-interaction — timing, easing, choreography. |
| `.claude/skills/interactive-prototype/` | Building a swipeable/gestural high-fidelity React prototype artifact of a flow. |
| `app/layout.tsx`, `app/page.tsx`, `app/globals.css` | Editing the actual app — still the `create-next-app` scaffold, except `globals.css` now also imports `build/css/tokens.css`. |
| `public/*.svg`, `app/favicon.ico` | Default Next.js placeholder assets — replace once real UI lands. |
| `public/images/Knowie.png` | The Knowie mascot asset. |
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` | Changing build, lint, or type config. |
| `README.md` | Default `create-next-app` instructions — not project-specific. |
| `knowunity-sprint.code-workspace` | Local, gitignored VS Code multi-root workspace — not part of the app. |
