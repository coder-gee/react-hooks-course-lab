import { useEffect, useId, useRef } from "react";
import type { GlossaryTermDefinition } from "../data/glossaryTerms";
import "./glossary-term.css";

export default function GlossaryTerm({ term, phrase = term.phrase }: { term: GlossaryTermDefinition; phrase?: string }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const close = () => tooltip.current?.hidePopover();
  const positionTooltip = () => {
    const button = trigger.current;
    const tip = tooltip.current;
    if (!button || !tip?.matches(":popover-open")) return;
    const anchor = button.getBoundingClientRect();
    if (anchor.bottom <= 0 || anchor.top >= window.innerHeight) {
      tip.hidePopover();
      return;
    }
    const bounds = tip.getBoundingClientRect();
    const gap = 8;
    const inset = 12;
    const left = Math.max(inset, Math.min(anchor.left, window.innerWidth - bounds.width - inset));
    const top = anchor.bottom + gap + bounds.height <= window.innerHeight - inset
      ? anchor.bottom + gap
      : Math.max(inset, anchor.top - bounds.height - gap);
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };
  const show = () => {
    cancelClose();
    tooltip.current?.showPopover();
    positionTooltip();
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (document.activeElement !== trigger.current &&
          !trigger.current?.matches(":hover") && !tooltip.current?.matches(":hover")) close();
    }, 150);
  };

  useEffect(() => {
    const repositionOnScroll = (event: Event) => {
      if (event.target !== tooltip.current) positionTooltip();
    };
    window.addEventListener("scroll", repositionOnScroll, true);
    window.addEventListener("resize", positionTooltip);
    return () => {
      clearTimeout(closeTimer.current);
      window.removeEventListener("scroll", repositionOnScroll, true);
      window.removeEventListener("resize", positionTooltip);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="glossary-term-trigger"
        ref={trigger}
        aria-describedby={id}
        onMouseEnter={show}
        onMouseLeave={scheduleClose}
        onFocus={show}
        onBlur={scheduleClose}
        onClick={show}
      >
        {phrase}
      </button>
      <span
        ref={tooltip}
        id={id}
        role="tooltip"
        popover="auto"
        className="glossary-term-tooltip"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <strong>{term.title}</strong>
        {term.explanation}
        {term.code && <>
          {term.codeNote && <span className="glossary-term-code-note">{term.codeNote}</span>}
          <code>{term.code}</code>
        </>}
      </span>
    </>
  );
}

