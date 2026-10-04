import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CachedOffers, UncachedOffers, StableAction, UnstableAction } from "./demos/OptimizationExamples";
afterEach(cleanup);
const count = (name: string) => Number(screen.getByLabelText(name).textContent);
describe("standalone optimization comparisons", () => {
  it.each([["uncached", UncachedOffers], ["cached", CachedOffers]] as const)("%s filters offers, ignores note edits, and updates for new offers", (_name, Component) => {
    const { rerender } = render(<Component offers={[{ id: "1", name: "Travel backpack" }, { id: "2", name: "School backpack" }, { id: "3", name: "Bottle" }]} />);
    fireEvent.change(screen.getByLabelText("Search offers"), { target: { value: "BACKPACK" } });
    const list = screen.getByRole("list", { name: "Matching offers" });
    expect(list.querySelectorAll("li").length).toBe(2);
    expect(count("Total matches")).toBe(2);
    const before = list.textContent;
    fireEvent.change(screen.getByLabelText("Unrelated order note"), { target: { value: "Gift" } });
    expect(list.textContent).toBe(before);
    fireEvent.change(screen.getByLabelText("Search offers"), { target: { value: "missing" } });
    expect(screen.getByText("No matching offers.")).toBeTruthy();
    rerender(<Component offers={[{ id: "new", name: "Missing item" }]} />);
    expect(list.textContent).toBe("Missing item");
    expect((screen.getByLabelText("Unrelated order note") as HTMLInputElement).value).toBe("Gift");
  });
  it.each([["unstable", UnstableAction, true], ["stable", StableAction, false]] as const)("%s shipping form responds to theme, dependencies, own state and local submission", (_name, Component, changes) => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      render(<Component />);
      log.mockClear();
      fireEvent.click(screen.getByRole("button", { name: "Theme: light" }));
      expect(log.mock.calls.some(args => args[0] === "Rendering ShippingForm")).toBe(changes);
      for (const [label, value] of [["Product", "bottle"], ["Referrer", "friend"]]) {
        log.mockClear();
        fireEvent.change(screen.getByLabelText(label), { target: { value } });
        expect(log.mock.calls.some(args => args[0] === "Rendering ShippingForm")).toBe(true);
      }
      log.mockClear();
      fireEvent.change(screen.getByLabelText("Address"), { target: { value: "12 School Road" } });
      expect(log.mock.calls.some(args => args[0] === "Rendering ShippingForm")).toBe(true);
      fireEvent.submit(screen.getByRole("button", { name: "Submit order locally" }).closest("form")!);
      expect(screen.getByRole("status").textContent).toBe("Saved locally: bottle · friend · 12 School Road");
    } finally { log.mockRestore(); }
  });
});
