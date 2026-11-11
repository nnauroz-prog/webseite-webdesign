import Link from "next/link";

import { BRANCHEN, type Branche } from "@/lib/branchen-data";

/**
 * Laufband der Startseite: die Branchen mit Musterseite als sehr großes
 * Schriftband in zwei Zeilen, die gegeneinander laufen und sich beim
 * Scrollen zusätzlich verschieben. Jede Bezeichnung ist ein Link auf
 * /branchen/[slug]. Styles in app/effekte-band.css.
 *
 * Ohne Bewegung (reduzierte Bewegung, kein JavaScript, ältere Browser)
 * und sobald die Tastatur im Band steht, ist es eine normale,
 * umbrechende Linkliste. Die zweite Kopie je Zeile gibt es nur für die
 * Schleife: aria-hidden, nicht per Tastatur erreichbar, ohne Vorabruf.
 */
export function Laufband() {
  const haelfte = Math.ceil(BRANCHEN.length / 2);
  const zeilen = [BRANCHEN.slice(0, haelfte), BRANCHEN.slice(haelfte)];
  return (
    <div className="laufband" data-ein="">
      <div className="laufband-wellen" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="inhalt">
        <p className="kennzeile-mono laufband-marke">
          Für diese Branchen bauen wir
        </p>
      </div>
      <nav aria-label="Branchen" className="laufband-nav">
        {zeilen.map((zeile) => (
          <div key={zeile[0]?.slug} className="laufband-zeile">
            <div className="laufband-spur">
              <Gruppe branchen={zeile} />
              <Gruppe branchen={zeile} kopie />
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function Gruppe({
  branchen,
  kopie = false,
}: {
  branchen: Branche[];
  kopie?: boolean;
}) {
  return (
    <ul
      role="list"
      className={kopie ? "laufband-gruppe laufband-kopie" : "laufband-gruppe"}
      aria-hidden={kopie ? true : undefined}
    >
      {branchen.map((b) => (
        <li key={b.slug}>
          <Link
            href={`/branchen/${b.slug}`}
            tabIndex={kopie ? -1 : undefined}
            prefetch={kopie ? false : undefined}
          >
            {b.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
