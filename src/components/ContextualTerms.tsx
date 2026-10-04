import { glossaryTerms } from "../data/glossaryTerms";
import GlossaryTerm from "./GlossaryTerm";
import "./contextual-terms.css";

const termsByName = new Map(glossaryTerms.map(term => [term.phrase, term]));

export default function ContextualTerms({ terms = [] }: { terms?: string[] }) {
  const definitions = terms.flatMap(name => {
    const term = termsByName.get(name);
    return term ? [term] : [];
  });
  if (!definitions.length) return null;
  return (
    <section className="contextual-terms" aria-label="Related glossary terms">
      <div className="contextual-terms-heading">
        <h2>Key terms <span>· hover or tap for a refresher</span></h2>
        <a href="/glossary" target="_blank" rel="noopener noreferrer">Full glossary ↗</a>
      </div>
      <ul>
        {definitions.map(term => <li key={term.phrase}><GlossaryTerm term={term} /></li>)}
      </ul>
    </section>
  );
}
