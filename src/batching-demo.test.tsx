import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Profiler } from "react";
import App from "./App";
import { BatchedReset } from "./demos/Examples";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("commits quantity and note together when Reset is clicked", () => {
  const commits: string[][] = [];
  render(<Profiler id="reset" onRender={() => commits.push([
    screen.getByLabelText("Demo quantity").textContent || "",
    screen.getByLabelText("Demo note").textContent || "",
  ])}><BatchedReset /></Profiler>);
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(commits).toEqual([["3", "Happy birthday!"], ["1", "No note"]]);
});

it("starts with batching and keeps source and results aligned through the quantity comparison", () => {
  window.history.replaceState({}, "", "/demo?scene=queue");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const { container } = render(<App />);
  const source = () => container.querySelector(".source-panel code")!.textContent;
  expect(source()).toContain("function BatchedReset");
  expect(screen.queryByRole("button", { name: /Reveal the fix/ })).toBeNull();
  expect(screen.queryByRole("button", { name: /Inspect the decision/ })).toBeNull();
  expect(screen.queryByText("React waits for the Reset handler to finish, then updates quantity and note together.")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Run the example/ }));
  expect(screen.getByText("React waits for the Reset handler to finish, then updates quantity and note together.")).toBeTruthy();
  expect(screen.getByLabelText("Demo note").textContent).toBe("Happy birthday!");
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("1");
  expect(screen.getByLabelText("Demo note").textContent).toBe("No note");
  fireEvent.click(screen.getByRole("button", { name: /Restart example/ }));
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("3");
  expect(screen.getByLabelText("Demo note").textContent).toBe("Happy birthday!");

  fireEvent.click(screen.getByRole("button", { name: /Continue to queued updates/ }));
  expect(source()).toContain("function DirectUpdates");
  fireEvent.click(screen.getByRole("button", { name: /Run the example/ }));
  fireEvent.click(screen.getByRole("button", { name: "Add two?" }));
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("2");
  fireEvent.click(screen.getByRole("button", { name: /Reveal the fix/ }));
  expect(source()).toContain("function QueuedUpdates");
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Add two" }));
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("3");
  fireEvent.click(screen.getByRole("button", { name: "1 · Batching" }));
  expect(source()).toContain("function BatchedReset");
  fireEvent.click(screen.getByRole("button", { name: /Run the example/ }));
  expect(screen.getByLabelText("Demo quantity").textContent).toBe("3");
  expect(screen.getByLabelText("Demo note").textContent).toBe("Happy birthday!");
});
