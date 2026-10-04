import { teachingGuide } from "./data/teachingGuide";
import { teachingScreens } from "./data/teachingScreens";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { scenes } from "./data/scenes";
import { demoPractice } from "./data/demoPractice";
import { snippet } from "./lib/snippets";
import { checkoutConnection } from "./lib/connectivity";
afterEach(() => { cleanup(); checkoutConnection.reset(); vi.restoreAllMocks(); });
function open(scene: string) {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState({}, "", `/demo?scene=${scene}`);
  return render(<App />);
}
it.each(["consistent", "title", "focus", "reducer", "context", "custom"])("%s has one interactive demo with visible source and explanation", id => {
  const { container } = open(id);
  const phases = within(container.querySelector(".demo-phase") as HTMLElement);
  expect(phases.queryByRole("button", { name: /Fix/ })).toBeNull();
  expect(phases.queryByRole("button", { name: /Fix/ })).toBeNull();
  expect(screen.queryByRole("button", { name: /Inspect the decision/ })).toBeNull();
  const source = container.querySelector(".source-panel code")!.textContent;
  expect(source).toBe(snippet(scenes.find(scene => scene.id === id)!.before));
  fireEvent.click(phases.getByRole("button", { name: /Run/ }));
  expect(container.querySelector(".prediction-cover")).toBeNull();
  expect(container.querySelector(".behavior-body button, .behavior-body textarea, .behavior-body select")).toBeTruthy();
  expect(container.querySelector(".source-panel code")!.textContent).toBe(source);
  expect(screen.getByText(scenes.find(scene => scene.id === id)!.takeaway)).toBeTruthy();
});
it.each(["remember", "queue", "sync", "memo", "callback"])("%s preserves distinct original and fixed code", id => {
  const { container } = open(id);
  if (id === "queue") {
    expect(within(container.querySelector(".demo-phase") as HTMLElement).queryByRole("button", { name: /Fix/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "2 · Queued updates" }));
  }
  const phases = within(container.querySelector(".demo-phase") as HTMLElement);
  const scene = scenes.find(scene => scene.id === id)!;
  fireEvent.click(phases.getByRole("button", { name: /Run/ }));
  expect(container.querySelector(".source-panel code")!.textContent).toBe(snippet(scene.before));
  fireEvent.click(phases.getByRole("button", { name: /Fix/ }));
  expect(container.querySelector(".source-panel code")!.textContent).toBe(snippet(scene.after));
  expect(snippet(scene.after)).not.toBe(snippet(scene.before));
  expect(screen.getByRole("button", { name: /Show original/ })).toBeTruthy();
  fireEvent.click(phases.getByRole("button", { name: /Run/ }));
  expect(container.querySelector(".source-panel code")!.textContent).toBe(snippet(scene.before));
});
it.each(scenes.map(scene => scene.id))("%s exposes Practice only for an actual course handoff", id => {
  const { container } = open(id);
  const phases = within(container.querySelector(".demo-phase") as HTMLElement);
  const button = phases.queryByRole("button", { name: /Practice/ });
  const practice = demoPractice[id];
  expect(!!button).toBe(!!practice);
  if (practice) {
    fireEvent.click(button!);
    expect(screen.getByRole("link", { name: /Open the checkout task/ }).getAttribute("href"))
      .toBe(`/checkout?checkpoint=${practice.checkpoint}&stage=${practice.stage}`);
  } else {
    expect(screen.queryByRole("link", { name: /Matching checkout task/ })).toBeNull();
  }
  expect(screen.getByRole("link", { name: "Checkout lab" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Lecture slides" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Live demo" })).toBeTruthy();
});
it.each([["reducer", "component"], ["context", "provider"], ["custom", "consumer"]])("%s retains its distinct source perspective", (id, label) => {
  const { container } = open(id);
  const original = container.querySelector(".source-panel code")!.textContent;
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`Show ${label}`) }));
  expect(container.querySelector(".source-panel code")!.textContent).not.toBe(original);
  fireEvent.click(screen.getByRole("button", { name: /Show core logic/ }));
  expect(container.querySelector(".source-panel code")!.textContent).toBe(original);
});

it("maps every Practice destination to a real assigned exercise in the teaching flow", () => {
  expect(Object.keys(demoPractice).sort()).toEqual(["consistent", "context", "custom", "focus", "reducer", "sync"]);
  for (const practice of Object.values(demoPractice)) {
    const stage = teachingGuide.find(stage => stage.id === practice.stage)!;
    expect(stage.checkpoint).toBe(practice.checkpoint);
    expect(teachingScreens[stage.id].steps.some(step => step.checkout && !step.reference && (step.checkpoint ?? stage.checkpoint) === practice.checkpoint)).toBe(true);
  }
});

it.each([["remember", "fix"], ["consistent", "run"], ["queue", "fix"]])("safely maps old Inspect links for %s", (id, expected) => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState({}, "", `/demo?scene=${id}&phase=inspect`);
  const { container } = render(<App />);
  expect(container.querySelector(".demo-phase button.active")!.textContent).toContain(expected === "fix" ? "Fix" : "Run");
  const scene = scenes.find(scene => scene.id === id)!;
  expect(container.querySelector(".source-panel code")!.textContent).toBe(snippet(expected === "fix" ? scene.after : scene.before));
});
it("keeps the explanation expandable alongside live source and controls", () => {
  const { container } = open("consistent");
  fireEvent.click(screen.getByRole("button", { name: /Run the example/ }));
  const explanation = container.querySelector("details.takeaway") as HTMLDetailsElement;
  expect(explanation.open).toBe(true);
  fireEvent.click(explanation.querySelector("summary")!);
  expect(explanation.open).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: /Quantity: 1/ }));
  expect(screen.getByText("Pack total: $48")).toBeTruthy();
  fireEvent.click(explanation.querySelector("summary")!);
  expect(explanation.open).toBe(true);
  expect(container.querySelector(".source-panel code")).toBeTruthy();
});

it.each([
  ["remember", ["Predict", "Run", "Fix"]],
  ["queue", ["Predict", "Run"]],
  ["consistent", ["Predict", "Run", "Practice"]],
  ["title", ["Predict", "Run"]],
  ["sync", ["Predict", "Run", "Fix", "Practice"]],
  ["focus", ["Predict", "Run", "Practice"]],
  ["reducer", ["Predict", "Run", "Practice"]],
  ["context", ["Predict", "Run", "Practice"]],
  ["custom", ["Predict", "Run", "Practice"]],
  ["memo", ["Predict", "Run", "Fix"]],
  ["callback", ["Predict", "Run", "Fix"]],
])("%s has precisely the agreed tabs", (id, expected) => {
  const { container } = open(id as string);
  const labels = () => Array.from(container.querySelectorAll(".demo-phase button")).map(button => button.textContent!.replace(/^\d+/, ""));
  expect(labels()).toEqual(expected);
  if (id === "queue") {
    fireEvent.click(screen.getByRole("button", { name: "2 · Queued updates" }));
    expect(labels()).toEqual(["Predict", "Run", "Fix"]);
  }
});

it("formats the Live Demo price with the shared currency while retaining language and local theme", () => {
  open("context");
  fireEvent.click(screen.getByRole("button", { name: "Run the example →" }));
  expect(screen.getByLabelText("Demo price").textContent).toBe("$24.00");
  fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "EUR" } });
  expect(screen.getByLabelText("Demo price").textContent).toBe("€24.00");
  expect(screen.getByText("Currency: EUR")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "JPY" } });
  expect(screen.getByLabelText("Demo price").textContent).toBe("¥24");
  fireEvent.change(screen.getByLabelText("Theme"), { target: { value: "dark" } });
  expect(screen.getByLabelText("Settings preview").getAttribute("data-theme")).toBe("dark");
  fireEvent.change(screen.getByLabelText("Language"), { target: { value: "es" } });
  expect(screen.getByRole("heading", { name: "Resumen del pedido" })).toBeTruthy();
  expect(screen.getByText(/Formatting demo only: the amount stays 24/)).toBeTruthy();
});
