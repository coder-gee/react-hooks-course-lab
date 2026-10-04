import { createContext, useContext, useState, type ReactNode } from "react";
import "./speaking-cue-display.css";


const CueDisplayContext = createContext({ expanded: false, toggle: () => {} });

export function SpeakingCueDisplay({ children, stageId }: { children: ReactNode; stageId: string }) {
  const storageKey = `lecturer-speaking-cues-expanded:${stageId}`;
  const [expanded, setExpanded] = useState(() => {
    try { return window.localStorage.getItem(storageKey) === "true"; } catch { return false; }
  });
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    try { window.localStorage.setItem(storageKey, String(next)); } catch { /* Still works without storage. */ }
  };
  return <CueDisplayContext.Provider value={{ expanded, toggle }}>{children}</CueDisplayContext.Provider>;
}

export const useSpeakingCueDisplay = () => useContext(CueDisplayContext);

export function SpeakingCueToggle() {
  const { expanded, toggle } = useSpeakingCueDisplay();
  return <button className="button small speaking-cue-toggle" type="button" aria-pressed={expanded} onClick={toggle}>Expand speaking cues</button>;
}
