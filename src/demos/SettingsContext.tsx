import { createContext, useContext, useState, type ReactNode } from "react";
import { CurrencySelect, ThemeSelect, LanguageSelect } from "../components/SettingsView";

export type Currency = "USD" | "EUR" | "JPY";
export type Theme = "light" | "dark";
export type Language = "en" | "es";
export type SettingsValue = {
  currency: Currency; setCurrency: (value: Currency) => void;
  theme: Theme; setTheme: (value: Theme) => void;
  language: Language; setLanguage: (value: Language) => void;
};
export const SettingsContext = createContext<SettingsValue | null>(null);

// @snippet provider
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");
  const value = { currency, setCurrency, theme, setTheme, language, setLanguage };
  void value; // Keeps the unfinished provider wiring compiling.
  // All state, consumers, controls and styles are supplied.

  return <SettingsContext.Provider value={value}>
    {children}
  </SettingsContext.Provider>;
}
// @end provider

// @snippet settingsConsumers
export function CurrencyBadge() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  const { currency } = settings;
  return <span className="settings-currency">Currency: {currency}</span>;
}
export function LanguageSelector() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  const { language, setLanguage } = settings;
  return <LanguageSelect value={language} onChange={setLanguage} />;
}
export function ThemeSelector() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  const { theme, setTheme } = settings;
  return <ThemeSelect value={theme} onChange={setTheme} />;
}
// @end settingsConsumers
export function CurrencySelector() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <CurrencySelect value={settings.currency} onChange={settings.setCurrency} />;
}
export function LanguageLabel() {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <>{settings.language === "en" ? "Order summary" : "Resumen del pedido"}</>;
}
export function ThemePreview({ children }: { children: ReactNode }) {
  const settings = useContext(SettingsContext);
  if (settings === null) return null;
  return <div className="settings-preview" data-theme={settings.theme} aria-label="Settings preview">{children}</div>;
}
