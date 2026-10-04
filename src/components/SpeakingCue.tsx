import { useSpeakingCueDisplay } from "./SpeakingCueDisplay";
import { cuePrompts } from "../data/cuePrompts";
import GlossaryTerm from "./GlossaryTerm";

export default function SpeakingCue({ cue }: { cue: string }) {
  const { expanded } = useSpeakingCueDisplay();
  const prompt = cuePrompts[cue];
  if (!prompt) return <>{cue}</>;
  if (expanded) return <div className="speaking-cue-expanded"><strong>{cue}</strong><p>{prompt}</p></div>;
  return <GlossaryTerm term={{ phrase: cue, title: "You could say", explanation: prompt }} />;
}
