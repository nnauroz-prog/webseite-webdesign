import { Fragment } from "react";

import { cn } from "@/lib/utils";

/**
 * Headline-Wrapper, der seinen Inhalt Wort für Wort einblendet.
 *
 * Erwartet als Kinder einen ReactNode-Mix aus Strings und Spans —
 * Strings werden in einzelne Wörter zerlegt, Spans bleiben als
 * eine Einheit (für serif-italic-Akzente). Jedes Wort/jeder Span
 * bekommt ein gestaffeltes `--word-delay` und fadet sequentiell rein.
 *
 * Pure CSS-Animation via `.reveal-word` (definiert in globals.css).
 * Auf prefers-reduced-motion: alles sofort sichtbar.
 */
type WordReveal = {
  children: React.ReactNode;
  /** Versatz zwischen den Wörtern in ms. Default 70. */
  step?: number;
  /** Initial-Delay vor dem ersten Wort. Default 0. */
  delay?: number;
  className?: string;
};

export function WordReveal({
  children,
  step = 70,
  delay = 0,
  className,
}: WordReveal) {
  let wordIndex = 0;

  function wrapWords(node: React.ReactNode): React.ReactNode {
    if (typeof node === "string") {
      // String in Wörter splitten — Whitespaces bleiben als
      // eigene Knoten erhalten, damit die Inline-Flussbreite stimmt.
      const tokens = node.split(/(\s+)/);
      return tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <Fragment key={i}>{token}</Fragment>;
        if (token === "") return null;
        const idx = wordIndex++;
        return (
          <span
            key={i}
            className="reveal-word inline-block"
            style={
              { "--word-delay": `${delay + idx * step}ms` } as React.CSSProperties
            }
          >
            {token}
          </span>
        );
      });
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <Fragment key={i}>{wrapWords(child)}</Fragment>
      ));
    }
    if (typeof node === "object" && node !== null && "props" in node) {
      // Element — wenn es eigene Kinder hat, rekursiv. Aber das Element
      // selbst bleibt ein einzelnes "Reveal-Token" (gute Strategie für
      // <br /> und <span class="serif-italic">…</span>).
      const element = node as React.ReactElement<{
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }>;
      // <br /> nicht wrappen — der Zeilenumbruch soll instant passieren.
      if (typeof element.type === "string" && element.type === "br") {
        return element;
      }
      // Sonst: ganzes Element als ein Reveal-Word behandeln.
      const idx = wordIndex++;
      const existingStyle = element.props.style ?? {};
      const Cloned = {
        ...element,
        props: {
          ...element.props,
          className: cn(
            element.props.className,
            "reveal-word inline-block",
          ),
          style: {
            ...existingStyle,
            "--word-delay": `${delay + idx * step}ms`,
          } as React.CSSProperties,
        },
      } as React.ReactElement;
      return Cloned;
    }
    return node;
  }

  return <span className={className}>{wrapWords(children)}</span>;
}
