/**
 * Floating WhatsApp button for the Sitalo marketing pages. Mirrors
 * the customer-site SiteWhatsappButton but reads its number from
 * NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER (so we don't hard-code the
 * agency's phone number into the bundle).
 *
 * Renders nothing if the env var isn't set — the floating CTA stays
 * hidden until production is properly configured rather than linking
 * to nowhere.
 */
export function MarketingWhatsapp() {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;

  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;

  const message =
    process.env.NEXT_PUBLIC_SITALO_WHATSAPP_MESSAGE?.trim() ||
    "Hallo Sitalo, ich interessiere mich für eine professionelle Website. Können Sie mir ein Angebot machen?";

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Projekt per WhatsApp anfragen"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-xl ring-1 ring-black/10 transition-all duration-200 hover:scale-105 hover:bg-[#1ebe57] hover:shadow-2xl sm:right-6 sm:bottom-6"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <path d="M16.001 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.241.586 4.434 1.7 6.366L3.2 28.8l6.601-1.728a12.79 12.79 0 0 0 6.198 1.577h.002c7.067 0 12.799-5.732 12.799-12.799 0-3.422-1.332-6.638-3.752-9.057a12.726 12.726 0 0 0-9.047-3.593zm0 23.342h-.002a10.591 10.591 0 0 1-5.4-1.479l-.387-.229-4.014 1.051 1.07-3.915-.252-.4a10.587 10.587 0 0 1-1.624-5.668c0-5.866 4.775-10.641 10.641-10.641 2.842 0 5.514 1.108 7.525 3.12a10.557 10.557 0 0 1 3.116 7.527c0 5.866-4.774 10.634-10.673 10.634zm5.834-7.967c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16s-.827 1.04-1.014 1.254c-.187.214-.374.241-.694.08-.32-.16-1.353-.499-2.578-1.591-.953-.85-1.597-1.9-1.784-2.22-.187-.32-.02-.493.14-.652.143-.143.32-.374.48-.561.16-.187.213-.32.32-.534.107-.214.054-.4-.026-.561-.08-.16-.72-1.733-.987-2.373-.26-.622-.524-.538-.72-.548-.187-.01-.4-.012-.614-.012a1.18 1.18 0 0 0-.854.4c-.293.32-1.12 1.094-1.12 2.667 0 1.574 1.147 3.094 1.307 3.307.16.213 2.254 3.44 5.466 4.825.764.329 1.36.526 1.826.674.766.244 1.464.21 2.014.127.615-.092 1.893-.774 2.16-1.521.267-.748.267-1.387.187-1.521-.08-.134-.293-.213-.614-.374z" />
      </svg>
      <span className="hidden sm:inline">Projekt per WhatsApp anfragen</span>
    </a>
  );
}
