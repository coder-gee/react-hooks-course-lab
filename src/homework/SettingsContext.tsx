import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { readSavedDraft } from "./draftStorage";
import type { Currency } from "./draftStorage";
export type CurrencySettings = { currency: Currency; setCurrency: (currency: Currency) => void };
export const settingsPlaceholder: CurrencySettings = { currency: "USD", setCurrency: () => {} };
export const SettingsContext = createContext<CurrencySettings>(settingsPlaceholder);
// Supplied: the only owner of currency. Do not add currency to the draft reducer.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => readSavedDraft()?.currency ?? "USD");
  return <SettingsContext.Provider value={{ currency, setCurrency }}>{children}</SettingsContext.Provider>;
}
