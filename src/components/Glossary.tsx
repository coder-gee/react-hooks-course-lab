import { glossaryTerms } from "../data/glossaryTerms";
import "./glossary.css";

const sortedTerms = [...glossaryTerms].sort((a, b) => a.phrase.localeCompare(b.phrase));

export default function Glossary() {
  return (
    <article className="glossary-page" aria-label="Glossary">
      <h1>Glossary</h1>
      <p className="glossary-intro">React Hooks terminology, with plain-language explanations and examples.</p>
      <dl className="glossary-terms">
        {sortedTerms.map(term => (
          <div key={term.phrase}>
            <dt>{term.phrase}</dt>
            <dd>
              <p className="glossary-meaning">{term.title}</p>
              <p>{term.explanation}</p>
              {term.code && (
                <div className="glossary-example">
                  <p className="glossary-code-note">{term.codeNote || "Code example"}</p>
                  <pre><code>{term.code}</code></pre>
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
