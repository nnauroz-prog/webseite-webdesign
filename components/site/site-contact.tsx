import { Mail, MapPin, Phone, Clock } from "lucide-react";

import { PreviewFormNotice } from "@/components/site/preview-form-notice";
import { SiteContactForm } from "@/components/site/site-contact-form";
import type { WebsiteRow } from "@/types/website";

/**
 * Contact — Apple-grade two-column with refined info-rail on the left
 * and a card-style form on the right. Generous whitespace, larger
 * type, hairline icons, premium card chrome.
 */
export function SiteContact({
  website,
  isPreview,
}: {
  website: WebsiteRow;
  isPreview: boolean;
}) {
  const phone = website.phone?.trim();
  const email = website.email?.trim();
  const address = website.address?.trim();
  const hours = website.opening_hours?.text?.trim();

  if (!phone && !email && !address && !hours && !website.contact_form_enabled) {
    return null;
  }

  return (
    <section
      id="kontakt"
      className="border-border/60 border-b py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
            Kontakt
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            Schreiben Sie uns
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-pretty">
            Wir antworten in der Regel innerhalb eines Werktages.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <dl className="space-y-7">
            {phone ? (
              <ContactRow icon={<Phone className="h-4 w-4" />} label="Telefon">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:underline"
                >
                  {phone}
                </a>
              </ContactRow>
            ) : null}
            {email ? (
              <ContactRow icon={<Mail className="h-4 w-4" />} label="E-Mail">
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </ContactRow>
            ) : null}
            {address ? (
              <ContactRow icon={<MapPin className="h-4 w-4" />} label="Adresse">
                <span className="whitespace-pre-line">{address}</span>
              </ContactRow>
            ) : null}
            {hours ? (
              <ContactRow
                icon={<Clock className="h-4 w-4" />}
                label="Öffnungszeiten"
              >
                <span className="whitespace-pre-line">{hours}</span>
              </ContactRow>
            ) : null}
          </dl>

          {website.contact_form_enabled ? (
            <div className="bg-card ring-border/50 rounded-3xl border p-8 shadow-xl ring-1 sm:p-10">
              <h3 className="text-2xl font-semibold tracking-tight">
                Nachricht senden
              </h3>
              <p className="text-muted-foreground mt-2 mb-7 text-sm">
                Beschreiben Sie kurz Ihr Anliegen — wir melden uns zurück.
              </p>
              {isPreview ? (
                <PreviewFormNotice formLabel="Anfragen" />
              ) : (
                <SiteContactForm slug={website.slug} />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <div>
        <dt className="text-muted-foreground text-[10px] font-medium tracking-[0.2em] uppercase">
          {label}
        </dt>
        <dd className="text-foreground/90 mt-1 text-[15px] leading-relaxed">
          {children}
        </dd>
      </div>
    </div>
  );
}
