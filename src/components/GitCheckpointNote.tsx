import { useState } from "react";
import { gitLessonForCheckpoint, gitLessons } from "../data/gitLessons";
import type { GitLessonTag } from "../data/gitLessons";

export default function GitCheckpointNote({ checkpoint, activeTag = null }: {
  checkpoint: string;
  activeTag?: GitLessonTag | null;
}) {
  const [copyResult, setCopyResult] = useState<{ command: string; ok: boolean } | null>(null);
  const lesson = activeTag
    ? gitLessons.find(entry => entry.tag === activeTag)
    : gitLessonForCheckpoint(checkpoint);
  if (!lesson) return null;
  const command = `git checkout ${lesson.tag}`;
  const copied = copyResult?.command === command && copyResult.ok;
  const copyFailed = copyResult?.command === command && !copyResult.ok;
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyResult({ command, ok: true });
    } catch {
      setCopyResult({ command, ok: false });
    }
  }
  return (
    <section className="git-checkpoint-note" aria-label="Git lesson checkpoint">
      <h3>{activeTag ? "Current Git lesson" : "Git starting point"}</h3>
      <p>{lesson.ready}</p>
      <div className="git-checkpoint-command">
        <code>{command}</code>
        <button type="button" className="git-copy-button" onClick={copyCommand} aria-label="Copy checkpoint command" title={copied ? "Copied" : "Copy command"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {copied ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
          </svg>
          <span className="git-copy-label" aria-live="polite">{copied ? "Command copied" : "Copy command"}</span>
        </button>
      </div>
      {copyFailed && <p role="status" className="git-copy-error">Couldn’t copy. Select the command and copy it manually.</p>}
      <p className="fineprint">Run in React Hooks Demo Lab. Save edits with a commit or stash before switching. Tags are fixed snapshots; create your own branch before committing your work.</p>
      <p className="fineprint">After checkout, open Checkout lab. This snapshot chooses its exercise automatically. Reset above resets the running UI; it does not restore source files.</p>
    </section>
  );
}
