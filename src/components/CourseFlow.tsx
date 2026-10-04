import { Fragment } from "react";
import { teachingGuide, type TeachingStage } from "../data/teachingGuide";
import { teachingScreens } from "../data/teachingScreens";
import { referenceSlides } from "../data/referenceSlides";
import { scenes } from "../data/scenes";
import { courseFlowTransitions } from "../data/courseFlowTransitions";
import "./course-flow.css";

function FlowSteps({ stage }: { stage: TeachingStage }) {
  const plan = teachingScreens[stage.id];
  return (
    <ol className="course-flow-steps" aria-label="Screen transitions">
      {plan.steps.map((step, index) => (
        <li className="course-flow-step" key={`${step.screen}-${index}`} data-screen={step.screen}>
          <div className="course-flow-card">
            <span className="course-flow-surface">{step.screen}{step.optional && <small> · If needed</small>}</span>
            <div className="course-flow-links">
              {step.slides?.map(id => {
                const slideIndex = referenceSlides.findIndex(slide => slide.id === id);
                return (
                  <a key={id} href={`/slides?topic=${encodeURIComponent(id)}`} target="_blank" rel="noopener noreferrer" title={referenceSlides[slideIndex].title.replace(/\n/g, " ")}>
                    Slide {slideIndex + 1}
                  </a>
                );
              })}
              {step.demos?.map(id => {
                const demoIndex = scenes.findIndex(scene => scene.id === id);
                return (
                  <a key={id} href={`/demo?scene=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage.id)}`} target="_blank" rel="noopener noreferrer">
                    {demoIndex + 1} · {scenes[demoIndex].title}
                  </a>
                );
              })}
              {step.href && <a href={step.href} target="_blank" rel="noopener noreferrer">Open Homework instructions ↗</a>}
              {step.checkout && (
                <a href={`/checkout?checkpoint=${encodeURIComponent(step.checkpoint ?? stage.checkpoint!)}&stage=${encodeURIComponent(stage.id)}${step.reference ? "&view=reference" : ""}`} target="_blank" rel="noopener noreferrer">
                  {step.checkout}
                </a>
              )}
            </div>
            {step.reference && <p className="reference-target-instruction">{step.instruction}</p>}
              {!step.slides && !step.demos && !step.checkout && <p>{step.instruction}</p>}
          </div>
          {index < plan.steps.length - 1 && <span className="course-flow-arrow" aria-hidden="true">→</span>}
        </li>
      ))}
    </ol>
  );
}

export default function CourseFlow() {
  const query = new URLSearchParams(window.location.search);
  const origin = teachingGuide.find(stage => stage.id === query.get("stage")) || teachingGuide[0];
  const returnQuery = `stage=${encodeURIComponent(origin.id)}`;

  return (
    <article className="course-flow" aria-label="Course flow">
      <div className="course-flow-controls">
        <a className="button small" href={`/guide?${returnQuery}`}>← Back to teaching guide</a>
        <a className="button small" href={`/glossary?${returnQuery}`} target="_blank" rel="noopener noreferrer">Glossary ↗</a>
      </div>
      <dl className="course-flow-patterns" aria-label="Teaching patterns by screen">
        <div>
          <dt>Lecture slides</dt>
          <dd>Idea → Example → Takeaway</dd>
        </div>
        <div>
          <dt>Live demo</dt>
          <dd>Point → Show → Explain</dd>
        </div>
        <div>
          <dt>Checkout lab</dt>
          <dd>Goal → Try → Check</dd>
        </div>
      </dl>
      {teachingGuide.map((stage, index) => (
        <Fragment key={stage.id}>
          <section className="course-flow-stage" aria-labelledby={`flow-title-${stage.id}`}>
            <header>
              <p className="course-flow-meta">Stage {index + 1} · {stage.start}–{stage.end} min{stage.optional ? " · Optional" : ""}</p>
              <h2 id={`flow-title-${stage.id}`}>{stage.title}</h2>
            </header>
            <div>
              {courseFlowTransitions[stage.id] && <section className="course-flow-transition" aria-label="Spoken transition">
                <h3>Section opening</h3>
                {courseFlowTransitions[stage.id]!.map((paragraph, i) => <div key={i}>
                  {stage.id === "optional-callback" && <h4 className="course-flow-script-label">Slide 29 · useCallback</h4>}
                  {stage.id === "optional-memo" && <h4 className="course-flow-script-label">{["Slide 26 · Optimization", "Slide 27 · useMemo", "Slide 28 · memo"][i]}</h4>}
                  <p>{paragraph}</p>
                </div>)}
              </section>}
              <FlowSteps stage={stage} />
            </div>
          </section>
        </Fragment>
      ))}
    </article>
  );
}
