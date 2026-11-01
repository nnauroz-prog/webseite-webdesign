import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";
import { ANGEBOT_KONTAKT } from "@/lib/admin/angebote";
import { cn } from "@/lib/utils";

import styles from "./angebot.module.css";

/**
 * Unbekannter oder unvollständiger Angebots-Link (auch: Entwurf ohne
 * Anmeldung). Ruhig und ohne Marketing, mit Kontakt. Titel und
 * noindex kommen aus generateMetadata der Seite (404 setzt Next
 * zusätzlich auf noindex).
 */
export default function AngebotNichtGefunden() {
  return (
    <div className={cn(styles.seite, "bg-background flex min-h-dvh flex-col")}>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[40rem] flex-1 px-4 py-12 sm:px-6 sm:py-20"
      >
        <SitaloLogo size="md" />
        <p className="label-mono text-muted-foreground mt-12">Angebot</p>
        <h1 className="mt-3 text-[1.7rem] leading-[1.1] tracking-[-0.025em] text-balance sm:text-[2.2rem]">
          Zu diesem Link finden wir kein Angebot.
        </h1>
        <p className="text-muted-foreground mt-4 text-[16px] leading-relaxed">
          Prüfen Sie bitte, ob der Link vollständig ist. In manchen Mails wird
          er umgebrochen, dann fehlt am Ende ein Stück. Oder rufen Sie uns an,
          wir schicken Ihnen den Link gern noch einmal.
        </p>
        <div className="mt-7 grid gap-3 sm:flex">
          <a href={ANGEBOT_KONTAKT.telHref} className="btn-signal">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {ANGEBOT_KONTAKT.telefon}
          </a>
          <a href={`mailto:${ANGEBOT_KONTAKT.email}`} className="btn-line">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {ANGEBOT_KONTAKT.email}
          </a>
        </div>
        <p className="text-muted-foreground mt-10 text-[14px]">
          <Link
            href="/"
            className="hover:text-foreground underline underline-offset-4"
          >
            Zur Startseite von Sitalo Webdesign
          </Link>
        </p>
      </main>
    </div>
  );
}
