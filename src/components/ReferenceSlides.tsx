import ContextualTerms from "./ContextualTerms";
import { slideTerms } from "../data/contextualTerms";
import { useEffect, useRef, useState } from "react";
import { referenceSlides, type ReferenceSlide } from "../data/referenceSlides";
import Code from "./Code";
import "./reference-slides.css";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 810;
type Props = { navigate: (path: string) => void };

function slideHeading(slide: ReferenceSlide) {
  const topic = slide.topic.replace(/\bUSE(STATE|EFFECT|REF|REDUCER|CONTEXT|MEMO|CALLBACK)\b/g,
    word => ({ USESTATE: "useState", USEEFFECT: "useEffect", USEREF: "useRef", USEREDUCER: "useReducer", USECONTEXT: "useContext", USEMEMO: "useMemo", USECALLBACK: "useCallback" })[word]!);
  const normalizedTitle = slide.title.replace(/\s+/g, " ").toLowerCase();
  return normalizedTitle.startsWith(topic.toLowerCase()) ? slide.title : `${topic}: ${slide.title}`;
}


function SlideCanvas({
  slide,
  index,
}: {
  slide: ReferenceSlide;
  index: number;
}) {
  return (
    <article
      className={`reference-slide ${slide.dark ? "reference-dark" : ""} ${slide.cover ? "reference-cover" : ""} ${slide.sectionNumber ? "reference-section" : ""}`}
      aria-label={`Lecture slide ${index + 1}: ${slide.title.replace(/\n/g, " ")}`}
      data-slide-id={slide.id}
    >
      {slide.closing ? (
        <div className="reference-closing-content"><h1>{slide.title}</h1></div>
      ) : slide.cover ? (
        <>
          <img
            src="/assets/xsolla-cyan-logo.png"
            className="reference-cover-logo"
            alt="Xsolla"
          />
          <div className="reference-cover-content">
            <span className="reference-cover-school">{slide.topic}</span>
            {slide.author && <p className="reference-cover-author">{slide.author}</p>}
            <h1>{slide.title}</h1>
            <p className="reference-body">{slide.body}</p>
          </div>
        </>
      ) : slide.sectionNumber ? (
        <>
          <img
            src="/assets/xsolla-gray-mark.png"
            className="reference-section-mark"
            alt="Xsolla"
          />
          <div className="reference-section-content">
            <span className="reference-section-number">
              {slide.sectionNumber}
            </span>
            <h1>{slide.title}</h1>
            {slide.body && <p className="reference-body">{slide.body}</p>}
          </div>
        </>
      ) : (
        <>
          <div className="reference-topline">
            <img
              src={
                slide.dark
                  ? "/assets/xsolla-cyan-logo.png"
                  : "/assets/xsolla-gray-mark.png"
              }
              className={slide.dark ? "reference-logo" : "reference-mark"}
              alt="Xsolla"
            />
          </div>
          <h1>{slideHeading(slide)}</h1>
          <p className="reference-body">{slide.body}</p>
          {slide.jobs ? (
            <div className="reference-job-map">
              <table aria-label="Hooks, general purposes and checkout examples">
                <thead>
                  <tr><th scope="col">Hook</th><th scope="col">General purpose</th><th scope="col">In our checkout</th></tr>
                </thead>
                <tbody>
                  {slide.jobs.map((job) => (
                    <tr key={job.hook}>
                      <td><code>{job.hook}</code></td>
                      <td>{job.purpose}</td>
                      <td>{job.need}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : slide.comparison ? (
            <div className={`reference-comparison${slide.comparison.length === 3 ? " three-examples" : ""}`}>
              {slide.comparison.map((example) => (
                <section key={example.title}>
                  <h2>{example.title}</h2>
                  <div className="reference-code"><Code source={example.code} size={(slide.id === "custom-extraction" || slide.id === "optimization-choice" || slide.id === "callback-reference") ? 18 : slide.comparison?.length === 3 ? 17 : 19} /></div>
                  <p>{example.explanation}</p>
                </section>
              ))}
            </div>
          ) : (
          <div
            className={`reference-explanation ${slide.code ? "with-code" : ""}`}
          >
            {slide.code && (
              <div className="reference-code">
                <Code source={slide.code} size={19} />
              </div>
            )}
            <div className="reference-detail">
              {slide.codeCallout && (
                <aside className="reference-code-callout" aria-label={slide.codeCallout.label}>
                  <span>{slide.codeCallout.label}</span>
                  <code>{slide.codeCallout.code}</code>
                  {slide.codeCallout.description && <p>{slide.codeCallout.description}</p>}
                </aside>
              )}
              {slide.explanation && <p>{slide.explanation}</p>}
              {slide.pitfall && (
                <div className="reference-pitfall">
                  <span>WATCH FOR</span>
                  <p>{slide.pitfall}</p>
                </div>
              )}
            </div>
          </div>
          )}
          {slide.takeaway && (
            <div className="reference-takeaway">
              <span>THE IDEA TO KEEP</span>
              <p>{slide.takeaway}</p>
            </div>
          )}
        </>
      )}
      <div className="reference-footer">
        <span>XSOLLA SCHOOL · REACT HOOKS</span>
        <div className="reference-canvas-sources">
          {slide.sources.length > 0 && <span>Read more</span>}
          {slide.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.label}
            </a>
          ))}
        </div>
        <span>
          {String(index + 1).padStart(2, "0")} / {referenceSlides.length}
        </span>
      </div>
    </article>
  );
}

function ScaledSlide({
  slide,
  index,
}: {
  slide: ReferenceSlide;
  index: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = frame.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / CANVAS_WIDTH),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="reference-slide-frame"
      ref={frame}
      style={{ height: CANVAS_HEIGHT * scale }}
    >
      <div
        className="reference-slide-scale"
        style={{ transform: `scale(${scale})` }}
      >
        <SlideCanvas slide={slide} index={index} />
      </div>
    </div>
  );
}

export default function ReferenceSlides({ navigate }: Props) {
  const query = new URLSearchParams(window.location.search);
  const printView = query.get("print") === "1";
  const topic = query.get("topic");
  const match = topic
    ? referenceSlides.findIndex((slide) => slide.id === topic)
    : -1;
  const step = Number(query.get("step") || 0);
  const index =
    match >= 0
      ? match
      : Number.isFinite(step)
        ? Math.max(0, Math.min(referenceSlides.length - 1, Math.floor(step)))
        : 0;
  const slide = referenceSlides[index];
  const [printReady, setPrintReady] = useState(false);
  const visit = (next: number) =>
    navigate(`/slides?topic=${encodeURIComponent(referenceSlides[next].id)}`);
  useEffect(() => {
    if (printView) return;
    const key = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement).closest(
          'input,textarea,select,button,[contenteditable="true"]',
        )
      )
        return;
      if (event.key === "ArrowRight" && index < referenceSlides.length - 1) {
        event.preventDefault();
        visit(index + 1);
      }
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        visit(index - 1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, navigate, printView]);
  useEffect(() => {
    document.title = printView
      ? "Xsolla School — React Hooks Lecture Slides"
      : `Lecture slides · ${slide.title.replace(/\n/g, " ")} · React Hooks`;
  }, [slide.id, printView]);
  useEffect(() => {
    if (!printView) return;
    let active = true;
    void (document.fonts?.ready || Promise.resolve()).then(async () => {
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode
            ? image.decode().catch(() => undefined)
            : Promise.resolve(),
        ),
      );
      if (active) setPrintReady(true);
    });
    return () => {
      active = false;
    };
  }, [printView]);
  if (printView)
    return (
      <div
        className="reference-print-view"
        data-print-ready={printReady ? "true" : "false"}
      >
        <div className="reference-print-toolbar">
          <div>
            <strong>React Hooks lecture slides</strong>
            <span>
              {referenceSlides.length} slides · one 16:9 slide per page
            </span>
          </div>
          <button
            className="button primary"
            disabled={!printReady}
            onClick={() => window.print()}
          >
            {printReady ? "Save as PDF" : "Preparing fonts…"}
          </button>
          <p>
            Choose Save as PDF in the print dialog. Use all pages, no margins or
            headers, and background graphics enabled.
          </p>
        </div>
        <div className="reference-print-deck">
          {referenceSlides.map((item, i) => (
            <div className="reference-print-page" key={item.id}>
              <SlideCanvas slide={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="reference-page">
      <div className="view-toolbar">
        <div>
          <span className="eyebrow">REACT HOOKS · LECTURE SLIDES</span>
          <span>Concepts, examples, and decisions</span>
        </div>
        <div className="toolbar-actions">
          <select
            aria-label="Jump to lecture slide"
            value={slide.id}
            onChange={(event) =>
              navigate(
                `/slides?topic=${encodeURIComponent(event.target.value)}`,
              )
            }
          >
            {referenceSlides.map((item, i) => (
              <option key={item.id} value={item.id}>
                {i + 1}. {item.title.replace(/\n/g, " ")}
              </option>
            ))}
          </select>
          <a
            className="button small"
            href="/slides?print=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Print / Save PDF ↗
          </a>
          <button
            className="icon-button"
            aria-label="Toggle fullscreen"
            title="Toggle fullscreen"
            onClick={() =>
              document.fullscreenElement
                ? void document.exitFullscreen()
                : void document.documentElement.requestFullscreen()
            }
          >
            ⛶
          </button>
        </div>
      </div>
      <ScaledSlide slide={slide} index={index} />
      <div className="reference-navigation">
        <div className="slide-stepper">
          <button
            className="button small"
            disabled={index === 0}
            onClick={() => visit(index - 1)}
          >
            ← Previous
          </button>
          <span>
            {index + 1} / {referenceSlides.length}
          </span>
          <button
            className="button small"
            disabled={index === referenceSlides.length - 1}
            onClick={() => visit(index + 1)}
          >
            Next →
          </button>
        </div>
      </div>
      <ContextualTerms terms={slideTerms[slide.id]} />
    </div>
  );
}
