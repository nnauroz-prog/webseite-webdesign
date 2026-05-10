"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageIcon, Search } from "lucide-react";

import { FormStatus } from "@/components/dashboard/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { pickUnsplashPhotoAction } from "@/lib/actions/unsplash";

type StockKind = "hero" | "about" | "gallery";

type Photo = {
  id: string;
  description: string | null;
  thumb_url: string;
  full_url: string;
  link_html: string;
  photographer_name: string;
  photographer_url: string;
  download_location: string;
  width: number;
  height: number;
};

type SearchResponse =
  | { ok: true; photos: Photo[] }
  | { ok: false; configured: false; message: string }
  | { ok: false; configured: true; message: string };

/**
 * Collapsible "Stock-Foto wählen" panel embedded in image upload forms.
 *
 * Default: a single button. On expand:
 *   - Search field (debounced)
 *   - Grid of Unsplash thumbnails
 *   - Click a thumbnail → posts to the server action which mirrors
 *     the photo into our storage and attaches it to the website.
 *
 * Picks the orientation hint that matches the image slot (hero +
 * gallery → landscape, about → squarish) to surface relevant results.
 */
export function StockPhotoButton({
  kind,
  defaultQuery,
}: {
  kind: StockKind;
  defaultQuery: string;
}) {
  const [state, formAction] = useActionState(
    pickUnsplashPhotoAction,
    initialState,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(defaultQuery);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchState, setSearchState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "ready" }
  >({ kind: "idle" });

  // Debounce search input + run when the panel opens. All setState calls
  // are deferred into the timer callback to avoid synchronous-in-effect
  // cascading renders.
  const inflight = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const timer = setTimeout(async () => {
      if (!q) {
        setPhotos([]);
        setSearchState({ kind: "idle" });
        return;
      }
      inflight.current?.abort();
      const ctrl = new AbortController();
      inflight.current = ctrl;
      setSearchState({ kind: "loading" });
      try {
        const orientation = kind === "about" ? "squarish" : "landscape";
        const url = `/api/unsplash/search?q=${encodeURIComponent(q)}&orientation=${orientation}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const json = (await res.json()) as SearchResponse;
        if (!json.ok) {
          setSearchState({ kind: "error", message: json.message });
          setPhotos([]);
          return;
        }
        setPhotos(json.photos);
        setSearchState({ kind: "ready" });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSearchState({
          kind: "error",
          message:
            err instanceof Error
              ? `Suche fehlgeschlagen: ${err.message}`
              : "Suche fehlgeschlagen.",
        });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [open, query, kind]);

  if (!open) {
    return (
      <div className="border-border/60 bg-secondary/40 mt-4 rounded-lg border-2 border-dashed p-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-600 to-cyan-700 text-white">
            <ImageIcon className="h-3.5 w-3.5" />
          </span>
          Stock-Foto von Unsplash wählen
        </button>
      </div>
    );
  }

  return (
    <div className="border-primary/40 bg-primary/[0.04] mt-4 rounded-lg border-2 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-600 to-cyan-700 text-white">
            <ImageIcon className="h-3.5 w-3.5" />
          </span>
          Stock-Foto wählen
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Schließen
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`unsplash-q-${kind}`}>Suchbegriff</Label>
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id={`unsplash-q-${kind}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="z.B. Friseur, Praxis, Kaffee, Werkstatt …"
            className="pl-9"
            autoFocus
            spellCheck={false}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Fotos: Unsplash. Frei nutzbar inkl. kommerziell — wir kopieren das
          Bild in deinen Speicher, damit es dauerhaft online bleibt.
        </p>
      </div>

      <div className="mt-3">
        <FormStatus state={state} />
      </div>

      {searchState.kind === "loading" && (
        <p className="text-muted-foreground mt-4 text-sm">Suche läuft …</p>
      )}
      {searchState.kind === "error" && (
        <p className="text-destructive bg-destructive/10 mt-4 rounded-md px-3 py-2 text-sm">
          {searchState.message}
        </p>
      )}
      {searchState.kind === "ready" && photos.length === 0 && (
        <p className="text-muted-foreground mt-4 text-sm">
          Keine Treffer. Probiere einen anderen Begriff.
        </p>
      )}

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((photo) => (
            <PhotoTile key={photo.id} kind={kind} photo={photo} action={formAction} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoTile({
  kind,
  photo,
  action,
}: {
  kind: StockKind;
  photo: Photo;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="contents">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="full_url" value={photo.full_url} />
      <input
        type="hidden"
        name="download_location"
        value={photo.download_location}
      />
      <input
        type="hidden"
        name="photographer_name"
        value={photo.photographer_name}
      />
      <TileButton photo={photo} />
    </form>
  );
}

function TileButton({ photo }: { photo: Photo }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      disabled={pending}
      className="group bg-muted relative aspect-[4/3] h-auto w-full overflow-hidden rounded-md p-0 ring-1 ring-black/5 transition-transform hover:scale-[1.02]"
      title={
        photo.description
          ? `${photo.description} — Foto: ${photo.photographer_name}`
          : `Foto: ${photo.photographer_name}`
      }
    >
      {/* Plain <img> rather than next/image so we don't proxy every
          thumbnail through the optimizer — the picker can show 18
          thumbs at once and they're already tiny. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.thumb_url}
        alt={photo.description ?? ""}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1 text-left text-[10px] text-white">
        {photo.photographer_name}
      </span>
      {pending && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white">
          Importiere …
        </span>
      )}
    </Button>
  );
}
