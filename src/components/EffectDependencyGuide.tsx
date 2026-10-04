import Code from "./Code";
import "./effect-dependency-guide.css";

const cases = [
  {
    title: "No dependency argument",
    scenario: "Temporary debugging: report when the component first appears and completes a re-render to the browser console.",
    code: `useEffect(() => {
  console.log('Checkout render completed');
});`,
    timing: "With no dependency array, the effect runs after the component first appears and after every completed re-render. This is deliberately broad; it is not needed for this countdown.",
  },
  {
    title: "Empty array: []",
    scenario: "Run a countdown while the timer child is mounted. setSeconds is the stable setter from useState.",
    code: `useEffect(() => {
  const id = setInterval(() => {
    setSeconds(s => Math.max(0, s - 1));
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    timing: "Sets up on mount. Note or quantity edits do not restart it. Review unmounts the child and clears its interval; Edit details mounts a fresh child.",
  },
  {
    title: "Specific values: [quantity, currency]",
    scenario: "Keep the browser tab title in sync with quantity and currency supplied as props or state.",
    code: `useEffect(() => {
  document.title = quantity + ' items · ' + currency;
}, [quantity, currency]);`,
    timing: "Runs when the component first appears, then after a completed re-render where either listed value changed. An unrelated note edit does not rerun it. This title assignment needs no cleanup.",
  },
];

export default function EffectDependencyGuide() {
  return <details className="effect-dependency-guide">
    <summary>Effect dependencies: which form fits the job?</summary>
    <p>Start with what the Effect reads, not how often you want it to run. When you pass an array, include every reactive prop, state value, and component-local value the Effect uses. Use [] only when there are no reactive dependencies; don’t leave out a value just to stop reruns.</p>
    <p>These excerpts go at the top level inside a component. Import useEffect from React.</p>
    <div className="effect-dependency-cases">
      {cases.map(item => <section key={item.title} aria-label={item.title}>
        <h3>{item.title}</h3><p>{item.scenario}</p>
        <Code source={item.code} size={14} /><p>{item.timing}</p>
      </section>)}
    </div>
    <p><strong>When cleanup is needed:</strong> React runs the old cleanup before the next setup, and again on unmount. With a dependency array, that next setup follows changed dependencies; without an array, it follows every completed re-render.</p>
    <p><strong>In this lab:</strong> checkoutReservationTimers is a supplied, imported interval service with the same setInterval/clearInterval pairing and visible diagnostic counts. It is fixed; the state setter is stable. A functional updater avoids reading seconds in setup, so [] fits. Complete interval setup, the functional countdown updater, and returned cleanup. Review should leave zero timers with ticks stopped; Edit details should start at 30 with one timer. A new child resets its state even if an old timer leaked, so check the active count too. The Live Demo receives its timer service as a prop, so that Effect lists [timers].</p>
    <a href="https://react.dev/reference/react/useEffect#specifying-reactive-dependencies" target="_blank" rel="noopener noreferrer">React reference: Effect dependencies ↗</a>
  </details>;
}
