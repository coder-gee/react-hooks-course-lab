export type CheckoutDraft = { quantity: number; note: string };
export type DraftAction =
  | { type: "quantityChanged"; quantity: number }
  | { type: "noteChanged"; note: string };
export const initialDraft: CheckoutDraft = { quantity: 1, note: "" };

// Student TODOs: compute the next quantity/note state, without mutating the old state.
// No storage, Effects or currency here. Saving belongs in CheckoutDraft.tsx.
export function draftReducer(draft: CheckoutDraft, action: DraftAction): CheckoutDraft {
  switch (action.type) {
    case "quantityChanged":
      // TODO: use action.quantity; preserve the note.
      return draft;
    case "noteChanged":
      // TODO: use action.note; preserve the quantity.
      return draft;

  }
}
