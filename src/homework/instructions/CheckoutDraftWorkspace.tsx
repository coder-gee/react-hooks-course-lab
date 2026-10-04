import CheckoutDraft from "../CheckoutDraft";
import "../homework.css";
export default function CheckoutDraftWorkspace({ navigate }: { navigate: (path: string) => void }) {
  return <section className="homework-assignment" aria-label="Homework workspace">
    <div className="homework-preview-controls">
      <h1>Automatically saved checkout draft · workspace</h1>
      <a href="/homework" onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey) { event.preventDefault(); navigate("/homework"); } }}>Read homework instructions ↗</a>
      <p>Working local-state starter; persistence is unfinished. Complete one feature in src/homework/checkoutDraftReducer.ts and CheckoutDraft.tsx: automatically reload quantity, note and Context currency from one saved object. UI, provider and storage helpers are supplied. Refactor its local quantity/note states and event setters to useReducer, then add the Context read and saving Effect.</p>
      <p>Reset or returning to this workspace remounts it; neither clears saved browser storage.</p>
    </div>
    <CheckoutDraft />
  </section>;
}
