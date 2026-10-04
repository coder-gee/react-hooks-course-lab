import { useState } from "react";
import CheckoutDraftView from "./CheckoutDraftView";
import { SettingsProvider } from "./SettingsContext";

function DraftEditor() {
  // WORKING BASELINE: these local states update the UI but do not save.
  // TODO: import useReducer and draftReducer/initialDraft from checkoutDraftReducer.
  // Replace BOTH states with one reducer state/dispatch pair. Remove these states;
  // do not keep duplicate owners. Use the supplied initializeDraft lazy initializer
  // from draftStorage so saved quantity/note load before the saving Effect runs.
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // TODO: import useContext and SettingsContext; read currency for saving.
  // Currency already works in the supplied view/provider. Do not create currency state.
  // TODO: import useEffect and saveDraft; save quantity, note and Context currency
  // together after changes. Dependencies must include the reducer draft and currency.
  // Keep storage writes out of the reducer and the render body.

  return <CheckoutDraftView quantity={quantity} note={note}
    // TODO: after the refactor, read quantity/note from the reducer state above.
    // TODO: replace this setter with a quantityChanged dispatch (minimum 1).
    onDecrease={() => setQuantity(value => Math.max(1, value - 1))}
    // TODO: replace this setter with a quantityChanged dispatch (maximum 10).
    onIncrease={() => setQuantity(value => Math.min(10, value + 1))}
    // TODO: replace this setter with a noteChanged dispatch carrying the next note.
    onNoteChange={setNote} />;
}
export default function CheckoutDraft() {
  return <SettingsProvider><DraftEditor /></SettingsProvider>;
}
