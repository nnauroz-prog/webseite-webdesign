/** Login lädt kurz (Sitzung prüfen): kein Listen-Platzhalter. */
export default function LoginLoading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-sm pt-8 sm:pt-16">
      <span className="sr-only">Lädt …</span>
    </div>
  );
}
