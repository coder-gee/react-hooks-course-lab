import { useReducer, useRef, useState, type ReactNode } from "react";
import { checkoutReducer, initialCheckoutState } from "../advanced/cart";
import ReducerCheckoutView from "./ReducerCheckoutView";
// Supplied checkout behavior. Students only edit their Context exercise file.
export default function ContextCheckoutView({ renderPrice }: { renderPrice: (amount: number) => ReactNode }) {
  const [checkoutState, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const [reviewing, setReviewing] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const giftRef = useRef<HTMLTextAreaElement>(null);
  return <ReducerCheckoutView renderPrice={renderPrice} checkoutState={checkoutState} reviewing={reviewing}
    noteRef={noteRef} giftRef={giftRef}
    onQuantity={quantity => dispatch({ type: "quantityChanged", quantity })}
    onNote={note => dispatch({ type: "noteChanged", note })}
    onGiftEnabled={enabled => dispatch({ type: "giftToggled", enabled })}
    onGift={gift => dispatch({ type: "giftChanged", gift })}
    onReset={() => dispatch({ type: "reset" })}
    onReview={() => setReviewing(true)} onEdit={() => setReviewing(false)} />;
}
