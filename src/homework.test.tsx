import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import CheckoutDraft from "./homework/CheckoutDraft";
import { DRAFT_STORAGE_KEY, readSavedDraft, saveDraft } from "./homework/draftStorage";
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
beforeEach(() => { installMemoryStorage(); vi.spyOn(window, "scrollTo").mockImplementation(() => {}); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("keeps a separate brief before Glossary and homework last in the existing checkout UI", () => {
  window.history.replaceState({}, "", "/homework"); render(<App />);
  const nav = within(screen.getByRole("navigation"));
  const labels = nav.getAllByRole("link").map(link => link.textContent?.trim());
  expect(labels[labels.indexOf("Glossary") - 1]).toBe("Homework");
  expect(screen.getByRole("article", { name: "Homework instructions" })).toBeTruthy();
  expect(screen.queryByLabelText("Draft order note")).toBeNull();
  for (const hook of ["useState", "useReducer", "useEffect", "useContext"]) expect(screen.getByRole("cell", { name: hook })).toBeTruthy();
  expect(screen.getByText("Estimated workload: 45–75 minutes")).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "Open homework in Checkout lab →" }));
  expect(window.location.search).toBe("?checkpoint=homework");
  expect(screen.getByLabelText("Draft order note")).toBeTruthy();
  expect(screen.getByRole("group", { name: "Quantity controls" }).classList.contains("stepper")).toBe(true);
  expect(document.querySelector('.store.game-store')).toBeTruthy();
  const picker = screen.getByLabelText("Checkout version") as HTMLSelectElement;
  expect(picker.options[picker.options.length - 1].value).toBe("homework");
  expect(screen.queryByRole("region", { name: "Lecturer homework reference" })).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Read homework instructions ↗" }));
  expect(screen.getByRole("heading", { name: "Self-check before you finish" })).toBeTruthy();
});
it("working starter edits quantity/note/currency but does not persist them", () => {
  const first = render(<CheckoutDraft />);
  fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
  fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
  fireEvent.change(screen.getByLabelText("Draft order note"), { target: { value: "Hello" } });
  fireEvent.change(screen.getByLabelText("Currency preference"), { target: { value: "EUR" } });
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("3");
  expect((screen.getByLabelText("Draft order note") as HTMLTextAreaElement).value).toBe("Hello");
  expect(screen.getByTestId("total").textContent).toBe("€66.00");
  expect(readSavedDraft()).toBeNull();
  first.unmount(); render(<CheckoutDraft />);
  expect(screen.getByLabelText("Draft quantity").textContent).toBe("1");
  expect((screen.getByLabelText("Draft order note") as HTMLTextAreaElement).value).toBe("");
  expect((screen.getByLabelText("Currency preference") as HTMLSelectElement).value).toBe("USD");
  expect(screen.queryByRole("button", { name: /Restore|Start new/ })).toBeNull();
});
it("supplied helpers validate all three fields and tolerate malformed or unavailable storage", () => {
  for (const raw of ['{bad', 'null', JSON.stringify({ quantity: 0, note: "", currency: "USD" }), JSON.stringify({ quantity: 2, note: "", currency: "XXX" }), JSON.stringify({ quantity: 2, note: "" })]) {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, raw);
    expect(readSavedDraft()).toBeNull();
  }
  const saved = { quantity: 3, note: "Hello", currency: "GBP" as const };
  expect(saveDraft(saved)).toBe(true); expect(readSavedDraft()).toEqual(saved);
  vi.spyOn(window.localStorage, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  vi.spyOn(window.localStorage, "setItem").mockImplementation(() => { throw new Error("full"); });
  expect(readSavedDraft()).toBeNull(); expect(saveDraft(saved)).toBe(false);
});

it("supplied currency Context works before students complete the draft TODOs", () => {
  render(<CheckoutDraft />);
  fireEvent.change(screen.getByLabelText("Currency preference"), { target: { value: "EUR" } });
  expect((screen.getByLabelText("Currency preference") as HTMLSelectElement).value).toBe("EUR");
  expect(screen.getByTestId("total").textContent).toBe("€22.00");
  fireEvent.change(screen.getByLabelText("Currency preference"), { target: { value: "GBP" } });
  expect(screen.getByTestId("total").textContent).toBe("£19.00");
  expect(readSavedDraft()).toBeNull();
});
