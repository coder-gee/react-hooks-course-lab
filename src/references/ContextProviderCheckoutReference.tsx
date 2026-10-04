import { createContext, useContext, useState, type ReactNode } from "react";
import { CurrencySelect, ThemeSelect } from "../components/SettingsView";
import ContextCheckoutView from "../components/ContextCheckoutView";
import { money } from "../components/CheckoutFrame";
import "../components/context-checkout.css";

export type Currency = "USD" | "EUR" | "JPY";
export type Theme = "light" | "dark";
export type SettingsValue = {
  currency: Currency; setCurrency: (value: Currency) => void;
  // Optional while the theme setup TODO is unfinished.
  theme?: Theme; setTheme?: (value: Theme) => void;
};
export const SettingsContext = createContext<SettingsValue | null>(null);
type CurrencyProps = { currency: Currency; setCurrency: (value: Currency) => void };
export function SettingsProvider({ children, currency, setCurrency }: CurrencyProps & { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = { currency, setCurrency, theme, setTheme };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
export function CurrencySelector() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <CurrencySelect value={settings.currency} onChange={settings.setCurrency} />;
}
export function ThemeSelector() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <ThemeSelect value={settings.theme ?? "light"} onChange={settings.setTheme ?? ignoreChange} />;
}
export function CurrencyPrice({ amount }: { amount: number }) {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <>{money(amount, settings.currency)}</>;
}
export function ThemeCheckout({ children }: { children: ReactNode }) {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <div className="context-checkout" data-theme={settings.theme ?? "light"} aria-label="Checkout theme">{children}</div>;
}
// Supplied currency works before Context is connected. Theme has no hidden state.
const ignoreChange = () => {};
function SettingsControls({ currency, setCurrency }: CurrencyProps) {
  const settings = useContext(SettingsContext);
  return <div className="settings-controls">
    {settings === null ? <>
      <CurrencySelect value={currency} onChange={setCurrency} />
      <ThemeSelect value="light" onChange={ignoreChange} />
    </> : <><CurrencySelector /><ThemeSelector /></>}
  </div>;
}
// Supplied fallback keeps the checkout usable before students connect Context.
function CheckoutScaffold({ currency }: { currency: Currency }) {
  const settings = useContext(SettingsContext);
  if (settings === null) {
    return <div className="context-checkout" data-theme="light" aria-label="Checkout theme">
      <ContextCheckoutView renderPrice={amount => money(amount, currency)} />
    </div>;
  }
  return <ThemeCheckout><ContextCheckoutView renderPrice={amount => <CurrencyPrice amount={amount} />} /></ThemeCheckout>;
}
export default function ContextProviderCheckoutReference() {
  // Supplied currency plumbing works even before the theme provider is placed.
  const [currency, setCurrency] = useState<Currency>("USD");
  return <SettingsProvider currency={currency} setCurrency={setCurrency}>
    <p className="fineprint">Currency changes formatting only, not exchange value. Theme applies only to this checkout. Quantity, note and Review/Edit are supplied.</p>
    <SettingsControls currency={currency} setCurrency={setCurrency} />
    <CheckoutScaffold currency={currency} />
  </SettingsProvider>;
}
