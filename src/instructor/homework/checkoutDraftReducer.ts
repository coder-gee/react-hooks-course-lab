import type { CheckoutDraft, DraftAction } from "../../homework/checkoutDraftReducer";

// Lecturer-only completed reducer. Never copy into the student starter.
export function referenceDraftReducer(draft: CheckoutDraft, action: DraftAction): CheckoutDraft {
  switch (action.type) {
    case "quantityChanged": return { ...draft, quantity: action.quantity };
    case "noteChanged": return { ...draft, note: action.note };
  }
}
