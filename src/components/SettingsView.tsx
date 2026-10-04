import type { ReactNode } from "react";
import "./settings-demo.css";
// Supplied presentation only: no state and no Context reads.
export function CurrencySelect({ value, onChange }: {
  value: "USD" | "EUR" | "JPY"; onChange: (value: "USD" | "EUR" | "JPY") => void;
}) {
  return <label>Currency<select aria-label="Currency" value={value} onChange={e => onChange(e.target.value as "USD" | "EUR" | "JPY")}>
    <option value="USD">USD</option><option value="EUR">EUR</option><option value="JPY">JPY</option>
  </select></label>;
}
export function ThemeSelect({ value, onChange }: {
  value: "light" | "dark"; onChange: (value: "light" | "dark") => void;
}) {
  return <label>Theme<select aria-label="Theme" value={value} onChange={e => onChange(e.target.value as "light" | "dark")}>
    <option value="light">Light</option><option value="dark">Dark</option>
  </select></label>;
}
export function LanguageSelect({ value, onChange }: {
  value: "en" | "es"; onChange: (value: "en" | "es") => void;
}) {
  return <label>Language<select aria-label="Language" value={value} onChange={e => onChange(e.target.value as "en" | "es")}>
    <option value="en">English</option><option value="es">Español</option>
  </select></label>;
}
export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="settings-demo">
    <p className="fineprint">Local preferences demo. Currency is a preference label only; no prices or exchange-rate conversion. Theme and language affect this preview only.</p>
    {children}
  </div>;
}

// Supplied presentation: formatting only; no Context or state ownership.
export function PriceDisplay({ amount, currency }: { amount: number; currency: "USD" | "EUR" | "JPY" }) {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  return <><output aria-label="Demo price">{formatted}</output><p>{currency} · Explorer Pack</p></>;
}
