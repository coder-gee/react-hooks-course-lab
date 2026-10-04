import { SpeakingCueDisplay, SpeakingCueToggle } from "./SpeakingCueDisplay";
import { teachingGuide } from "../data/teachingGuide";
import type { TeachingSpeakingNotes, TeachingStage } from "../data/teachingGuide";
import { teachingScreens } from "../data/teachingScreens";
import { scenes } from "../data/scenes";
import { referenceSlides } from "../data/referenceSlides";
import TeachingText from "./TeachingText";
import SpeakingCue from "./SpeakingCue";
import StageTerminology from "./StageTerminology";
import "./teaching-guide.css";

type Props = { navigate: (path: string) => void };
function ProjectLink({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <a
      className="guide-project-link"
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
function SpeakingNotes({ notes, stageId }: { notes: TeachingSpeakingNotes; stageId: string }) {
  return (
    <SpeakingCueDisplay key={stageId} stageId={stageId}>
    <section className="guide-speaking" aria-label="Speaking notes">
      <div className="speaking-cue-panel-header"><h3>Speaking cues</h3><SpeakingCueToggle /></div>
      <ol className="guide-speaking-cues">
        {notes.cues.map((cue) => (
          <li key={cue}><SpeakingCue cue={cue} /></li>
        ))}
      </ol>
      <StageTerminology stageId={stageId} />
    </section>
    </SpeakingCueDisplay>
  );
}
function ScreenSequence({ stage }: { stage: TeachingStage }) {
  const plan = teachingScreens[stage.id];
  return (
    <section className="guide-screen-sequence" aria-label="What to open">
      <h3>What to open</h3>
      <p className="guide-screen-summary">{plan.summary}</p>
      <ol style={{ "--guide-screen-count": plan.steps.length } as React.CSSProperties}>
        {plan.steps.map((step, index) => (
          <li key={`${step.screen}-${index}`} className={step.optional ? "guide-screen-optional" : undefined}>
              <h4 title={step.instruction}><span className="guide-screen-number" aria-hidden="true">{index + 1}</span>{step.screen}</h4>
              {step.optional && <span className="guide-screen-condition">Only if needed</span>}
              <div className="guide-screen-links">
              {step.slides?.map((id) => {
                const slideIndex = referenceSlides.findIndex((slide) => slide.id === id);
                const slide = referenceSlides[slideIndex];
                return (
                  <ProjectLink key={id} href={`/slides?topic=${encodeURIComponent(id)}`} label={`Slide ${slideIndex + 1} · ${slide.title.replace(/\n/g, " ")}`}>
                    {`Slide ${slideIndex + 1}`}
                  </ProjectLink>
                );
              })}
              {step.demos?.map((id) => (
                <ProjectLink key={id} href={`/demo?scene=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage.id)}`} label={`Open Live demo · ${scenes.find((scene) => scene.id === id)?.title}`}>
                  {scenes.find((scene) => scene.id === id)?.title}
                </ProjectLink>
              ))}
              {step.href && <a href={step.href} target="_blank" rel="noopener noreferrer">Open Homework instructions ↗</a>}
              {step.checkout && (
                <ProjectLink href={`/checkout?checkpoint=${encodeURIComponent(step.checkpoint ?? stage.checkpoint!)}&stage=${encodeURIComponent(stage.id)}${step.reference ? "&view=reference" : ""}`} label={`Open Checkout lab · ${step.checkout}`}>
                  {step.checkout}
                </ProjectLink>
              )}
              </div>
              {step.reference && <p className="reference-target-instruction">{step.instruction}</p>}
              {!step.slides && !step.demos && !step.checkout && <p>{step.instruction}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
export default function TeachingGuide({ navigate }: Props) {
  const query = new URLSearchParams(window.location.search);
  const selected = query.get("stage");
  const index = Math.max(
    0,
    teachingGuide.findIndex((stage) => stage.id === selected),
  );
  const stage = teachingGuide[index];
  const visit = (id: string) => navigate(`/guide?stage=${encodeURIComponent(id)}`);
  return (
    <div className="teaching-guide">
      <div className="guide-layout">
        <aside className="guide-outline">
          <span className="eyebrow">SESSION ROUTE</span>
          <ol>
            {teachingGuide.map((item, i) => (
              <li key={item.id}>
                <button
                  className={i === index ? "current" : ""}
                  aria-current={i === index ? "step" : undefined}
                  onClick={() => visit(item.id)}
                >
                  <span className="guide-stage-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <small>
                      {String(item.start).padStart(2, "0")}–
                      {String(item.end).padStart(2, "0")} MIN
                      {item.optional ? " · OPTIONAL" : ""}
                    </small>
                    <b>{item.title}</b>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <section className="guide-current">
          <div className="guide-current-header">
            <span>
              {`${stage.start}–${stage.end} MIN · ${stage.end - stage.start} MIN STAGE / ${stage.talkMinutes} MIN TALK`}
            </span>
            <div className="guide-stage-actions">
              <select
                className="lesson-picker"
                aria-label="Current teaching stage"
                value={stage.id}
                onChange={(event) => visit(event.target.value)}
              >
                {teachingGuide.map((item, i) => (
                  <option key={item.id} value={item.id}>
                    {i + 1}. {item.title}
                  </option>
                ))}
              </select>
              <a
                className="button small"
                href={`/flow?stage=${encodeURIComponent(stage.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open the course flow in a new tab"
              >
                Course flow ↗
              </a>

            </div>
          </div>
              <h2>{stage.title}</h2>
              <ScreenSequence stage={stage} />
              {stage.id === "exit-transfer" && <p><a href="/homework" target="_blank" rel="noopener noreferrer">Open independent homework: Saved checkout draft ↗</a></p>}
              {stage.speakingNotes && <SpeakingNotes key={stage.id} notes={stage.speakingNotes} stageId={stage.id} />}
              <div className="guide-prompt-grid">
                <section className="guide-ask">
                  <span>{stage.id === "exit-transfer" ? "PRACTICAL QUESTION" : "ASK · WAIT 5–7 SECONDS"}</span>
                  <p>{stage.ask}</p>
                </section>
                <section>
                  <span>{stage.id === "exit-transfer" ? "WHERE TO WORK" : "EXPECTED REASONING"}</span>
                  <p><TeachingText text={stage.expected} /></p>
                </section>
                <section className="guide-hint">
                  <span>IF THEY GET STUCK</span>
                  <p>{stage.ifStuck}</p>
                </section>
              </div>
              <div className="guide-check">
                <span>{stage.id === "exit-transfer" ? "HANDOFF CHECK" : "CHECK UNDERSTANDING"}</span>
                <p>{stage.check}</p>
              </div>
          <nav className="guide-controls" aria-label="Guide progression">
            <button
              className="button"
              disabled={index === 0}
              onClick={() => visit(teachingGuide[index - 1].id)}
            >
              ← Previous stage
            </button>
            <span>
              {index + 1} / {teachingGuide.length}
            </span>
            <button
              className="button primary"
              disabled={index === teachingGuide.length - 1}
              onClick={() =>
                visit(teachingGuide[index + 1].id)
              }
            >
              Next stage →
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}
