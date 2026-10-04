import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import StateCheckoutExercise from "./exercises/StateCheckoutExercise";
import StateCheckoutReference from "./references/StateCheckoutReference";
afterEach(cleanup);
it("gives the state exercise the working checkpoint's quantity and note layout", () => {
  for (const Component of [StateCheckoutExercise, StateCheckoutReference]) {
    render(<Component />);
    expect(screen.getByLabelText("Quantity").tagName).toBe("OUTPUT");
    expect(screen.getByLabelText("Decrease quantity").closest(".stepper")).toBeTruthy();
    expect(screen.getByLabelText("Increase quantity").closest(".stepper")).toBeTruthy();
    expect(screen.getByLabelText("Order note").getAttribute("maxlength")).toBe("100");
    expect(screen.queryByText("Add a gift message")).toBeNull();
    expect(screen.getByRole("button", { name: /Review order/ })).toBeTruthy();
    cleanup();
  }
});
