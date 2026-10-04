// Introduction points for the lecturer, independent of the optional speaking script.
export type TerminologyGroup = { slide?: string; label?: string; terms: string[] };

export const teachingTerminology: Record<string, TerminologyGroup[]> = {
  'native-baseline': [
    { label: 'Checkout exploration', terms: ['native behavior', 'uncontrolled input', 'events', 'class-component APIs'] },
  ],
  'hook-map': [
    { slide: 'hooks-overview', terms: ['Hook', 'useState', 'useEffect', 'useRef', 'useReducer', 'useContext', 'custom Hook'] },
    { slide: 'hook-rules', terms: ['function component', 'top level'] },
  ],
  'state-snapshots': [
    { slide: 'section-state', terms: ['React state', 'rendering'] },
    { slide: 'state-memory', terms: ['useState', 'state setter'] },
    { slide: 'state-snapshot', terms: ['batching', 'state snapshot'] },
    { slide: 'state-updaters', terms: ['updater function', 'pending state', 'pure function'] },
  ],
  'controlled-checkout': [
    { slide: 'controlled-input', terms: ['controlled input'] },
    { slide: 'derived-state', terms: ['derived value', 'props', 'lifting state up'] },
  ],
  'effect-choice': [
    { slide: 'effect-purpose', terms: ['useEffect', 'external system', 'events'] },
    { slide: 'effect-dependencies', terms: ['reactive dependency', 'dependency list'] },
  ],
  'subscription-cleanup': [
    { label: 'Demo 5 · flash sale timer', terms: ['updater function', 'mount and unmount'] },
    { slide: 'effect-cleanup', terms: ['cleanup'] },
  ],
  'explicit-focus': [
    { slide: 'ref-memory', terms: ['useRef'] },
    { slide: 'ref-focus', terms: ['DOM', 'focus'] },
  ],
  break: [],
  'reducer-model': [
    { slide: 'reducer-actions', terms: ['useReducer', 'reducer', 'action', 'dispatch'] },
    { slide: 'reducer-immutability', terms: ['immutability', 'pure function'] },
  ],
  'reducer-reset': [
    { label: 'Reset exercise · revisit', terms: ['action', 'dispatch', 'immutability'] },
  ],
  'context-owner': [
    { slide: 'context-provider', terms: ['provider', 'props'] },
    { slide: 'context-consumer', terms: ['useContext', 'consumer'] },
  ],
  'custom-extract': [
    { slide: 'custom-extraction', terms: ['custom Hook', 'reusable logic', 'cleanup'] },
  ],
  'custom-reuse': [
    { slide: 'custom-independence', terms: ['independent Hook calls'] },
    { slide: 'context-provider', terms: ['provider', 'consumer'] },
  ],
  'optional-memo': [
    { slide: 'memo-result', terms: ['useMemo', 'memoization', 'pure function'] },
    { slide: 'optimization-choice', terms: ['memoization'] },
  ],
  'optional-callback': [
    { slide: 'callback-reference', terms: ['useCallback', 'function reference', 'memoized'] },
  ],
  'exit-transfer': [],
};
