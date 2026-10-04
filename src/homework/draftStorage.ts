import type { CheckoutDraft } from "./checkoutDraftReducer";
export type Currency = "USD" | "EUR" | "GBP";
export type SavedCheckout = CheckoutDraft & { currency: Currency };
export const DRAFT_STORAGE_KEY = "xsolla-homework-checkout-draft-v1";

// Supplied: invalid or unavailable storage behaves like no saved draft.
export function readSavedDraft(): SavedCheckout | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const draft = value as Partial<SavedCheckout>;
    if (!Number.isInteger(draft.quantity) || draft.quantity! < 1 || draft.quantity! > 10 ||
        typeof draft.note !== "string" || draft.note.length > 200 ||
        !["USD", "EUR", "GBP"].includes(draft.currency ?? "")) return null;
    return { quantity: draft.quantity!, note: draft.note, currency: draft.currency! };
  } catch { return null; }
}
// Supplied: saving must never crash the checkout if storage is blocked/full.
export function saveDraft(draft: SavedCheckout): boolean {
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch { return false; }
}


// Supplied catalogue prices, not exchange-rate conversion.
export const UNIT_PRICES: Record<Currency, number> = { USD: 24, EUR: 22, GBP: 19 };

// Supplied lazy reducer initializer: load before any saving Effect can run.
export function initializeDraft(defaultDraft: CheckoutDraft): CheckoutDraft {
  const saved = readSavedDraft();
  return saved ? { quantity: saved.quantity, note: saved.note } : { ...defaultDraft };
}
