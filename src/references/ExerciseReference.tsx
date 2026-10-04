import StateCheckoutReference from "./StateCheckoutReference";
import EffectCleanupCheckoutReference from "./EffectCleanupCheckoutReference";
import InputFocusCheckoutReference from "./InputFocusCheckoutReference";
import ReducerResetCheckoutReference from "./ReducerResetCheckoutReference";
import ContextProviderCheckoutReference from "./ContextProviderCheckoutReference";
import CustomHookCheckoutReference from "./CustomHookCheckoutReference";

// Ordinary lesson targets only; no homework solution.
export default function ExerciseReference({ exercise }: { exercise: string }) {
  if (exercise === "starter") return <StateCheckoutReference />;
  if (exercise === "repair-sync") return <EffectCleanupCheckoutReference />;
  if (exercise === "sync") return <InputFocusCheckoutReference />;
  if (exercise === "reducer") return <ReducerResetCheckoutReference />;
  if (exercise === "context") return <ContextProviderCheckoutReference />;
  if (exercise === "custom") return <CustomHookCheckoutReference />;
  return null;
}
