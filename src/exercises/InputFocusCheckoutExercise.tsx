import { useEffect, useState } from "react";
import {
  CheckoutFrame,
  Summary,
  SectionLabel,
} from "../components/CheckoutFrame";

// Parent state preserves the note when Review unmounts the Details field.
export default function InputFocusCheckoutExercise() {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  useEffect(() => {
    document.title = `Checkout lab · ${quantity} pack${quantity === 1 ? "" : "s"}`;
  }, [quantity]);
  return (
    <CheckoutFrame
      phase={reviewing ? "Review" : "Details"}
      summary={<Summary quantity={quantity} note={note} />}
    >
      <SectionLabel number={reviewing ? "02" : "01"}>
        {reviewing ? "Review your Explorer Pack" : "Your pack details"}
      </SectionLabel>
      {reviewing ? (
        <>
          <div className="review-detail">
            <b>{quantity} × Explorer Pack</b>
            <p>{note || "No order note"}</p>
          </div>
          <button className="button" onClick={() => setReviewing(false)}>
            ← Edit details
          </button>
        </>
      ) : (
        <>
          <p className="muted">
            Choose your packs and add an optional note for this demo order.
          </p>
          <div className="field">
            <p>Quantity</p>
            <div className="stepper">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <output aria-label="Quantity">{quantity}</output>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              >
                +
              </button>
            </div>
          </div>
          <NoteField note={note} setNote={setNote} />
          <button
            className="button primary wide"
            onClick={() => setReviewing(true)}
          >
            Review order <span>→</span>
          </button>
        </>
      )}
    </CheckoutFrame>
  );
}


// Details mounts this child; Review unmounts it. UI and state wiring are supplied.
function NoteField({ note, setNote }: { note: string; setNote: (value: string) => void }) {
  // TODO 1: Import useRef and create a ref for HTMLTextAreaElement, initially null.
  // TODO 2: Attach the ref to the supplied textarea.
  // TODO 3: In useEffect with [], call noteRef.current?.focus() after mount.
  // Keep note in the parent. Do not use the autoFocus prop or a click handler.
  return (
    <label className="field">
      Order note <span>Optional</span>
      <textarea
        aria-label="Order note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        maxLength={100}
        placeholder="Anything we should know?"
      />
      <small>{note.length}/100 characters</small>
    </label>
  );
}
