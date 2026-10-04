export type ReferenceSource = { label: string; url: string };
export type ReferenceSlide = {
  id: string;
  title: string;
  topic: string;
  body: string;
  jobs?: { need: string; hook: string; purpose: string }[];
  comparison?: { title: string; code: string; explanation: string }[];
  code?: string;
  codeNote?: string;
  codeCallout?: { label: string; code: string; description?: string };
  explanation?: string;
  pitfall?: string;
  takeaway: string;
  sources: ReferenceSource[];
  optional?: boolean;
  dark?: boolean;
  cover?: boolean;
  closing?: boolean;
  author?: string;
  sectionNumber?: string;
};
const docs = (label: string, path: string): ReferenceSource => ({ label, url: `https://react.dev/${path}` });

export const referenceSlides: ReferenceSlide[] = [
  {
    id: 'course-intro', title: 'React Hooks', topic: 'Xsolla School / Week 3', author: 'C.Gee Kee', cover: true, dark: true,
    body: 'Concepts and examples for building interactive apps',
    takeaway: '', sources: [],
  },
  {
    id: 'hooks-overview', title: 'React Hooks and their jobs', topic: 'HOOKS OVERVIEW',
    body: 'A Hook gives a function component React features, such as remembering information. Hook names start with use followed by a capital letter, like useState.',
    jobs: [
      {"hook": "useState", "purpose": "Remember values that drive the UI.", "need": "Remember the quantity and note."},
      {"hook": "useEffect", "purpose": "Keep your component in sync with browser features or network services.", "need": "Follow changes in connection status."},
      {"hook": "useRef", "purpose": "Retain a value or DOM element without requesting a render.", "need": "Move the cursor into the note field."},
      {"hook": "useReducer", "purpose": "Organize related state changes using actions.", "need": "Reset the cart’s choices together."},
      {"hook": "useContext", "purpose": "Read values shared through the component tree.", "need": "Share currency, theme and language preferences."},
      {"hook": "Custom Hooks", "purpose": "Reuse logic built with Hooks across components.", "need": "Reuse connection-status logic in the header and footer."},
    ],
    takeaway: '',
    sources: [docs('Built-in React Hooks', 'reference/react/hooks'), docs('Reusing logic', 'learn/reusing-logic-with-custom-hooks')],
  },
  {
    id: 'hook-rules', title: 'Rules of Hooks', topic: 'REACT HOOKS',
    body: 'React uses Hook call order to keep track of information between renders. These rules keep that order predictable.',
    code: "import { useState } from 'react';\n\nfunction Quantity() {\n  const [quantity, setQuantity] = useState(1);\n  return <button onClick={() => setQuantity(q => q + 1)}>\n    {quantity}\n  </button>;\n}",
    explanation: '1. Only at the top level\nCall these Hooks before early returns, outside conditions, loops and nested functions.\n\n2. Only from React functions\nCall them inside function components or custom Hooks.',
    pitfall: 'Regular JavaScript functions and event handlers cannot call these Hooks. The button’s handler calls the setter instead.',
    takeaway: 'Call Hooks while React renders, in a consistent order.',
    sources: [docs('Rules of Hooks', 'reference/rules/rules-of-hooks')],
  },
  {
    id: 'section-state', title: 'State and rendering', topic: 'REACT HOOKS', sectionNumber: '01', dark: true,
    body: 'Remember choices, understand updates, and derive a consistent interface.',
    takeaway: '', sources: [],
  },
  {
    id: 'state-memory', title: 'State remembers a value\nand requests a render.', topic: 'USESTATE',
    body: 'useState returns the current state and a setter. React retains the state between renders of that component instance.',
    comparison: [
      {
        "title": "Ordinary local variable",
        "code": "function Quantity() {\n  let quantity = 1;\n  function handleAdd() {\n    quantity = quantity + 1;\n  }\n  return <button onClick={handleAdd}>\n    Quantity: {quantity}\n  </button>;\n}",
        "explanation": "The variable changes, but React is not asked to render. The screen still shows 1. A new render initializes this local variable again."
      },
      {
        "title": "React state",
        "code": "import { useState } from 'react';\n\nfunction Quantity() {\n  const [quantity, setQuantity] = useState(1);\n  function handleAdd() {\n    setQuantity(quantity + 1);\n  }\n  return <button onClick={handleAdd}>\n    Quantity: {quantity}\n  </button>;\n}",
        "explanation": "The setter requests a render with the next state. The screen updates to 2."
      }
    ],
    takeaway: 'Use state for remembered values that affect the rendered result.',
    sources: [docs('useState', 'reference/react/useState'), docs('Local variables and state', 'learn/state-a-components-memory')],
  },
  {
    id: 'state-snapshot', title: 'React batches updates\nbefore the next render.', topic: 'BATCHING STATE UPDATES',
    body: 'One Reset click changes two state values. React waits for the handler to finish, then updates the screen with both changes.',
    code: "const [quantity, setQuantity] = useState(3);\nconst [note, setNote] = useState('Happy birthday!');\n\nfunction handleReset() {\n  setQuantity(1);\n  setNote('');\n}\n\n// Connect to the Reset button:\n// <button onClick={handleReset}>Reset</button>",
    explanation: 'Before Reset: quantity is 3 and the note is “Happy birthday!”.\n\nAfter Reset: quantity is 1 and the note is empty.\n\nReact applies both changes together, so the screen does not show a half-reset form.',
    takeaway: 'Batching groups state updates from one event handler into the next render.',
    sources: [docs('Queueing state updates', 'learn/queueing-a-series-of-state-updates')],
  },
  {
    id: 'state-updaters', title: 'Updater functions work\nfrom pending state.', topic: 'QUEUED STATE UPDATES',
    codeCallout: { label: 'Updater function', code: 'q => q + 1', description: 'q is the latest queued value; q + 1 is the next value.' },
    body: 'When the next value depends on the previous value, an updater function receives the pending state. React applies queued updaters in order.',
    code: "import { useState } from 'react';\n\nfunction Quantity() {\n  const [quantity, setQuantity] = useState(1);\n  function handleAdd() {\n    setQuantity(q => q + 1);\n    setQuantity(q => q + 1);\n    console.log(quantity); // 1 in this handler\n  }\n  return <button onClick={handleAdd}>\n    Quantity: {quantity} {/* 3 after one click */}\n  </button>;\n}",
    explanation: "Starting from 1, the first updater produces 2 and the second produces 3. The console still logs 1 inside this handler; the next render displays 3.\n\nSometimes we need several updates to the same value before React renders again. Updater functions let each update build on the previous one.",
    pitfall: 'Updater functions must be pure. Put unrelated side effects in the event handler, not inside an updater.',
    takeaway: 'Use the pending-state argument when combining updates based on earlier state.',
    sources: [docs('Queueing state updates', 'learn/queueing-a-series-of-state-updates')],
  },
  {
    id: 'controlled-input', title: 'A controlled input\nuses React as its owner.', topic: 'CONTROLLED INPUTS',
    body: 'Both textareas accept typing. The difference is who owns their current value.',
    comparison: [
          {
                "title": "Uncontrolled · browser owns the text",
                "code": "function OrderNote() {\n  return <textarea defaultValue=\"\" />;\n}",
                "explanation": "Typing works without React state. The browser keeps the current text; defaultValue only supplies its initial value."
          },
          {
                "title": "Controlled · React state owns the text",
                "code": "import { useState } from 'react';\n\nfunction OrderNote() {\n  const [note, setNote] = useState('');\n  return <>\n    <textarea value={note}\n      onChange={e => setNote(e.target.value)} />\n    <p>{note.length} characters</p>\n  </>;\n}",
                "explanation": "value and onChange keep note in React state. The field and character count read that same note, so they update together."
          }
    ],
    explanation: 'An uncontrolled field can instead keep its current value in the browser. defaultValue sets its initial value.',
    pitfall: 'A controlled text field needs a value that remains a string and a handler that updates it.',
    takeaway: 'Use a controlled field when other React output must follow its current value.',
    sources: [docs('Controlled textareas', 'reference/react-dom/components/textarea')],
  },
  {
    id: 'derived-state', title: 'Remember the minimum.\nCalculate the rest.', topic: 'DERIVED VALUES AND OWNERSHIP',
    body: 'A value that can be calculated from current props or state usually does not need separate state.',
    code: "// Fixed value: price per pack\nconst unitPrice = 24;\n\n// State: choices React remembers\nconst [quantity, setQuantity] = useState(1);\nconst [note, setNote] = useState('');\n\n// Derived values: calculate each render\nconst total = unitPrice * quantity;\nconst characterCount = note.length;",
    explanation: 'When controls and a summary need the same quantity, place that state in their closest common parent and pass it down.',
    pitfall: 'Copying a total into state with an Effect creates another value that can become inconsistent. A simple multiplication does not need useMemo.',
    takeaway: 'One owner for shared state; render calculations for derived values.',
    sources: [docs('Choosing state structure', 'learn/choosing-the-state-structure'), docs('Sharing state', 'learn/sharing-state-between-components')],
  },
  {
    id: 'section-effects', title: 'Effects and cleanup', topic: 'REACT HOOKS', sectionNumber: '02', dark: true,
    body: 'Synchronize with external systems and manage their connection lifecycle.',
    takeaway: '', sources: [],
  },
  {
    id: 'effect-purpose', title: 'Effects synchronize\nwith external systems.', topic: 'USEEFFECT',
    body: 'Keep browser features and services in step with current component values. These excerpts belong inside a component; import useEffect from React.',
    comparison: [
      {
        title: 'Browser tab · follows quantity',
        code: 'useEffect(() => {\n  document.title = `Checkout (${quantity})`;\n}, [quantity]);',
        explanation: 'When quantity changes, keep the browser tab title in sync.',
      },
      {
        title: 'Chat room · follows roomId',
        code: 'useEffect(() => {\n  const room = connectToRoom(roomId);\n  return () => room.disconnect();\n}, [roomId]);',
        explanation: 'The connection follows the selected room. connectToRoom is an illustrative service API defined outside the component. The returned function disconnects the room.',
      },
      {
        title: 'Map widget · follows zoom',
        code: 'useEffect(() => {\n  map.setZoom(zoomLevel);\n}, [map, zoomLevel]);',
        explanation: 'map is a widget passed as a prop; setZoom is an illustrative API. Keep its zoom matched to zoomLevel.',
      },
    ],
    takeaway: 'Use Effects for external synchronization. Calculate totals during render; handle submissions in events.',
    sources: [docs('useEffect', 'reference/react/useEffect'), docs('You might not need an Effect', 'learn/you-might-not-need-an-effect')],
  },
  {
    id: 'effect-dependencies', title: 'Dependencies describe\nwhat the Effect reads.', topic: 'EFFECT DEPENDENCIES',
    body: 'Include the reactive props, state, and component-local values used by the Effect. React compares dependencies with Object.is.',
    code: 'function PageTitle({ quantity, currency }) {\n  useEffect(() => {\n    document.title = `${quantity} items · ${currency}`;\n  }, [quantity, currency]);\n  return null;\n}',
    explanation: 'With no dependency array, the effect runs after the component first appears and after every completed re-render.\n[]: on mount, with no reactive dependencies.\n[quantity, currency]: initially, then when either value changes.\n\nThis Effect reads both props, so list both. Module-level constants are not reactive component values.',
    pitfall: 'An empty array is not a way to hide a changing dependency. Missing dependencies can leave synchronization stale.',
    takeaway: 'Change the code to change its dependencies; do not silence the relationship.',
    sources: [docs('Removing Effect dependencies', 'learn/removing-effect-dependencies')],
  },
  {
    id: 'effect-cleanup', title: 'Cleanup stops\nthe work setup started.', topic: 'EFFECT CLEANUP',
    body: 'This timer counts down while its component is mounted. Cleanup clears the interval when that component leaves.',
    code: 'const [seconds, setSeconds] = useState(30);\n\nuseEffect(() => {\n  const id = setInterval(() => {\n    setSeconds(s => Math.max(0, s - 1));\n  }, 1000);\n  return () => clearInterval(id);\n}, []);',
    codeCallout: {
      label: 'Why can it drop by 2?',
      code: '2 intervals × −1 = −2 per second',
      description: 'Development Strict Mode repeats setup. Without cleanup, two intervals can update the current instance. Fix leaves one.',
    },
    explanation: 'The updater avoids reading seconds; the setter is stable: [] fits.\n\nReview removes the timer child. Edit mounts a fresh one; form choices stay in the parent.',
    pitfall: 'Old unmounted instances cannot update the new countdown. Their leaked intervals only increase the shared tick count. Check zero active after unmount.',
    takeaway: 'Cleanup runs before setup repeats with changed dependencies, and when the component unmounts.',
    sources: [docs('useEffect', 'reference/react/useEffect')],
  },
  {
    id: 'section-refs', title: 'Refs and DOM access', topic: 'REACT HOOKS', sectionNumber: '03', dark: true,
    body: 'Retain values and reach browser capabilities without driving renders.',
    takeaway: '', sources: [],
  },
  {
    id: 'ref-memory', title: 'A ref retains a value\nwithout requesting a render.', topic: 'USEREF',
    body: 'State holds the note shown in the textarea. A ref remembers the last saved note for comparison inside the Save handler.',
    code: "import { useRef, useState } from 'react';\n\nfunction OrderNote() {\n  const [note, setNote] = useState('');\n  const lastSavedNote = useRef<string | null>(null);\n  function handleSave() {\n    if (note === lastSavedNote.current) return;\n    localStorage.setItem('demo-note', note); // Local demo save\n    lastSavedNote.current = note; // Save succeeded\n  }\n  return <>\n    <textarea value={note}\n      onChange={event => setNote(event.target.value)} />\n    <button onClick={handleSave}>Save note</button>\n  </>;\n}",
    explanation: 'Typing updates state and renders the textarea. Save skips unchanged text; after the local browser save succeeds, the ref remembers it without requesting a render.',
    pitfall: 'This is an illustrative local save, not a server request. The ref is only read and written in the handler. A visible saved or dirty status would need state.',
    takeaway: 'State holds information that drives the UI. A ref remembers information that doesn’t need to drive a UI update.',
    sources: [docs('useRef', 'reference/react/useRef')],
  },
  {
    id: 'ref-focus', title: 'Focus the field\nwhen it mounts.', topic: 'DOM REFERENCES',
    body: 'Attach a ref to the textarea. After React puts the DOM node in current, an Effect can focus it.',
    code: "import { useEffect, useRef } from 'react';\n\nfunction NoteFocus() {\n  const noteRef = useRef<HTMLTextAreaElement>(null);\n  useEffect(() => {\n    noteRef.current?.focus();\n  }, []);\n  return <textarea ref={noteRef} />;\n}",
    explanation: 'HTMLTextAreaElement is the node type. Optional chaining handles a missing node. The empty dependency list focuses on mount, not on each keystroke.',
    takeaway: 'The ref gives access to the DOM node. The Effect focuses it after mount.',
    sources: [docs('Manipulating the DOM with refs', 'learn/manipulating-the-dom-with-refs')],
  },
  {
    id: 'section-reducer', title: 'Reducers and state transitions', topic: 'REACT HOOKS', sectionNumber: '04', dark: true,
    body: 'Describe actions and calculate predictable next state.',
    takeaway: '', sources: [],
  },
  {
    id: 'reducer-actions', title: 'A reducer function centralizes\nstate transition rules.', topic: 'USEREDUCER',
    body: 'useReducer manages state by passing the current state and a dispatched action to a pure reducer. The reducer returns the next state.',
    code: "function checkoutReducer(\n  checkoutState: { quantity: number; note: string },\n  action: CheckoutAction\n) {\n  switch (action.type) {\n    case 'quantityChanged':\n      return { ...checkoutState, quantity: action.quantity };\n    case 'reset':\n      return { quantity: 1, note: '' };\n    default:\n      return checkoutState;\n  }\n}",
    codeCallout: {"label": "1. Define the allowed actions", "code": "type CheckoutAction =\n  | { type: 'quantityChanged';\n      quantity: number }\n  | { type: 'reset' };", "description": "quantityChanged requires a quantity number. reset needs no extra data."},
    explanation: '2. The reducer handles these actions. action.type selects the branch; quantityChanged supplies action.quantity. Each branch returns the next checkoutState. We send an action with dispatch on slide 19.',
    pitfall: 'A reducer is an alternative to organizing the same state with setters, not an additional duplicate state owner.',
    takeaway: 'Use actions when related update rules benefit from a single place.',
    sources: [docs('Extracting state logic into a reducer', 'learn/extracting-state-logic-into-a-reducer')],
  },
  {
    id: 'reducer-immutability', title: 'Return the next state\nwithout changing the old one.', topic: 'REDUCER STATE',
    body: 'Reducer inputs are read-only. Create a new object when an action changes object state; keep reducers free of side effects.',
    code: "const initialCheckoutState = { quantity: 1, note: '' };\nconst [checkoutState, dispatch] = useReducer(checkoutReducer, initialCheckoutState);\n\nfunction handleReset() {\n  dispatch({ type: 'reset' });\n}\n\n// Inside checkoutReducer’s switch:\ncase 'reset':\n  return { ...initialCheckoutState };",
    explanation: 'The component calls useReducer at its top level. Dispatching reset selects the reset case, which returns a fresh object with quantity 1 and an empty note. The previous checkout state is unchanged.',
    pitfall: 'Mutating checkoutState and returning that same object can prevent the expected update and corrupt earlier snapshots.',
    takeaway: 'An action produces a new state value while preserving previous state.',
    sources: [docs('useReducer', 'reference/react/useReducer')],
  },
  {
    id: 'section-context', title: 'Context and shared values', topic: 'REACT HOOKS', sectionNumber: '05', dark: true,
    body: 'Distribute one owner’s value to consumers across the component tree.',
    takeaway: '', sources: [],
  },
  {
    id: 'context-provider', title: 'One provider shares\nour settings.', topic: 'CONTEXT PROVIDERS',
    body: 'SettingsProvider owns currency, theme and language. Context makes their current values available below it without props through every layout.',
    code: "const SettingsContext = createContext(null);\n\nfunction SettingsProvider({ children }) {\n  const [currency, setCurrency] = useState('USD');\n  const [theme, setTheme] = useState('light');\n  const [language, setLanguage] = useState('en');\n  return <SettingsContext.Provider value={{\n    currency, setCurrency,\n    theme, setTheme,\n    language, setLanguage\n  }}>\n    {children}\n  </SettingsContext.Provider>;\n}",
    explanation: 'Small consumers read the preference or setter they need. The provider owns all three values; checkout quantity stays separate.',
    pitfall: 'This is a local preview: a currency label, light/dark styling and a short translated label. No conversion, full translation system or sitewide theme.',
    takeaway: 'The provider owns state; Context distributes its current value.',
    sources: [docs('Passing data deeply with context', 'learn/passing-data-deeply-with-context')],
  },
  {
    id: 'context-consumer', title: 'Different consumers,\none Settings context.', topic: 'USECONTEXT',
    body: 'Each component reads the properties it needs from the same nearest provider. Guard a missing value before reading its properties.',
    comparison: [{"title": "Currency", "code": "function CurrencyBadge() {\n  const settings =\n    useContext(SettingsContext);\n  if (settings === null) return null;\n  const { currency } = settings;\n  return <span>{currency}</span>;\n}", "explanation": "Reads currency to display a badge."}, {"title": "Language", "code": "function LanguageSelector() {\n  const settings =\n    useContext(SettingsContext);\n  if (settings === null) return null;\n  const { language, setLanguage } = settings;\n  return <LanguageSelect\n    value={language} onChange={setLanguage} />;\n}", "explanation": "Reads language and its setter. The supplied selector changes a short label."}, {"title": "Theme", "code": "function ThemeSelector() {\n  const settings =\n    useContext(SettingsContext);\n  if (settings === null) return null;\n  const { theme, setTheme } = settings;\n  return <ThemeSelect\n    value={theme} onChange={setTheme} />;\n}", "explanation": "Reads theme and its setter. Light/dark styles affect the local preview."}],
    takeaway: 'One provider owns the preferences. Separate consumers read and update them.',
    sources: [docs('useContext', 'reference/react/useContext')],
  },
  {
    id: 'section-custom', title: 'Custom Hooks', topic: 'REACT HOOKS', sectionNumber: '06', dark: true,
    body: 'Extract reusable stateful logic while keeping ownership clear.',
    takeaway: '', sources: [],
  },
  {
    id: 'custom-extraction', title: 'Compose state, ref and Effect in a Hook.', topic: 'CUSTOM HOOKS',
    body: 'One useCountdown function, read left to right. Import useState, useRef and useEffect from React.',
    comparison: [{"title": "1. State, ref and Effect", "code": "function useCountdown(initialSeconds = 30) {\n  const [seconds, setSeconds] = useState(initialSeconds);\n  const [restartVersion, setRestartVersion] = useState(0);\n  const timerRef =\n    useRef<ReturnType<typeof setInterval> | null>(null);\n  useEffect(() => {\n    setSeconds(initialSeconds);\n    const timer = setInterval(() => {\n      setSeconds(previous => Math.max(0, previous - 1));\n    }, 1000);\n    timerRef.current = timer;\n    return () => {\n      clearInterval(timer);\n      if (timerRef.current === timer) timerRef.current = null;\n    };\n  }, [initialSeconds, restartVersion]);", "explanation": "State drives seconds. The ref retains the timer ID. The Effect owns setup and cleanup."}, {"title": "2. Continue inside the same Hook", "code": "  function stop() {\n    if (timerRef.current !== null) {\n      clearInterval(timerRef.current);\n    }\n    timerRef.current = null;\n  }\n  return {\n    seconds,\n    stop,\n    restart: () => setRestartVersion(v => v + 1)\n  };\n}", "explanation": "Stop cancels this interval. Restart changes the version, so cleanup runs before fresh setup. Zero only clamps the displayed number."}],
    explanation: 'Each caller receives seconds, stop and restart. Restart changes restartVersion so cleanup runs before fresh setup. Import useState, useRef and useEffect from React.',
    pitfall: 'The updater only calculates the next seconds value. Zero clamps the display; stopping or unmounting clears the interval. Keep cleanup after extraction.',
    takeaway: 'A custom Hook composes Hooks around one reusable responsibility.',
    sources: [docs('Reusing logic with custom Hooks', 'learn/reusing-logic-with-custom-hooks')],
  },
  {
    id: 'custom-independence', title: 'Each countdown call\nhas its own state.', topic: 'CUSTOM HOOK INSTANCES',
    body: 'Two calls share the implementation, not their seconds or timer handles.',
    code: "function TwoCountdowns() {\n  const first = useCountdown(30);\n  const second = useCountdown(30);\n  return <>\n    <p>{first.seconds} / {second.seconds}</p>\n    <button onClick={first.stop}>Stop First</button>\n    <button onClick={first.restart}>Restart First</button>\n  </>;\n}",
    explanation: 'Both start at thirty. Stop First: Second keeps counting. Restart First: only First returns to thirty. The demo also unmounts one caller to show its cleanup.',
    pitfall: 'Matching numbers do not mean shared state. To share one countdown, lift one Hook call to a common owner and pass its result or use Context.',
    takeaway: 'Reuse countdown logic; each call owns its state, ref and Effect.',
    sources: [docs('Custom Hooks share logic, not state', 'learn/reusing-logic-with-custom-hooks')],
  },
  {
    id: 'section-optimization', title: 'Optimization', topic: 'REACT HOOKS', sectionNumber: '07', dark: true, optional: true,
    body: 'Use evidence to decide when cached results or stable references help.',
    takeaway: '', sources: [],
  },
  {
    id: 'memo-result', title: 'useMemo can reuse\na calculation result.', topic: 'OPTIMIZATION', optional: true,
    body: 'When a pure calculation is measurably expensive, useMemo can reuse its result while its dependencies remain unchanged.',
    code: "function Offers({ offers, region }) {\n  const [note, setNote] = useState('');\n  const matchingOffers = useMemo(\n    () => offers.filter(offer => offer.region === region),\n    [offers, region]\n  );\n  return (\n    <section>\n      <input aria-label=\"Order note\" value={note}\n        onChange={e => setNote(e.target.value)} />\n      <ul>{matchingOffers.map(offer => (\n        <li key={offer.id}>{offer.name}</li>\n      ))}</ul>\n    </section>\n  );\n}",
    explanation: 'Typing a note updates state and rerenders Offers. If the offers array reference and region are unchanged, useMemo reuses matchingOffers. A new offers array or a different region reruns the filter. The list still renders; the cache only skips the calculation.',
    pitfall: 'useMemo saves calculation work; the component still renders.',
    takeaway: '',
    sources: [docs('useMemo', 'reference/react/useMemo')],
  },
  {
    id: 'optimization-choice', title: 'useMemo and memo do different jobs.', topic: 'OPTIMIZATION', optional: true,
    body: 'useMemo caches a calculated value. memo wraps a component and may skip a parent-caused render when its props are unchanged. memo is a wrapper, not a Hook. Neither requires the other.',
    comparison: [
      { title: 'Parent · cache the filtered array', code: "function Offers({ offers, region }) {\n  const [note, setNote] = useState('');\n  const matchingOffers = useMemo(\n    () => offers.filter(\n      offer => offer.region === region\n    ),\n    [offers, region]\n  );\n  return <section>\n    <input aria-label=\"Order note\" value={note}\n      onChange={e => setNote(e.target.value)} />\n    <OffersList offers={matchingOffers} />\n  </section>;\n}", explanation: 'Typing a note rerenders Offers. With the same offers array and region, useMemo skips the filter and returns the same matchingOffers array.' },
      { title: 'Child · reuse output for unchanged props', code: "const OffersList = memo(\n  function OffersList({ offers }) {\n    return <ul>\n      {offers.map(offer => (\n        <li key={offer.id}>{offer.name}</li>\n      ))}\n    </ul>;\n  }\n);", explanation: 'The same array prop lets memo skip OffersList on that note update. A new offers array or region reruns the filter, producing a new array: OffersList renders again. Its own state or Context changes can also cause renders. Next, we’ll keep a function prop stable with useCallback.' },
    ],
    takeaway: '',
    sources: [docs('useMemo', 'reference/react/useMemo'), docs('memo', 'reference/react/memo')],
  },
  {
    id: 'callback-reference', title: 'useCallback keeps a function prop stable.', topic: 'OPTIMIZATION', optional: true,
    body: 'Imagine a shipping form that is slow to render. Keep its submit prop stable when only the page theme changes. Simplified from the React docs.',
    comparison: [
      { title: 'ProductPage · keep the submit prop stable', code: "function submitOrder(productId, details) {\n  console.log(productId, details); // simulation only\n}\nfunction ProductPage({ productId, referrer, theme }) {\n  const handleSubmit = useCallback(\n    orderDetails => submitOrder(productId, {\n      referrer, orderDetails\n    }),\n    [productId, referrer]\n  );\n  return <div className={theme}>\n    <ShippingForm onSubmit={handleSubmit} />\n  </div>;\n}", explanation: 'Theme changes rerender ProductPage, but the handler keeps its reference. Changing productId or referrer gives a new handler, so the child renders. submitOrder is a fixed helper outside React; it only logs.' },
      { title: 'ShippingForm · supplied form, shortened', code: "const ShippingForm = memo(\n  function ShippingForm({ onSubmit }) {\n    return <form onSubmit={event => {\n      event.preventDefault();\n      const orderDetails = Object.fromEntries(\n        new FormData(event.currentTarget)\n      );\n      onSubmit(orderDetails);\n    }}>\n      <input name=\"address\" aria-label=\"Address\" />\n      <button>Submit order</button>\n    </form>;\n  }\n);", explanation: 'Unchanged onSubmit lets memo skip a parent-triggered form render. Submitting still calls the handler with the form data. The potential saving is form rendering—not handler execution or the number of parameters.' },
    ],
    takeaway: '',
    sources: [docs('React useCallback · ProductPage example', 'reference/react/useCallback#skipping-re-rendering-of-components'), docs('memo', 'reference/react/memo')],
  },
  {
    id: 'thank-you', title: 'Thank you', topic: '', body: '',
    dark: true, closing: true, takeaway: '', sources: [],
  },
];

const codeNotes: Record<string, string> = {
  'hook-rules': 'JavaScript and JSX example.',
  'state-memory': 'JavaScript and JSX example.',
  'state-snapshot': 'Inside a function component. Import useState from React.',
  'state-updaters': 'JavaScript and JSX. Comments describe the first click, starting from quantity 1.',
  'controlled-input': 'JavaScript and JSX example.',
  'derived-state': 'Inside a function component. Import useState from React. The pack price is fixed at $24.',
  'effect-purpose': 'Component-body excerpt: quantity is state or a prop; import useEffect from React.',
  'effect-dependencies': 'JavaScript and JSX example; import useEffect from React.',
  'effect-cleanup': 'Inside the timer child component; import useState and useEffect from React.',
  'ref-memory': 'Complete TypeScript/JSX component. The illustrative save uses local browser storage.',
  'ref-focus': 'TypeScript and JSX example; the generic identifies a textarea DOM element.',
  'reducer-actions': 'JavaScript reducer example for cart state with quantity and note fields.',
  'reducer-immutability': 'Separate JavaScript excerpts: component setup and handler, then a reducer branch. Import useReducer from React.',
  'context-provider': 'JSX sketch. Import createContext and useState; SettingsControls is supplied. The demo includes TypeScript types.',
  'context-consumer': 'JSX consumers of the shared SettingsContext. Selector UI is supplied.',
  'custom-extraction': 'TypeScript custom Hook. Import useState, useRef and useEffect from React.',
  'custom-independence': 'JSX component using useCountdown from the preceding slide.',
  'memo-result': 'JavaScript/JSX component; import useState and useMemo from React. Offers have id, name and region fields.',
  'callback-reference': 'JavaScript/JSX parent and child; import memo and useCallback from React. Submission logs locally; no network request.',
};

for (const slide of referenceSlides) {
  if (slide.code) slide.codeNote = codeNotes[slide.id];
}
