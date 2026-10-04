import CheckoutDraftWorkspace from "../../homework/instructions/CheckoutDraftWorkspace";
import CheckoutDraftReference from "./CheckoutDraftReference";
export default function CheckoutDraftInstructorWorkspace({ navigate }: { navigate: (path: string) => void }) {
  const query = new URLSearchParams(window.location.search);
  const solution = query.get("homeworkView") === "solution";
  function toggleSolution() {
    if (solution) query.delete("homeworkView");
    else query.set("homeworkView", "solution");
    navigate(`${window.location.pathname}?${query.toString()}`);
  }
  return <>
    <div className="homework-preview-controls">
      <p className="fineprint">LECTURER ONLY · Keep the completed answer hidden when showing the student starter.</p>
      <button className="button" onClick={toggleSolution}>{solution ? "Return to unfinished starter" : "Open lecturer homework solution"}</button>
    </div>
    {solution ? <section aria-label="Lecturer homework reference" className="homework-assignment">
      <h1>Automatically saved checkout draft · lecturer reference</h1>
      <p>Completed answer in src/instructor/homework/. This implementation is absent from the student app. Reload stays on this lecturer solution and loads saved values automatically.</p>
      <CheckoutDraftReference />
    </section> : <CheckoutDraftWorkspace navigate={navigate} />}
  </>;
}
