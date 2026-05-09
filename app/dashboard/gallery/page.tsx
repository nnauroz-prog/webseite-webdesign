import type { Metadata } from "next";

import { GalleryGrid } from "@/components/dashboard/gallery/gallery-grid";
import { GalleryUploader } from "@/components/dashboard/gallery/gallery-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { GalleryImageRow } from "@/types/website";

export const metadata: Metadata = { title: "Galerie" };

export default async function GalleryPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: false });

  const images = (data as GalleryImageRow[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Galerie</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bilder für den Galerie-Bereich deiner Website. Maximal 4 MB pro Datei.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neues Bild hochladen</CardTitle>
          <CardDescription>JPG, PNG, WebP oder AVIF.</CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryUploader />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-base font-medium">Bilder ({images.length})</h2>
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
