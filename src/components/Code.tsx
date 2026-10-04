import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
export default function Code({
  source,
  size = 18,
}: {
  source: string;
  size?: number;
}) {
  const html = Prism.highlight(source, Prism.languages.tsx, "tsx");
  return (
    <pre className="code-block" style={{ fontSize: size }}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
