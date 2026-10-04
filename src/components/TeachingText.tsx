import type { ReactNode } from "react";
import { glossaryTerms } from "../data/glossaryTerms";
import TeachingTerm from "./GlossaryTerm";
export { default as TeachingTerm } from "./GlossaryTerm";

export default function TeachingText({ text }: { text: string }) {
  // Match whole terms, not "action" inside "interaction" or a variable name.
  const findTerm = (phrase: string, from: number) => {
    let index = text.indexOf(phrase, from);
    while (index >= 0) {
      const before = text[index - 1] || "";
      const after = text[index + phrase.length] || "";
      if (!/[\p{L}\p{N}_$]/u.test(before) && !/[\p{L}\p{N}_$]/u.test(after)) return index;
      index = text.indexOf(phrase, index + 1);
    }
    return -1;
  };
  const parts: ReactNode[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const next = glossaryTerms
      .flatMap(term => [term.phrase, ...(term.aliases || [])].map(phrase => ({ term, phrase, index: findTerm(phrase, cursor) })))
      .filter(match => match.index >= 0)
      .sort((a, b) => a.index - b.index || b.phrase.length - a.phrase.length)[0];
    if (!next) {
      parts.push(text.slice(cursor));
      break;
    }
    parts.push(text.slice(cursor, next.index));
    parts.push(<TeachingTerm key={next.index} term={next.term} phrase={next.phrase} />);
    cursor = next.index + next.phrase.length;
  }
  return <>{parts}</>;
}
