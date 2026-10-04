export type Scene = 'remember' | 'queue' | 'consistent' | 'title' | 'sync' | 'focus' | 'reducer' | 'context' | 'custom' | 'memo' | 'callback';
export type Slide = {
  title: string; eyebrow: string; time: string; body: string;
  cards?: { title: string; body: string }[];
  answerCards?: { title: string; body: string }[];
  question?: string; check?: string; code?: string;
  notes: string[]; scene?: Scene; checkpoint?: string;
  dark?: boolean; activity?: boolean; optional?: boolean; talkMinutes?: number;
};

export const slides: Slide[] = [
  {
    title: 'The input changes.\nWhy not the summary?', eyebrow: 'START WITH THE CHECKOUT', time: '00–06', talkMinutes: 2,
    body: 'Explore a checkout with no Hooks. Change quantity, type a note, and open the order details.',
    question: 'What already works? What is still disconnected?', checkpoint: 'starter', dark: true,
    notes: [
      'Let learners explore, then wait 5–7 seconds before taking predictions.',
      'Expected: native controls and ordinary events work; input values are not connected to this React summary.',
      'Do not imply Hooks are the only route to interactivity. Browser behavior and class-component APIs also exist.',
      'Transition at minute 6: what does this function component need React to remember?',
    ],
  },
  {
    title: 'Choose the tool\nfor the app problem.', eyebrow: 'THE SMALL MAP', time: '06–10', talkMinutes: 1,
    body: 'Hooks let function components use React features. We will choose each tool when its problem appears.',
    cards: [
      { title: 'Remember and organize', body: 'useState remembers a choice. useReducer organizes state transitions.' },
      { title: 'Connect and share', body: 'useEffect synchronizes externally. useContext reads a provider value.' },
      { title: 'Reach and reuse', body: 'useRef retains a DOM or non-render value. Custom Hooks reuse logic.' },
    ],
    question: 'Quantity? Focus? Total? Which one needs no additional Hook?',
    check: 'Call Hooks at the top level of React components or custom Hooks. Optional optimization comes after the core.',
    notes: [
      'Expected: quantity/state, focus/ref, total/render calculation with no extra Hook.',
      'State setters request a render; changing ref.current does not. Context does not create the state it distributes.',
      'This is a map, not an API lecture. Use learner matching to retrieve props and event-handler knowledge.',
      'No conditions, loops, or event-handler Hook calls. Begin the repair at minute 10.',
    ],
  },
  {
    title: 'Remember the choice.\nCalculate the result.', eyebrow: 'PREDICT → RUN → EXPLAIN', time: '10–17', talkMinutes: 4,
    body: 'Keep quantity and note in state. Derive the total and character count during render.',
    code: "const [quantity, setQuantity] = useState(1);\nconst [note, setNote] = useState('');\nconst total = unitPrice * quantity;\nconst count = note.length;",
    question: 'From 1, what do two quantity + 1 updates in one handler produce?', scene: 'remember', checkpoint: 'starter',
    notes: [
      'Contrast a plain local variable: assignment alone does not request a React render. Reveal useState and one controlled-input line.',
      'Expected owner: closest common parent of controls and summary. Total/count are derived, not extra state.',
      'Then open /demo?scene=queue: direct updates end at 2, updater functions end at 3. Reset to 1 between versions.',
      'Misconception: rapid clicks cause this. Both direct expressions read the same render snapshot in one handler.',
      'Reserve three minutes for prediction/testing and hand over at minute 17.',
    ],
  },
  {
    title: 'Connect the checkout.\nProve it agrees.', eyebrow: 'BUILD / EXPLAIN', time: '17–30', talkMinutes: 2,
    body: 'Make the controls and summary read one source of truth.',
    cards: [
      { title: 'Remember', body: 'Controlled quantity and note. Quantity stays at least one.' },
      { title: 'Calculate', body: 'Total = price × quantity. Count = note.length.' },
      { title: 'Explain', body: 'Which component owns the shared values? Why not store total?' },
    ],
    check: 'Every display agrees after quantity and note edits.', scene: 'consistent', checkpoint: 'starter', activity: true,
    notes: [
      'Expected: a common state owner, props to consumers, derived total/count, no copying Effect.',
      'Rescue: mark changing UI, locate the owner, then supply one syntax hint. Keep learners making the decision.',
      'The state checkpoint is a prepared scaffold if needed; preserve earlier work and require an explanation.',
      'Give specific feedback during work. Stop at minute 30.',
    ],
  },
  {
    title: 'Put the work\nwhere it belongs.', eyebrow: 'SORT / THEN REVEAL', time: '30–36', talkMinutes: 3,
    body: 'Sort these operations into render, an event handler, or an Effect. Defend one choice.',
    cards: [
      { title: 'Checkout total', body: 'Calculate price × quantity.' },
      { title: 'Place demo order', body: 'Respond to an explicit submission.' },
      { title: 'Browser title', body: 'Keep the tab aligned with checkout quantity.' },
    ],
    answerCards: [
      { title: 'Render', body: 'Calculate the total from current data.' },
      { title: 'Event handler', body: 'Handle this particular submission.' },
      { title: 'Effect', body: 'Synchronize the external browser title.' },
    ],
    question: 'Which changing value does the title Effect read?', scene: 'title', checkpoint: 'state',
    notes: [
      'Wait for pair sorting before revealing answer cards.',
      'Expected: render, event, Effect. Show the title demo with quantity in its dependency array.',
      'Misconception: every side effect belongs in useEffect. A particular user action belongs in its event handler.',
      'Dependencies reflect reactive values read; title synchronization here needs no invented unsubscribe. Finish at 36.',
    ],
  },
  {
    title: 'Connect while mounted.\nDisconnect when finished.', eyebrow: 'REPAIR / PROVE', time: '36–44', talkMinutes: 2,
    body: 'Repair the supplied subscription. Use the active count to prove its lifecycle.',
    cards: [
      { title: 'Inspect', body: 'What external source does setup connect to?' },
      { title: 'Repair', body: 'Return the matching unsubscribe function.' },
      { title: 'Prove', body: 'One mounted. Zero unmounted. One remounted.' },
    ],
    check: 'Explain the dependencies and what cleanup undoes.', scene: 'sync', checkpoint: 'repair-sync', activity: true,
    notes: [
      'Expected: cleanup undoes the subscription. Demo reads a connection prop, so [connection] is required; the student fixture is module-level and can use [].',
      'Misconception: [] guarantees literal once. Strict Mode can check setup → cleanup → setup in development.',
      'Do not suppress the check or hide duplicated notifications. Ask learners to pair setup with its inverse.',
      'The fixture can simulate status; browser connectivity does not prove a payment service is reachable. Stop at 44.',
    ],
  },
  {
    title: 'Focus the field.\nKeep its text in state.', eyebrow: 'HELP THE SHOPPER EDIT', time: '44–50', talkMinutes: 1,
    body: 'Focus the textarea after its component mounts, using a ref and an Effect.',
    code: "const noteRef = useRef<HTMLTextAreaElement>(null);\n// Attach ref={noteRef} to the textarea.\nuseEffect(() => {\n  noteRef.current?.focus();\n}, []);",
    question: 'Why is the note text state, but the DOM element a ref?', scene: 'focus', checkpoint: 'sync', activity: true,
    notes: [
      'Expected: displayed text drives rendering; the ref retains a DOM node without requesting renders when .current changes.',
      'The mount Effect runs after React attaches the DOM ref; typing does not rerun it.',
      'Declare the Hooks at the field child’s top level; keep note state in its parent.',
      'Keep five minutes for learner implementation/testing. Break at 50.',
    ],
  },
  {
    title: 'Take five.', eyebrow: 'BREAK', time: '50–55', talkMinutes: 0,
    body: 'Keep your checkout open. Stretch. Return at minute 55.', dark: true,
    notes: [
      'Give the full five-minute break, not a catch-up lecture.',
      'Resume with related cart changes that need clear update rules.',
    ],
  },
  {
    title: 'Describe the action.\nCalculate the next cart.', eyebrow: 'MAKE CHANGES PREDICTABLE', time: '55–61', talkMinutes: 3,
    body: 'Quantity, note, reset: move their update rules into one pure reducer.',
    code: "const [cart, dispatch] = useReducer(checkoutReducer, initialCheckoutState);\n// An event describes what happened:\ndispatch({ type: 'quantityChanged', quantity: 3 });",
    question: 'What does the event decide? What does the reducer decide?', scene: 'reducer', checkpoint: 'reducer',
    notes: [
      'Expected: event dispatches an action; reducer returns next state; React renders it.',
      'Trace a supplied quantity branch. It returns a new object and keeps quantity at least one.',
      'Misconception: useReducer is extra state alongside the old cart setters. It replaces that state-management choice.',
      'A small cart may still use useState. Let learners trace actions before the reset task at 61.',
    ],
  },
  {
    title: 'Reset the cart.\nPreserve the previous state.', eyebrow: 'CHANGE / TEST / EXPLAIN', time: '61–72', talkMinutes: 2,
    body: 'Implement reset. Explain why the mutation example in the comment would be wrong.',
    cards: [
      { title: 'Reset', body: 'Quantity becomes one. Note becomes empty.' },
      { title: 'Test', body: 'Quantity → note → reset. Each next state is predictable.' },
      { title: 'Explain', body: 'Return new state; keep totals derived.' },
    ],
    check: 'Previous state remains unchanged. Controls and summary still agree.', scene: 'reducer', checkpoint: 'reducer', activity: true,
    notes: [
      'Expected reset returns { ...initialCheckoutState }: quantity one, empty note, and supplied gift defaults. Types and other branches are supplied.',
      'Misconception: mutate inside a reducer or keep a second live cart state.',
      'Rescue: action shape, then the new-object pattern; require a prediction before running.',
      'Give nine minutes learner work/peer explanation. Move to the distant summary at 72.',
    ],
  },
  {
    title: 'Different consumers.\nOne Settings provider.', eyebrow: 'SHARE PREFERENCES THROUGH THE TREE', time: '72–84', talkMinutes: 4,
    body: 'Connect currency, theme and language to their supplied Context consumers.',
    code: '<SettingsContext.Provider value={{ currency, setCurrency, theme, setTheme, language, setLanguage }}>\n  {children}\n</SettingsContext.Provider>',
    question: 'Which properties does each consumer read from the same provider?', scene: 'context', checkpoint: 'context', activity: true,
    check: 'Currency badge, local theme and language label follow the provider. Missing consumers return null.',
    notes: ['The provider owns preferences. Supplied consumers read separate properties.', 'Currency is a preference label without prices or conversion. Theme and language stay local to the preview.'],
  },
  {
    title: 'Name the countdown\nlogic you already trust.', eyebrow: 'EXTRACT / PRESERVE BEHAVIOR', time: '84–92', talkMinutes: 3,
    body: 'Compose seconds state, a timer ref for Stop, and lifecycle Effects in useCountdown.',
    code: 'const { seconds, stop, restart } = useCountdown(30);\n// The Hook packages state, a timer ref, and Effect cleanup.',
    question: 'What logic moves together? What value should the Hook return?', scene: 'custom', checkpoint: 'custom', activity: true,
    notes: [
      'Expected: seconds state, timer ref and Effect move together; return seconds, stop and restart.',
      'This slide is an extraction sketch. Show the complete runnable version in the matching demo.',
      'Misconception: extraction allows dropping cleanup or calling Hooks conditionally. Same rules still apply.',
      'Model a short move, then learners replace one component copy. Second consumer begins at 92.',
    ],
  },
  {
    title: 'Reuse the logic.\nExplain what stays separate.', eyebrow: 'USE TWICE / PREDICT / PROVE', time: '92–104', talkMinutes: 2,
    body: 'Extract the checkout flash-sale timer into useCountdown and call it from the same supplied banner. Use Live Demo to compare two independent calls.',
    cards: [
      { title: 'Mount both', body: 'How many independent intervals?' },
      { title: 'Remove one', body: 'Which countdown keeps running?' },
      { title: 'Explain', body: 'Shared logic or shared state? What would a provider change?' },
    ],
    check: 'Both countdowns work independently; each cleanup removes only its own interval.', scene: 'custom', checkpoint: 'custom', activity: true,
    notes: [
      'Expected: two calls own independent state, timer refs and Effects. Stop or restart one without changing the other.',
      'Misconception: a use-prefixed function is a singleton state store. Custom Hooks reuse logic.',
      'Ask pairs to explain a reducer owner, Context value, and custom-Hook call without conflating them.',
      'At minute 104: introduce the optional optimization comparisons.',
    ],
  },
  {
    title: 'Does editing a note\nneed to filter offers again?', eyebrow: 'OPTIONAL / ONLY IF READY', time: '104–109', talkMinutes: 2, optional: true,
    body: 'Compare ordinary offer filtering with useMemo. Show the total match count and first five results.',
    code: 'const result = useMemo(\n  () => offers.filter(offer => offer.name.includes(query)),\n  [offers, query]\n);',
    question: 'Edit note, then search. Which input change should recompute the filter?', scene: 'memo', activity: true,
    check: 'The output stays correct without memoization. Simple totals still need no memo.',
    notes: [
      'The optional optimization comparisons occupy 104–114.',
      'Expected: unchanged offers and query may reuse the filter result; changing either recalculates. The match count is output, not a calculation counter.',
      'Misconception: memoization fixes correctness. Removing it must leave correct output; measure before optimizing.',
      'React Compiler may reduce manual memoization needs; this comparison uses disclosed manual mode. No measured speed claim is made by this filter example.',
      'Reserve learner observation/change time; continue at 109 and introduce homework at 114.',
    ],
  },
  {
    title: 'Keep a function prop\nstable when it helps.', eyebrow: 'OPTIONAL / COMPARE THE CHILD', time: '109–114', talkMinutes: 1, optional: true,
    body: 'ProductPage passes a submit handler to ShippingForm. Compare theme changes with productId and referrer changes.',
    code: "const handleSubmit = useCallback(\n  orderDetails => submitOrder(productId, { referrer, orderDetails }),\n  [productId, referrer]\n);\n<ShippingForm onSubmit={handleSubmit} />",
    question: 'Does a theme change rerender ShippingForm? Does local submission use the latest product and referrer?', scene: 'callback', activity: true,
    check: 'A stable callback can let this memoized child skip an unrelated render.',
    notes: [
      'Expected: useCallback retains a function reference, not the result of executing the function.',
      'The supplied memo child has no other changing props and does not consume changing Context; otherwise this comparison is misleading.',
      'Misconception: useCallback speeds up every function or blocks all renders. Keep dependencies correct.',
      'Open the Homework brief at minute 114.',
    ],
  },
  {
    title: 'Your next step:\nAutomatically saved checkout draft.', eyebrow: 'HOMEWORK HANDOFF', time: '114–120', talkMinutes: 3,
    body: 'Open the existing Homework brief, then the student workspace. Start at the homework TODOs.',
    cards: [
      { title: 'Purpose', body: 'Automatically load saved quantity, note and currency on return.' },
      { title: 'One saved checkout', body: 'Reducer owns quantity/note; supplied useState owns currency; useContext reads it; an Effect saves all three after safe initialization.' },
      { title: 'Start here', body: 'Homework page → Checkout lab → src/homework/CheckoutDraft.tsx, the homework TODOs.' },
    ],
    check: 'Students know the brief, work files and first task.', checkpoint: 'homework', activity: true,
    notes: [
      'Three minutes introduce requirements, two minutes locate the workspace and the homework TODOs, one minute practical questions.',
      'UI, SettingsContext and safe storage helpers are supplied. All student edits stay in src/homework/.',
      'Use the existing Homework page; provide submission details only when supplied. Close by minute 120.',
    ],
  },
];

export const scenes: {
  id: Scene; title: string; question: string; before: string; after: string;
  takeaway: string; task: string; slide: number; checkpoint?: string; optional?: boolean;
}[] = [
  { id: 'remember', title: 'Connect the choice to the screen', question: 'The native input works. What asks React to update its summary?', before: 'local', after: 'state', takeaway: 'State remembers a value between renders; its setter requests the next render. Native interactivity already works without Hooks.', task: 'Make quantity, note, and summary read one state owner.', slide: 2, checkpoint: 'starter' },
  { id: 'queue', title: 'Predict the next quantity', question: 'From 1, do two updates in one handler produce 2 or 3?', before: 'direct', after: 'queued', takeaway: 'Direct updates read the same render snapshot. Updater functions receive pending state in order.', task: 'Predict both results before running. Explain without referring to click speed.', slide: 2, checkpoint: 'starter' },
  { id: 'consistent', title: 'Keep the summary consistent', question: 'What needs memory, and what can be calculated?', before: 'consistent', after: 'consistent', takeaway: 'Remember quantity and note once. Derive total and count during render.', task: 'Build the controlled inputs and shared summary; explain the common owner.', slide: 3, checkpoint: 'starter' },
  { id: 'title', title: 'Keep the browser aligned', question: 'What changes outside React when quantity changes?', before: 'title', after: 'title', takeaway: 'The Effect reads reactive quantity, so quantity belongs in its dependency list.', task: 'Observe the browser title and explain render versus event versus Effect.', slide: 4, checkpoint: 'state' },
  { id: 'sync', title: 'Connect, then disconnect', question: 'Unmount checkout. What should remain subscribed?', before: 'leaking', after: 'cleaned', takeaway: 'Cleanup undoes setup. One mounted subscription becomes zero after unmount; development checks may repeat setup and cleanup.', task: 'Repair the supplied Effect and prove mount, unmount, and remount behavior.', slide: 5, checkpoint: 'repair-sync' },
  { id: 'focus', title: 'Focus the note on mount', question: 'How does the Effect focus the note after mount?', before: 'focus', after: 'focus', takeaway: 'State holds displayed text. A ref holds the DOM node; an Effect focuses it after mount.', task: 'Add a ref and mount Effect while preserving controlled text.', slide: 6, checkpoint: 'sync' },
  { id: 'reducer', title: 'Make cart transitions predictable', question: 'After quantity, note, and reset actions, what should the cart contain?', before: 'reducer', after: 'reducer', takeaway: 'Events dispatch actions; a pure reducer returns next state. It organizes state updates rather than creating a duplicate cart.', task: 'Implement reset, explain why the commented mutation is wrong, and keep totals derived.', slide: 8, checkpoint: 'reducer' },
  { id: 'context', title: 'Find the shared owner', question: 'Where do separate consumers read their settings?', before: 'context', after: 'context', takeaway: 'useContext reads the nearest provider. SettingsProvider owns currency, theme and language; Context distributes them.', task: 'Connect the Settings provider value and test the preference consumers.', slide: 10, checkpoint: 'context' },
  { id: 'custom', title: 'Reuse logic and preserve its lifecycle', question: 'Two Hook calls: does Stop First affect Second?', before: 'custom', after: 'custom', takeaway: 'Custom Hooks reuse logic, not Hook-local state. Two calls own independent seconds and intervals.', task: 'Extract one checkout flash-sale timer and preserve Review/Edit cleanup. Compare two independent callers in Live Demo.', slide: 11, checkpoint: 'custom' },
  { id: 'memo', title: 'Reuse a filtered product list', question: 'Should changing the note repeat an unchanged product filter?', before: 'uncached', after: 'memo', takeaway: 'useMemo can reuse a calculation result while dependencies are unchanged. It is an optimization, not a correctness requirement.', task: 'Compare search and unrelated note edits in the product filter.', slide: 13, optional: true },
  { id: 'callback', title: 'Keep a useful function prop stable', question: 'Does a theme change alter ShippingForm’s onSubmit prop?', before: 'unstable', after: 'callback', takeaway: 'useCallback can retain a function reference. It helps this memoized child only when its other inputs remain stable.', task: 'Compare theme and dependency changes, then submit the shipping form locally.', slide: 14, optional: true },
];

export const chapters = [
  { name: 'Connect choices to the screen', time: '00–30', slide: 0, description: 'Hook-free baseline → controlled state → derived summary' },
  { name: 'Connect to the browser', time: '30–50', slide: 4, description: 'External synchronization, cleanup, and focus on mount' },
  { name: 'Make changes predictable', time: '55–72', slide: 8, description: 'Actions and a pure reducer; one cart owner' },
  { name: 'Read the same cart elsewhere', time: '72–84', slide: 10, description: 'Provider value, distant consumers, clear ownership' },
  { name: 'Reuse the working countdown', time: '84–104', slide: 11, description: 'Custom-Hook extraction, reuse, and independent state' },
  { name: 'Optimize only if ready', time: '104–114', slide: 13, description: 'Optional measured memoization', optional: true },
  { name: 'Introduce homework', time: '114–120', slide: 15, description: 'Existing brief, student workspace and the homework TODOs' },
];
