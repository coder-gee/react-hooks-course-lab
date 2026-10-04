export const gitLessons = [
  { tag: "lesson-00-native", checkpoint: "starter", title: "Explore the native baseline", order: 0, ready: "Layout, sample data, native inputs and form behavior are supplied." },
  { tag: "lesson-01-state", checkpoint: "starter", title: "State and derived values", order: 1, ready: "Begin with native controls; connect quantity, note and summary with state." },
  { tag: "lesson-02-effects", checkpoint: "repair-sync", title: "Effects and cleanup", order: 2, ready: "State, controlled inputs and derived totals are complete. The countdown is inactive; implement Effect setup, functional updates and timer cleanup." },
  { tag: "lesson-03-refs", checkpoint: "sync", title: "Refs and focus", order: 3, ready: "State and synchronization are complete. Attach a ref and focus the note in an Effect after mount." },
  { tag: "lesson-04-reducer", checkpoint: "reducer", title: "Reducer transitions", order: 4, ready: "State, synchronization and focus are complete. Implement the reducer reset action." },
  { tag: "lesson-05-context", checkpoint: "context", title: "Context and shared values", order: 5, ready: "Share checkout currency and theme through one Settings provider; connect the supplied consumers." },
  { tag: "lesson-06-custom-hooks", checkpoint: "custom", title: "Custom Hooks", order: 6, ready: "State, Effects, refs, reducer and Context are complete. Extract independent countdowns using state, ref and Effect." },
  { tag: "lesson-07-optimization", checkpoint: "custom", title: "Optional optimization", order: 7, ready: "All core exercises are complete. Use the standalone Live Demo memoization comparisons if time allows; there is no optimization checkout exercise." },
  { tag: "lesson-complete", checkpoint: "reference", title: "Completed core checkout", order: 8, ready: "All core exercises are complete; use this as a recovery point or comparison." },
  { tag: "reference-state", checkpoint: "state-reference", title: "Earlier state-based reference", order: 8, ready: "Working checkout before the reducer, Context and custom Hook refactor." },
] as const;
export type GitLessonTag = typeof gitLessons[number]["tag"];
export function gitLessonForCheckpoint(checkpoint: string) {
  if (checkpoint === "starter") return gitLessons[1];
  if (checkpoint === "state") return gitLessons[2];
  return gitLessons.find(lesson => lesson.checkpoint === checkpoint);
}
