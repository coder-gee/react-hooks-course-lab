import { useEffect, useReducer, useRef, useState } from "react";
import ReducerCheckoutView from "../components/ReducerCheckoutView";

// All lesson-specific types, state and reducer wiring are in this file.
export type CheckoutState = {
  quantity: number;
  note: string;
  giftEnabled: boolean;
  gift: string;
};
export type CheckoutAction =
  | { type: "quantityChanged"; quantity: number }
  | { type: "noteChanged"; note: string }
  | { type: "giftToggled"; enabled: boolean }
  | { type: "giftChanged"; gift: string }
  // TODO 1: add the reset action variant to this union.
  ;
export const initialCheckoutState: CheckoutState = {
  quantity: 1, note: "", giftEnabled: false, gift: "",
};
// Quantity/note/gift branches and the UI are supplied. Practice the reset path.
export function studentCheckoutReducer(checkoutState: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "quantityChanged":
      return { ...checkoutState, quantity: Math.max(1, Math.min(10, action.quantity)) };
    case "noteChanged":
      return { ...checkoutState, note: action.note };
    case "giftToggled":
      return { ...checkoutState, giftEnabled: action.enabled };
    case "giftChanged":
      return { ...checkoutState, gift: action.gift };
    // TODO 2: add the whole reset case here.
    // Return a NEW object with initialCheckoutState's values.
    default:
      return checkoutState;
  }
}

export default function ReducerResetCheckoutExercise() {
  const [checkoutState, dispatch] = useReducer(studentCheckoutReducer, initialCheckoutState);
  function handleReset() {
    // TODO 3: dispatch the reset action here.
  }
  // Supplied UI behavior: review navigation, focus access and browser title.
  const [reviewing, setReviewing] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const giftRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    document.title = `Checkout lab · ${checkoutState.quantity} pack${checkoutState.quantity === 1 ? "" : "s"}`;
  }, [checkoutState.quantity]);
  return <ReducerCheckoutView checkoutState={checkoutState} reviewing={reviewing}
    noteRef={noteRef} giftRef={giftRef}
    onQuantity={quantity => dispatch({ type: "quantityChanged", quantity })}
    onNote={note => dispatch({ type: "noteChanged", note })}
    onGiftEnabled={enabled => dispatch({ type: "giftToggled", enabled })}
    onGift={gift => dispatch({ type: "giftChanged", gift })}
    onReset={handleReset}
    onReview={() => setReviewing(true)} onEdit={() => setReviewing(false)} />;
}
