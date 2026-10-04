# React Hooks course lab — lecturer repository

Private lecturer workspace for Xsolla School, cohort 2. The teaching guide leads the two-hour class; the standalone lecture slides explain React Hooks for students to revisit independently. Live code demos and checkout exercises support practice. The browser reference deck exports to PDF; a native editable slide deck has not been created.

The first state exercise uses a **Hook-free checkout starter** with the working checkpoint’s quantity stepper and note layout. The quantity buttons, count and summary are deliberately unwired; native note typing still works. The review markup is also supplied; learners wire one Boolean to switch views while retaining quantity and note. Learners progressively connect the UI, synchronize with the browser, organize transitions, distribute one owner, and extract reusable logic.

## Run it

Use a current Node.js version compatible with Vite 7 (Node 20.19+ or 22.12+). From this folder:

```sh
npm ci
npm run dev
```

On this computer:

```sh
cd /Users/cgee/Workspace/XsollaSchool/react-hooks-course-lab
npm run dev
```

Open the `Local` URL printed by Vite. The configured default is **http://127.0.0.1:4173/**. Leave the Terminal window running; press Control-C there to stop your server. `strictPort` prevents silently starting a second copy on another port. If the port is occupied, open the already-running course app or check which project owns it before stopping anything.

```sh
npm run build  # TypeScript + production bundle
npm test       # behavior, lifecycle, source-excerpt, and performance checks
npm run preview -- --port 4175  # optional production-build preview
```

No payment service, credentials, backend, real order, or deployment is used. Font files are bundled locally. The fictional game artwork is an original SVG; the Xsolla marks were copied unmodified from the supplied company template for internal use.

## Two separate repositories

- **This lecturer repository:** Teaching guide, Lecture slides, Live demo, Checkout lab, and Glossary. The private guide holds classroom timing, questions, expected answers, coaching hints, and transitions. Keep this repository private; it is not the student GitLab upload.
- **React Hooks Demo Lab (student repository):** `../react-hooks-demo-lab`, maintained as its own Git repository. Four surfaces: **Lecture slides**, **Live demo**, **Checkout lab**, and **Glossary**. It includes the same public lecture slides, without the teaching guide, private prompts, or links to lecturer routes. Its independent local preview is http://127.0.0.1:4174/. It has not been published.

No remote is configured here. The user will handle the student repository's eventual Xsolla School GitLab destination. Nothing has been pushed.

## Use the private guide to lead the class

1. Keep **Teaching guide** on your laptop, outside the projected display. Choose the current stage. Its time window includes demonstration, student work and feedback; the talk budget is listed separately.
2. Use **What to open**, **Speaking cues**, and **Terms to bring up** for the current stage. **Course flow** shows these for all sixteen stages on one page. Use **Ask** and **Expected reasoning** to prepare the activity. The guide names the relevant lecture slides, demonstrations and checkout task. Open those public screens for the class while keeping the private guide available.
3. In Live demo, start at **Predict**, then **Run**, then inspect or reveal the change. `A−`/`A+` changes code size. Reset remounts the current example. Fullscreen is available.
4. Give students the checkout task. Use the guide's hint and success check as you circulate, then follow its transition to the next stage. The guide owns the teaching order; reference-slide order is independent.

**Lecture slides** contain definitions, explanations, code examples, common mistakes and takeaways. They do not contain classroom timing, coaching prompts or required demo/lab steps. Students can read them without the apps running. The same public deck appears in both repositories.

Glossary remains at the end of the navigation in both apps. Its single alphabetical list uses the same definitions as the lecturer’s stage reminders. The deck has an Xsolla School cover and seven numbered section dividers. Each page uses the same fixed 16:9 canvas, scaled to the available browser width. **Print / Save PDF** opens the complete deck; choose **Save as PDF** and all pages in the browser print dialog, with no margins or headers and background graphics enabled. One PDF contains the entire deck, one complete slide per page, without the app navigation or private guide.

The code panel extracts marked source regions from the actual executable modules with Vite's `?raw` imports. Imports, shared visual layout and supplied instrumentation may be omitted from an excerpt; the full files remain editable. Reducer, Context and custom-Hook scenes have a second source view for the component, provider or consumer. This is a preset demonstration tool, not an arbitrary live-code compiler.

The guide is private by repository separation, not by screen sharing: **any guide window you project is visible to the class**. Keep it on your laptop and project only the public screens. Native Google Slides template content was not overwritten. The browser reference deck uses the supplied Bai Jamjuree font, exact extracted logo assets, company colors and selected template layout patterns.

## Two-hour route

| Minutes | Application problem | Talk |
|---|---|---:|
| 00–10 | Native controls work; the summary is disconnected. Overview and tool map. | 3 |
| 10–30 | Remember choices, controlled input, snapshots, derived data and shared owner. | 6 |
| 30–50 | Browser synchronization, cleanup and explicit field focus. | 6 |
| 50–55 | Break. | 0 |
| 55–72 | Organize cart transitions with a pure reducer. | 5 |
| 72–84 | Give distant consumers the existing owner through Context. | 4 |
| 84–104 | Extract and reuse countdown logic with state, ref and Effect. | 5 |
| 104–114 | Optional measured `useMemo`/`useCallback`, or core consolidation. | 3 |
| 114–120 | Individual evidence, explanation and homework logistics. | 1 |

Maximum **35 minutes lecturer talk, 80 minutes learner work/feedback and homework orientation, 5 minutes break**. Demonstrations/instructions count as talk. Custom Hooks are core and precede optimization. Optional optimization remains at 104–114; use 114–120 for the Homework introduction and workspace handoff. This is a broad introduction with prepared exercises, not a promise of mastery of every API in two hours.

## Editable exercise entry points

Checkpoints are separate source modules. Changing a selector opens another prepared version; it does not modify or complete a student's work. Keep solutions closed until appropriate.

| Checkout query | Edit / inspect | Intended starting behavior |
|---|---|---|
| `checkpoint=starter` | `src/exercises/StateCheckoutExercise.tsx` | Zero Hooks in the feature/imported visual layout; native controls work, summary is initial. Build state and derived values. |
| `checkpoint=state` | `src/references/StateCheckoutReference.tsx` | Completed Lab 1 rescue/reference; one state owner, derived total/count. |
| `checkpoint=repair-sync` | `src/exercises/EffectCleanupCheckoutExercise.tsx` | Form and inactive countdown supplied; implement interval setup, functional updates and returned cleanup. |
| `checkpoint=sync` | `src/exercises/InputFocusCheckoutExercise.tsx` | Completed synchronization; add a ref and explicit Edit note action. |
| `checkpoint=reducer` | `src/exercises/ReducerResetCheckoutExercise.tsx` | Actions supplied; reset deliberately returns unchanged state. Implement pure reset and explain mutation. |
| `checkpoint=context` | `src/exercises/ContextProviderCheckoutExercise.tsx` | Main reducer works; provider intentionally distributes initial data. Connect the existing owner. |
| `checkpoint=custom` | `src/exercises/CustomHookCheckoutExercise.tsx` | Two consumers call the incomplete Hook. Extract state + timer ref + Effect cleanup; each call owns its state and interval. |
| `checkpoint=reference` | `src/references/AdvancedCheckout.tsx` | Completed core reference: reducer + Context + custom Hook + ref + simulated checkout. |
| `checkpoint=state-reference` | `src/references/ReferenceCheckout.tsx` | Earlier state-based complete version for comparison. |

The application shell uses Hooks for navigation/demo controls; that does not change the Hook-free starter feature. `CheckoutFrame.tsx` and `Summary` are Hook-free presentation components. Styling, sample pricing and native layout are supplied so students work on React decisions.

## Demonstration details that matter

- **Snapshots:** one click calls a setter twice. Direct replacements from initial 1 produce 2; two updater functions produce 3. It is not a click-speed issue.
- **Effects:** title synchronization reads quantity; timer cleanup clears its matching interval. Development Strict Mode is enabled. Final active count, not an exact universal setup total, proves cleanup.
- **Custom Hooks:** `useCountdown` combines seconds state, a timer-ID ref for Stop, and Effect setup/cleanup. In Live Demo, stop/restart First independently and unmount Second. In checkout, Review clears only the main banner; the top-bar timer continues. Edit remounts a fresh banner, and leaving the route clears both. The lab Hook returns only seconds; there are no Stop/Restart controls or reset counter. The lab has one flash-sale banner and a small independent top-bar sale countdown before the profile: students extract its Hook, return the interface, and call it from the supplied banner. The starter is fully working with duplicated inline state/ref/Effect logic. Students create the Hook from scratch; no skeleton is supplied. The two-call independence example stays in Live Demo. Homework is the separate saved-checkout feature; it does not require a custom Hook.
- **Context:** SettingsProvider owns currency, theme and language. Separate consumers read the properties they need; layout components pass no settings props. The standalone demo formats a fixed price and changes local theme/language. The checkout lab applies only currency and theme, with no exchange conversion.
- **Optimization (optional):** the app has **no React Compiler configured** so manual comparisons are visible. The useMemo demo filters 500 offers, shows the total matches and first five results, and logs actual filter calculations. The useCallback demo logs renders of a memoized shipping form and submits locally. Strict Mode may repeat development logs; compare which interactions trigger work, not exact counts or assumed speed gains. Caches are for performance, never correctness.
- **Refs:** focus comes from an explicit Edit action; note text remains state-driven. The gift message is preserved while disabled and omitted from summary.
- **Submission:** Review → Place demo order → local confirmation. No order is sent or charged.

## Remaining course preparation

The organizer supplies the real homework deadline, submission destination, survey URL/QR and mentor handoff. No fabricated destination or QR is included. Regenerate the reference PDF after changing its content. A native editable slide deck and any classroom-specific adjustments remain separate from this browser prototype.

Teaching scope and notes: `../work/course-content/proposed-outline.md` and `../work/course-content/prototype-storyboard.md`. Source evidence and template exports remain in `../work/sources/` outside this Git repository.

Primary React references: [state snapshots](https://react.dev/learn/state-as-a-snapshot), [choosing Effects](https://react.dev/learn/you-might-not-need-an-effect), [useEffect](https://react.dev/reference/react/useEffect), [useRef](https://react.dev/reference/react/useRef), [useReducer](https://react.dev/reference/react/useReducer), [useContext](https://react.dev/reference/react/useContext), [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), [useMemo](https://react.dev/reference/react/useMemo), [useCallback](https://react.dev/reference/react/useCallback).


## Student Git lesson checkpoints

The student repository has fixed lesson tags. Its `CHECKPOINTS.md` lists all commands,
and the checkout task notes in both apps show the matching student Git checkout command.
Run those commands in **React Hooks Demo Lab**, not this lecturer repository.
The snapshots supply earlier completed work and choose the relevant exercise automatically.
Save student edits with a commit or stash before switching. The UI Reset button does not
restore source files. When publishing the student repository, push its tags as well as main.

## Independent homework: Automatically saved checkout draft

One feature: persist quantity, note and supplied Context currency in one localStorage object and automatically load it on return. `/homework` is the separate brief under `src/homework/instructions/`, alongside the instructional `CheckoutDraftWorkspace.tsx` wrapper; `/checkout?checkpoint=homework` is the last lab item.

Students edit `src/homework/checkoutDraftReducer.ts` (quantityChanged and noteChanged) and `src/homework/CheckoutDraft.tsx` (replace working local state and setters with useReducer/dispatch, read Context currency and add a saving Effect). Supplied lazy initializers load draft and currency before the first save, preventing defaults from overwriting saved data. The baseline UI works with local quantity/note state and supplied currency Context, but does not save edits. Safe storage helpers and catalogue prices are supplied. Estimate: 45–75 minutes including checks. No extra features or styling work.

Completed component and reducer remain only in `src/instructor/homework/` in the lecturer repository. The private solution toggle opens the answer and records `homeworkView=solution` in the lecturer URL, so reload stays on the solution. Without that parameter, the student starter remains the default. The student app does not implement this private view.

## Exercise working references and source folders

The Checkout lab dropdown alternates each **Exercise** with its own **Working reference**, for all six exercises. Choose either entry directly; Homework stays last. Each reference contains only that task and the relevant earlier behavior; the exercise remains unfinished.

| Exercise | Focused target |
| --- | --- |
| State | Quantity, note/count, Review and Edit details |
| Effect cleanup | State plus a flash sale countdown that stops in Review and restarts in Details |
| Input focus | Controlled note state plus focus on mount |
| Reducer reset | Cart actions/reset; no Context header or custom-Hook status consumers |
| Context | Checkout currency and local theme; supplied quantity, note and Review/Edit |
| Custom Hooks | Extract the flash-sale banner Hook; reuse it independently in the lab-only top bar |

- `src/exercises/`: unfinished lesson code, with supplied markup and TODOs.
- `src/references/`: working lesson targets and existing comparison implementations.
- `src/homework/`: student starter, supplied UI, Context and storage helpers. Instruction-only UI lives in `src/homework/instructions/`.
- `src/advanced/`: shared cart types/reducer, Context and completed countdown Hook utilities.
- `src/demos/`: the small Live Demo examples.

The completed homework stays only in the lecturer repository at `src/instructor/homework/`. The student app has no homework reference button or completed homework code.

### Matching lesson source files

| Exercise | Working reference |
| --- | --- |
| `src/exercises/StateCheckoutExercise.tsx` | `src/references/StateCheckoutReference.tsx` |
| `src/exercises/EffectCleanupCheckoutExercise.tsx` | `src/references/EffectCleanupCheckoutReference.tsx` |
| `src/exercises/InputFocusCheckoutExercise.tsx` | `src/references/InputFocusCheckoutReference.tsx` |
| `src/exercises/ReducerResetCheckoutExercise.tsx` | `src/references/ReducerResetCheckoutReference.tsx` |
| `src/exercises/ContextProviderCheckoutExercise.tsx` | `src/references/ContextProviderCheckoutReference.tsx` |
| `src/exercises/CustomHookCheckoutExercise.tsx` | `src/references/CustomHookCheckoutReference.tsx` |

Each named file is the matching component entrypoint. Reducer, Context and custom Hook exercise files also contain their unfinished logic; shared checkout layout stays reusable. The standalone useMemo demo in `src/demos/OptimizationExamples.tsx` compares ordinary product filtering with a cached result. It has no timing or scoring instrumentation.

Each ordinary working reference uses the same collapsed instruction box as its exercise. Expand the reference title to read its explanation and find the answer component, any shared implementation files, and the matching exercise file to edit.

### Flash sale timer cleanup

Choose **Exercise · Set up and clean up timer** and its immediately following **Working reference · Effect cleanup**. The Details view mounts a 30-second flash sale countdown child. Review unmounts that child; Edit details mounts a fresh countdown while quantity/note persist in the parent. The separate persistent diagnostic counts interval callbacks, not seconds remaining. The exercise initially has no active timers and stays at 00:30. Show the working reference first, then students implement interval setup, the functional updater and returned cleanup. In the completed version, active timers reach zero and ticks stop on Review. UI, styles, state and navigation are supplied. This is a local teaching simulation.

Live Demo shows only the countdown banner, Unmount timer / Mount timer, and compact activity counts. Run omits cleanup; Fix clears the interval. No checkout form appears in that demo. Both lesson hosts dispose forgotten timers on navigation/reset; teaching intervals are also bounded. Strict Mode remains enabled. The custom-Hook lesson extracts countdown logic; homework remains separately scaffolded.


The reducer-reset exercise and reference each contain their own `CheckoutState`,
`CheckoutAction`, initial values, reducer and `useReducer` wiring. Students edit
only `src/exercises/ReducerResetCheckoutExercise.tsx`, completing three TODOs: define the reset action,
add its whole reducer case, then dispatch it in the handler; compare it directly with
`src/references/ReducerResetCheckoutReference.tsx`. Their shared
`src/components/ReducerCheckoutView.tsx` supplies presentation only—no Hooks,
reducer, mode switches or later Context/performance scaffolding.


The slides and standalone Live Demo use three settings: currency, theme and language.
The Context lab applies just currency and theme to the existing checkout. Edit only
`src/exercises/ContextProviderCheckoutExercise.tsx`: add theme state and its setter to SettingsProvider and its value; then wrap the
exported exercise scaffold with SettingsProvider, passing the supplied currency and setCurrency. Controls remain visible with working currency and an inert light-theme control until setup and placement are complete. Separate consumers format unit/summary prices and theme
the checkout. Quantity, note, gift, Review/Edit, UI and CSS are supplied. The matching
reference has the same scaffold with both TODO areas completed. Formatting is not currency
conversion. Null-context consumers return null. No language task is included in the lab.


Custom Hook lab file organization: keep `src/exercises/CustomHookCheckoutExercise.tsx`
and create **a new** `src/exercises/hooks/useCountdown.ts`. Export the extracted Hook
and import it into the checkout from `./hooks/useCountdown`; both banner and header
reuse that import. The starter deliberately has no Hook file or broken import.
The completed reference imports `src/references/hooks/useCountdown.ts`.
Leave `src/advanced/useCountdown.ts` (Live Demo) and homework Hooks unchanged.

Optimization is taught through slides and standalone Live Demo only. No optimization exercise/reference appears in Checkout Lab. The Homework performance stretch remains optional.
