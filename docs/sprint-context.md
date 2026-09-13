# Sprint Context

Voice active-recall for Knowunity: student speaks a term, Knowie judges it and replies in text only, never voice.
Prototype for a 2.5-week sprint. Canvas: iPhone 390px, dark mode only, no other breakpoints. Recall engine (STT + judge) is fully mocked.

**Committed concept:** a fully-decided session (topic + length stated up front) that the student confirms rather than builds, running a five-term voice loop with generous miss recovery (hint, then mandatory say-it-back on any reveal) and a scored, honest summary, reachable from two doors that share one completion record.

**Where the recall step lives:** home chip (permanent once any material is completed) and a step inside the study plan section sequence, placed after that section's reading step and locked until it unlocks; entering from the plan node skips the hub and goes straight into the loop.

## Decisions

- Feature is 3 new screens (hub, loop, summary) plus a sheet, not more, because the loop absorbs every verdict, branch and text-mode variant on one screen.
- Chip is permanent once earned, never disappears, because a chip that comes and goes is unfindable and a student who just feels like rehearsing would have no door.
- Chip displaces YouTube in the row (not Scan/Quiz/Upload), because those are material intake and YouTube is the narrowest slot and the only one dependent on an external source.
- Chip has two markers, NEW (label, once-ever) and ready (dot, recurring), never shown together, because the risk isn't collision, it's a returning student reading a ready dot as "still new."
- Chip carries no date or count, only icon + label, and precedence is NEW > ready > plain, because the detail that would go on the chip belongs on the hub and summary instead.
- Ready fires from three sources: unlocked pending plan step (fires immediately), terms missed last session (without it, ready is a one-way ratchet that goes silent forever once a student stops studying new material), and completed-never-rehearsed material after a 48h delay (a starting value, not researched; ninety seconds after reading is recognition dressed as retrieval, not a real memory claim yet).
- Intro card has no numeric countdown, autostarts ~6s, pauses on touch/scroll, cancels under reduced motion or screen reader, because a timed advance is hostile to those users.
- Intro card has no empty state, because the chip gate guarantees the student always has material by the time they reach it.
- Hub shows one already-decided proposal with length stated before commit, not a picker, because it's built as a confirm the student accepts, not a choice they have to construct.
- Hub's "I can't speak right now" sits as a quiet secondary beside the primary CTA, because the hub is the one screen present in every session and the first point where the app is about to ask for voice.
- Continue rows show coverage count and last-practiced date, never a projected % gain, because that number is unverifiable and reads as a nag.
- Picker is scoped to topics/artifacts only, never individual terms, because students are unreliable judges of their own confidence, especially on material they read recently.
- Continue rows are activities, not paused sessions; resuming starts a fresh session on the remaining unrehearsed terms, because that's what lets a student hold several part-rehearsed activities at once without a paused-session state to manage.
- Hub proposal precedence: pending plan step first (it's scoped, the material was actually taught, and it carries an exam date), then terms missed previously (retention beats breadth), then never-rehearsed material last.
- A locked plan step shows as one quiet row, never a list and never a full screen, because the hub must never lead with something the student can't start, and a plan has many future locked steps so a list of them is a list of chores.
- Rehearsing from the chip completes the plan's node and vice versa (one shared completion record), because the chip is meant to mirror the plan's pending step, not compete with it — one feature, two doors, not two placements.
- Session entry ("Today: 5 terms from X") is a state of the loop screen, not a separate loader screen, because folding it in is what makes the two doors visibly land in the same place.
- Discard is an action back to idle, not a state, because a discarded take should leave no record behind (no verdict written); the beat before the next prompt is a transition inside idle, not its own screen.
- Wait state renders the resolved transcript with a "that's not what I said" re-record control, not a typing indicator, because it must read as "heard you" rather than "the app deciding how bad the answer was," and it catches mis-transcription before the verdict fires.
- Skip lives in the top bar on every loop screen, not in the miss action stack, because it's available on every term, not only on a miss.
- On a miss: hint (then one explicit try-again, scoring below unaided; a second miss closes the term) or re-explain (capped in-card follow-ups, no open composer, no retry after). A bare try-again with no hint doesn't exist, because otherwise the first attempt costs nothing and every miss becomes a free do-over.
- On almost there: hint or skip only, no re-explain; copy must state what was there and what was missing in the same line ("You had X. Missing: Y."), because a vaguer verdict reads as the app being fussy and pushes students into guessing keywords.
- Miss copy carries no authorship claim, because "the app already explained this" is false whenever the student picked the topic themselves — the generosity has to come from tone and the recovery ladder, not from that claim.
- Say-it-back appears only after a reveal (re-explain or a second miss), never after a hinted pass, and it's mandatory, because after a hinted pass the student already produced the answer out loud, while after a reveal they've produced nothing — without it, re-explain and skip both score the same as engaging seriously.
- Dispute is available on miss/almost-there, capped at 1 per session, awards 0 XP, and moves the term to its own "flagged for review" bucket rather than needs-practice, because a self-certified verdict awarding XP would let a student award themselves league position on their own say-so.
- Dispute copy states the real consequence (the answer is reviewed to improve judging; the term drops out of the practice list), not a softer implied one, because "won't count against you" reads as a point arriving later that never actually comes.
- Cannot-speak sheet is one question, sticky for the session; "yes" keeps the same loop with a text field instead of a mic (never a chat bubble, verdict logic unchanged) because it's the same feature with a different input, not a second feature to build; "no" returns home and keeps any set already built.
- Text-mode wait has no transcript-correction control, just a short plain wait, because there's no transcript to mis-hear.
- Scoring: unaided 15, hinted 8, almost-there 5, say-it-back-after-reveal 5, miss/reveal/skip/dispute 0. A term scores once, at its final resolved outcome, and say-it-back only ever adds to a zero — it never stacks on almost-there or hinted, because otherwise a near miss could out-earn a clean pass (e.g. 5+8 beating a straight 8).
- No XP is shown while a verdict is still unresolved (mid-hint, mid-almost-there), because the term can still change outcome and hasn't scored yet.
- Miss verdict is coral, not the system's error/red, because red stays reserved for actual failures like a lost recording — a miss is not yet that.
- Recall's icon is a custom brain glyph, not the mic, because the mic already means "dictate" in the composer and "capture now" in the record control, and the chip row names activities, not devices.
- Knowie holds one pose (standby) through the entire loop; "approving" appears only on the all-clear summary, because varying the pose mid-loop would imply the app is reacting to how the student did, which is exactly what the wait state and verdict badge already have to carry honestly.
- Summary shows 5 buckets (unaided, hinted, revealed [+said back], flagged, skipped) and claims only what the student did, never what they now know, because a reveal is visibly not the same as knowing.
- Summary has a required all-clear state that returns the chip to plain, because without it the ready dot never switches off and a dot that never goes away is noise, not a signal.
- No leaderboard nudge or star rating between summary and results, unlike the beta, because that interrupts the earned signal twice and trains a tap-through reflex on the one screen carrying the claim.
- Abandoning before answering keeps the built set as a queued session that reappears as the hub proposal and sets the chip to ready (one pending set at a time); abandoning mid-session after answering banks the partial result and the chip reflects it (e.g. "2 of 5 done") — because progress made before leaving shouldn't evaporate, but doesn't warrant a new object to manage either.

## Not building

- No voice output, ever, anywhere in the flow — hard constraint from the brief, Knowie only ever replies in text.
- No auto-endpointing — push-to-talk with explicit send only, because the most common voice failure isn't bad transcription, it's the system guessing wrong about when someone's done talking.
- No tutoring branch — hard constraint from the brief (recall only, not tutoring); re-explain is capped, in-card follow-ups only, no open composer or chat thread.
- No confidence-calibration step before the verdict — rejected because it adds a tap to every turn in a loop being optimised for completion, and it needs tuning a mocked judge can't give.
- No second "targeted worst-terms" session type — named gap, not designed this sprint.
- No mid-answer language-switch handling — named gap, real for the product but out of scope for a v1 sprint.
- No pause/resume into one take — single continuous take only, already deferred by the brief.
- No mic-hardware-busy handling (e.g. on a call) — named gap, rare enough in practice not to design for.
- No designed network/judge-error/timeout screens — a session can end on a named-gap error state, defensible in a mocked prototype, not an engineered one.
- No dismissal or long-message handling on Knowie's message component — named gap in that component's own build notes, not a regression.
