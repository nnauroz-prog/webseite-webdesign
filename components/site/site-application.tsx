import { PreviewFormNotice } from "@/components/site/preview-form-notice";
import { SiteApplicationForm } from "@/components/site/site-application-form";
import type { WebsiteRow } from "@/types/website";

export function SiteApplication({
  website,
  isPreview,
}: {
  website: WebsiteRow;
  isPreview: boolean;
}) {
  if (!website.application_form_enabled) return null;

  return (
    <section
      id="bewerbung"
      className="bg-muted/30 border-border/60 border-b py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Bei uns bewerben
          </h2>
          <p className="text-muted-foreground mt-3">
            Wir freuen uns über Initiativbewerbungen und gezielte Anfragen für
            offene Positionen.
          </p>
        </div>
        <div className="mt-8">
          {isPreview ? (
            <PreviewFormNotice formLabel="Bewerbungen" />
          ) : (
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <SiteApplicationForm slug={website.slug} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
