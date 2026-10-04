// Actual course handoffs, not every exercise loosely related to a Hook.
// Reducer practice follows its model stage; the early state and title demos
// return to teaching, and optimization practice stays in Live Demo.
export const demoPractice: Record<string, { checkpoint: string; stage: string }> = {
  consistent: { checkpoint: "starter", stage: "controlled-checkout" },
  sync: { checkpoint: "repair-sync", stage: "subscription-cleanup" },
  focus: { checkpoint: "sync", stage: "explicit-focus" },
  reducer: { checkpoint: "reducer", stage: "reducer-reset" },
  context: { checkpoint: "context", stage: "context-owner" },
  custom: { checkpoint: "custom", stage: "custom-extract" },
};
