"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, RotateCw, Smartphone, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Viewport = "desktop" | "mobile";

const SIZES: Record<Viewport, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  mobile: { width: "390px", label: "Mobile" },
};

/**
 * Iframe-based live preview panel. Loads /site/[slug] inside an iframe
 * and exposes a refresh + viewport toggle. The iframe is reloaded after
 * a save by listening for `sitepilot:saved` custom events on window —
 * dashboard forms can dispatch this to trigger a refresh.
 */
export function LivePreview({
  slug,
  initialViewport = "desktop",
}: {
  slug: string;
  initialViewport?: Viewport;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const [bust, setBust] = useState(0);

  function refresh() {
    setBust((n) => n + 1);
  }

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("sitepilot:saved", handler);
    return () => window.removeEventListener("sitepilot:saved", handler);
  }, []);

  // A polling refresh every 3s ensures recently-saved server-action edits
  // surface in the iframe even if a form forgot to dispatch the event.
  useEffect(() => {
    const id = setInterval(refresh, 6000);
    return () => clearInterval(id);
  }, []);

  const src = `/site/${slug}?preview=1&t=${bust}`;
  const publicHref = `/site/${slug}`;

  return (
    <div className="bg-card sticky top-4 flex flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={viewport === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewport("desktop")}
            aria-label="Desktop-Vorschau"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={viewport === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewport("mobile")}
            aria-label="Mobile Vorschau"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-muted-foreground text-xs">
          {SIZES[viewport].label} · /site/{slug}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={refresh}
            aria-label="Vorschau aktualisieren"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button asChild type="button" variant="ghost" size="sm">
            <a
              href={publicHref}
              target="_blank"
              rel="noreferrer"
              aria-label="In neuem Tab öffnen"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <div className="bg-muted/30 flex justify-center overflow-y-auto p-4">
        <div
          className="bg-background overflow-hidden rounded-lg shadow-sm transition-all"
          style={{
            width: SIZES[viewport].width,
            maxWidth: "100%",
            height: "70vh",
          }}
        >
          <iframe
            ref={iframeRef}
            src={src}
            title="Vorschau"
            className={cn("h-full w-full border-0")}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
