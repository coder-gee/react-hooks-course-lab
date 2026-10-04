import { useState, type ReactNode, type RefObject } from "react";
import {
  CheckoutFrame,
  Summary,
  SectionLabel,
} from "../components/CheckoutFrame";

// CHECKPOINT 1 — lab 1 solution / lab 2 starting point.
// One shared owner. Total and character count are calculations, not extra state.
export default function StateCheckoutReference({ noteRef, detailsContent, topbarContent }: { topbarContent?: ReactNode; noteRef?: RefObject<HTMLTextAreaElement | null>; detailsContent?: ReactNode } = {}) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  return (
    <CheckoutFrame
      topbarContent={topbarContent}
      phase={reviewing ? "Review" : "Details"}
      summary={<>
        <Summary quantity={quantity} note={note} />
        {noteRef && !reviewing && <div className="summary-actions">
          <button onClick={() => noteRef.current?.focus()}>Edit note ↗</button>
        </div>}
      </>}
    >
      <SectionLabel number={reviewing ? "02" : "01"}>
        {reviewing ? "Review your Explorer Pack" : "Your pack details"}
      </SectionLabel>
      {reviewing ? (
        <>
          <p className="muted">
            Your controls and this summary use the same state.
          </p>
          <div className="review-detail">
            <b>{quantity} × Explorer Pack</b>
            <p>{note || "No order note"}</p>
          </div>
          <button className="button" onClick={() => setReviewing(false)}>
            ← Edit details
          </button>
          <p className="scaffold-note">
            The same quantity and note are preserved when you return to Details.
          </p>
        </>
      ) : (
        <>
          {detailsContent}
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
          <label className="field">
            Order note <span>Optional</span>
            <textarea
              ref={noteRef}
              aria-label="Order note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={100}
              placeholder="Anything we should know?"
            />
            <small>
              {note.length}/100 characters · calculated during render
            </small>
          </label>
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
