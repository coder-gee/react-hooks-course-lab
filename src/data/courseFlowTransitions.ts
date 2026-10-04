// Approved spoken main-section transitions for Course Flow only.
export const courseFlowTransitions: Partial<Record<string, string[]>> = {
  "native-baseline": [
    "Hi everyone, welcome back to week four. I’m CG, and I’ll be your lecturer today. Last week, you covered the React foundations. Today, we’ll build on that and learn how to use Hooks, with examples and hands-on practice.",
    "Before we start, let me quickly show you the mini-app we’ll use today. The Slides introduce each idea. In Live Demo, we’ll see short code examples working. Checkout Lab is where you’ll practise. And if you need a quick reminder of a term, you can look it up in the Glossary. Now, let’s go back to the slides and get an overview of the Hooks."
  ],
  "hook-map": [
    "Before we look at each Hook, let’s see what they help us do. A component might need to remember information, work with something outside React, or share information with other components. Different Hooks help with different jobs. We’ll take them one at a time, starting with useState.",
    "That’s the overview of what Hooks help us do. Before we try the first one, there are two rules to follow. First, call Hooks at the top level, before any early return—not inside conditions, loops, or event handlers. That keeps their order the same each time the component renders. Second, call Hooks only inside React function components or custom Hooks. We’ll follow those rules throughout our examples. Now, let’s start with useState—how a component remembers information and updates what’s on screen."
  ],
  "state-snapshots": [
    "Let’s start with something familiar: changing the quantity in our checkout. When the user clicks a button, we need to remember the new quantity and update what’s on screen. useState gives our component that memory. Let’s look at how it works."
  ],
  "effect-choice": [
    "We’ve seen how state updates our React UI. But sometimes, our component also needs to keep something outside React in sync with its state or props. That’s where useEffect comes in. Let’s look at what that means."
  ],
  "explicit-focus": [
    "We’ve used state to remember information that updates the screen. But sometimes, we need to remember a value without triggering a UI update. useRef gives us a way to do that. Let’s look at how it differs from state."
  ],
  "reducer-model": [
    "We’ve used useState to update values. As our component grows, those updates can involve several related values and rules. useReducer gives us one place to organize those rules. Let’s see how it works."
  ],
  "context-owner": [
    "Sometimes, several components need the same information. Context lets us share it without passing props through every level. Let’s see how it works."
  ],
  "custom-extract": [
    "We’ve used several Hooks together inside a component. When another component needs the same logic, we can extract it into a custom Hook. Let’s see how."
  ],
  "optional-memo": [
    "Our features are working. If an interaction feels slow, we can look for unnecessary work and reduce it. That’s optimization. Let’s see how.",
    "useMemo lets us reuse a calculated result when its dependencies haven’t changed.",
    "Now we pass that result to a child. memo can let the child skip a render when its props haven’t changed. useMemo keeps the result stable; memo checks the child’s props."
  ],
  "optional-callback": [
    "We’ve seen how a stable array prop can help a child wrapped in memo. Now let’s pass a function prop. useCallback keeps the same function reference when its dependencies haven’t changed. Changing the page theme can leave the shipping form’s submit handler unchanged. Submitting the form still calls it."
  ],
  "exit-transfer": [
    "Today, we’ve seen what the main Hooks are for and practised using them. Your homework is a chance to bring those ideas together on your own. Let’s look at what you’ll build and where to start."
  ]
};
