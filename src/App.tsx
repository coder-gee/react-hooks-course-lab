import { TimerDiagnostic } from "./components/ReservationCountdown";
import { checkoutReservationTimers } from "./lib/reservationTimers";
import { ReservationTimerLab } from "./components/ReservationTimerLab";
import { demoPractice } from "./data/demoPractice";
import ReducerResetCheckoutExercise from "./exercises/ReducerResetCheckoutExercise";
import ContextProviderCheckoutExercise from "./exercises/ContextProviderCheckoutExercise";
import CustomHookCheckoutExercise from "./exercises/CustomHookCheckoutExercise";
import ExerciseReference from "./references/ExerciseReference";
import { exerciseReferences } from "./data/exerciseReferences";
import EffectDependencyGuide from "./components/EffectDependencyGuide";
import CheckoutDraftInstructorWorkspace from "./instructor/homework/CheckoutDraftInstructorWorkspace";
import HomeworkAssignment from "./homework/instructions/HomeworkAssignment";
import ContextualTerms from "./components/ContextualTerms";
import { demoTerms, checkoutTerms } from "./data/contextualTerms";
import GitCheckpointNote from "./components/GitCheckpointNote";
import { useEffect, useLayoutEffect, useState } from "react";
import { scenes } from "./data/scenes";
import { referenceSlides } from "./data/referenceSlides";
import { teachingGuide } from "./data/teachingGuide";
import ReferenceSlides from "./components/ReferenceSlides";
import TeachingGuide from "./components/TeachingGuide";
import CourseFlow from "./components/CourseFlow";
import Glossary from "./components/Glossary";
import Code from "./components/Code";
import { snippet } from "./lib/snippets";
import {
  LocalQuantity,
  StateQuantity,
  BatchedReset,
  DirectUpdates,
  QueuedUpdates,
  ConsistentCheckout,
  TitleSync,
  FocusNote,
} from "./demos/Examples";
import StateCheckoutExercise from "./exercises/StateCheckoutExercise";
import StateCheckoutReference from "./references/StateCheckoutReference";
import EffectCleanupCheckoutExercise from "./exercises/EffectCleanupCheckoutExercise";
import InputFocusCheckoutExercise from "./exercises/InputFocusCheckoutExercise";
import ReferenceCheckout from "./references/ReferenceCheckout";
import AdvancedCheckout from "./references/AdvancedCheckout";
import {
  ReducerExample,
  ContextExample,
  CustomHookExample,
} from "./demos/AdvancedExamples";
import { CachedOffers, StableAction, UncachedOffers, UnstableAction } from "./demos/OptimizationExamples";
import { checkoutConnection } from "./lib/connectivity";

type Route = "homework" | "guide" | "flow" | "glossary" | "slides" | "demo" | "checkout";
const params = () => new URLSearchParams(window.location.search);
function go(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}
function Link({
  to,
  children,
  className = "",
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
          e.preventDefault();
          go(to);
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
function Fullscreen() {
  return (
    <button
      className="icon-button"
      title="Toggle fullscreen"
      aria-label="Toggle fullscreen"
      onClick={() => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }}
    >
      ⛶
    </button>
  );
}
export default function App() {
  const [location, setLocation] = useState(
    window.location.pathname + window.location.search,
  );
  useEffect(() => {
    const update = () =>
      setLocation(window.location.pathname + window.location.search);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  useEffect(() => {
    if (window.location.pathname === "/checkout" && new URLSearchParams(window.location.search).get("checkpoint") === "performance") {
      go("/demo?scene=memo&phase=run");
    }
  }, [location]);
  const raw = location.split("?")[0].slice(1);
  const route: Route = ["homework", "flow", "glossary", "slides", "demo", "checkout"].includes(raw)
    ? (raw as Route)
    : "guide";
  useLayoutEffect(() => {
    const section = {
      guide: "Teaching guide",
      flow: "Course flow",
      homework: "Homework",
      glossary: "Glossary",
      slides: "Lecture slides",
      demo: "Live demo",
      checkout: "Checkout lab",
    }[route];
    // Set the section before lesson Effects add their live title examples.
    document.title = `${section} · React Hooks Course Lab`;
  }, [location, route]);
  if (route === "slides" && params().get("print") === "1") {
    return <ReferenceSlides key={location} navigate={go} />;
  }
  return (
    <>
      <header className="app-header">
        <Link to="/guide" className="brand">
          <img src="/assets/xsolla-cyan-logo.png" alt="Xsolla" />
          <span>COURSE LAB</span>
        </Link>
        <nav aria-label="Teaching surfaces">
          {[
            ["guide", "Teaching guide"],
            ["slides", "Lecture slides"],
            ["demo", "Live demo"],
            ["checkout", "Checkout lab"],
            ["homework", "Homework"],
            ["glossary", "Glossary"],
          ].map(([key, label]) => (
            <Link
              key={key}
              to={`/${key}`}
              className={route === key || (route === "flow" && key === "guide") ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main>
        {route === "guide" ? (
          <TeachingGuide key={location} navigate={go} />
        ) : route === "flow" ? (
          <CourseFlow key={location} />
        ) : route === "homework" ? (
          <HomeworkAssignment key={location} navigate={go} />
        ) : route === "glossary" ? (
          <Glossary key={location} />
        ) : route === "slides" ? (
          <ReferenceSlides key={location} navigate={go} />
        ) : route === "demo" ? (
          <Demo key={location} />
        ) : (
          <Checkout key={location} />
        )}
      </main>
    </>
  );
}
function guideForScene(sceneId: string) {
  return (
    teachingGuide.find((stage) => stage.id === params().get("stage")) ||
    teachingGuide.find((stage) =>
      stage.demos.some((demo) => demo.id === sceneId),
    ) ||
    teachingGuide[0]
  );
}
function Demo() {
  const found = scenes.find((s) => s.id === params().get("scene"));
  const scene = found || scenes[0];
  const practice = demoPractice[scene.id];
  const practiceHref = practice ? `/checkout?checkpoint=${practice.checkpoint}&stage=${practice.stage}` : undefined;
  const section = referenceSlides.find((slide) => slide.id === scene.section)!;
  const originStage = guideForScene(scene.id);
  const guideHref = `/guide?stage=${encodeURIComponent(originStage.id)}`;
  const sceneIndex = scenes.indexOf(scene);
  const visitExample = (index: number) => {
    const nextScene = scenes[index];
    if (!nextScene) return;
    const search = new URLSearchParams(window.location.search);
    search.set("scene", nextScene.id);
    if (!search.has("stage")) search.set("stage", originStage.id);
    go(`/demo?${search.toString()}`);
  };
  // Older Inspect links open the fixed version only when a comparison exists.
  const requestedPhase = params().get("phase") ?? params().get("tab");
  const requestedFix = requestedPhase === "inspect" || requestedPhase === "fix";
  const initialQueuePart = params().get("part") === "updates" || (scene.id === "queue" && requestedFix) ? "updates" : "batching";
  const initialHasFix = !!scene.comparison && (scene.id !== "queue" || initialQueuePart === "updates");
  const [phase, setPhase] = useState<"predict" | "run" | "fix" | "handoff">(
    requestedFix ? (initialHasFix ? "fix" : "run")
      : requestedPhase === "practice" || requestedPhase === "handoff" ? (practice ? "handoff" : "run")
      : requestedPhase === "run" ? "run" : "predict",
  );
  const [extra, setExtra] = useState(false);
  const [fixed, setFixed] = useState(requestedFix && initialHasFix);
  const [reset, setReset] = useState(0);
  const [size, setSize] = useState(18);
  const [queuePart, setQueuePart] = useState<"batching" | "updates">(initialQueuePart);
  const isBatching = scene.id === "queue" && queuePart === "batching";
  const hasFix = !isBatching && !!scene.comparison;
  const phases: Array<typeof phase> = ["predict", "run"];
  if (hasFix) phases.push("fix");
  if (practice) phases.push("handoff");
  const question = isBatching
    ? "What happens when one Reset click changes quantity and note?"
    : scene.question;
  const takeaway = isBatching
    ? "React waits for the Reset handler to finish, then updates quantity and note together."
    : scene.takeaway;
  const chooseQueuePart = (part: "batching" | "updates") => {
    setQueuePart(part);
    setFixed(false);
    setPhase("predict");
    setReset((value) => value + 1);
  };
  const source = snippet(
    isBatching ? "batching" : extra && scene.id === "reducer"
      ? "reducerUse"
      : extra && scene.id === "context"
        ? "provider"
        : extra && scene.id === "custom"
          ? "consumer"
          : fixed
            ? scene.after
            : scene.before,
  );
  const live =
    scene.id === "remember" ? (
      fixed ? (
        <StateQuantity />
      ) : (
        <LocalQuantity />
      )
    ) : scene.id === "queue" ? (
      isBatching ? <BatchedReset /> : fixed ? (
        <QueuedUpdates />
      ) : (
        <DirectUpdates />
      )
    ) : scene.id === "consistent" ? (
      <ConsistentCheckout />
    ) : scene.id === "title" ? (
      <TitleSync />
    ) : scene.id === "sync" ? (
      <ReservationTimerLab fixed={fixed} />
    ) : scene.id === "focus" ? (
      <FocusNote />
    ) : scene.id === "reducer" ? (
      <ReducerExample />
    ) : scene.id === "context" ? (
      <ContextExample />
    ) : scene.id === "custom" ? (
      <CustomHookExample />
    ) : scene.id === "memo" ? (
      fixed ? (
        <CachedOffers />
      ) : (
        <UncachedOffers />
      )
    ) : fixed ? (
      <StableAction />
    ) : (
      <UnstableAction />
    );
  return (
    <div className="demo-page">
      <div className="view-toolbar">
        <div>
          <span className="eyebrow">PRESENTER DEMO</span>
          <span>One idea · short explanation · hand over</span>
        </div>
        <div className="toolbar-actions">
          <select
            className="lesson-picker"
            aria-label="Demo scene"
            value={scene.id}
            onChange={(e) =>
              go(
                `/demo?scene=${e.target.value}&stage=${encodeURIComponent(originStage.id)}`,
              )
            }
          >
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <Fullscreen />
        </div>
      </div>
      {scene.optional && (
        <div className="optional-banner">
          <span>
            Optional · performance only. Compiler off; measure before
            optimizing.
          </span>

        </div>
      )}
      <div className="demo-heading">
        <span className="eyebrow">
          Section {section.sectionNumber} · {section.title}
        </span>
        <h1>{scene.title}</h1>
        <p>{question}</p>
      </div>
      {scene.id === "queue" && (
        <nav className="demo-topics" aria-label="Batching and queued update steps">
          <button type="button" className="button small" aria-pressed={isBatching}
            onClick={() => chooseQueuePart("batching")}>1 · Batching</button>
          <button type="button" className="button small" aria-pressed={!isBatching}
            onClick={() => chooseQueuePart("updates")}>2 · Queued updates</button>
        </nav>
      )}
      <div className="demo-phase">
        {phases.map((item, i) => (
          <button
            key={item}
            className={phase === item ? "active" : ""}
            onClick={() => {
              setPhase(item);
              if (hasFix) setFixed(item === "fix");
            }}
          >
            <span>{i + 1}</span>
            {item === "handoff"
              ? "Practice"
              : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      {phase === "handoff" && practiceHref ? (
        <section className="handoff-card">
          <span className="eyebrow">LEARNERS TAKE THE KEYBOARD</span>
          <h2>{scene.task}</h2>
          <p>{takeaway}</p>
          <div>
            <Link className="button primary" to={practiceHref}>
              Open the checkout task →
            </Link>
            <Link className="button" to={guideHref}>
              Back to teaching guide
            </Link>
          </div>
        </section>
      ) : (
        <div className="demo-grid">
          <section className="source-panel">
            <div className="panel-header">
              <span>
                Live source <small>· exact component excerpt</small>
              </span>
              <div>
                <button
                  aria-label="Smaller code"
                  onClick={() => setSize((s) => Math.max(14, s - 2))}
                >
                  A−
                </button>
                <button
                  aria-label="Larger code"
                  onClick={() => setSize((s) => Math.min(26, s + 2))}
                >
                  A+
                </button>
              </div>
            </div>
            {["reducer", "context", "custom"].includes(scene.id) && (
              <button
                className="source-switch"
                onClick={() => setExtra((x) => !x)}
              >
                {extra
                  ? "Show core logic"
                  : "Show " +
                    (scene.id === "context"
                      ? "provider"
                      : scene.id === "custom"
                        ? "consumer"
                        : "component")}{" "}
                ↔
              </button>
            )}
            <Code source={source} size={size} />
            <div className="code-footnote">
              Imports and shared styling omitted. This excerpt is extracted from
              the running component.
            </div>
          </section>
          <section className="behavior-panel">
            <div className="panel-header">
              <span>LIVE RESULT</span>
              <button
                onClick={() => {
                  setReset((r) => r + 1);
                }}
              >
                {scene.id === "queue" ? "↻ Restart example" : "↻ Reset"}
              </button>
            </div>
            <div className="behavior-body">
              {phase === "predict" ? (
                <div className="prediction-cover">
                  <span className="big-question">?</span>
                  <h2>Make a prediction.</h2>
                  <p>
                    Think alone. Compare with a partner.
                    <br />
                    Explain what you expect to happen.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => setPhase("run")}
                  >
                    Run the example →
                  </button>
                </div>
              ) : (
                <div key={`${queuePart}-${fixed}-${reset}`}>{live}</div>
              )}
            </div>
            {scene.id === "memo" && phase !== "predict" && (
              <aside className="takeaway" aria-label="Offer filter explanation">
                <p>Open DevTools Console and compare Run with Fix. Typing a note rerenders the component: Run filters again; Fix reuses the result while offers and query stay unchanged. Searching filters in both versions.</p>
                <p>“Filtering offers” logs mark the calculation, not child renders. Development checks may duplicate logs; compare triggers, not exact counts. The total is a match count, with only the first five shown. useMemo does not skip the slice or list rendering, and this example does not prove a speed benefit.</p>
              </aside>
            )}
            {scene.id === "callback" && phase !== "predict" && (
              <aside className="takeaway" aria-label="Shipping form explanation">
                <p>Open DevTools Console. Toggle theme: Run logs “Rendering ShippingForm” again; Fix can skip that child render because onSubmit stays the same. Changing product or referrer creates a new handler in both versions. Editing the address updates the form’s own state, so it still renders.</p>
                <p>The controls supply ProductPage’s props, as on slide 29. Submission saves a local receipt and logs the order; no network request is made. Development checks may duplicate render logs. Compare triggers, not counts; this small form illustrates the mechanism, not a measured speed benefit.</p>
              </aside>
            )}
            {(phase === "fix" || (!hasFix && phase === "run")) && (
              <details className="takeaway" open>
                <summary className="eyebrow">EXPLAIN THE RESULT</summary>
                <p>{takeaway}</p>
              </details>
            )}
            <div className="behavior-actions">
              {isBatching && (
                <button className="button" onClick={() => chooseQueuePart("updates")}>
                  Continue to queued updates →
                </button>
              )}
              {hasFix && (
                <button
                  className="button primary"
                  onClick={() => {
                    setFixed(!fixed);
                    setPhase(fixed ? "run" : "fix");
                    setReset((r) => r + 1);
                  }}
                >
                  {fixed
                    ? "Show original"
                    : scene.optional
                      ? "Compare optimization"
                      : "Reveal the fix"}{" "}
                  <span>↗</span>
                </button>
              )}
              <Link className="text-button" to={guideHref}>
                Back to teaching guide
              </Link>
            </div>
          </section>
        </div>
      )}
      <div className="demo-bottom">
        <nav className="demo-example-navigation" aria-label="Example navigation">
          <button
            type="button"
            className="button small"
            disabled={sceneIndex === 0}
            onClick={() => visitExample(sceneIndex - 1)}
            title={scenes[sceneIndex - 1]?.title}
          >
            ← Previous example
          </button>
          <span>{sceneIndex + 1} / {scenes.length}</span>
          <button
            type="button"
            className="button small"
            disabled={sceneIndex === scenes.length - 1}
            onClick={() => visitExample(sceneIndex + 1)}
            title={scenes[sceneIndex + 1]?.title}
          >
            Next example →
          </button>
        </nav>
        {practiceHref && <Link to={practiceHref}>Matching checkout task →</Link>}
      </div>
      <ContextualTerms terms={demoTerms[scene.id]} />
    </div>
  );
}
const checkpoints = [
  {
    id: "starter",
    label: "Exercise · Add state to the starter",
    path: "src/exercises/StateCheckoutExercise.tsx",
    heading: "Connect the checkout controls to state",
    task: "The layout and styling are supplied; no UI conversion is needed. Wire the −/+ quantity buttons and output to state (1–10), control the note with value and onChange, pass both values to Summary, and derive note.length. Summary already calculates the total. Then add reviewing Boolean state, connect it to showReview, and wire Review order / Edit details. Reuse quantity and note in the supplied review; no styling or extra copies of state.",
    check:
      "After your changes: −/+ stays within 1–10, summary and count agree, Review shows the current quantity/note, and Edit details returns with both values preserved.",
  },
  {
    id: "state",
    label: "Working reference · State and derived values",
    path: "src/references/StateCheckoutReference.tsx",
    heading: "One source of truth",
    task: "This rescue checkpoint completes Lab 1. Explain the state owner and derived values before adding synchronization.",
    check: "Try quantity at the minimum, edit the note, and review the order.",
  },
  {
    id: "repair-sync",
    label: "Exercise · Set up and clean up timer",
    path: "src/exercises/EffectCleanupCheckoutExercise.tsx",
    heading: "Start the countdown and clean up its interval",
    task: "The supplied countdown starts inactive at 00:30. First view the working reference. In the timer child, start an interval every 1000 ms, use a functional updater to subtract one down to zero, and return cleanup that clears the same interval identifier. Keep []. UI, state, styles and the Review/Edit loop are supplied. Hint: setSeconds(previous => Math.max(0, previous - 1)); previous is the pending state value React supplies. Keep the updater pure: only calculate the next number. Clamping to zero does not clear the interval; clearing belongs in returned cleanup.",
    check:
      "After implementation: Details has one timer ticking once per second. Review has zero timers and no new ticks. Edit details starts at 00:30 with one timer, preserving quantity/note. Before implementation, 00:30 stays still and active timers remain zero.",
  },
  {
    id: "sync",
    label: "Exercise · Add input focus",
    path: "src/exercises/InputFocusCheckoutExercise.tsx",
    heading: "Focus the note when Details mounts",
    task: "In NoteField, create a textarea ref, attach it, and use an Effect with [] to focus after mount. UI, styles and parent note state are supplied. Do not use autoFocus. Review unmounts the field; Edit details mounts it again.",
    check:
      "The working field focuses on first mount and after Review → Edit details. Text and count update through state; typing and quantity changes do not refocus it.",
  },
  {
    id: "reducer",
    label: "Exercise · Complete the reducer reset",
    path: "src/exercises/ReducerResetCheckoutExercise.tsx",
    heading: "One action, a complete transition",
    task: "Work only in src/exercises/ReducerResetCheckoutExercise.tsx: its CheckoutAction types, initialCheckoutState, reducer and useReducer wiring are together. Complete three TODOs in order: add the reset variant to CheckoutAction, add its whole reducer case returning fresh initial state, then dispatch reset in handleReset. Quantity, note, gift actions and presentational UI are supplied. Compare with the matching reference file.",
    check:
      "Reset dispatches the reset action and restores quantity one, empty note and initial gift settings in a fresh state object. Other actions and Review/Edit keep working.",
  },
  {
    id: "context",
    label: "Exercise · Share settings with Context",
    path: "src/exercises/ContextProviderCheckoutExercise.tsx",
    heading: "Share checkout currency and theme",
    task: "Edit only src/exercises/ContextProviderCheckoutExercise.tsx; no CSS or shared-file edits. TODO 1 in SettingsProvider: add theme useState initialized to light, then include theme and setTheme in value beside the supplied currency props. TODO 2 in the exported ContextProviderCheckoutExercise return: replace the Fragment with SettingsProvider around the supplied scaffold, passing currency and setCurrency. Controls and checkout always display; currency already works through supplied local state; theme stays inert/light until both TODOs are completed. All UI and checkout behavior are supplied.",
    check:
      "Currency formats the unit price, subtotal and total without exchange-rate conversion. Theme updates only this checkout. Increase quantity, add a note and use Review/Edit: details and preferences persist. No language setting in this lab.",
  },
  {
    id: "custom",
    label: "Exercise · Extract a custom Hook",
    path: "src/exercises/CustomHookCheckoutExercise.tsx",
    heading: "Extract the familiar countdown",
    task: "Start in src/exercises/CustomHookCheckoutExercise.tsx. Create a NEW src/exercises/hooks/useCountdown.ts file; do not rename the checkout JSX file or edit advanced/useCountdown.ts. The starter already works: the banner and bright top-bar sale timer each contain inline useState, timerRef and useEffect setup/cleanup. Export useCountdown(initialSeconds) from the new file, move the banner logic and React Hook imports there, and return seconds. Import it into the checkout from ./hooks/useCountdown. Replace the banner logic with useCountdown(30), then reuse it in the header with 45. Keep all supplied markup/styles unchanged. No Hook skeleton is provided.",
    check:
      "Before and after extraction, the banner and header tick independently. Review clears only the banner timer; Edit remounts it at 30 while the header keeps counting. Quantity/note persist. Leaving this lab clears both. There are no Stop or Restart controls or reset counter.",
  },
  {
    id: "state-reference",
    label: "Working reference · Checkout before reducers",
    path: "src/references/ReferenceCheckout.tsx",
    heading: "Earlier state-based solution",
    task: "Retained comparison before reducer/context/custom Hook refactoring.",
    check: "Quantity, note, gift, focus and simulated review work.",
  },
  {
    id: "reference",
    label: "Working reference · Complete checkout",
    path: "src/references/AdvancedCheckout.tsx",
    heading: "The completed core checkout",
    task: "Instructor reference: reducer owns choices, Context distributes them, refs focus the fields; practice independent countdowns in the Custom Hook pair.",
    check:
      "Run Details → Review → Complete. Confirmation is a local simulation.",
  },
  {
    id: "homework",
    label: "Homework · Saved checkout draft",
    path: "src/homework/CheckoutDraft.tsx",
    heading: "Add squad gift planning to this checkout",
    task: "Follow the five small tasks on the Homework page. List logic and UI are supplied; connect the draft, one budget transition, Context readers, validation focus and a scaffolded countdown.",
    check: "Core: add/remove and shared displays agree, budget changes preserve the list, empty-name focus works, and countdown/restart cleanup works. Undo and confirmation are optional.",
  },
];
function Checkout() {
  const cp =
    checkpoints.find((c) => c.id === params().get("checkpoint")) ||
    checkpoints[0];
  const originStage =
    teachingGuide.find((stage) => stage.id === params().get("stage")) ||
    teachingGuide.find((stage) => stage.id === (cp.id === "homework" ? "exit-transfer" : "")) ||
    teachingGuide.find((stage) => stage.checkpoint === cp.id) ||
    teachingGuide[0];
  const guideHref = `/guide?stage=${encodeURIComponent(originStage.id)}`;
  const reference = exerciseReferences[cp.id];
  const showReference = !!reference && params().get("view") === "reference";
  const [reset, setReset] = useState(0);
  const [mounted, setMounted] = useState(true);
  useEffect(() => () => { checkoutConnection.reset(); checkoutReservationTimers.dispose(); }, []);
  function resetLab() {
    checkoutConnection.reset();
    checkoutReservationTimers.reset();
    setMounted(true);
    setReset((n) => n + 1);
  }
  return (
    <div className="checkout-page">
      <div className="view-toolbar">
        <div>
          <span className="eyebrow">CHECKOUT VERSION</span>
        </div>
        <div className="toolbar-actions">
          <select
            className="lesson-picker"
            aria-label="Checkout version"
            value={showReference ? `${cp.id}::reference` : cp.id}
            onChange={(e) => {
              const [checkpoint, view] = e.target.value.split("::");
              resetLab();
              go(`/checkout?checkpoint=${checkpoint}${view === "reference" ? "&view=reference" : ""}&stage=${encodeURIComponent(originStage.id)}`);
            }}
          >
            {!exerciseReferences[cp.id] && cp.id !== "homework" && <option value={cp.id}>Legacy snapshot · {cp.label}</option>}
            {checkpoints.filter(c => !!exerciseReferences[c.id] || c.id === "homework").flatMap((c) => [
              <option key={c.id} value={c.id}>{c.label}</option>,
              ...(exerciseReferences[c.id] ? [
                <option key={`${c.id}::reference`} value={`${c.id}::reference`}>
                  Working reference · {exerciseReferences[c.id].title}
                </option>,
              ] : []),
            ])}
          </select>
          <button className="button small" onClick={() => {
            if (cp.id !== "repair-sync") { resetLab(); return; }
            // Restart the complete lesson host, including forgotten intervals.
            const search = new URLSearchParams(window.location.search);
            search.set("reset", String(Number(search.get("reset") || 0) + 1));
            go(`/checkout?${search}`);
          }}>
            ↻ Reset
          </button>
        </div>
      </div>
      {showReference && <section aria-label="Exercise working reference">
        <details className="task-drawer">
          <summary>
            <span className="checkpoint-dot" />
            Working reference · {reference.title}
            <span className="drawer-hint">How it works & source files</span>
          </summary>
          <div className="task-content">
            <div>
              <span className="eyebrow">READ THE WORKING ANSWER</span>
              <p>{reference.goal}</p>
              <p>Read this reference component:</p>
              <code>{reference.referencePath}</code>
              {reference.implementationPaths && <>
                <p>The completed logic it uses is in:</p>
                {reference.implementationPaths.map(path => <p key={path}><code>{path}</code></p>)}
              </>}
            </div>
            <div>
              <span className="eyebrow">EDIT THE MATCHING EXERCISE</span>
              <p>Make your changes in this exercise file.</p>
              <code>{cp.path}</code>
            </div>
          </div>
        </details>
      </section>}
      {!showReference && <details className="task-drawer">
        <summary>
          <span className="checkpoint-dot" />
          {cp.heading}
          <span className="drawer-hint">Your task & source file</span>
        </summary>
        <div className="task-content">
          <div>
            <p>{cp.task}</p>
            <code>{cp.path}</code>
          </div>
          <div>
            <span className="eyebrow">SUCCESS CHECK</span>
            <p>{cp.check}</p>
          </div>
        </div>
        <GitCheckpointNote checkpoint={cp.id} />
      </details>}
      {!showReference && cp.id === "repair-sync" && <EffectDependencyGuide />}
      {cp.id === "repair-sync" && <TimerDiagnostic />}
      {mounted ? (
        <div key={`${cp.id}:${showReference}:${reset}`}>
          {showReference ? <ExerciseReference exercise={cp.id} /> : cp.id === "homework" ? (
            <CheckoutDraftInstructorWorkspace navigate={go} />
          ) : cp.id === "starter" ? (
            <StateCheckoutExercise />
          ) : cp.id === "state" ? (
            <StateCheckoutReference />
          ) : cp.id === "repair-sync" ? (
            <EffectCleanupCheckoutExercise />
          ) : cp.id === "sync" ? (
            <InputFocusCheckoutExercise />
          ) : cp.id === "state-reference" ? (
            <ReferenceCheckout />
          ) : cp.id === "reducer" ? <ReducerResetCheckoutExercise />
            : cp.id === "context" ? <ContextProviderCheckoutExercise />
            : cp.id === "custom" ? <CustomHookCheckoutExercise />
            : (
            <AdvancedCheckout mode="complete" />
          )}
        </div>
      ) : (
        <div className="unmounted">
          <h2>Checkout unmounted.</h2>
          <p>Inspect the active count above. Then mount it again.</p>
        </div>
      )}
      <div className="checkout-course-footer">
        <Link to={guideHref}>← Teaching guide</Link>
        <Link to={guideHref}>Return to current stage →</Link>
      </div>
      <ContextualTerms terms={checkoutTerms[cp.id]} />
    </div>
  );
}
