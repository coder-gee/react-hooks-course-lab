import ContextualTerms from "../../components/ContextualTerms";
import { checkoutTerms } from "../../data/contextualTerms";
import "../homework.css";
export default function HomeworkAssignment({ navigate }: { navigate: (path: string) => void }) {
  return <article className="homework-assignment" aria-label="Homework instructions">
    <div className="homework-brief">
      <span className="eyebrow">SECOND-LESSON PRACTICE · ONE FEATURE</span>
      <h1>Homework: Automatically saved checkout draft</h1>
      <p>Keep the shopper’s quantity, order note and currency when they reload or return to the checkout. Load saved values automatically. Keep the fixed Explorer Pack, existing stepper and supplied UI.</p>
      <p><strong>Estimated workload: 45–75 minutes</strong> with the supplied UI and storage helpers, including checks. This is a planning estimate, not a deadline.</p>
      <a className="button primary" href="/checkout?checkpoint=homework" onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey) { event.preventDefault(); navigate("/checkout?checkpoint=homework"); } }}>Open homework in Checkout lab →</a>
      <h2>Two files, one feature</h2>
      <p>Complete <code>src/homework/checkoutDraftReducer.ts</code> and <code>src/homework/CheckoutDraft.tsx</code>. The starter already works using local useState: the stepper, note and currency update the UI. It does not save your edits. Refactor it to reducer-owned draft state and add persistence. Currency already works through the supplied SettingsContext. No styling or extra features are required.</p>
      <h2>The four Hook roles</h2>
      <table className="homework-hook-table"><thead><tr><th>Hook</th><th>Job</th></tr></thead><tbody>
        <tr><td>useReducer</td><td>Finish quantityChanged and noteChanged in the reducer. Then replace the existing quantity/note useState calls with useReducer and the supplied lazy initializer. Remove both old states and replace the button/note setters with dispatch calls yourself.</td></tr>
        <tr><td>useState</td><td>The supplied SettingsProvider owns currency and initializes it from saved data. Do not create another currency owner.</td></tr>
        <tr><td>useContext</td><td>Import and call useContext in CheckoutDraft.tsx to read currency from SettingsContext for saving. The supplied UI reads the same Context independently so its selector already works.</td></tr>
        <tr><td>useEffect</td><td>In CheckoutDraft.tsx, save the current quantity, note and currency after changes. Keep draft and currency as dependencies.</td></tr>
      </tbody></table>
      <h2>Load first, then save</h2>
      <p>The single localStorage key <code>xsolla-homework-checkout-draft-v1</code> stores <code>{'{quantity, note, currency}'}</code>. When wiring useReducer, pass the supplied initializeDraft as its third argument and initialDraft as its initializer input. This loads quantity/note; the provider’s lazy useState initializer loads currency from that same saved object. Both finish before the saving Effect runs, so default values do not overwrite an existing draft on mount. Missing, invalid or unavailable storage gives quantity 1, an empty note and USD.</p>
      <h2>File map and hint</h2>
      <ul>
        <li><code>checkoutDraftReducer.ts</code>: your two reducer cases; types and initial state are supplied. State transitions only—no storage in this file.</li>
        <li><code>CheckoutDraft.tsx</code>: replace local quantity/note state with useReducer, replace the three event setters with dispatch, read currency using useContext, and add the useEffect save. Inline TODOs identify each location. The initializer function is supplied; connecting it to the Hook is your job.</li>
        <li><code>draftStorage.ts</code>: supplied safe parsing, lazy draft initializer, storage key, saving helper and fixed catalogue prices.</li>
        <li><code>SettingsContext.tsx</code>: supplied currency owner, lazy initializer and setter.</li>
        <li><code>CheckoutDraftView.tsx</code>: supplied stepper (1–10), note field, currency selector and formatting.</li>
        <li><code>instructions/HomeworkAssignment.tsx</code> and <code>instructions/CheckoutDraftWorkspace.tsx</code>: supplied brief and workspace directions; no student edits needed.</li>
      </ul>
      <p>Storage accepts strings: <code>{"localStorage.setItem(key, JSON.stringify({ ...draft, currency }))"}</code>. Import and use the supplied <code>{"saveDraft({ ...draft, currency })"}</code> helper to catch blocked/full storage. Saving belongs in the Effect, not the reducer or render body. Derive totals from the supplied catalogue prices; do not save prices or fetch exchange rates.</p>
      <h2>Start here</h2>
      <p>Use the current full student app, run <code>npm install</code> if needed and <code>npm run dev</code>. Open the last Checkout lab item, <strong>Homework · Saved checkout draft</strong>. Try the working starter, then reload to see that its edits are not saved. Complete the two reducer cases; replace the local states and setters; read currency with useContext; add the saving Effect. Keep one owner for quantity/note.</p>
      <p><strong>Check the baseline with clean storage:</strong> if this browser was used for an earlier solution, delete only <code>xsolla-homework-checkout-draft-v1</code> in DevTools → Application → Local Storage, then reload. The supplied currency initializer can otherwise read that older saved currency. Do not clear unrelated browser storage. Starting clean, all controls work but reloading returns to quantity 1, an empty note and USD until you implement saving.</p>
      <h2>Self-check before you finish</h2>
      <ul>
        <li>Set quantity to 3, type Hello and choose EUR. Reload: all three values appear automatically, without a prompt or button. Return to the lab after navigating away and check the same result.</li>
        <li>Change quantity without losing the note; change note without losing quantity. Currency remains owned by Context. Stepper bounds are 1–10.</li>
        <li>Inspect the single saved object in DevTools → Application → Local Storage. Delete only its key to test defaults; set it to invalid JSON to check safe fallback.</li>
        <li>Use the safe helpers so blocked/full storage cannot crash the checkout. Editing still works in memory, but unavailable storage cannot preserve changes across reloads.</li>
        <li>Run <code>npm run build</code>. Starter tests protect the scaffold, so also perform these manual checks. Development checks may repeat Effects; saving the same object twice must be harmless.</li>
      </ul>
      <h2>What to hand in</h2>
      <p>Your completed reducer and component files, a short recording or screenshots of edit → reload → automatically restored values, and one sentence for each Hook’s role. All student edits stay under src/homework/. The lecturer provides the deadline and submission location.</p>
    </div>
    <ContextualTerms terms={checkoutTerms.homework} />
  </article>;
}
