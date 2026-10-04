export type TeachingSpeakingNotes = {
  cues: string[];
};
export type TeachingStage = {
  id: string;
  title: string;
  start: number;
  end: number;
  talkMinutes: number;
  show: string;
  speakingNotes?: TeachingSpeakingNotes;
  ask: string;
  expected: string;
  ifStuck: string;
  activity: string;
  check: string;
  transition: string;
  referenceIds: string[];
  demos: { id: string; label: string }[];
  checkpoint?: string;
  optional?: boolean;
  decision?: string;
};

// Private lecturer material. Share referenceSlides.ts, not this guide, with students.
export const teachingGuide: TeachingStage[] = [
  {
    id: 'native-baseline', title: 'Explore what works before Hooks', start: 0, end: 6, talkMinutes: 2,
    show: 'Show only slide 1: the dark React Hooks cover with Xsolla School / Week 3 and your name. Give the short introduction below, then open the native checkout. Keep the initial summary visible beside the quantity input. Save the Hooks overview and Rules of Hooks slides for stage 2.',
    speakingNotes: { cues: ['Welcome', 'Goal', 'How we’ll learn'] },
    ask: 'Change quantity and open the details. What already works, and why does the React summary stay the same?',
    expected: "The browser remembers what we type into this uncontrolled input. There is no React state connecting it to the summary yet. A page can respond without Hooks: the browser has built-in behavior, event handlers can run our code, and class components have their own state methods.",
    ifStuck: 'Ask the learner to point to what changed in the browser, then to the unchanged summary. Trace whether the input value is actually read by the component that renders the summary.',
    activity: 'Learners explore for a minute, think independently, and compare explanations with a partner. Wait 5–7 seconds before inviting answers.',
    check: 'Learners distinguish native field behavior from a React render update without claiming that all interaction requires Hooks.',
    transition: 'At minute 6, name the missing responsibility: React needs to remember the choice and render from it.',
    referenceIds: ['course-intro'], demos: [], checkpoint: 'starter',
  },
  {
    id: 'hook-map', title: 'Introduce the checkout roadmap', start: 6, end: 10, talkMinutes: 1,
    show: "Show slide 2 (React Hooks and their jobs). Read across each row: Hook name, general purpose, then its checkout example. Give a short overview without teaching the syntax. Show slide 3 for the two calling rules, then move to stage 3. No live demo or pair task in this stage.",
    speakingNotes: { cues: [
        "Introduce the map of tools",
        "Hook names start with use",
        "What each tool does",
        "How we’ll use it in the checkout",
        "Two rules for where Hooks can go",
        "Learn the other details as we go"
      ] },
    ask: 'No planned discussion in this stage. Take brief clarification questions if needed.',
    expected: 'Learners recognize the Hook naming pattern and can use the map as a reference. They do not need to memorize every tool yet.',
    ifStuck: 'Return to the concrete need rather than listing API names. Ask whether the value needs remembering, can be calculated, or belongs to something outside React.',
    activity: 'Learners follow the overview and scan the map. Keep it available as a reference for the examples that follow.',
    check: 'Learners can locate a Hook call at the component top level and distinguish it from calling a setter in an event.',
    transition: 'At minute 10, begin the quantity repair. Do not spend this block teaching every API on the map.',
    referenceIds: ['hooks-overview', 'hook-rules'], demos: [], checkpoint: 'starter',
  },
  {
    id: 'state-snapshots', title: 'Model remembered choices and queued updates', start: 10, end: 17, talkMinutes: 4,
    show: "Give the brief State and rendering introduction on slide 4. Move to slide 5 to introduce useState, then open the first Live demo. After the first demo, return to slide 6, then slide 7. Only then open Live demo: useState · Batching and queued updates. In that demo, show the Batching reset first, then switch to Queued updates. Keep code and behavior side by side, and restart quantity at one between comparison versions.",
    speakingNotes: { cues: [
        "Slide 4: state and rendering",
        "Slide 5: what useState gives us",
        "Live demo: useState · Local variables vs state",
        "Back to slide 6: reset quantity and note together",
        "Slide 7: build on the previous update",
        "Live demo: useState · Batching and queued updates",
        "Then stage 4: back to slide 8"
      ] },
    ask: 'What asks React to render? From quantity one, what happens when this one handler calls setQuantity(quantity + 1) twice? What changes with two updater functions?',
    expected: "Changing a plain variable does not ask React to render again. Reset updates quantity and note together in the next render. In the queued-update demo, quantity starts at one. Both direct updates read that same one and request two. Two updater functions build on each other and reach three. Both examples happen inside one click handler.",
    ifStuck: 'Substitute the value one into each direct expression. Then write the updater sequence as one → two → three. Directly teach snapshot reasoning if it is new; do not coach around a concept not yet introduced.',
    activity: 'Learners predict independently before each run, compare results, and explain what the next render receives. Introduce controlled inputs in stage 4 before the checkout exercise.',
    check: 'A learner explains both results and identifies quantity/note as remembered choices rather than copying the explanation.',
    transition: 'At minute 17, return to slides 8–9 and briefly show demo 3, then hand over the checkout exercise. Keep this introduction within the two-minute explanation budget for stage 4.',
    referenceIds: ['section-state', 'state-memory', 'state-snapshot', 'state-updaters'],
    demos: [{ id: 'remember', label: 'useState · Local variables vs state' }, { id: 'queue', label: 'useState · Batching and queued updates' }], checkpoint: 'starter',
  },
  {
    id: 'controlled-checkout', title: 'Build one owner and a consistent summary', start: 17, end: 30, talkMinutes: 2,
    show: "Return to slide 8 for controlled inputs, then slide 9 for shared ownership and derived values. Briefly show Live demo 3, useState · Controlled inputs and derived values. Then open Checkout lab: Exercise · Add state to the starter, and keep its source visible while learners work. Keep the slides and demonstration within the two-minute explanation budget. Before student work, open Working reference · State, count and review. Change quantity and note, then Review order and Edit details. Show the matching total/count and preserved choices before students wire the starter.",
    speakingNotes: { cues: [
        "Slide 8: connect the input to state",
        "Slide 9: remember choices, calculate the rest",
        "Live demo 3: controlled inputs and derived values",
        "Checkout lab: Exercise · Add state to the starter"
      ] },
    ask: 'Which values are stored, which are derived, and which component is the closest shared owner?',
    expected: "One component keeps quantity and note in state. It gives the inputs their current values and handlers to update them. We work out the total and character count while rendering, then pass those values to the components that need them.",
    ifStuck: 'First mark the changing UI values, then trace the common parent, then supply one missing syntax line. A prepared state checkpoint is available, but preserve earlier work and require the learner to explain the supplied version.',
    activity: 'Learners wire the supplied stepper and note, keep quantity within 1–10, and derive total/count. Then they add reviewing Boolean state to switch between the supplied Details and Review views, reusing quantity and note. Partners explain one design choice.',
    check: 'Quantity and note edits update all relevant displays. Review shows the current choices; Edit details preserves them. Only reviewing is added for the view switch: no copied quantity/note, extra total state, routing or copying Effect.',
    transition: 'At minute 30, move from keeping React output consistent to deciding what belongs outside rendering.',
    referenceIds: ['controlled-input', 'derived-state'], demos: [{ id: 'consistent', label: 'useState · Controlled inputs and derived values' }], checkpoint: 'starter',
  },
  {
    id: 'effect-choice', title: 'Keep browser features and services in sync', start: 30, end: 36, talkMinutes: 3,
    show: "Use the optional slide 10 divider to bridge from state updating the React UI. On slide 11, explain why an outside system also needs to match current values, then show all three examples: document.title follows quantity, a chat connection follows roomId, and a map widget follows zoomLevel. The chat and map APIs are illustrative; leave cleanup mechanics for Stage 6. Open the existing title demo, predict its visible result before clicking Add one, then explain dependencies on slide 12. Ordinary slides are direct explanations, not classification or prediction rounds.",
    speakingNotes: { cues: [
        "Slide 10: state updates our React UI",
        "Slide 11: something outside React needs to match",
        "Slide 11: title, chat and map",
        "Live demo 4: watch the browser tab",
        "Slide 12: name the values the Effect reads"
      ] },
    ask: 'In Live demo 4, before clicking Add one: what should happen to the displayed quantity and the browser tab title?',
    expected: "State keeps the checkout UI consistent. An Effect can also keep the browser title aligned with quantity, a chat connection aligned with roomId, or a map widget aligned with zoomLevel. The title Effect reads quantity, so it lists [quantity]. Totals are still calculated during render, and a particular submission belongs in its event handler.",
    ifStuck: 'Point to quantity in the component and the title in the browser tab. Follow the value into document.title. Use the chat and map cards as concrete parallels, without unpacking cleanup yet.',
    activity: 'Explain slides 10–11 directly. At the actual title demo, invite a prediction before clicking Add one and observe both results. Return to slide 12 to explain quantity in the demo, quantity and currency in the slide, and why an unrelated note change is not a trigger.',
    check: 'Learners connect each external job to its current component value. They do not copy derived values into state or invent cleanup for the browser-title example.',
    transition: 'At minute 36, return to the connection example: setting a browser value differs from starting a timer that must be stopped.',
    referenceIds: ['section-effects', 'effect-purpose', 'effect-dependencies'], demos: [{ id: 'title', label: 'useEffect · Synchronizing the browser title' }], checkpoint: 'state',
  },
  {
    id: 'subscription-cleanup', title: 'Stop the flash sale timer with cleanup', start: 36, end: 44, talkMinutes: 2,
    show: "Show only the flash sale countdown banner in Live Demo. Predict the active count before Unmount timer. Run leaves its interval behind; Fix clears it. Use slide 13 for setInterval/clearInterval, then show Working reference · Effect cleanup in Checkout Lab. Details has one timer; Review has zero; Edit details starts at 30 with one. Quantity and note remain in the parent. The countdown is a local flash sale simulation, not an inventory reservation.",
    speakingNotes: { cues: [
        "Show the flash sale countdown",
        "Predict what Unmount should stop",
        "Pair setInterval with clearInterval",
        "Explain the two-second drop",
        "Optional: trace banner A to banner B",
        "Review, then edit again"
      ] },
    ask: 'Before Unmount timer in Live Demo: should the interval keep running after the banner leaves? What should the active count be?',
    expected: "Details has one active timer. Review unmounts the timer child, so cleanup leaves zero and ticks stop. Edit details mounts a new child at 30 with one timer; parent quantity and note persist. A new child starts fresh even if old intervals leaked, so the active count proves cleanup. The functional updater avoids reading seconds in setup. The fixed imported service and stable setter allow [] in the lab; the demo receives timers as a prop and lists [timers].",
    ifStuck: 'Find the interval identifier returned by setup. Start the interval, update seconds with a functional updater, and return a function that clears that same identifier. Keep the timer in the supplied child so Review really unmounts it.',
    activity: 'Learners implement interval setup, the functional countdown updater and returned cleanup in src/exercises/EffectCleanupCheckoutExercise.tsx. Test Details → Review → Edit details twice; inspect active timers and ticks, not only the fresh countdown.',
    check: 'One timer in Details, zero in Review, no ticking during Review. Returning starts at 30 with one timer and preserves quantity/note. Changing form fields does not restart the timer. Strict Mode may repeat setup and cleanup; judge the final active count.',
    transition: 'At minute 44, keep the note text in state and add a direct editing convenience with a ref.',
    referenceIds: ['effect-cleanup'], demos: [{ id: 'sync', label: 'useEffect · Flash sale timer cleanup' }], checkpoint: 'repair-sync',
  },
  {
    id: 'explicit-focus', title: 'Focus the note when it mounts', start: 44, end: 50, talkMinutes: 1,
    show: "Slide 14 is optional. Use slide 15 for state versus remembered saved text, then slide 16 for DOM refs and an Effect after mount. Show the minimal focus demo, then Working reference · Input focus. Type a note, Review, and Edit details: the field remounts and focuses while parent state preserves the text.",
    speakingNotes: { cues: [
      "Start with focus on mount",
      "Separate displayed text from saved memory",
      "Attach the ref before the Effect",
      "Remount the field and keep the note"
    ] },
    ask: 'What does the ref hold? Why does focus happen in an Effect? Does typing run this Effect again?',
    expected: 'The ref holds the textarea DOM node. React attaches it before the Effect focuses it. With [], typing does not rerun this Effect. A newly mounted field focuses again; parent state preserves its text.',
    ifStuck: 'Find the supplied NoteField child. Import useRef, create a typed ref, attach it to the textarea, then call current?.focus() inside useEffect with [].',
    activity: 'Students implement the three focus TODOs in NoteField. Reserve five minutes for practice.',
    check: 'Focus on first mount and after Review → Edit details. Preserve text and count; ordinary typing and quantity changes do not refocus. The starter has no automatic focus until implemented.',
    transition: 'At minute 50, take the full five-minute break.',
    referenceIds: ['section-refs', 'ref-memory', 'ref-focus'], demos: [{ id: 'focus', label: 'useRef · Focusing an input' }], checkpoint: 'sync',
  },
  {
    id: 'break', title: 'Five-minute break', start: 50, end: 55, talkMinutes: 0,
    show: "No lecture slide is required. Keep a simple break screen or clock visible and leave learner work open. Announce the break as the preceding activity ends; do not fill the pause with teaching.",
    speakingNotes: { cues: [
        "Keep work open",
        "Take the full break",
        "Resume at minute 55"
      ] },
    ask: 'No required question during the break.',
    expected: 'Learners get an uninterrupted five-minute pause.',
    ifStuck: 'Do not use the break for a catch-up lecture. Preserve learner work for the next stage.',
    activity: 'Rest and stretch; no assigned coding.',
    check: 'Resume at minute 55.',
    transition: 'Introduce related cart transitions after the break.',
    referenceIds: [], demos: [],
  },
  {
    id: 'reducer-model', title: 'Separate the action from the state transition', start: 55, end: 61, talkMinutes: 3,
    show: "Show the optional slide 17 divider, then slide 18’s reducer function. On slide 19, introduce useReducer and dispatch and explain preserving old state. Then open the reducer Live demo to trace event → action → next checkout state.",
    speakingNotes: { cues: [
        "Keep one checkout owner",
        "Name the action",
        "Trace the reducer branch",
        "Predict the next checkout state"
      ] },
    ask: 'What happened in the event, and what rule did the reducer apply to get the next checkout state?',
    expected: "The event handler sends an action with dispatch. The reducer works out the next state, and React renders with that value. We still have one component owning the checkout state. For simpler updates, useState can still be a good choice.",
    ifStuck: 'Trace action.type, the matching branch, and the returned object in order. Compare the result with the previous checkout state without introducing new infrastructure.',
    activity: 'Learners predict a quantity → note sequence using the supplied branches and compare their state trace with the live result.',
    check: 'The learner can identify the action, reducer decision, and new state, including why the reducer should be pure.',
    transition: 'At minute 61, show Working reference · Reducer reset, then hand over the reset exercise.',
    referenceIds: ['section-reducer', 'reducer-actions', 'reducer-immutability'], demos: [{ id: 'reducer', label: 'useReducer · Updating state with actions' }], checkpoint: 'reducer',
  },
  {
    id: 'reducer-reset', title: 'Practice: complete the checkout reset', start: 61, end: 72, talkMinutes: 2,
    show: "Stay in Checkout lab. Briefly preview Working reference · Reducer reset: change quantity, note and gift choices, then click Reset cart choices. Open Exercise · Complete the reducer reset with src/exercises/ReducerResetCheckoutExercise.tsx beside it. This one file contains CheckoutAction, initialCheckoutState, the reducer and useReducer wiring. The other branches and UI are supplied; students complete three TODOs: define the reset action, add its whole reducer case, then dispatch it.",
    speakingNotes: { cues: [
        "Preview the reset target",
        "Complete the reset branch",
        "Test the reset result"
      ] },
    ask: 'After changing the choices, does your reset restore every starting value?',
    expected: 'Reset restores quantity one, an empty note and the initial gift settings in a fresh state object. The summary agrees and the previous state stays unchanged.',
    ifStuck: 'Follow TODOs 1–3: action union, reducer switch, then handler. Use initialCheckoutState for the reset result. Ask which starting values it should return.',
    activity: 'Edit only ReducerResetCheckoutExercise.tsx. Define the reset action, add its whole reducer case and dispatch it in the handler, then change quantity, note and gift choices and test it. Compare directly with ReducerResetCheckoutReference.tsx.',
    check: 'The reset handler dispatches its action; all choices and the summary reset correctly; return fresh state without mutating the previous object.',
    transition: 'At minute 72, introduce shared preferences; keep checkout quantity separate.',
    referenceIds: [], demos: [], checkpoint: 'reducer',
  },
  {
    id: 'context-owner', title: 'Share settings and trace their consumers', start: 72, end: 84, talkMinutes: 4,
    show: "Start with the optional Context divider on slide 20, then slides 21–22: one Settings provider and separate currency, language and theme consumers. Use the standalone Live demo controls, then Working reference · Settings Context, applying only currency and theme to the existing checkout. In ContextProviderCheckoutExercise.tsx, students add theme state and its setter to the provider value, then wrap the exported exercise scaffold with SettingsProvider. Currency state, consumer components, UI and styling are supplied; students add theme state.",
    speakingNotes: { cues: [
        "Why share a value",
        "Trace the nearest provider",
        "Connect the settings value",
        "Verify preference consumers"
      ] },
    ask: 'Which value and setter does each consumer read? How do these components get the same settings without props through the layout?',
    expected: 'SettingsProvider owns currency, theme and language state. Its value includes those preferences and setters. CurrencyBadge reads currency; LanguageSelector reads language and setLanguage; ThemeSelector reads theme and setTheme. Each checks for null before reading properties. Context distributes the nearest provider value. In the checkout lab, supplied currency state lives in the exported exercise. SettingsProvider receives currency and its setter, adds theme state, and shares both preferences; CurrencyPrice and ThemeCheckout consume them.',
    ifStuck: 'Find TODO 1 inside SettingsProvider (theme state and value), then TODO 2 in the exported exercise return (provider wrapper). Then trace a consumer’s useContext(SettingsContext) call. No reducer, networking or styling task is needed.',
    activity: 'Add theme state/value and place SettingsProvider around the supplied lab scaffold. Check unit price, subtotal and total; switch checkout theme. Increase quantity, add a note and use Review/Edit. Explain each consumer path. No language task in this lab.',
    check: 'Lab currency formats all checkout amounts without conversion. Theme stays local. Quantity, note and Review/Edit still work. A missing context returns null. Slides and Live Demo retain three settings.',
    transition: 'At minute 84, distinguish shared preferences from reusing the familiar countdown logic.',
    referenceIds: ['section-context', 'context-provider', 'context-consumer'], demos: [{ id: 'context', label: 'useContext · Sharing values across components' }], checkpoint: 'context',
  },
  {
    id: 'custom-extract', title: 'Extract the familiar countdown into a Hook', start: 84, end: 92, talkMinutes: 3,
    show: "Use optional divider 23 and slide 24. Trace useState, useRef and useEffect in useCountdown, then run the minimal countdown demo. Open Working reference · Custom Hook reuse: one familiar flash-sale banner plus the small independent sale timer before the profile. Use Review → Edit to remount the main banner at 30 while the header continues. The Live Demo keeps its two independent callers.",
    speakingNotes: { cues: ["Start with working logic", "Choose the returned value", "Move state and Effect together", "Preserve cleanup"] },
    ask: 'What does each built-in Hook do here, and what should useCountdown return?',
    expected: 'In the lab, state holds seconds, the ref retains the interval ID for cleanup, and the Effect owns setup/cleanup. Return seconds. Review unmounts the banner; Edit remounts it at 30. The bright top-bar timer keeps its independent state. Live Demo separately includes restart support.',
    ifStuck: 'Start from the Stage 6 timer. Move seconds and its Effect together. Retain the interval ID in a ref for cleanup; keep the updater pure and clear the ID in cleanup.',
    activity: 'Start with the fully working inline timers in src/exercises/CustomHookCheckoutExercise.tsx. Create a new src/exercises/hooks/useCountdown.ts; export useCountdown, move the banner state/ref/Effect and React imports there, return seconds, then import and call it from the existing checkout banner and header. Do not rename the JSX checkout file or edit the Live Demo Hook. All markup/styles are supplied; no Hook declaration or skeleton is provided.',
    check: 'The checkout banner and header tick independently before and after extraction. Review clears the banner interval while the top-bar timer continues. Edit starts a fresh banner at 30 and preserves quantity/note. Leaving the lab clears both; the lab has no Stop/Restart controls or counter.',
    transition: 'At minute 92, switch to Live Demo to compare two independent callers.',
    referenceIds: ['section-custom', 'custom-extraction', 'hook-rules'], demos: [{ id: 'custom', label: 'Custom Hooks · Reusing stateful logic' }], checkpoint: 'custom',
  },
  {
    id: 'custom-reuse', title: 'Use the Hook twice and explain what is independent', start: 92, end: 104, talkMinutes: 2,
    show: "Switch to Live Demo for the two-call comparison. Predict Stop First, then test it while Second keeps counting. Restart First, unmount Second, and mount it again. Use slide 25 to explain independent state/ref/Effect instances. Contrast with one shared Context owner on slide 21.",
    speakingNotes: { cues: ["Predict two Hook calls", "Stop and restart one caller", "Unmount one consumer", "Distinguish logic from state"] },
    ask: 'Why does stopping or restarting First leave Second unchanged? What does unmounting Second clean up?',
    expected: 'Each call has its own seconds state, timer ref and Effect. Stop cancels only its timer. Restart resets only its state and interval. Unmount cleanup clears only that caller’s interval. Shared code does not create shared state.',
    ifStuck: 'Trace the two interval IDs and two state setters separately. Two equal numbers can still belong to independent callers.',
    activity: 'In Live Demo, test stop/restart, then remove one consumer and explain why the other keeps counting. Repair any duplicate intervals or missing cleanup.',
    check: 'Stopping First leaves Second running. Restarting First does not reset Second. Removing Second clears its interval. Leaving Live Demo clears both; the checkout lab has one banner and a small independent top-bar countdown.',
    decision: 'At minute 104, introduce the optional optimization comparisons.',
    transition: 'Move to the optional useMemo comparison at minute 104.',
    referenceIds: ['custom-independence', 'context-provider'], demos: [{ id: 'custom', label: 'Custom Hooks · Reusing stateful logic' }], checkpoint: 'custom',
  },
  {
    id: 'optional-memo', title: 'Optional comparison of repeated calculation work', start: 104, end: 109, talkMinutes: 2, optional: true,
    show: "Use slides 26 and 27, then the simple offer filter Live Demo. Search for backpack and edit the unrelated note. Compare ordinary filtering with useMemo, then introduce memo on slide 28. Slides filter offers by region; the demo filters offers by search text.",
    speakingNotes: { cues: ["Confirm the core is ready", "Compare calculation inputs", "Change note, then search", "Judge whether caching helps", "Slide 28: introduce memo and stable props"] },
    ask: 'Which values does the filter use? Does editing the note change either input?',
    expected: "The filter depends on offers and query. Note edits rerender the component; the ordinary version filters again, while useMemo can reuse the result. Changing query or the offers array recalculates. Both display the same correct results.",
    ifStuck: 'Read the filter and dependency list together. The note is not used by the calculation. There is no timer or counter; the example illustrates the mechanism, not a measured speed benefit.',
    activity: 'Search for backpack, edit the note, then search for bottle. Compare both source panels and explain what work can be reused.',
    check: 'Learners distinguish reusing a calculation from preventing renders and do not claim this cheap filter needs optimization.',
    transition: 'At minute 109, compare function identity. Homework handoff begins at 114.',
    referenceIds: ['section-optimization', 'memo-result', 'optimization-choice'], demos: [{ id: 'memo', label: 'useMemo · Caching a calculation' }],
  },
  {
    id: 'optional-callback', title: 'Optional comparison of a stable function prop', start: 109, end: 114, talkMinutes: 1, optional: true,
    show: "Slide 28 has introduced memo in Stage 14. Now show slide 29: ProductPage passes handleSubmit to ShippingForm. Theme changes keep the function stable; productId or referrer changes replace it. Submission only logs. Then open the matching ProductPage/ShippingForm Live Demo, with local-only submission. Compare committed child updates, not proof of improved performance.",
    speakingNotes: { cues: [
        "Slide 29: reuse the function prop",
        "Live Demo: inspect the child’s props",
        "Test local submission",
        "Move to homework"
      ] },
    ask: 'Does changing theme change onSubmit? What about productId or referrer? Does local submission use the latest values?',
    expected: "A new function passed as a prop can make the memoized child render again. useCallback can reuse the same function while its dependencies stay the same. It does not call the function or cache the result.",
    ifStuck: 'Compare the two function identities and the child inputs. Explain that another changing prop or Context value could still cause the child to render.',
    activity: 'Toggle theme, change product and referrer, then fill and submit the address locally. Compare console trigger patterns, not exact render counts or claimed speed gains.',
    check: 'Behavior remains correct and the explanation distinguishes useMemo result caching from useCallback reference caching.',
    transition: 'At minute 114, open the Homework instructions and hand off the independent task.',
    referenceIds: ['callback-reference'], demos: [{ id: 'callback', label: 'useCallback · Keeping a function reference stable' }],
  },
  {
    id: 'exit-transfer', title: 'Introduce homework and show where to start', start: 114, end: 120, talkMinutes: 3,
    show: "Open the brief and unfinished Checkout workspace. One feature saves quantity, note and supplied Context currency to localStorage and loads them automatically. Point to checkoutDraftReducer.ts and CheckoutDraft.tsx; keep the private answer hidden.",
    speakingNotes: { cues: ["Open the homework brief", "Explain the saved-draft feature", "Find the homework TODOs", "Close with the handoff"] },
    ask: 'Why must saved values initialize React state before the saving Effect runs?',
    expected: 'Otherwise defaults could overwrite saved work. The supplied lazy initializers load the reducer draft and provider currency before saving. The reducer handles quantity/note, useState owns supplied currency, useContext reads it, and useEffect persists all three.',
    ifStuck: 'The reducer is only state transitions. Complete its two cases, then replace the working local states and setter callbacks with useReducer/dispatch, then read currency with useContext and complete the Effect in CheckoutDraft.tsx. Safe storage and automatic initialization are already supplied.',
    activity: 'Locate the two files and explain the check: set quantity 3, note Hello and EUR, reload, and see all three appear automatically.',
    check: 'Students understand the four Hook roles, the two TODO files and the single saved object. No decision UI, custom Hook or extra feature is required.',
    transition: 'Close by minute 120. Use the existing Homework page for requirements. Share submission destination or deadline only when supplied; none is invented.',
    referenceIds: [], demos: [], checkpoint: 'homework',
  },
];
