import Image from "next/image";

/**
 * Hero visual — real product photograph of a Sitalo-built customer site
 * on a laptop. Framed with a soft gold halo and a deep, soft shadow so
 * it reads as a polished product image, not a UI screenshot.
 */
export function HeroMockups() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        aria-hidden="true"
        className="bg-gold/20 absolute -inset-10 -z-10 rounded-[3rem] blur-[80px]"
      />
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgb(0_0_0/0.35),0_12px_24px_-6px_rgb(0_0_0/0.18)] ring-1 ring-black/5">
        <Image
          src="/images/sitalo-laptop-hero.png"
          alt="Sitalo Webdesign — Laptop mit einer fertigen Kunden-Website auf einem warmen Holzschreibtisch."
          fill
          priority
          sizes="(min-width: 1024px) 640px, (min-width: 640px) 80vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
