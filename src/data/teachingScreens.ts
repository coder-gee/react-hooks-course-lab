export type TeachingScreenStep = {
  screen: 'Lecture slides' | 'Mini-app tour' | 'Live demo' | 'Checkout lab' | 'Discussion' | 'Break' | 'Homework';
  instruction: string;
  href?: string;
  slides?: string[];
  demos?: string[];
  checkout?: string;
  checkpoint?: string;
  reference?: boolean;
  optional?: boolean;
};

export type TeachingScreenPlan = {
  summary: string;
  steps: TeachingScreenStep[];
};

// The order to teach in, rather than a collection of every related resource.
export const teachingScreens: Record<string, TeachingScreenPlan> = {
  'native-baseline': {
    summary: 'Show the cover, then give a brief tour of the mini app.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Give your short welcome on the cover.', slides: ['course-intro'] },
      { screen: 'Mini-app tour', instruction: 'Use How we’ll learn to introduce the app. Point out Slides, Live Demo, Checkout Lab, and Glossary in the app navigation so students know where to follow along and practise.' },
    ],
  },
  'hook-map': {
    summary: 'Lecture slides only. No Live demo or Checkout lab in this stage.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Introduce the tools on slide 2, then the two calling rules on slide 3.', slides: ['hooks-overview', 'hook-rules'] },
    ],
  },
  'state-snapshots': {
    summary: 'Finish demo 2, then move to stage 4 and return to slide 8. The checkout exercise comes after slides 8–9 and demo 3.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Give the brief opening on slide 4, then introduce useState on slide 5.', slides: ['section-state', 'state-memory'] },
      { screen: 'Live demo', instruction: 'Ask for a prediction, run the plain-variable version, then reveal the state version.', demos: ['remember'] },
      { screen: 'Lecture slides', instruction: 'On slide 6, one Reset click changes quantity and note together. Then introduce updater functions on slide 7.', slides: ['state-snapshot', 'state-updaters'] },
      { screen: 'Live demo', instruction: 'Start with Batching: Reset changes quantity and note together. Continue to Queued updates and compare the two quantity versions.', demos: ['queue'] },
    ],
  },
  'controlled-checkout': {
    summary: 'Show slides 8–9, briefly run demo 3, then hand over the checkout exercise. Keep the introduction to two minutes.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Return to slide 8 for controlled inputs, then slide 9 for shared state and calculated values.', slides: ['controlled-input', 'derived-state'] },
      { screen: 'Live demo', instruction: 'Briefly change quantity and note to show the summary and count following them.', demos: ['consistent'] },
      { screen: 'Checkout lab', instruction: "Change quantity and note, then Review order and Edit details. Show the matching total/count and preserved choices before students wire the starter.", checkout: 'Working reference · State, count and review', checkpoint: 'starter', reference: true },
      { screen: 'Checkout lab', instruction: 'Hand over to students: connect quantity and note to the summary.', checkout: 'Exercise · Add state to the starter' },
    ],
  },
  'effect-choice': {
    summary: 'Introduce three concrete uses on slide 11, then walk through the title demo and its dependencies. No Checkout lab task yet.',
    steps: [
      { screen: 'Lecture slides', instruction: 'On optional slide 10, recap state driving the React UI. On slide 11, explain why an outside system needs matching, then show all three cards: title follows quantity; chat connection follows roomId; map widget follows zoomLevel. Explain directly and save cleanup mechanics for Stage 6.', slides: ['section-effects', 'effect-purpose'] },
      { screen: 'Live demo', instruction: 'Open the title demo. Predict the visible result before clicking Add one, then watch the quantity and browser tab title change.', demos: ['title'] },
      { screen: 'Lecture slides', instruction: 'Explain the dependency list directly: the demo reads quantity; slide 12 reads quantity and currency. Listed value changes rerun this Effect; an unrelated note change does not.', slides: ['effect-dependencies'] },
    ],
  },
  'subscription-cleanup': {
    summary: 'Use the checkout Review/Edit loop to expose a missing timer cleanup, then repair the supplied timer child.',
    steps: [
      { screen: 'Live demo', instruction: 'Use the compact countdown banner. Predict the active count before Unmount timer; compare Run with Fix. Mount timer starts a fresh banner.', demos: ['sync'] },
      { screen: 'Lecture slides', instruction: 'Use slide 13 to pair setInterval with clearInterval and explain the functional updater.', slides: ['effect-cleanup'] },
      { screen: 'Checkout lab', instruction: 'Show the working Details → Review → Edit details loop: one timer, zero, one. The new countdown starts at 30; quantity/note persist.', checkout: 'Working reference · Effect cleanup', checkpoint: 'repair-sync', reference: true },
      { screen: 'Checkout lab', instruction: 'Show the working reference first. Students implement interval setup, functional updates and returned cleanup in the inactive timer child, then test the same loop. Check active timers as well as the countdown.', checkout: 'Exercise · Set up and clean up timer' },
    ],
  },
  'explicit-focus': {
    summary: 'Explain refs and focus after mount, show the minimal Live demo, then practice in Checkout lab.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Use slides 15–16 to explain refs and input focus. Slide 14 is an optional divider.', slides: ['section-refs', 'ref-memory', 'ref-focus'] },
      { screen: 'Live demo', instruction: 'Open Run: the note field focuses when its component mounts.', demos: ['focus'] },
      { screen: 'Checkout lab', instruction: "Type into the automatically focused field, then Review → Edit details to show focus after remount and preserved text.", checkout: 'Working reference · Input focus', checkpoint: 'sync', reference: true },
      { screen: 'Checkout lab', instruction: 'Students create and attach the ref, then focus in an Effect with []. Test first mount and Review → Edit details.', checkout: 'Exercise · Add input focus' },
    ],
  },
  break: {
    summary: 'Take the full five-minute break. No demo or coding task.',
    steps: [{ screen: 'Break', instruction: 'Show your break screen or a clock. Leave everyone’s work open and resume at minute 55.' }],
  },
  'reducer-model': {
    summary: 'Show slides 17–19 before the reducer Live demo. The next stage shows the working reset reference, then the exercise.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Introduce actions on slide 18. Slide 17 is an optional divider.', slides: ['section-reducer', 'reducer-actions'] },
      { screen: 'Lecture slides', instruction: 'On slide 19, introduce useReducer and dispatch, then explain why the reducer returns a fresh state object.', slides: ['reducer-immutability'] },
      { screen: 'Live demo', instruction: 'After slides 17–19, students predict the next cart before you run each action.', demos: ['reducer'] },
    ],
  },
  'reducer-reset': {
    summary: 'Briefly preview the working reset, then go straight to Checkout lab practice.',
    steps: [
      { screen: 'Checkout lab', instruction: "Change quantity, note and gift choices, then click Reset cart choices. This reference shows the reducer task without later Context or custom-Hook UI.", checkout: 'Working reference · Reducer reset', checkpoint: 'reducer', reference: true },
      { screen: 'Checkout lab', instruction: 'Open ReducerResetCheckoutExercise.tsx beside the checkout. Students work in this file alone: types, reducer and state wiring are supplied; define the reset action, add its whole reducer case, then dispatch and test reset.', checkout: 'Exercise · Complete the reducer reset' },
    ],
  },
  'context-owner': {
    summary: 'Introduce one Settings provider, demonstrate separate consumers, then connect the provider in the exercise.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Use optional divider 20, provider slide 21, then the three small consumers on slide 22.', slides: ['section-context', 'context-provider', 'context-consumer'] },
      { screen: 'Live demo', instruction: 'Change currency, local theme and language. Trace each consumer to the same SettingsContext.', demos: ['context'] },
      { screen: 'Checkout lab', instruction: 'Preview the existing checkout with currency and theme only. Format unit price and totals, switch theme, then verify quantity, note and Review/Edit. No exchange conversion.', checkout: 'Working reference · Settings Context', checkpoint: 'context', reference: true },
      { screen: 'Checkout lab', instruction: 'Students complete two TODO areas in ContextProviderCheckoutExercise.tsx: theme state/value in SettingsProvider, then provider placement in the exported return, then test the two checkout preferences. No language task in the lab.', checkout: 'Exercise · Share settings with Context' },
    ],
  },
  'custom-extract': {
    summary: 'Show reusable logic in Live demo, then let students complete their Hook in Checkout lab.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Introduce extraction on slide 24. Slide 23 is an optional divider.', slides: ['section-custom', 'custom-extraction'] },
      { screen: 'Live demo', instruction: 'Inspect useCountdown: state, timer ref, Effect, and the seconds/stop/restart interface.', demos: ['custom'] },
      { screen: 'Checkout lab', instruction: "Show one banner at 30 and a small top-bar timer at 45 before the profile. Watch both timers tick independently. Review clears only the banner; Edit starts it at 30. Leaving this lab clears both.", checkout: 'Working reference · Custom Hook reuse', checkpoint: 'custom', reference: true },
      { screen: 'Checkout lab', instruction: 'Start from working inline state/ref/Effect code. Students create src/exercises/hooks/useCountdown.ts, export the Hook, return seconds, then import it into the existing checkout and replace duplicate logic in both callers. Do not rename the checkout file.', checkout: 'Exercise · Extract a custom Hook' },
      { screen: 'Lecture slides', instruction: 'Revisit the calling rules only if needed.', slides: ['hook-rules'], optional: true },
    ],
  },
  'custom-reuse': {
    summary: 'Stay in Checkout lab for student predictions and testing. Live demo is a fallback.',
    steps: [
      { screen: 'Live demo', instruction: "Stop First, restart First, and unmount Second. Explain each independent caller; the checkout lab has one banner and a small top-bar caller.", demos: ['custom'] },
      { screen: 'Checkout lab', instruction: 'Recheck the single flash-sale reference before returning to student work.', checkout: 'Working reference · Custom Hook reuse', checkpoint: 'custom', reference: true },
      { screen: 'Checkout lab', instruction: 'Return to the single extracted checkout timer: verify unchanged ticking and Review/Edit remount/cleanup.', checkout: 'Exercise · Extract a custom Hook' },
      { screen: 'Live demo', instruction: 'Compare the two Live Demo calls; no second countdown is added to checkout.', demos: ['custom'], optional: true },
      { screen: 'Lecture slides', instruction: 'After testing, explain independent calls and compare them with shared Context.', slides: ['custom-independence', 'context-provider'] },
    ],
  },
  'optional-memo': {
    summary: 'If time allows, compare the versions in Live demo. No Checkout lab switch is needed.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Use slide 27 for the idea. Slide 26 is an optional divider.', slides: ['section-optimization', 'memo-result'] },
      { screen: 'Live demo', instruction: 'Students search offers, edit the unrelated note, and compare the ordinary filter with useMemo.', demos: ['memo'] },
      { screen: 'Lecture slides', instruction: 'Slide 28 introduces memo with the same filtered array passed to OffersList. Distinguish the two jobs before moving to function props.', slides: ['optimization-choice'] },
    ],
  },
  'optional-callback': {
    summary: 'After slide 28 introduces memo, show slide 29 and compare callbacks in Live demo. Finish by minute 114.',
    steps: [
      { screen: 'Lecture slides', instruction: 'Slide 29 uses ProductPage and a memo-wrapped ShippingForm. Contrast a theme change with productId or referrer changes; submission only logs.', slides: ['callback-reference'] },
      { screen: 'Live demo', instruction: 'Use the matching shipping form: toggle theme, change product/referrer, edit the address, and submit locally.', demos: ['callback'] },
    ],
  },
  'exit-transfer': {
    summary: 'Introduce the existing homework brief, then show the student workspace and first task.',
    steps: [
      { screen: 'Homework', instruction: 'Explain one automatically saved checkout draft: quantity, note and currency, automatically restored on return.', href: '/homework' },
      { screen: 'Checkout lab', instruction: 'Show the unfinished student workspace. Reducer TODOs are in src/homework/checkoutDraftReducer.ts; Hook wiring and saving Effect TODOs are in CheckoutDraft.tsx; UI and safe storage helpers are supplied.', checkout: 'Homework · Saved checkout draft', checkpoint: 'homework' },
    ],
  },
};
