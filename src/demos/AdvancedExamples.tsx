import { useContext, useReducer } from "react";
import { checkoutReducer, initialCheckoutState } from "../advanced/cart";
import { SettingsContext, SettingsProvider, CurrencySelector, CurrencyBadge, ThemeSelector, LanguageSelector, LanguageLabel, ThemePreview } from "./SettingsContext";
import { useCountdown } from "../advanced/useCountdown";
import CountdownPair from "../components/CountdownPair";
import { PriceDisplay } from "../components/SettingsView";
// @snippet reducerUse
export function ReducerExample() {
  const [checkoutState, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  return (
    <div className="mini-checkout">
      <button
        onClick={() =>
          dispatch({ type: "quantityChanged", quantity: checkoutState.quantity + 1 })
        }
      >
        Explorer Packs: {checkoutState.quantity} · add one
      </button>
      <label>
        Order note
        <input
          value={checkoutState.note}
          onChange={(event) =>
            dispatch({ type: "noteChanged", note: event.target.value })
          }
        />
      </label>
      <button onClick={() => dispatch({ type: "reset" })}>
        Reset both choices
      </button>
      <p>Total is still derived: ${checkoutState.quantity * 24}</p>
    </div>
  );
}
// @end reducerUse
// @snippet currencyConsumer
export function CurrencyConsumer() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <PriceDisplay amount={24} currency={settings.currency} />;
}
// @end currencyConsumer
export function ContextExample() {
  return <SettingsProvider>
    <div className="settings-demo">
      <p className="fineprint">Formatting demo only: the amount stays 24. Changing currency changes its format, not its exchange value. Theme and language affect this preview only.</p>
      <div className="settings-controls"><CurrencySelector /><ThemeSelector /><LanguageSelector /></div>
      <CurrencyBadge />
      <ThemePreview><section className="settings-card">
        <h3><LanguageLabel /></h3><CurrencyConsumer />
      </section></ThemePreview>
    </div>
  </SettingsProvider>;
}
// @snippet consumer
function CountdownConsumer() {
  const { seconds, stop, restart } = useCountdown(30);
  return <div>
    <output>{seconds}</output>
    <button onClick={stop}>Stop</button>
    <button onClick={restart}>Restart</button>
  </div>;
}
// @end consumer
// Exported for the source perspective; the live pair uses the same Hook.
export { CountdownConsumer };
export function CustomHookExample() {
  return <CountdownPair useCountdown={useCountdown} />;
}
