import { SitaloSignatur } from "./sitalo-signatur";
import s from "./notiz.module.css";

/**
 * Notiz aus dem Büro: ein reiner Text-Moment ohne Karte und ohne Knopf.
 * Linierte Fläche aus Haarlinien, Mono-Kopf mit Ort und Wochentag, ein
 * Satz in Mona Sans, darunter die Signatur als Strich.
 *
 * Der Wochentag kommt vom Server (die Seite rendert ohnehin regelmäßig
 * neu); er steht nur im Kopf und ist für niemanden kritisch.
 */
const WOCHENTAG = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "long" });

export function Notiz({ children, id }: { children: React.ReactNode; id?: string }) {
  const tag = WOCHENTAG.format(new Date());
  return (
    <section id={id} aria-label="Notiz aus dem Büro" className={s.abschnitt}>
      <div className={`inhalt ${s.raster}`}>
        <div className={s.blatt}>
          <p className={s.kopf}>
            <span>Notiz</span>
            <span aria-hidden="true">·</span>
            <span>Hamburg, {tag}</span>
          </p>
          <p className={s.satz}>{children}</p>
          <SitaloSignatur className={s.signatur} />
        </div>
      </div>
    </section>
  );
}
