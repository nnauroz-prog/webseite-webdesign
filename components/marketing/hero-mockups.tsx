import Image from "next/image";

/**
 * Hero visual for the landing — a branded photograph of a laptop
 * displaying a Sitalo-designed customer template, framed by a
 * "SITALO Webdesign" canvas on the wall and a Sitalo-branded coffee
 * mug. Replaces the earlier three-card CSS mockup composition so the
 * hero feels like a real product photograph instead of a
 * design-system preview.
 *
 * The image is rendered through next/image with `priority` so the
 * largest paint above-the-fold doesn't wait on lazy-loading.
 */
export function HeroMockups() {
  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      {/* Soft radial backdrop in the brand's gold-bronze accent */}
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute -inset-6 -z-10 rounded-[3rem] blur-3xl"
      />
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgb(0_0_0/0.35),0_8px_20px_-4px_rgb(0_0_0/0.18)] ring-1 ring-black/10">
        <Image
          src="/images/sitalo-laptop-hero.png"
          alt="Sitalo Webdesign — Laptop mit einer fertigen Kunden-Website auf einem warmen Holzschreibtisch, daneben eine gebrandete Sitalo-Tasse und ein Notizbuch."
          fill
          priority
          sizes="(min-width: 1024px) 600px, (min-width: 640px) 80vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
