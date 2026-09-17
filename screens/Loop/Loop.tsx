'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronLeft, Mic, Pencil } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { RecallCard } from '../../components/RecallCard/RecallCard';
import { RecordControl } from '../../components/RecordControl/RecordControl';
import { RecallBlock } from '../../components/RecallBlock/RecallBlock';
import { VerdictBadge } from '../../components/VerdictBadge/VerdictBadge';
import { MascotSlot } from '../../components/MascotSlot/MascotSlot';
import { MascotArt } from '../../components/shared/MascotArt';
import { TextBlock } from '../../components/TextBlock/TextBlock';
import { ButtonIcon } from '../../components/ButtonIcon/ButtonIcon';
import { Button } from '../../components/Button/Button';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { IconSlot } from '../../components/IconSlot/IconSlot';
import { Sheet } from '../../components/Sheet/Sheet';
import { TopBar } from '../../components/TopBar/TopBar';
import { TermPip } from '../../components/TermPip/TermPip';
import { TOPIC_TERMS, TOPIC_LABELS, isTopicSlug, type TopicSlug, type Verdict } from './script';
import type { SummaryResultRow } from '../Summary/Summary';

/**
 * Loop — screen 4 from docs/SPEC.md. One screen, one RecallCard, a single
 * state machine absorbing every verdict/branch/text-mode variant, per
 * SPEC.md's own words. Real content and every correction against SPEC.md
 * this screen required (Miss/Almost's real four-action stack, the
 * dispute-cap copy conflict, Transcribing's real gap, the "Checking"
 * leftover, Text mode's persistent banner) are documented in the plan
 * (now-do-the-same-kind-falcon.md) and in this file's own comments at each
 * relevant point, not repeated in full here.
 */

type LoopState =
  | 'idle'
  | 'recording'
  | 'transcribing'
  | 'wait'
  | 'verdict'
  | 'hintRevealed'
  | 'disputeConfirm';

const VERDICT_LABEL: Record<Verdict, string> = {
  success: 'Got it',
  almost: 'Almost',
  miss: 'Not yet',
};

export interface LoopProps {
  /** Which Hub topic to play — `app/loop/page.tsx` reads this from the
   *  `topic` query param. Defaults to `research-methods` for any direct
   *  `/loop` link that doesn't specify one (e.g. the Cannot-speak
   *  sheet's own "Yes, let me type" from Hub). */
  topic?: string;
}

export function Loop({ topic }: LoopProps) {
  const router = useRouter();
  const topicSlug: TopicSlug = isTopicSlug(topic) ? topic : 'research-methods';
  const terms = TOPIC_TERMS[topicSlug];

  const [hasStarted, setHasStarted] = useState(false);
  const [termIndex, setTermIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [loopState, setLoopState] = useState<LoopState>('idle');
  const [disputeOrigin, setDisputeOrigin] = useState<'almost' | 'miss' | null>(null);
  const [textMode, setTextMode] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [micPermissionAsked, setMicPermissionAsked] = useState(false);
  const [results, setResults] = useState<SummaryResultRow[]>([]);
  const [verdictKind, setVerdictKind] = useState<Verdict | 'flagged' | null>(null);
  // Tracks whether Hint was actually shown before a retry, since a retry is
  // now reachable both from Hint revealed and directly from the first
  // verdict (the real Figma flow puts a bare "Try again" next to "Hint" on
  // both Miss and Almost) — outcomeRow() below needs this to avoid
  // mislabeling a hint-less retry as "Said it after a hint".
  const [hintShown, setHintShown] = useState(false);
  // New 2026-09-16, on direct request: Wait no longer shows "Checking"
  // and the correction control at once (the real Figma frame did, node
  // 13759:45381 — a real behavior being deliberately changed here, not a
  // bug). Resets to false whenever Wait is (re-)entered; flips once the
  // mocked judge is done "checking," swapping the status row for the
  // correction control instead of showing both together.
  const [checkingDone, setCheckingDone] = useState(false);
  // New 2026-09-16, on direct request, overriding sprint-context.md's
  // locked "No pause/resume into one take" decision — see
  // components/RecordControl/RecordControl.tsx's own doc comment on its
  // new `Paused` state for what's confirmed vs. a judgment call.
  const [paused, setPaused] = useState(false);

  const term = terms[termIndex];
  const variant = term.variants[variantIndex];
  const attempt = variant.attempts[Math.min(attemptIndex, variant.attempts.length - 1)];
  const skipDisabled = loopState === 'recording' || loopState === 'transcribing';

  function recordResult(row: SummaryResultRow) {
    setResults((prev) => [...prev, row]);
  }

  function goToNextTerm() {
    if (termIndex + 1 >= terms.length) {
      const allClear = ![...results].some((r) => r.flagged);
      router.push(allClear ? '/summary?allClear=1' : '/summary');
      return;
    }
    setTermIndex((i) => i + 1);
    setVariantIndex(0);
    setAttemptIndex(0);
    setHintShown(false);
    setLoopState('idle');
  }

  // SPEC.md's Idle section: first-ever tap triggers the native OS mic
  // permission dialog (not a custom card); Allow auto-starts recording
  // immediately; Deny — or a later tap where permission was already
  // revoked, pre-checked with no failed-attempt beat — routes to the
  // Cannot-speak sheet, identical copy either way. Nothing here does any
  // STT or processes the captured audio (still fully mocked past this
  // point) — the stream is stopped immediately after the real prompt
  // resolves; only the genuine browser permission prompt itself is real.
  async function startRecording() {
    if (textMode) return;

    if (!micPermissionAsked) {
      setMicPermissionAsked(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setLoopState('recording');
      } catch {
        setSheetOpen(true);
      }
      return;
    }

    if (navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (status.state === 'denied') {
          setSheetOpen(true);
          return;
        }
      } catch {
        // Permissions API doesn't support querying 'microphone' in every
        // browser (e.g. Safari) — fall through rather than block on it.
      }
    }
    setLoopState('recording');
  }

  function handleDiscard() {
    setPaused(false);
    setVariantIndex((v) => (v === 0 ? 1 : 0) as 0 | 1);
    setAttemptIndex(0);
    setLoopState('idle');
  }

  // Reveal/Say-it-back removed entirely 2026-09-16, on direct request —
  // Reveal was never part of the committed Figma flow (no "Loop 9" exists
  // in the real 17-frame set), and every scripted variant's final attempt
  // is now guaranteed to resolve to 'success' (see script.ts's own rule),
  // so a miss is just a miss, always, regardless of attempt number — it
  // never needs to escalate anywhere else.
  function resolveAttempt() {
    const v = attempt.verdict;
    setVerdictKind(v);
    setLoopState('verdict');
    if (v === 'success') {
      recordResult(outcomeRow('success'));
    }
  }

  function handlePause() {
    setPaused(true);
  }

  function handleResume() {
    setPaused(false);
  }

  function handleSubmit() {
    setPaused(false);
    setLoopState('transcribing');
    setTimeout(() => {
      setCheckingDone(false);
      setLoopState('wait');
      setTimeout(() => setCheckingDone(true), 700);
      setTimeout(resolveAttempt, 1200);
    }, 900);
  }

  function handleChatSend() {
    setChatLoading(true);
    setTimeout(() => {
      setChatLoading(false);
      resolveAttempt();
    }, 900);
  }

  // New 2026-09-16, on direct request: the correction control used to
  // disappear once a verdict resolved (Figma's own real content only ever
  // shows it on Wait — confirmed live, node 13759:45381 — so this is a
  // genuinely new decision, not a stale-docs correction). Persisting it
  // through every verdict means a student can redo a take that already
  // scored — when that's the case, the already-recorded result for this
  // term is removed first so Summary never double-counts it.
  function handleEditTranscript() {
    setResults((prev) => prev.filter((r) => r.term !== term.term));
    setLoopState('idle');
  }

  function outcomeRow(verdict: Verdict | 'flagged' | 'skipped'): SummaryResultRow {
    const outcomeLabel =
      verdict === 'success'
        ? attemptIndex > 0
          ? hintShown
            ? 'Said it after a hint'
            : 'Said it after a retry'
          : 'Said it unaided'
        : verdict === 'flagged'
          ? 'Flagged for review'
          : verdict === 'skipped'
            ? 'Skipped'
            : 'Almost there';
    return { term: term.term, outcome: outcomeLabel, flagged: verdict === 'flagged' || verdict === 'skipped' };
  }

  function handleHint() {
    setHintShown(true);
    setLoopState('hintRevealed');
  }

  function handleTryAgain() {
    if (attemptIndex + 1 < variant.attempts.length) {
      setAttemptIndex((a) => a + 1);
    }
    setLoopState(textMode ? 'idle' : 'recording');
  }

  function handleTopSkip() {
    if (skipDisabled) return;
    recordResult(outcomeRow('skipped'));
    goToNextTerm();
  }

  function handleDispute(origin: 'almost' | 'miss') {
    setDisputeOrigin(origin);
    setLoopState('disputeConfirm');
  }

  function handleDisputeConfirmYes() {
    recordResult(outcomeRow('flagged'));
    setVerdictKind('flagged');
    setLoopState('verdict');
  }

  function handleDisputeConfirmNo() {
    setVerdictKind(disputeOrigin);
    setLoopState('verdict');
  }

  // TopBar's own real Loop variant is the progress bar (design-system.md /
  // TopBar's own doc comment: Leading + a filling Progress slot of five
  // real TermPip instances + Trailing) — not used until now because none
  // of the 12 real Loop Figma frames actually instantiate it (SPEC.md
  // Open #3); resolving that open question by using it for real.
  //
  // One real mismatch, not silently papered over: TopBar's own Trailing
  // slot is a fixed control-600 (48px) box — sized for the icon-only
  // buttonIcon Figma's real Leading/Trailing instances both use, not for
  // a text button. Every real Loop screen's actual Skip control is a text
  // button ("Skip"), not an icon. Passed through anyway below and
  // verified visually rather than guessed — if it clips, that's the next
  // thing to fix, not assumed fine.
  const header = (
    <TopBar
      variant="Loop"
      leading={
        <ButtonIcon
          variant="Tertiary"
          size="M"
          icon={<ChevronLeft style={{ width: '100%', height: '100%' }} />}
          aria-label="Back to Recall Hub"
          onClick={() => router.push('/hub')}
        />
      }
      progress={
        <>
          {terms.map((t, i) => (
            <TermPip key={t.term} state={i < termIndex ? 'Done' : i === termIndex ? 'Current' : 'Upcoming'} />
          ))}
        </>
      }
      trailing={
        <Button
          variant="Tertiary"
          size="S"
          cta="Skip"
          state={skipDisabled ? 'Disabled' : 'Default'}
          onClick={handleTopSkip}
        />
      }
    />
  );

  if (!hasStarted) {
    return (
      <Scaffold
        topNavigation={header}
        middleContent={
          <div
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 'var(--space-300)',
              cursor: 'pointer',
            }}
            onClick={() => setHasStarted(true)}
          >
            {/* No real Figma frame for this state (SPEC.md Open #7) — copy
                adapted from Home E's own real knowieMessage pattern: "You
                read Research Methods on Tuesday. Say five terms back to
                me? About 3 minutes." Topic-driven since 2026-09-16 — was
                hardcoded to Research Methods regardless of what was
                actually selected in Hub. */}
            <TextBlock
              variant="L"
              title={`Today: ${terms.length} terms from ${TOPIC_LABELS[topicSlug]}`}
              caption="About 3 minutes. Tap to start."
              showCaption
            />
          </div>
        }
      />
    );
  }

  // RecallCard's own children wrapper (components/RecallCard) is a plain
  // flex column with no alignItems, so anything that doesn't stretch full
  // width (like MascotSlot) sits at the left edge by default — centered
  // here, scoped to this screen.
  function renderMascot(crop: 'Full' | 'Peek') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <MascotSlot size="2XL" crop={crop}>
          <MascotArt pose="standby" />
        </MascotSlot>
      </div>
    );
  }

  // ChatInput is purely presentational — confirmed directly in its own
  // source, it has no onChange/text-entry mechanism at all, only a
  // controlled `value` display and click handlers. Real typing isn't
  // possible to simulate, which actually lines up with SPEC.md's own
  // "content doesn't matter" rule: shown straight in "Ready to send" so
  // the trailing send control is real and tappable, no fake typing beat.
  function renderChatInputBottom() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
            <IconSlot size="200">
              <Mic style={{ width: '100%', height: '100%' }} />
            </IconSlot>
            <span style={{ fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Answering by text for this session
            </span>
          </div>
          {/* New 2026-09-16, on direct request: text mode was sticky for
              the whole session with no way back (sprint-context.md's own
              decision, now relaxed) — confirmed live neither real
              text-mode Figma screen (Loop 14/15) has this control either,
              so it's a genuinely new addition, not a stale-docs fix. */}
          <Button variant="Tertiary" size="S" cta="Switch back to voice" onClick={() => setTextMode(false)} />
        </div>
        <ChatInput
          status={chatLoading ? 'Loading' : 'Ready to send'}
          value={chatLoading ? undefined : 'Tap to send'}
          onTrailingClick={chatLoading ? undefined : handleChatSend}
        />
      </div>
    );
  }

  // New 2026-09-16, on direct request: persisted through every verdict
  // now, not just Wait (see handleEditTranscript's own comment for why).
  // Text mode never renders this — sprint-context.md's existing rule for
  // Wait ("no transcript-correction control... no transcript to
  // mis-hear") applies identically wherever this control now lives, not
  // just Wait specifically; a typed answer was never mis-transcribed.
  function renderCorrectionControl() {
    if (textMode) return null;
    return (
      <Button
        variant="Tertiary"
        size="S"
        cta="That's not what I said"
        showLeftIcon
        leftIcon={<Pencil style={{ width: '100%', height: '100%' }} />}
        onClick={handleEditTranscript}
      />
    );
  }

  // Per the real Figma screens: the card only ever holds term info, the
  // verdict badge, feedback text, the transcript block and its correction
  // control (RecallCard's own Content-slot description: "badge, aside,
  // transcript, correction button can all sit in it at once"). Every real
  // CTA and every voice/text input control — RecordControl, the mic
  // trigger, hint/try-again/skip/dispute-resolution buttons, ChatInput —
  // lives outside the card, pinned to Scaffold's `bottomContent` slot
  // below it, not stacked inside. Mascot (Peek crop, small) sits above the
  // card on Recording/Say-it-back per the real screens; Idle keeps the
  // Full-crop centered mascot SPEC.md confirms for that state specifically.
  const { mascot, card, bottom }: { mascot: ReactNode; card: ReactNode; bottom: ReactNode } = (() => {
    switch (loopState) {
      case 'idle':
        return textMode
          ? { mascot: null, card: null, bottom: renderChatInputBottom() }
          : {
              mascot: renderMascot('Full'),
              card: null,
              bottom: (
                <RecordControl
                  state="Idle"
                  onMicClick={startRecording}
                  escape={
                    <Button variant="Tertiary" size="M" cta="I can't speak right now" onClick={() => setSheetOpen(true)} />
                  }
                />
              ),
            };
      case 'recording':
        return {
          mascot: renderMascot('Peek'),
          card: null,
          bottom: (
            <RecordControl
              state={paused ? 'Paused' : 'Recording'}
              onDiscardClick={handleDiscard}
              onSubmitClick={handleSubmit}
              onPauseClick={handlePause}
              onResumeClick={handleResume}
            />
          ),
        };
      case 'transcribing':
        // Screen-level gap, not a real RecordControl state — see
        // docs/component-gaps.md. Controls are inert (no handlers).
        // `amplitudeFrozen`: fulfils SPEC.md's own "bars stay visible but
        // freeze" line for this beat, now that Recording's meter
        // otherwise animates live by default.
        return {
          mascot: renderMascot('Peek'),
          card: null,
          bottom: <RecordControl state="Recording" caption="Transcribing" amplitudeFrozen />,
        };
      case 'wait':
        return {
          // SPEC.md confirms MascotSlot (2XL) for Wait without naming a
          // crop; Peek matches the real Recording/Say-it-back screens'
          // sibling treatment — a judgment call, not directly confirmed.
          mascot: renderMascot('Peek'),
          card: (
            <RecallBlock variant="Transcript" label="You said" body={attempt.transcript}>
              {checkingDone ? (
                renderCorrectionControl()
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
                  <IconSlot size="200">
                    <Mic style={{ width: '100%', height: '100%' }} />
                  </IconSlot>
                  <span
                    style={{
                      fontFamily: 'var(--font-family-default)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Checking
                  </span>
                </div>
              )}
            </RecallBlock>
          ),
          bottom: null,
        };
      case 'verdict': {
        const verdict = verdictKind ?? attempt.verdict;
        if (verdict === 'success') {
          return {
            mascot: null,
            card: (
              <>
                <VerdictBadge variant="Success" label={VERDICT_LABEL.success} />
                <RecallBlock variant="Transcript" label="You said" body={attempt.transcript}>
                  {renderCorrectionControl()}
                </RecallBlock>
              </>
            ),
            bottom: <Button variant="Primary" size="L" cta="Next term" onClick={goToNextTerm} />,
          };
        }
        if (verdict === 'flagged') {
          return {
            mascot: null,
            card: (
              <>
                <VerdictBadge variant="Flagged" label="Flagged for review" />
                <p style={{ fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Sent. It stays out of your practice list.
                </p>
                <RecallBlock variant="Transcript" label="You said" body={attempt.transcript}>
                  {renderCorrectionControl()}
                </RecallBlock>
              </>
            ),
            bottom: <Button variant="Primary" size="L" cta="Next term" onClick={goToNextTerm} />,
          };
        }
        const isMiss = verdict === 'miss';
        return {
          mascot: null,
          card: (
            <>
              <VerdictBadge variant={isMiss ? 'Miss' : 'Almost'} label={VERDICT_LABEL[verdict]} />
              {isMiss ? null : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)' }}>
                  <p style={{ margin: 0, fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {attempt.had}
                  </p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {attempt.missing}
                  </p>
                </div>
              )}
              <RecallBlock variant="Transcript" label="You said" body={attempt.transcript}>
                {renderCorrectionControl()}
              </RecallBlock>
              <Button
                variant="Tertiary"
                size="S"
                cta="My answer was right"
                onClick={() => handleDispute(isMiss ? 'miss' : 'almost')}
              />
            </>
          ),
          // Identical action pair on both Miss and Almost — confirmed
          // directly against the live "COMMITED FLOW FINAL WITHOUT
          // COMPONENTS" Figma frame (Loop 6 / Loop 8, node 13759:45445 /
          // 13759:45508): Try again (Primary/L) then Hint (Secondary/L),
          // in that order. This overrides sprint-context.md's written "no
          // bare try-again" / "no re-explain" rules and drops the
          // "Re-explain" action entirely — the committed flow has no
          // dedicated re-explain trigger; Reveal is reached only via a
          // second miss (resolveAttempt below).
          bottom: (
            <>
              <Button variant="Primary" size="L" cta="Try again" onClick={handleTryAgain} />
              <Button variant="Secondary" size="L" cta="Hint" onClick={handleHint} />
            </>
          ),
        };
      }
      case 'hintRevealed':
        return {
          mascot: null,
          card: (
            <>
              <VerdictBadge variant="Miss" label={VERDICT_LABEL.miss} />
              <RecallBlock variant="Hint" label="Hint" body={variant.hintBody ?? ''} />
              <p style={{ fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                One attempt, and it scores below an unaided answer.
              </p>
            </>
          ),
          bottom: <Button variant="Primary" size="L" cta="Try again" onClick={handleTryAgain} />,
        };
      case 'disputeConfirm':
        return {
          mascot: null,
          card: (
            <>
              <VerdictBadge variant={disputeOrigin === 'miss' ? 'Miss' : 'Almost'} label={disputeOrigin === 'miss' ? VERDICT_LABEL.miss : VERDICT_LABEL.almost} />
              <p style={{ fontFamily: 'var(--font-family-default)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                You&apos;re saying your answer was right?
              </p>
              {/* Real Figma copy ends "...and you get one of these per
                  session" — the cap you explicitly removed in the
                  interview. Dropped, not reproduced. */}
              <p style={{ fontFamily: 'var(--font-family-default)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                We will look at it to improve the judging. It stays out of your practice list. No points either way.
              </p>
            </>
          ),
          bottom: (
            <>
              <Button variant="Primary" size="M" cta="Yes, flag it" onClick={handleDisputeConfirmYes} />
              <Button variant="Tertiary" size="M" cta="Never mind" onClick={handleDisputeConfirmNo} />
            </>
          ),
        };
      default:
        return { mascot: null, card: null, bottom: null };
    }
  })();

  return (
    <Scaffold
      topNavigation={header}
      middleContent={
        <>
          {mascot}
          <RecallCard
            term={term.term}
            instruction={term.instruction}
            provenance={term.provenance}
            onClick={
              loopState === 'verdict' && (verdictKind === 'success' || verdictKind === 'flagged')
                ? goToNextTerm
                : undefined
            }
          >
            {card}
          </RecallCard>
        </>
      }
      bottomContent={bottom}
      showBottomSheetBackground={sheetOpen}
      bottomSheetOnly={
        sheetOpen ? (
          <Sheet
            actions={
              <>
                <Button
                  variant="Primary"
                  size="L"
                  cta="Yes, let me type"
                  onClick={() => {
                    setTextMode(true);
                    setSheetOpen(false);
                  }}
                />
                <Button variant="Tertiary" size="M" cta="No, back to home" onClick={() => setSheetOpen(false)} />
              </>
            }
          />
        ) : undefined
      }
    />
  );
}
