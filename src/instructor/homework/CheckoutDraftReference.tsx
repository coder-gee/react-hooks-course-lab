import { useContext, useEffect, useReducer } from "react";
import CheckoutDraftView from "../../homework/CheckoutDraftView";
import { initializeDraft, saveDraft } from "../../homework/draftStorage";
import { initialDraft } from "../../homework/checkoutDraftReducer";
import { SettingsProvider, SettingsContext } from "../../homework/SettingsContext";
import { referenceDraftReducer } from "./checkoutDraftReducer";

function ReferenceDraftEditor() {
  const { currency } = useContext(SettingsContext);
  const [draft, dispatch] = useReducer(referenceDraftReducer, initialDraft, initializeDraft);
  useEffect(() => { saveDraft({ ...draft, currency }); }, [draft, currency]);
  return <CheckoutDraftView quantity={draft.quantity} note={draft.note}
    onDecrease={() => dispatch({ type: "quantityChanged", quantity: Math.max(1, draft.quantity - 1) })}
    onIncrease={() => dispatch({ type: "quantityChanged", quantity: Math.min(10, draft.quantity + 1) })}
    onNoteChange={note => dispatch({ type: "noteChanged", note })} />;
}

export default function CheckoutDraftReference() {
  return <SettingsProvider><ReferenceDraftEditor /></SettingsProvider>;
}
