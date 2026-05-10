"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Image as ImageIcon } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { deleteGalleryImageAction } from "@/lib/actions/gallery";
import type { GalleryImageRow } from "@/types/website";

export function GalleryGrid({ images }: { images: GalleryImageRow[] }) {
  if (images.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        tone="pink"
        title="Noch keine Bilder hochgeladen"
        description="Logo gehört in die Stammdaten — hier kommen Eindrücke deiner Räume, deines Teams oder deiner Arbeit hin. JPG, PNG, WebP, AVIF bis 4 MB."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <GalleryItem key={img.id} image={img} />
      ))}
    </div>
  );
}

function GalleryItem({ image }: { image: GalleryImageRow }) {
  const [pending, start] = useTransition();
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted aspect-square w-full overflow-hidden">
        <Image
          src={image.image_url}
          alt={image.alt_text ?? ""}
          width={400}
          height={400}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
        <span className="text-muted-foreground line-clamp-1">
          {image.alt_text || "Ohne Beschreibung"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (!confirm("Dieses Bild wirklich löschen?")) return;
            const fd = new FormData();
            fd.append("id", image.id);
            start(() => {
              void deleteGalleryImageAction(undefined, fd);
            });
          }}
        >
          {pending ? "…" : "Löschen"}
        </Button>
      </div>
    </div>
  );
}
