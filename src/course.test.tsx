import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import StateCheckoutExercise from "./exercises/StateCheckoutExercise";
import StateCheckoutReference from "./references/StateCheckoutReference";
import AdvancedCheckout from "./references/AdvancedCheckout";
import { DirectUpdates, QueuedUpdates } from "./demos/Examples";
import { ConnectionLab } from "./components/ConnectionLab";
import { CustomHookExample } from "./demos/AdvancedExamples";
import { checkoutReducer, initialCheckoutState } from "./advanced/cart";
import { checkoutConnection, createConnectivity } from "./lib/connectivity";
import { snippet } from "./lib/snippets";
import { scenes } from "./data/scenes";
import App from "./App";
afterEach(() => {
  cleanup();
  checkoutConnection.reset();
  vi.restoreAllMocks();
});
const strict = (component: React.ReactNode) =>
  render(<StrictMode>{component}</StrictMode>);
function quantity() {
  return screen.getByLabelText("Quantity").textContent;
}
describe("lesson contracts", () => {
  it("every displayed excerpt is extracted from an actual source region", () => {
    for (const scene of scenes) {
      expect(snippet(scene.before).length).toBeGreaterThan(30);
      expect(snippet(scene.after).length).toBeGreaterThan(30);
    }
  });
  it("starter supplies the note field and shared summary layout", () => {
    render(<StateCheckoutExercise />);
    expect(screen.getByLabelText("Order note").tagName).toBe("TEXTAREA");
    expect(screen.getByTestId("total")).toBeTruthy();
  });
  it("state checkpoint has one shared quantity and a derived count", () => {
    render(<StateCheckoutReference />);
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(quantity()).toBe("1");
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(quantity()).toBe("2");
    expect(screen.getByTestId("total").textContent).toBe("$48.00");
    fireEvent.change(screen.getByLabelText("Order note"), {
      target: { value: "Hello" },
    });
    expect(
      screen.getByText("5/100 characters · calculated during render"),
    ).toBeTruthy();
  });
  it("two snapshot replacements differ from queued updater functions", () => {
    const first = render(<DirectUpdates />);
    fireEvent.click(screen.getByText("Add two?"));
    expect(screen.getByLabelText("Demo quantity").textContent).toBe("2");
    first.unmount();
    render(<QueuedUpdates />);
    fireEvent.click(screen.getByText("Add two"));
    expect(screen.getByLabelText("Demo quantity").textContent).toBe("3");
  });
  it("cleanup survives StrictMode and leaves zero active on unmount", () => {
    const { container } = strict(<ConnectionLab fixed />);
    expect(
      container.querySelector(".diagnostic-stats strong")?.textContent,
    ).toBe("1");
    fireEvent.click(screen.getByText("Unmount status"));
    expect(
      container.querySelector(".diagnostic-stats strong")?.textContent,
    ).toBe("0");
    fireEvent.click(screen.getByText("Mount status"));
    expect(
      container.querySelector(".diagnostic-stats strong")?.textContent,
    ).toBe("1");
  });
  it("custom Hook calls have independent lifecycle under StrictMode", () => {
    vi.useFakeTimers();
    strict(<CustomHookExample />);
    expect(vi.getTimerCount()).toBe(2);
    fireEvent.click(screen.getByText("Unmount Second"));
    expect(vi.getTimerCount()).toBe(1);
    fireEvent.click(screen.getByText("Stop First"));
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByText("Restart First"));
    expect(vi.getTimerCount()).toBe(1);
    cleanup();
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });
  it("reducer resets every choice without mutating input", () => {
    const checkoutState = Object.freeze({
      quantity: 4,
      note: "Hello",
      giftEnabled: true,
      gift: "Gift",
    });
    expect(checkoutReducer(checkoutState, { type: "reset" })).toEqual(initialCheckoutState);
    expect(checkoutState.quantity).toBe(4);
    expect(checkoutReducer(checkoutState, { type: "noteChanged", note: "Next" })).toEqual({
      ...checkoutState,
      note: "Next",
    });
  });
  it("full reference shares the owner, preserves gift text and confirms locally", () => {
    strict(<AdvancedCheckout mode="complete" />);
    expect(checkoutConnection.getSnapshot().active).toBe(0);
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(screen.getByText("Header basket: 2 item(s)")).toBeTruthy();
    expect(screen.getByTestId("total").textContent).toBe("$48.00");
    fireEvent.click(screen.getByLabelText("Make it a gift", { exact: false }));
    fireEvent.change(screen.getByLabelText("Gift message"), {
      target: { value: "Enjoy space" },
    });
    fireEvent.click(screen.getByText("Edit gift message ↗"));
    expect(document.activeElement).toBe(screen.getByLabelText("Gift message"));
    fireEvent.click(screen.getByLabelText("Make it a gift", { exact: false }));
    expect(screen.queryByText("Enjoy space")).toBeNull();
    fireEvent.click(screen.getByLabelText("Make it a gift", { exact: false }));
    expect(
      (screen.getByLabelText("Gift message") as HTMLTextAreaElement).value,
    ).toBe("Enjoy space");
    fireEvent.click(screen.getByText("Review order →"));
    fireEvent.click(screen.getByText("Place demo order →"));
    expect(screen.getByText("Your next jump is ready.")).toBeTruthy();
  });
  it("section titles follow navigation without disabling the title-sync lesson", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    window.history.replaceState({}, "", "/glossary");
    strict(<App />);
    expect(document.title).toMatch(/^Glossary ·/);

    fireEvent.click(screen.getByRole("link", { name: "Live demo" }));
    expect(document.title).toMatch(/^Live demo · React Hooks/);
    fireEvent.change(screen.getByLabelText("Demo scene"), { target: { value: "title" } });
    fireEvent.click(screen.getByText("Run the example →"));
    expect(document.title).toBe("Live demo · Quantity 1");
    fireEvent.click(screen.getByRole("button", { name: "Add one" }));
    expect(document.title).toBe("Live demo · Quantity 2");
    fireEvent.change(screen.getByLabelText("Demo scene"), { target: { value: "remember" } });
    expect(document.title).toMatch(/^Live demo · React Hooks/);

    fireEvent.click(screen.getByRole("link", { name: "Checkout lab" }));
    expect(document.title).toMatch(/^Checkout lab · React Hooks/);
    fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "sync" } });
    expect(document.title).toBe("Checkout lab · 1 pack");
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(document.title).toBe("Checkout lab · 2 packs");
    fireEvent.change(screen.getByLabelText("Checkout version"), { target: { value: "starter" } });
    expect(document.title).toMatch(/^Checkout lab · React Hooks/);

    fireEvent.click(screen.getByRole("link", { name: "Lecture slides" }));
    expect(document.title).toMatch(/^Lecture slides ·/);
    fireEvent.click(screen.getByRole("link", { name: "Glossary" }));
    expect(document.title).toMatch(/^Glossary ·/);
  });
  it("reference owns the correct initial browser title on direct route", () => {
    window.history.replaceState({}, "", "/checkout?checkpoint=reference");
    render(<App />);
    expect(document.title).toBe("Checkout lab · 1 pack");
  });
  it("reads current browser status after a detached interval", () => {
    const conn = createConnectivity();
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(conn.read()).toBe(false);
    const off = conn.subscribe(() => {});
    expect(conn.getSnapshot().online).toBe(false);
    off();
    conn.dispose();
  });
});
