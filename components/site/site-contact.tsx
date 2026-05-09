import { Mail, MapPin, Phone, Clock } from "lucide-react";

import type { WebsiteRow } from "@/types/website";

export function SiteContact({ website }: { website: WebsiteRow }) {
  const phone = website.phone?.trim();
  const email = website.email?.trim();
  const address = website.address?.trim();
  const hours = website.opening_hours?.text?.trim();

  // Hide section entirely if there's nothing to show.
  if (!phone && !email && !address && !hours && !website.contact_form_enabled) {
    return null;
  }

  return (
    <section id="kontakt" className="border-border/60 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Kontakt
          </h2>
          <p className="text-muted-foreground mt-3">
            Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <dl className="space-y-5 text-sm">
            {phone && (
              <ContactRow icon={<Phone className="h-4 w-4" />} label="Telefon">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:underline"
                >
                  {phone}
                </a>
              </ContactRow>
            )}
            {email && (
              <ContactRow icon={<Mail className="h-4 w-4" />} label="E-Mail">
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </ContactRow>
            )}
            {address && (
              <ContactRow icon={<MapPin className="h-4 w-4" />} label="Adresse">
                <span className="whitespace-pre-line">{address}</span>
              </ContactRow>
            )}
            {hours && (
              <ContactRow
                icon={<Clock className="h-4 w-4" />}
                label="Öffnungszeiten"
              >
                <span className="whitespace-pre-line">{hours}</span>
              </ContactRow>
            )}
          </dl>

          {website.contact_form_enabled && (
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">
                Nachricht senden
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Das Kontaktformular wird in Kürze freigeschaltet.
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                Bis dahin erreichen Sie uns gern telefonisch oder per E-Mail.
              </p>
            </div>
          )}
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
    <div className="flex items-start gap-3">
      <span className="bg-secondary text-secondary-foreground mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <div>
        <dt className="text-muted-foreground text-xs tracking-wide uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 leading-relaxed">{children}</dd>
      </div>
    </div>
  );
}
