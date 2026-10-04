import { useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  CheckoutFrame,
  Summary,
  SectionLabel,
} from "../components/CheckoutFrame";
import { checkoutReducer, initialCheckoutState } from "../advanced/cart";
import type { CheckoutState, CheckoutAction } from "../advanced/cart";
import type { Dispatch } from "react";
import { CartContext, BasketBadge } from "../advanced/CartContext";

export type AdvancedMode =
  | "reducer"
  | "context"
  | "custom"
  | "complete";
type ReferenceScope = "reducer" | "context" | "custom";
export default function AdvancedCheckout({ mode, referenceFor }: { mode: AdvancedMode; referenceFor?: ReferenceScope }) {
  const [checkoutState, dispatch] = useReducer(
    checkoutReducer,
    initialCheckoutState,
  );
  useEffect(() => {
    document.title = `Checkout lab · ${checkoutState.quantity} pack${checkoutState.quantity === 1 ? "" : "s"}`;
  }, [checkoutState.quantity]);
  const body = (
    <>
      {referenceFor !== "reducer" && <div className="advanced-header">
        <BasketBadge />
      </div>}
      <AdvancedBody checkoutState={checkoutState} dispatch={dispatch} mode={mode} referenceFor={referenceFor} />
    </>
  );
  if (referenceFor === "reducer") return body;
  return <CartContext.Provider value={{ checkoutState, dispatch }}>
    {body}
  </CartContext.Provider>;
}
function SharedSummary() {
  const value = useContext(CartContext);
  if (!value) return null;
  return (
    <Summary
      quantity={value.checkoutState.quantity}
      note={value.checkoutState.note}
      gift={value.checkoutState.giftEnabled ? value.checkoutState.gift : ""}
    />
  );
}
function AdvancedBody({
  checkoutState,
  dispatch,
  mode,
  referenceFor,
}: {
  checkoutState: CheckoutState;
  dispatch: Dispatch<CheckoutAction>;
  mode: AdvancedMode;
  referenceFor?: ReferenceScope;
}) {
  const [phase, setPhase] = useState<"Details" | "Review" | "Complete">(
    "Details",
  );
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const giftRef = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <CheckoutFrame
        phase={phase}
        summary={
          <>
            {referenceFor === "reducer"
              ? <Summary quantity={checkoutState.quantity} note={checkoutState.note} gift={checkoutState.giftEnabled ? checkoutState.gift : ""} />
              : <SharedSummary />}
            {phase === "Details" && (
              <div className="summary-actions">
                <button onClick={() => noteRef.current?.focus()}>
                  Edit note ↗
                </button>
                {checkoutState.giftEnabled && (
                  <button onClick={() => giftRef.current?.focus()}>
                    Edit gift message ↗
                  </button>
                )}
              </div>
            )}
          </>
        }
      >
        {phase === "Complete" ? (
          <div className="confirmation">
            <div className="check-orbit">✓</div>
            <span className="eyebrow">SIMULATED CONFIRMATION</span>
            <h1>Your next jump is ready.</h1>
            <p>
              Demo order confirmed for Nova_Rider. No payment was collected and
              no game items were delivered.
            </p>
            <div className="review-detail">
              <b>{checkoutState.quantity} × Explorer Pack</b>
              <p>
                1,200 Stardust + 48-hour XP boost + Aurora Trail per pack.
                Delivery to the demo account is simulated.
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
                  Review your Explorer Pack in the shared summary.
                </p>
                <div className="review-detail">
                  <b>Demo delivery · Nova_Rider</b>
                  <p>
                    Your Explorer Pack is assigned to the sample game account.
                    No payment details are required.
                  </p>
                </div>
                {!referenceFor && <button
                  className="button primary wide"
                  onClick={() => setPhase("Complete")}
                >
                  Place demo order →
                </button>}
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
                  Choose your packs and add an optional note for this demo
                  order.
                </p>
                <div className="field">
                  <p>Quantity</p>
                  <div className="stepper">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() =>
                        dispatch({
                          type: "quantityChanged",
                          quantity: checkoutState.quantity - 1,
                        })
                      }
                    >
                      −
                    </button>
                    <output aria-label="Quantity">{checkoutState.quantity}</output>
                    <button
                      aria-label="Increase quantity"
                      onClick={() =>
                        dispatch({
                          type: "quantityChanged",
                          quantity: checkoutState.quantity + 1,
                        })
                      }
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
                    maxLength={100}
                    value={checkoutState.note}
                    onChange={(event) =>
                      dispatch({
                        type: "noteChanged",
                        note: event.target.value,
                      })
                    }
                    placeholder="Anything we should know?"
                  />
                  <small>{checkoutState.note.length}/100 characters</small>
                </label>
                <div className="gift-box">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={checkoutState.giftEnabled}
                      onChange={(event) =>
                        dispatch({
                          type: "giftToggled",
                          enabled: event.target.checked,
                        })
                      }
                    />
                    <span>
                      Make it a gift
                      <small>Keep your message when the option is off.</small>
                    </span>
                    <span className="gift-symbol">✧</span>
                  </label>
                  {checkoutState.giftEnabled && (
                    <label className="field">
                      Gift message
                      <textarea
                        ref={giftRef}
                        aria-label="Gift message"
                        maxLength={100}
                        value={checkoutState.gift}
                        onChange={(event) =>
                          dispatch({
                            type: "giftChanged",
                            gift: event.target.value,
                          })
                        }
                      />
                      <small>{checkoutState.gift.length}/100 characters</small>
                    </label>
                  )}
                </div>
                <button
                  className="button primary wide"
                  onClick={() => setPhase("Review")}
                >
                  Review order →
                </button>
                <button
                  className="text-button"
                  onClick={() => dispatch({ type: "reset" })}
                >
                  Reset cart choices
                </button>
              </>
            )}
          </>
        )}
      </CheckoutFrame>

    </>
  );
}
