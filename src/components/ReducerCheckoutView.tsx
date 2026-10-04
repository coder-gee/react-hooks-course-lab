import type { RefObject, ReactNode } from "react";
import { CheckoutFrame, Summary, SectionLabel } from "./CheckoutFrame";
// Supplied presentation only: no Hooks, reducer, action types, or lesson modes.
type Props = {
  renderPrice?: (amount: number) => ReactNode;
  checkoutState: { quantity: number; note: string; giftEnabled: boolean; gift: string };
  reviewing: boolean;
  noteRef: RefObject<HTMLTextAreaElement | null>;
  giftRef: RefObject<HTMLTextAreaElement | null>;
  onQuantity: (quantity: number) => void;
  onNote: (note: string) => void;
  onGiftEnabled: (enabled: boolean) => void;
  onGift: (gift: string) => void;
  onReset: () => void;
  onReview: () => void;
  onEdit: () => void;
};
export default function ReducerCheckoutView({ renderPrice, checkoutState, reviewing, noteRef, giftRef,
  onQuantity, onNote, onGiftEnabled, onGift, onReset, onReview, onEdit }: Props) {
  return <CheckoutFrame renderPrice={renderPrice} phase={reviewing ? "Review" : "Details"} summary={<>
    <Summary renderPrice={renderPrice} quantity={checkoutState.quantity} note={checkoutState.note}
      gift={checkoutState.giftEnabled ? checkoutState.gift : ""} />
    {!reviewing && <div className="summary-actions">
      <button onClick={() => noteRef.current?.focus()}>Edit note ↗</button>
      {checkoutState.giftEnabled && <button onClick={() => giftRef.current?.focus()}>Edit gift message ↗</button>}
    </div>}
  </>}>
    <SectionLabel number={reviewing ? "02" : "01"}>
      {reviewing ? "Review your Explorer Pack" : "Your pack details"}
    </SectionLabel>
    {reviewing ? <>
      <p className="muted">Review your Explorer Pack in the shared summary.</p>
      <div className="review-detail">
        <b>Demo delivery · Nova_Rider</b>
        <p>Your Explorer Pack is assigned to the sample game account. No payment details are required.</p>
      </div>
      <button className="text-button" onClick={onEdit}>← Edit details</button>
    </> : <>
      <p className="muted">Choose your packs and add an optional note for this demo order.</p>
      <div className="field"><p>Quantity</p><div className="stepper">
        <button aria-label="Decrease quantity" onClick={() => onQuantity(checkoutState.quantity - 1)}>−</button>
        <output aria-label="Quantity">{checkoutState.quantity}</output>
        <button aria-label="Increase quantity" onClick={() => onQuantity(checkoutState.quantity + 1)}>+</button>
      </div></div>
      <label className="field">Order note <span>Optional</span>
        <textarea ref={noteRef} aria-label="Order note" maxLength={100} value={checkoutState.note}
          onChange={event => onNote(event.target.value)} placeholder="Anything we should know?" />
        <small>{checkoutState.note.length}/100 characters</small>
      </label>
      <div className="gift-box">
        <label className="checkbox">
          <input type="checkbox" checked={checkoutState.giftEnabled} onChange={event => onGiftEnabled(event.target.checked)} />
          <span>Make it a gift<small>Keep your message when the option is off.</small></span>
          <span className="gift-symbol">✧</span>
        </label>
        {checkoutState.giftEnabled && <label className="field">Gift message
          <textarea ref={giftRef} aria-label="Gift message" maxLength={100} value={checkoutState.gift}
            onChange={event => onGift(event.target.value)} />
          <small>{checkoutState.gift.length}/100 characters</small>
        </label>}
      </div>
      <button className="button primary wide" onClick={onReview}>Review order →</button>
      <button className="text-button" onClick={onReset}>Reset cart choices</button>
    </>}
  </CheckoutFrame>;
}
