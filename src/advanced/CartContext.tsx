import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { CheckoutState, CheckoutAction } from "./cart";
export type CartValue = { checkoutState: CheckoutState; dispatch: Dispatch<CheckoutAction> };
export const CartContext = createContext<CartValue | null>(null);
// @snippet context
export function BasketBadge() {
  const value = useContext(CartContext);
  if (!value) return null;
  const { checkoutState, dispatch } = value;
  return (
    <div className="basket-badge">
      <span>Header basket: {checkoutState.quantity} item(s)</span>
      <button onClick={() => dispatch({ type: "reset" })}>Start again</button>
    </div>
  );
}
// @end context
