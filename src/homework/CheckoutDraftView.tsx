import { CheckoutFrame, money, SectionLabel } from "../components/CheckoutFrame";
import { UNIT_PRICES } from "./draftStorage";
import type { Currency } from "./draftStorage";
import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";

// Supplied UI: students do not edit layout or styles.
export default function CheckoutDraftView({ quantity, note, onDecrease, onIncrease, onNoteChange }: {
  quantity: number; note: string; onDecrease: () => void; onIncrease: () => void;
  onNoteChange: (note: string) => void;
}) {
  const { currency, setCurrency } = useContext(SettingsContext);
  const unitPrice = UNIT_PRICES[currency];
  return <CheckoutFrame renderPrice={() => money(unitPrice, currency)} summary={<>
    <div className="summary-lines"><p>Explorer Pack × {quantity}</p>{note && <p>{note}</p>}</div>
    <div className="summary-total"><span>Total</span><strong data-testid="total">{money(unitPrice * quantity, currency)}</strong></div>
  </>}>
    <SectionLabel number="01">Your checkout draft</SectionLabel>
    <fieldset className="homework-draft-fields">
    <label className="field">Currency preference
      <select aria-label="Currency preference" value={currency} onChange={event => setCurrency(event.target.value as Currency)}>
        <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
      </select>
    </label>
    </fieldset>
    <p className="fineprint">Currency comes from the supplied Context. Prices are catalogue examples, not live conversions.</p>
    <fieldset className="homework-draft-fields">
      <legend>Explorer Pack details</legend>
      <div className="field">
        <p>Quantity</p>
        <div className="stepper" role="group" aria-label="Quantity controls">
          <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1}
            onClick={onDecrease}>−</button>
          <output aria-label="Draft quantity" aria-live="polite">{quantity}</output>
          <button type="button" aria-label="Increase quantity" disabled={quantity >= 10}
            onClick={onIncrease}>+</button>
        </div>
      </div>
      <label className="field">Order note
        <textarea aria-label="Draft order note" maxLength={200} value={note}
          onChange={event => onNoteChange(event.target.value)} />
      </label>
    </fieldset>
    <p className="fineprint">One fixed product. Local checkout practice. No purchase or network request.</p>
  </CheckoutFrame>;
}
