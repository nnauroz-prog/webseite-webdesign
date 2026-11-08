import a from "./atelier.module.css";

/**
 * Klebende Unternavigation für lange Unterseiten (mehr als vier
 * Bildschirme): eine Mono-Textzeile mit Ankern, ohne Preise und ohne
 * Knopf. Server-Komponente, klebt per position: sticky unter der
 * Kopfzeile. Am Handy wischt die Zeile seitlich.
 */
export function Sprungleiste({ links, label = "Auf dieser Seite" }: { links: { href: string; label: string }[]; label?: string }) {
  return (
    <nav aria-label={label} className={a.sprung}>
      <div className="inhalt">
        <ol>
          {links.map((l, i) => (
            <li key={l.href}>
              <a href={l.href}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
