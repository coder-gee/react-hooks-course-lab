import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { scenes } from "./data/scenes";
import { referenceSlides } from "./data/referenceSlides";
import { glossaryTerms } from "./data/glossaryTerms";
import { checkoutTerms, demoTerms, slideTerms } from "./data/contextualTerms";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function open(path: string) {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState({}, "", path);
  return render(<App />);
}
function names() {
  return within(screen.getByRole("region", { name: "Related glossary terms" }))
    .getAllByRole("button").map(button => button.textContent);
}

it("maps every public topic to existing glossary definitions", () => {
  expect(Object.keys(demoTerms).sort()).toEqual(scenes.map(scene => scene.id).sort());
  expect(Object.keys(slideTerms).sort()).toEqual(referenceSlides.map(slide => slide.id).sort());
  const phrases = new Set(glossaryTerms.map(term => term.phrase));
  for (const terms of [...Object.values(demoTerms), ...Object.values(checkoutTerms), ...Object.values(slideTerms)]) {
    expect(new Set(terms).size).toBe(terms.length);
    for (const name of terms) expect(phrases.has(name), name).toBe(true);
  }
});

it("keeps demo terms beneath the content and changes them with the selected example", () => {
  const { container } = open("/demo?scene=queue");
  expect(names()).toEqual(demoTerms.queue);
  expect(container.querySelector(".demo-page")?.lastElementChild?.getAttribute("aria-label"))
    .toBe("Related glossary terms");
  fireEvent.change(screen.getByLabelText("Demo scene"), { target: { value: "sync" } });
  expect(names()).toEqual(demoTerms.sync);
  const button = screen.getByRole("button", { name: "cleanup" });
  const definition = document.getElementById(button.getAttribute("aria-describedby")!);
  expect(definition?.textContent).toContain(glossaryTerms.find(term => term.phrase === "cleanup")!.explanation);
  expect(definition?.querySelector("code")).toBeTruthy();
});

it("keeps checkout terms outside the form and available with task notes closed", () => {
  const { container } = open("/checkout?checkpoint=starter");
  expect(names()).toEqual(checkoutTerms.starter);
  expect(container.querySelector("details.task-drawer")?.hasAttribute("open")).toBe(false);
  const terms = screen.getByRole("region", { name: "Related glossary terms" });
  expect(terms.closest("form")).toBeNull();
  expect(container.querySelector(".checkout-page")?.lastElementChild).toBe(terms);
  const selector = screen.getByLabelText("Checkout version");
  const options = Array.from(selector.querySelectorAll("option")).map(option => option.value);
  for (const option of options) expect(checkoutTerms[option.split("::")[0]]).toBeDefined();
  fireEvent.change(selector, { target: { value: "context" } });
  expect(names()).toEqual(checkoutTerms.context);
});

it("changes slide terms without adding them to the fixed slide canvas or print deck", async () => {
  const view = open("/slides?topic=state-snapshot");
  expect(names()).toEqual(slideTerms["state-snapshot"]);
  expect(screen.getByRole("region", { name: "Related glossary terms" }).closest("article")).toBeNull();
  fireEvent.change(screen.getByLabelText("Jump to lecture slide"), { target: { value: "ref-focus" } });
  expect(names()).toEqual(slideTerms["ref-focus"]);
  const fullGlossary = screen.getByRole("link", { name: "Full glossary ↗" });
  expect(fullGlossary.getAttribute("href")).toBe("/glossary");
  expect(fullGlossary.getAttribute("target")).toBe("_blank");
  view.unmount();
  open("/slides?print=1");
  await screen.findByRole("button", { name: "Save as PDF" });
  expect(screen.queryByRole("region", { name: "Related glossary terms" })).toBeNull();
  expect(screen.getAllByRole("article")).toHaveLength(referenceSlides.length);
});
