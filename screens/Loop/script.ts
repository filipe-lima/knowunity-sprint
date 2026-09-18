/**
 * The mocked scripts for Loop, one per selectable Hub topic. Per
 * docs/SPEC.md: "Fixed script per term... curated, not uniform — built so
 * one full run tours every path... each term needs at least two scripted
 * variants" for Discard's reroll. No real STT, no real judge — the
 * verdict is decided the moment a term's script is chosen, never computed
 * from what's actually said.
 *
 * **Restructured 2026-09-16, on direct request:** Hub's 4 selectable
 * rows (Research Methods, Cell biology, Legal studies, Terms you missed —
 * the 4th newly selectable, see screens/Hub/RecallHub.tsx) each need real,
 * topic-appropriate content, not one fixed script regardless of what's
 * tapped in Hub. `TOPIC_TERMS` below replaces the old single `TERMS`
 * export; `screens/Loop/Loop.tsx` picks the right one from the `topic`
 * prop `app/loop/page.tsx` passes in (defaulting to `research-methods`).
 *
 * **The five-path shape every topic's 5 terms follow, in order:**
 * 1. Unaided pass — one clean attempt, `success`.
 * 2. Hinted pass — miss, then hint, then a retry that succeeds.
 * 3. Recovered miss — miss, then a *bare* retry (no hint) that succeeds.
 * 4. Recoverable almost — `almost` (the real `had`/`missing` two-line
 *    copy), then a retry that succeeds.
 * 5. Skip-designated — the term this run's top-bar Skip is meant to
 *    exercise (`skippable: true`, documentation only, never read
 *    elsewhere in the app — see the rule below), with a real, safe
 *    single-attempt success anyway.
 *
 * **Two hard rules for every variant, present and future — both learned
 * from real bugs, not stated up front:**
 * - **A variant's final scripted attempt is always `'success'` — never a
 *   repeating `miss`/`almost`.** `attemptIndex` clamps to a variant's last
 *   attempt once "Try again" runs out of scripted attempts to advance
 *   through (`screens/Loop/Loop.tsx`'s `handleTryAgain`), so a variant
 *   whose only/last attempt is non-terminal becomes a closed loop —
 *   confirmed live 2026-09-16 (Internal validity's original single-
 *   attempt Almost, and Ecological validity's Discard-alternate, both had
 *   this bug; both fixed by adding a second, successful attempt). This is
 *   also why Reveal (a second miss escalating to a mandatory explanation
 *   + say-it-back) was removed entirely the same day — it was never part
 *   of the committed Figma flow (no "Loop 9" exists in the real 17-frame
 *   set) and this rule replaces it: a miss just resolves normally by the
 *   second attempt instead.
 * - **Every term needs real, non-empty transcript text on every
 *   attempt, including the skip-designated one.** Nothing stops a
 *   student recording instead of skipping (`skippable` is documentation
 *   only, confirmed never read elsewhere in the app) — an empty
 *   transcript there produced a real blank "You said" block, fixed
 *   2026-09-16.
 *
 * Every term/instruction/provenance triple and every Research Methods
 * transcript marked "real" comes verbatim from a real Figma Loop screen
 * node (see the plan, now-do-the-same-kind-falcon.md). Cell biology,
 * Legal studies, and Terms you missed are new topics with no Figma
 * frames of their own — their content is written to the same shape and
 * rules, not pulled from any real screen. "Terms you missed"'s own terms
 * are deliberately reused from the other three topics (framed as missed
 * last session) rather than invented from scratch, including one real
 * transcript fragment confirmed live on Loop 15's text-mode screen
 * ("When the people you study aren't representative of the group you
 * want to...").
 */

export type Verdict = 'success' | 'almost' | 'miss';

export interface TermAttempt {
  transcript: string;
  verdict: Verdict;
  /** Only meaningful when verdict is 'almost'. */
  had?: string;
  missing?: string;
}

export interface TermVariant {
  /** One attempt (term resolves immediately) or two (a miss/almost, then
   *  a second attempt after a hint or a direct retry) — the second, when
   *  present, is always 'success' (see the file-level rule above). */
  attempts: [TermAttempt] | [TermAttempt, TermAttempt];
  /** Shown on the Hint-revealed screen, only relevant if attempts[0] is a miss. */
  hintBody?: string;
}

export interface TermScript {
  term: string;
  instruction: string;
  provenance: string;
  /** True only for the dedicated skip-path term — the one this run's
   *  Skip affordance is meant to exercise. Documentation only; recording
   *  on it instead works fine too (see the file-level rule above). */
  skippable?: boolean;
  /** Primary script, and Discard's alternate reroll. */
  variants: [TermVariant, TermVariant];
}

export type TopicSlug = 'research-methods' | 'cell-biology' | 'legal-studies' | 'terms-you-missed';

export const TOPIC_LABELS: Record<TopicSlug, string> = {
  'research-methods': 'Research Methods',
  'cell-biology': 'Cell biology',
  'legal-studies': 'Legal studies',
  'terms-you-missed': 'Terms you missed',
};

export function isTopicSlug(value: string | null | undefined): value is TopicSlug {
  return !!value && Object.prototype.hasOwnProperty.call(TOPIC_LABELS, value);
}

const RESEARCH_METHODS_TERMS: TermScript[] = [
  // 1. Unaided pass. Real transcript, real verdict label ("Got it").
  {
    term: 'Construct validity',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, read Tuesday',
    variants: [
      {
        attempts: [
          {
            transcript:
              'Whether a test actually measures the thing it claims to measure, not something next to it.',
            verdict: 'success',
          },
        ],
      },
      // Discard's alternate — mocked, no real "same term, different
      // outcome" reference exists.
      {
        attempts: [
          {
            transcript: 'It means the test is valid, I think.',
            verdict: 'miss',
          },
          {
            transcript:
              'Whether the test measures the actual concept it is supposed to, not a related one.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about what the test claims to measure versus what it might accidentally measure instead.',
      },
    ],
  },
  // 2. Hinted pass. Real miss verdict label ("Not yet"), real hint body,
  // real caption about the reduced score. Second-attempt transcript is
  // mocked — no real "passed after a hint" screen exists.
  {
    term: 'Confounding variable',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, read Tuesday',
    variants: [
      {
        attempts: [
          {
            transcript: 'Something that messes up the results.',
            verdict: 'miss',
          },
          {
            transcript:
              'A variable that affects both what you are measuring and what you think is causing it, so it hides the real relationship.',
            verdict: 'success',
          },
        ],
        hintBody:
          'It affects both the thing you are measuring and the thing you think is causing it.',
      },
      {
        attempts: [
          {
            transcript:
              'A third factor that influences both the cause and the effect you are studying.',
            verdict: 'success',
          },
        ],
      },
    ],
  },
  // 3. Recovered miss (bare retry, no hint). Was originally scripted as
  // miss→miss→Reveal — revised 2026-09-16 when Reveal was removed
  // entirely; the second attempt now succeeds instead of escalating.
  {
    term: 'Ecological validity',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, read Tuesday',
    variants: [
      {
        attempts: [
          { transcript: 'Whether the study feels realistic.', verdict: 'miss' },
          {
            transcript: 'Whether the results still apply outside the lab, in real-world settings.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about whether the findings hold up in a real-world setting, not just in a controlled one.',
      },
      {
        attempts: [
          {
            transcript: 'It is about real-world settings somehow.',
            verdict: 'almost',
            had: 'You had: it relates to real-world settings.',
            missing: 'That it specifically means the findings generalize beyond the lab.',
          },
          {
            transcript:
              'Whether a study’s findings generalize to real-world settings, not just the conditions they were tested under.',
            verdict: 'success',
          },
        ],
      },
    ],
  },
  // 4. Recoverable almost. Real two-line "You had / Missing" pattern
  // reused; sentence content is mocked. Second attempt added 2026-09-16 —
  // the primary variant used to script only one attempt, so "Try again"
  // replayed the identical Almost verdict forever.
  {
    term: 'Internal validity',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, read Tuesday',
    variants: [
      {
        attempts: [
          {
            transcript: 'It is about whether the study design is solid.',
            verdict: 'almost',
            had: 'You had: it is about the study’s own design.',
            missing: 'Missing: ruling out other explanations for the result.',
          },
          {
            transcript:
              'Whether the study design rules out other explanations for the result, so the cause you claim is the real one.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          {
            transcript: 'Whether the study design rules out other explanations for the result.',
            verdict: 'success',
          },
        ],
      },
    ],
  },
  // 5. Skip-designated.
  {
    term: 'Random assignment',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, read Tuesday',
    skippable: true,
    variants: [
      {
        attempts: [
          {
            transcript:
              'Assigning participants to groups by chance, so each has an equal shot at any condition.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'Putting people into groups randomly so it is fair.', verdict: 'miss' },
          {
            transcript:
              'Assigning each participant to a group purely by chance, so the groups end up roughly equivalent.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about how each participant lands in a group — by chance, not by choice or characteristic.',
      },
    ],
  },
];

const CELL_BIOLOGY_TERMS: TermScript[] = [
  {
    term: 'Cell membrane',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, read last week',
    variants: [
      {
        attempts: [
          { transcript: 'The selective barrier that controls what enters and leaves the cell.', verdict: 'success' },
        ],
      },
      {
        attempts: [
          { transcript: 'The outside layer of the cell.', verdict: 'miss' },
          {
            transcript: 'The membrane that controls which substances can pass into or out of the cell.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about what makes it "selective" — not just that it wraps the cell, but that it chooses what gets through.',
      },
    ],
  },
  {
    term: 'Mitochondria',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, read last week',
    variants: [
      {
        attempts: [
          { transcript: 'The powerhouse of the cell.', verdict: 'miss' },
          {
            transcript: 'The organelle that produces ATP through cellular respiration, powering the cell.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about the actual molecule it produces for the cell to use as energy, not just the "powerhouse" phrase.',
      },
      {
        attempts: [{ transcript: 'The organelle that generates most of the cell’s ATP.', verdict: 'success' }],
      },
    ],
  },
  {
    term: 'Osmosis',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, read last week',
    variants: [
      {
        attempts: [
          { transcript: 'Water moving around a cell.', verdict: 'miss' },
          {
            transcript:
              'The movement of water across a membrane from an area of low solute concentration to an area of high solute concentration.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about which direction the water moves, and what it is responding to — water moving, not sugar or salt.',
      },
      {
        attempts: [
          { transcript: 'Water passing through a membrane toward the more concentrated side.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Diffusion',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, read last week',
    variants: [
      {
        attempts: [
          {
            transcript: 'Molecules spreading out from high to low concentration.',
            verdict: 'almost',
            had: 'You had: molecules move from high to low concentration.',
            missing: 'Missing: that this happens passively, with no energy required.',
          },
          {
            transcript:
              'The passive movement of molecules from an area of high concentration to low concentration, needing no energy, until equilibrium is reached.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          {
            transcript: 'The passive movement of molecules from high to low concentration until they are evenly spread.',
            verdict: 'success',
          },
        ],
      },
    ],
  },
  {
    term: 'Nucleus',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, read last week',
    skippable: true,
    variants: [
      {
        attempts: [
          {
            transcript: 'The organelle that holds the cell’s genetic material and controls its activities.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'The part of the cell with the DNA in it.', verdict: 'miss' },
          {
            transcript: 'The membrane-bound organelle that stores the cell’s DNA and directs its activity.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about what it stores, and what role that gives it in directing everything else the cell does.',
      },
    ],
  },
];

const LEGAL_STUDIES_TERMS: TermScript[] = [
  {
    term: 'Precedent',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, read Friday',
    variants: [
      {
        attempts: [
          {
            transcript: 'A prior court decision used as a guide for deciding future cases with similar facts.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'An old court case.', verdict: 'miss' },
          {
            transcript: 'A previous ruling that courts use to decide similar cases that come up later.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about why courts would look backward at all — what earlier decisions are actually used for.',
      },
    ],
  },
  {
    term: 'Burden of proof',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, read Friday',
    variants: [
      {
        attempts: [
          { transcript: 'Who has to prove it in court.', verdict: 'miss' },
          {
            transcript: 'The obligation of a party to prove their claim, usually resting on whoever is making the accusation.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about which side carries the responsibility to prove their claim, and how much evidence they need.',
      },
      {
        attempts: [
          { transcript: 'The responsibility one side has to prove their case to the required standard.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Tort',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, read Friday',
    variants: [
      {
        attempts: [
          { transcript: 'A crime against someone.', verdict: 'miss' },
          {
            transcript: 'A civil wrong that causes harm or loss, for which the injured party can sue for damages.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think civil, not criminal — who sues who, not who gets arrested.',
      },
      {
        attempts: [
          { transcript: 'A civil wrong, separate from a crime, that lets the injured party claim damages.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Jurisdiction',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, read Friday',
    variants: [
      {
        attempts: [
          {
            transcript: 'The authority a court has.',
            verdict: 'almost',
            had: 'You had: the authority of a court.',
            missing: 'Missing: that it is specifically the authority to hear and decide a particular case.',
          },
          {
            transcript: 'The official authority of a court to hear and decide a particular case.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'The court’s official power to hear and rule on a given case.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Statute',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, read Friday',
    skippable: true,
    variants: [
      {
        attempts: [
          { transcript: 'A written law formally enacted by a legislative body.', verdict: 'success' },
        ],
      },
      {
        attempts: [
          { transcript: 'A law that was written down somewhere.', verdict: 'miss' },
          { transcript: 'A law formally passed by a legislature, written down and codified.', verdict: 'success' },
        ],
        hintBody: 'Think about who actually passes it — not just that it is written down, but that a legislature enacted it.',
      },
    ],
  },
];

// Deliberately reuses terms from the other three topics, framed as
// "missed last session" — a real, independent script, not a reference
// into the others (see the file-level comment).
const TERMS_YOU_MISSED_TERMS: TermScript[] = [
  {
    term: 'Sampling bias',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, missed last session',
    variants: [
      {
        attempts: [
          {
            // Real transcript fragment, confirmed live on Loop 15's real
            // text-mode screen.
            transcript: 'When the people you study are not representative of the group you want to generalize to.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'When your sample is not random.', verdict: 'miss' },
          {
            transcript:
              'When the group you actually studied is not representative of the wider population you want to draw conclusions about.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about who ends up in the sample versus who you actually want to generalize to.',
      },
    ],
  },
  {
    term: 'Cell membrane',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, missed last session',
    variants: [
      {
        attempts: [
          { transcript: 'The outside layer of the cell.', verdict: 'miss' },
          {
            transcript: 'The selective barrier that controls what enters and leaves the cell.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think about what makes it "selective" — not just that it wraps the cell, but that it chooses what gets through.',
      },
      {
        attempts: [
          { transcript: 'The membrane that decides what can pass into or out of the cell.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Tort',
    instruction: 'Say what it means, out loud',
    provenance: 'Legal studies, missed last session',
    variants: [
      {
        attempts: [
          { transcript: 'A crime against someone.', verdict: 'miss' },
          {
            transcript: 'A civil wrong that causes harm or loss, for which the injured party can sue for damages.',
            verdict: 'success',
          },
        ],
        hintBody: 'Think civil, not criminal — who sues who, not who gets arrested.',
      },
      {
        attempts: [
          { transcript: 'A civil wrong that lets the injured party claim damages, separate from a crime.', verdict: 'success' },
        ],
      },
    ],
  },
  {
    term: 'Diffusion',
    instruction: 'Say what it means, out loud',
    provenance: 'Cell biology, missed last session',
    variants: [
      {
        attempts: [
          {
            transcript: 'Molecules spreading out from high to low concentration.',
            verdict: 'almost',
            had: 'You had: molecules move from high to low concentration.',
            missing: 'Missing: that this happens passively, with no energy required.',
          },
          {
            transcript:
              'The passive movement of molecules from high to low concentration, needing no energy, until they are evenly spread.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          {
            transcript: 'The passive movement of molecules from an area of high concentration to low concentration.',
            verdict: 'success',
          },
        ],
      },
    ],
  },
  {
    term: 'Confounding variable',
    instruction: 'Say what it means, out loud',
    provenance: 'Research Methods, missed last session',
    skippable: true,
    variants: [
      {
        attempts: [
          {
            transcript:
              'A variable that affects both what you are measuring and what you think is causing it, so it hides the real relationship.',
            verdict: 'success',
          },
        ],
      },
      {
        attempts: [
          { transcript: 'Something that messes up the results.', verdict: 'miss' },
          {
            transcript: 'A third factor that influences both the cause and the effect you are studying.',
            verdict: 'success',
          },
        ],
        hintBody: 'It affects both the thing you are measuring and the thing you think is causing it.',
      },
    ],
  },
];

export const TOPIC_TERMS: Record<TopicSlug, TermScript[]> = {
  'research-methods': RESEARCH_METHODS_TERMS,
  'cell-biology': CELL_BIOLOGY_TERMS,
  'legal-studies': LEGAL_STUDIES_TERMS,
  'terms-you-missed': TERMS_YOU_MISSED_TERMS,
};
