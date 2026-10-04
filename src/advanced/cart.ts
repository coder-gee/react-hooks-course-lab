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
  | { type: "reset" };
export const initialCheckoutState: CheckoutState = {
  quantity: 1,
  note: "",
  giftEnabled: false,
  gift: "",
};
// @snippet reducer
export function checkoutReducer(checkoutState: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "quantityChanged":
      return { ...checkoutState, quantity: Math.max(1, Math.min(10, action.quantity)) };
    case "noteChanged":
      return { ...checkoutState, note: action.note };
    case "giftToggled":
      return { ...checkoutState, giftEnabled: action.enabled };
    case "giftChanged":
      return { ...checkoutState, gift: action.gift };
    case "reset":
      return { ...initialCheckoutState };
  }
}
// @end reducer
