import App from "./App";
import { StrictMode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CheckoutDraftReference from "./instructor/homework/CheckoutDraftReference";
import { referenceDraftReducer } from "./instructor/homework/checkoutDraftReducer";
import { DRAFT_STORAGE_KEY, readSavedDraft } from "./homework/draftStorage";
function installMemoryStorage() {
  const data = new Map<string, string>();
  Object.defineProperty(window, "localStorage", { configurable: true, value: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
    removeItem: (key: string) => { data.delete(key); },
    clear: () => data.clear(), key: (index: number) => [...data.keys()][index] ?? null,
    get length() { return data.size; },
  } });
}
beforeEach(() => installMemoryStorage());
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const saved = { quantity: 3, note: "Hello", currency: "EUR" as const };
const mount = () => render(<StrictMode><CheckoutDraftReference /></StrictMode>);
it("loads all saved fields before the first Effect and automatically restores after remount", () => {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(saved));
  const writes = vi.spyOn(window.localStorage, "setItem");
  const view = mount();
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("3");
  expect((screen.getByLabelText("Draft order note") as HTMLTextAreaElement).value).toBe("Hello");
  expect((screen.getByLabelText("Currency preference") as HTMLSelectElement).value).toBe("EUR");
  expect(screen.queryByRole("button", { name: /Restore|Start new/ })).toBeNull();
  for (const [, value] of writes.mock.calls) expect(JSON.parse(value)).toEqual(saved);
  fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
  fireEvent.change(screen.getByLabelText("Currency preference"), { target: { value: "GBP" } });
  expect(readSavedDraft()).toEqual({ quantity: 4, note: "Hello", currency: "GBP" });
  expect(screen.getByTestId("total").textContent).toBe("£76.00");
  view.unmount(); mount();
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("4");
  expect((screen.getByLabelText("Draft order note") as HTMLTextAreaElement).value).toBe("Hello");
  expect((screen.getByLabelText("Currency preference") as HTMLSelectElement).value).toBe("GBP");
  expect(window.localStorage.length).toBe(1);
});
it("missing or invalid data starts with defaults and blocked storage leaves editing usable", () => {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, "invalid"); mount();
  expect(readSavedDraft()).toEqual({ quantity: 1, note: "", currency: "USD" });
  cleanup();
  vi.spyOn(window.localStorage, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  vi.spyOn(window.localStorage, "setItem").mockImplementation(() => { throw new Error("full"); });
  mount(); fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
  fireEvent.change(screen.getByLabelText("Draft order note"), { target: { value: "Hello" } });
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("2");
  expect((screen.getByLabelText("Draft order note") as HTMLTextAreaElement).value).toBe("Hello");
});
it("reducer changes only the selected field without mutating earlier state", () => {
  const draft = Object.freeze({ quantity: 3, note: "Hello" });
  expect(referenceDraftReducer(draft, { type: "quantityChanged", quantity: 4 })).toEqual({ quantity: 4, note: "Hello" });
  expect(referenceDraftReducer(draft, { type: "noteChanged", note: "New" })).toEqual({ quantity: 3, note: "New" });
  expect(draft).toEqual({ quantity: 3, note: "Hello" });
});
it("stepper respects the existing 1–10 bounds", () => {
  mount();
  const minus = screen.getByRole("button", { name: "Decrease quantity" }) as HTMLButtonElement;
  const plus = screen.getByRole("button", { name: "Increase quantity" }) as HTMLButtonElement;
  expect(minus.disabled).toBe(true);
  for (let i = 0; i < 12; i++) fireEvent.click(plus);
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("10"); expect(plus.disabled).toBe(true);
  for (let i = 0; i < 12; i++) fireEvent.click(minus);
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("1"); expect(minus.disabled).toBe(true);
});

it("lecturer solution URL opens the private answer and returning removes only its view selection", () => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(saved));
  window.history.replaceState({}, "", "/checkout?checkpoint=homework&homeworkView=solution");
  render(<App />);
  expect(screen.getByRole("region", { name: "Lecturer homework reference" })).toBeTruthy();
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("3");
  fireEvent.click(screen.getByRole("button", { name: "Return to unfinished starter" }));
  expect(new URLSearchParams(window.location.search).get("homeworkView")).toBeNull();
  expect(screen.getByRole("region", { name: "Homework workspace" })).toBeTruthy();
  expect(readSavedDraft()).toEqual(saved);
});
