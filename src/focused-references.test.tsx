import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import ExerciseReference from "./references/ExerciseReference";
import SettingsReference, { CurrencyPrice, CurrencySelector, ThemeSelector, ThemeCheckout } from "./references/ContextProviderCheckoutReference";
import { checkoutConnection } from "./lib/connectivity";

afterEach(() => { cleanup(); checkoutConnection.reset(); vi.restoreAllMocks(); vi.useRealTimers(); });
function open(path: string) {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState({}, "", path);
  return render(<App />);
}
it("offers only focused exercises and keeps homework last", () => {
  open("/checkout?checkpoint=starter");
  expect(Array.from(screen.getByLabelText("Checkout version").querySelectorAll("option")).map(o => o.value))
    .toEqual(["starter", "starter::reference", "repair-sync", "repair-sync::reference", "sync", "sync::reference", "reducer", "reducer::reference", "context", "context::reference", "custom", "custom::reference", "homework"]);
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "starter::reference" } });
  expect(window.location.search).toContain("checkpoint=starter");
  expect(window.location.search).toContain("view=reference");
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  expect(screen.getByLabelText("Quantity").textContent).toBe("2");
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "starter" } });
  expect(window.location.search).not.toContain("view=reference");
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  expect(screen.getByLabelText("Quantity").textContent).toBe("1");
});
it("keeps the state target focused and preserves values through review", () => {
  render(<ExerciseReference exercise="starter" />);
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Hello" } });
  expect(screen.getByText(/5\/100 characters/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Review order/ }));
  expect(screen.getByText("2 × Explorer Pack")).toBeTruthy();
  expect(screen.queryByText(/Place demo order/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Edit details/ }));
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("Hello");
  expect(screen.queryByText(/Edit note/)).toBeNull();
  expect(screen.queryByText(/Header basket/)).toBeNull();
  expect(checkoutConnection.getSnapshot().active).toBe(0);
});
it("adds focus to the next target", () => {
  const second = render(<ExerciseReference exercise="sync" />);
  expect(checkoutConnection.getSnapshot().active).toBe(0);
  expect(document.activeElement).toBe(screen.getByLabelText("Order note"));
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Keep this" } });
  const quantityButton = screen.getByLabelText("Increase quantity");
  quantityButton.focus();
  fireEvent.click(quantityButton);
  expect(document.activeElement).toBe(quantityButton);
  fireEvent.click(screen.getByRole("button", { name: /Review order/ }));
  expect(screen.queryByLabelText("Order note")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Edit details/ }));
  expect(document.activeElement).toBe(screen.getByLabelText("Order note"));
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("Keep this");
  expect(screen.getByText(/9\/100 characters/)).toBeTruthy();
  expect(screen.queryByText(/Reset cart choices/)).toBeNull();
  second.unmount();
  expect(checkoutConnection.getSnapshot().active).toBe(0);
});
it.each(["reducer"])("%s resets shared choices without unrelated status or confirmation", exercise => {
  render(<ExerciseReference exercise={exercise} />);
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Hello" } });
  fireEvent.click(screen.getByLabelText("Make it a gift", { exact: false }));
  fireEvent.change(screen.getByLabelText("Gift message"), { target: { value: "A gift" } });
  expect(screen.queryByText(/Header basket/)).toBeNull();
  fireEvent.click(screen.getByText("Reset cart choices"));
  expect(screen.getByLabelText("Quantity").textContent).toBe("1");
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("");
  expect((screen.getByLabelText("Make it a gift", { exact: false }) as HTMLInputElement).checked).toBe(false);
  expect(screen.queryByText(/Unmount footer status/)).toBeNull();
  expect(checkoutConnection.getSnapshot().active).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: /Review order/ }));
  expect(screen.queryByText(/Place demo order/)).toBeNull();
});
it("extracted banner and header timers stay independent across Review/Edit", () => {
  vi.useFakeTimers();
  const view = render(<ExerciseReference exercise="custom" />);
  expect(screen.getAllByLabelText("Flash sale countdown")).toHaveLength(1);
  expect(vi.getTimerCount()).toBe(2);
  expect(screen.queryByRole("button", { name: /Stop countdown|Restart countdown|Restart top bar sale/ })).toBeNull();
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByLabelText("Flash sale time remaining").textContent).toBe("00:28");
  expect(screen.getByLabelText("Top bar sale seconds").textContent).toBe("43s");
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Keep me" } });
  fireEvent.click(screen.getByRole("button", { name: /Review order/ }));
  expect(vi.getTimerCount()).toBe(1);
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByLabelText("Top bar sale seconds").textContent).toBe("41s");
  fireEvent.click(screen.getByRole("button", { name: /Edit details/ }));
  expect(vi.getTimerCount()).toBe(2);
  expect(screen.getByLabelText("Flash sale time remaining").textContent).toBe("00:30");
  expect(screen.getByLabelText("Top bar sale seconds").textContent).toBe("41s");
  expect(screen.getByLabelText("Quantity").textContent).toBe("2");
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("Keep me");
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("redirects retired optimization lab links to the standalone demo", () => {
  open("/checkout?checkpoint=performance&view=reference");
  expect(window.location.pathname).toBe("/demo");
  expect(screen.getByLabelText("Unrelated order note")).toBeTruthy();
  expect(screen.queryByLabelText("Checkout version")).toBeNull();
});

it("does not expose a homework reference through the query string", () => {
  open("/checkout?checkpoint=homework&view=reference");
  expect(screen.queryByRole("button", { name: "Back to exercise" })).toBeNull();
  expect(screen.queryByRole("button", { name: "View working reference" })).toBeNull();
});

it("selects each separate reference option and returns to its paired exercise", () => {
  open("/checkout?checkpoint=starter");
  const picker = screen.getByLabelText("Checkout version") as HTMLSelectElement;
  const labels = Array.from(picker.options).map(option => option.textContent);
  for (let index = 0; index < 12; index += 2) {
    expect(labels[index]).toMatch(/^Exercise/);
    expect(labels[index + 1]).toMatch(/^Working reference/);
  }
  expect(labels[12]).toMatch(/Homework/);
  for (const checkpoint of ["starter", "repair-sync", "sync", "reducer", "context", "custom"]) {
    fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: `${checkpoint}::reference` } });
    expect((screen.getByLabelText("Checkout version") as HTMLSelectElement).value).toBe(`${checkpoint}::reference`);
    expect(new URLSearchParams(window.location.search).get("checkpoint")).toBe(checkpoint);
    expect(new URLSearchParams(window.location.search).get("view")).toBe("reference");
    expect(screen.getByRole("region", { name: "Exercise working reference" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "View working reference" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Back to exercise" })).toBeNull();
    fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: checkpoint } });
    expect((screen.getByLabelText("Checkout version") as HTMLSelectElement).value).toBe(checkpoint);
    expect(new URLSearchParams(window.location.search).get("view")).toBeNull();
    expect(screen.queryByRole("region", { name: "Exercise working reference" })).toBeNull();
  }
});
it("selects the matching dropdown entry on a direct guide reference route", () => {
  open("/checkout?checkpoint=context&view=reference");
  expect((screen.getByLabelText("Checkout version") as HTMLSelectElement).value).toBe("context::reference");
});

it.each([
  ["starter", "State"], ["repair-sync", "EffectCleanup"], ["sync", "InputFocus"],
  ["reducer", "ReducerReset"], ["context", "ContextProvider"],
  ["custom", "CustomHook"],
])("shows collapsible matching source paths for %s", async (checkpoint, stem) => {
  open(`/checkout?checkpoint=${checkpoint}&view=reference`);
  const region = screen.getByRole("region", { name: "Exercise working reference" });
  const summary = region.querySelector("summary")!;
  const details = summary.closest("details")!;
  expect(details.className).toBe("task-drawer");
  expect(region.querySelector("h2")).toBeNull();
  expect(region.children).toHaveLength(1);
  expect(details.open).toBe(false);
  fireEvent.click(summary);
  expect(details.open).toBe(true);
  expect(details.textContent).toContain(`src/references/${stem}CheckoutReference.tsx`);
  expect(details.textContent).toContain(`src/exercises/${stem}CheckoutExercise.tsx`);
  fireEvent.click(summary);
  expect(details.open).toBe(false);
});

it("leaves focus exercise unfinished and automatically focuses its reference route", () => {
  open("/checkout?checkpoint=sync");
  expect(document.activeElement).not.toBe(screen.getByLabelText("Order note"));
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "sync::reference" } });
  expect(document.activeElement).toBe(screen.getByLabelText("Order note"));
});
it("focuses the minimal demo on mount without checkout controls", () => {
  open("/demo?scene=focus&phase=run");
  expect(document.activeElement).toBe(screen.getByLabelText("Order note"));
  expect(screen.queryByLabelText("Quantity")).toBeNull();
  expect(screen.queryByRole("button", { name: /Edit note/ })).toBeNull();
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Hello" } });
  expect(screen.getByText(/5 characters/)).toBeTruthy();
});

it.each(["starter", "repair-sync", "sync", "reducer", "context", "custom"])("omits stale connection controls from %s and its reference", checkpoint => {
  open(`/checkout?checkpoint=${checkpoint}`);
  expect(screen.queryByText("Simulate offline")).toBeNull();
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: `${checkpoint}::reference` } });
  expect(screen.queryByText("Simulate offline")).toBeNull();
});
it("keeps the inline starter fully working before extraction", () => {
  vi.useFakeTimers();
  open("/checkout?checkpoint=custom");
  expect(vi.getTimerCount()).toBe(2);
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByLabelText("Flash sale time remaining").textContent).toBe("00:29");
  expect(screen.getByLabelText("Top bar sale seconds").textContent).toBe("44s");
  fireEvent.click(screen.getByRole("button", { name: /Review order/ }));
  expect(vi.getTimerCount()).toBe(1);
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByLabelText("Top bar sale seconds").textContent).toBe("43s");
  fireEvent.click(screen.getByRole("button", { name: /Edit details/ }));
  expect(screen.getByLabelText("Flash sale time remaining").textContent).toBe("00:30");
  expect(vi.getTimerCount()).toBe(2);
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "custom::reference" } });
  expect(vi.getTimerCount()).toBe(2);
});

it("shares checkout currency and theme while preserving checkout details", () => {
  render(<SettingsReference />);
  const pageClass = document.body.className;
  expect(screen.queryByLabelText("Language")).toBeNull();
  fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "EUR" } });
  expect(screen.getByTestId("total").textContent).toBe("€24.00");
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  expect(screen.getByTestId("total").textContent).toBe("€48.00");
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Keep this note" } });
  fireEvent.change(screen.getByLabelText("Theme"), { target: { value: "dark" } });
  expect(screen.getByLabelText("Checkout theme").getAttribute("data-theme")).toBe("dark");
  expect(document.body.className).toBe(pageClass);
  fireEvent.click(screen.getByText("Review order →"));
  expect(screen.getByTestId("total").textContent).toBe("€48.00");
  fireEvent.click(screen.getByText("← Edit details"));
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("Keep this note");
  expect(screen.getByLabelText("Quantity").textContent).toBe("2");
  fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "JPY" } });
  expect(screen.getByTestId("total").textContent).toBe("¥48");
});
it("returns null for every settings consumer outside its provider", () => {
  const {container}=render(<><CurrencyPrice amount={24} /><CurrencySelector /><ThemeSelector /><ThemeCheckout>hidden</ThemeCheckout></>);
  expect(container.textContent).toBe("");
});
it("keeps separate Settings providers independent", () => {
  render(<><div data-testid="first"><SettingsReference /></div><div data-testid="second"><SettingsReference /></div></>);
  fireEvent.change(within(screen.getByTestId("first")).getByLabelText("Currency"), { target: { value: "JPY" } });
  expect(within(screen.getByTestId("first")).getByTestId("total").textContent).toBe("¥24");
  expect(within(screen.getByTestId("second")).getByTestId("total").textContent).toBe("$24.00");
});
it("keeps the Settings exercise unfinished and the reference route functional", () => {
  open("/checkout?checkpoint=context");
  expect(screen.getByLabelText("Currency")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "EUR" } });
  fireEvent.change(screen.getByLabelText("Theme"), { target: { value: "dark" } });
  expect((screen.getByLabelText("Currency") as HTMLSelectElement).value).toBe("EUR");
  expect((screen.getByLabelText("Theme") as HTMLSelectElement).value).toBe("light");
  expect(screen.getByLabelText("Checkout theme").getAttribute("data-theme")).toBe("light");
  expect(screen.getByTestId("total").textContent).toBe("€24.00");
  fireEvent.click(screen.getByLabelText("Increase quantity"));
  fireEvent.change(screen.getByLabelText("Order note"), { target: { value: "Starter still works" } });
  fireEvent.click(screen.getByText("Review order →"));
  expect(screen.getByTestId("total").textContent).toBe("€48.00");
  fireEvent.click(screen.getByText("← Edit details"));
  expect((screen.getByLabelText("Order note") as HTMLTextAreaElement).value).toBe("Starter still works");
  fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "context::reference" } });
  expect(screen.getByLabelText("Currency")).toBeTruthy();
  expect(screen.getByTestId("total").textContent).toBe("$24.00");
});
