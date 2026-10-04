import {
  CheckoutFrame,
  Summary,
  SectionLabel,
} from "../components/CheckoutFrame";

// LAB 1 STARTER: the working checkpoint's layout, with zero Hooks and no state wiring.
// Layout, classes and controls are supplied. No styling or UI conversion is needed.
// TODO 1: import useState; remember quantity (1) and note ("").
// TODO 2: wire the −/+ buttons and output to quantity; keep it between 1 and 10.
// TODO 3: replace the note's defaultValue with value + onChange using note state.
// TODO 4: pass quantity and note to Summary; it already derives the $24-per-pack total.
// TODO 5: replace the count placeholder with note.length. Do not store total/count in state.
// TODO 6: add reviewing state (false). Replace showReview's false with reviewing.
// TODO 7: Review order sets reviewing true; Edit details sets it false.
// Use the same quantity/note in the review below: no snapshot or second copy of state.
export default function StateCheckoutExercise() {
  // TODO: use the reviewing Boolean here to switch the supplied views.
  const showReview = false;
  return (
    <CheckoutFrame phase={showReview ? "Review" : "Details"} summary={<Summary quantity={1} />}>
      <SectionLabel number={showReview ? "02" : "01"}>
        {showReview ? "Review your Explorer Pack" : "Your pack details"}
      </SectionLabel>
      {showReview ? (
        <>
          <p className="muted">Your controls and this summary use the same state.</p>
          <div className="review-detail">
            {/* TODO: replace 1 and the placeholder note with the existing quantity/note state. */}
            <b>{1} × Explorer Pack</b>
            <p>No order note</p>
          </div>
          {/* TODO: onClick sets reviewing to false. */}
          <button className="button" type="button">← Edit details</button>
        </>
      ) : (
        <>
          <p className="muted">
            Choose your packs and add an optional note for this demo order.
          </p>
          <div className="field">
            <p>Quantity</p>
            <div className="stepper">
              {/* TODO: add onClick handlers that update quantity. */}
              <button type="button" aria-label="Decrease quantity">−</button>
              <output aria-label="Quantity">1</output>
              <button type="button" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <label className="field">
            Order note <span>Optional</span>
            <textarea
              aria-label="Order note"
              defaultValue=""
              maxLength={100}
              placeholder="Anything we should know?"
            />
            {/* TODO: replace 0 with note.length. */}
            <small>0/100 characters · calculated during render</small>
          </label>
          {/* TODO: onClick sets reviewing to true. */}
          <button className="button primary wide" type="button">
            Review order <span>→</span>
          </button>
        </>
      )}
    </CheckoutFrame>
  );
}
