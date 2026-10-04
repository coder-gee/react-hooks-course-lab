import { glossaryTerms } from "../data/glossaryTerms";
import { teachingTerminology } from "../data/teachingTerminology";
import { referenceSlides } from "../data/referenceSlides";
import { TeachingTerm } from "./TeachingText";
import "./teaching-guide.css";
import "./stage-terminology.css";

const termsByName = new Map(glossaryTerms.map(term => [term.phrase, term]));

export default function StageTerminology({ stageId }: { stageId: string }) {
  const groups = teachingTerminology[stageId];
  if (!groups?.length) return null;
  return (
    <section className="stage-terminology" aria-label="Terms to bring up">
      <h3>Terms to bring up <span>· hover or tap for a refresher</span></h3>
      <ul>
        {groups.map((group, index) => (
          <li key={index}>
            {group.slide ? (
              <a className="stage-term-location" href={`/slides?topic=${group.slide}`} target="_blank" rel="noopener noreferrer">
                Slide {referenceSlides.findIndex(slide => slide.id === group.slide) + 1}
              </a>
            ) : <span className="stage-term-location">{group.label}</span>}
            <span className="stage-term-list">
              {group.terms.map(name => (
                <span key={name}><TeachingTerm term={termsByName.get(name)!} /></span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
