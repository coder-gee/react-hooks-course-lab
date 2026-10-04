import { useEffect, useRef, useState } from "react";
import { checkoutConnection } from "../lib/connectivity";
import {
  CheckoutFrame,
  Summary,
  SectionLabel,
} from "../components/CheckoutFrame";

// Complete instructor reference. No real payment, order API or personal data collection.
export default function ReferenceCheckout() {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [giftEnabled, setGiftEnabled] = useState(false);
  const [gift, setGift] = useState("");
  const [phase, setPhase] = useState<"Details" | "Review" | "Complete">(
    "Details",
  );
  const [online, setOnline] = useState(checkoutConnection.read);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const giftRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    document.title = `Checkout lab · ${quantity} pack${quantity === 1 ? "" : "s"}`;
  }, [quantity]);
  useEffect(() => {
    setOnline(checkoutConnection.read());
    return checkoutConnection.subscribe(setOnline);
  }, []);
  function focusNote() {
    noteRef.current?.focus();
  }
  function focusGift() {
    giftRef.current?.focus();
  }
  return (
    <CheckoutFrame
      phase={phase}
      summary={
        <Summary quantity={quantity} note={note} gift={giftEnabled ? gift : ""}>
          {phase === "Details" && (
            <div className="summary-actions">
              <button onClick={focusNote}>Edit note ↗</button>
              {giftEnabled && (
                <button onClick={focusGift}>Edit gift message ↗</button>
              )}
            </div>
          )}
        </Summary>
      }
    >
      <div className={`connection ${online ? "" : "offline"}`}>
        <i />
        {online ? "Browser reports online" : "Browser reports offline"}
        <small>This does not test a payment service.</small>
      </div>
      {phase === "Complete" ? (
        <div className="confirmation">
          <div className="check-orbit">✓</div>
          <span className="eyebrow">SIMULATED CONFIRMATION</span>
          <h1>Your next jump is ready.</h1>
          <p>
            Your Explorer Pack order is confirmed in this demo. No payment was
            collected and no game items were delivered.
          </p>
          <div className="review-detail">
            <b>{quantity} × Explorer Pack</b>
            <p>
              1,200 Stardust + 48-hour XP boost + Aurora Trail per pack.
              Delivery to Nova_Rider is simulated.
            </p>
          </div>
          <button
            className="button primary"
            onClick={() => setPhase("Details")}
          >
            Back to checkout
          </button>
        </div>
      ) : (
        <>
          <SectionLabel number={phase === "Review" ? "02" : "01"}>
            {phase === "Review"
              ? "Review your Explorer Pack"
              : "Your pack details"}
          </SectionLabel>
          {phase === "Review" ? (
            <>
              <p className="muted">
                Check your Explorer Pack quantity and demo account before
                confirming.
              </p>
              <div className="review-detail">
                <b>In-game account delivery</b>
                <p>
                  No address or payment details needed. This is a local learning
                  app.
                </p>
              </div>
              <button
                className="button primary wide"
                onClick={() => setPhase("Complete")}
              >
                Place demo order <span>→</span>
              </button>
              <button
                className="text-button"
                onClick={() => setPhase("Details")}
              >
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
                <small>{note.length}/100 characters</small>
              </label>
              <div className="gift-box">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={giftEnabled}
                    onChange={(event) => setGiftEnabled(event.target.checked)}
                  />
                  <span>
                    Make it a gift
                    <small>A little note for their next adventure.</small>
                  </span>
                  <span className="gift-symbol">✧</span>
                </label>
                {giftEnabled && (
                  <label className="field">
                    Gift message
                    <textarea
                      ref={giftRef}
                      aria-label="Gift message"
                      value={gift}
                      onChange={(event) => setGift(event.target.value)}
                      maxLength={100}
                      placeholder="For your next adventure…"
                    />
                    <small>
                      {gift.length}/100 characters · text is kept when gift is
                      off
                    </small>
                  </label>
                )}
              </div>
              <button
                className="button primary wide"
                onClick={() => setPhase("Review")}
              >
                Review order <span>→</span>
              </button>
            </>
          )}
        </>
      )}
    </CheckoutFrame>
  );
}
