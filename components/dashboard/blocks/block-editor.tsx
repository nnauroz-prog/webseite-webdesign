"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState } from "@/lib/actions/states";
import { updateBlockAction } from "@/lib/actions/blocks";
import type {
  CtaBannerBlockData,
  FaqBlockData,
  MapBlockData,
  OpeningHoursBlockData,
  PageBlockRow,
  RichTextBlockData,
  StatsBlockData,
  TestimonialsBlockData,
  VideoBlockData,
} from "@/types/website";

/**
 * Inline editor for a single block. Renders the type-specific form,
 * serializes the resulting data into a hidden JSON field, and submits
 * via updateBlockAction. The action validates the JSON payload
 * server-side against the matching Zod schema.
 */
export function BlockEditor({ block }: { block: PageBlockRow }) {
  const [state, formAction] = useActionState(updateBlockAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={block.id} />
      <FormStatus state={state} />

      {block.type === "faq" ? (
        <FaqEditor data={block.data as FaqBlockData} />
      ) : null}
      {block.type === "testimonials" ? (
        <TestimonialsEditor data={block.data as TestimonialsBlockData} />
      ) : null}
      {block.type === "opening_hours" ? (
        <OpeningHoursEditor data={block.data as OpeningHoursBlockData} />
      ) : null}
      {block.type === "cta_banner" ? (
        <CtaBannerEditor data={block.data as CtaBannerBlockData} />
      ) : null}
      {block.type === "map" ? (
        <MapEditor data={block.data as MapBlockData} />
      ) : null}
      {block.type === "video" ? (
        <VideoEditor data={block.data as VideoBlockData} />
      ) : null}
      {block.type === "stats" ? (
        <StatsEditor data={block.data as StatsBlockData} />
      ) : null}
      {block.type === "rich_text" ? (
        <RichTextEditor data={block.data as RichTextBlockData} />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={block.is_published}
            value="true"
            className="h-4 w-4"
          />
          <span>Veröffentlicht</span>
        </label>
        <SubmitButton label="Block speichern" />
      </div>
      <FieldError message={state.fieldErrors?.data} />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ editor                                                        */
/* ------------------------------------------------------------------ */

function FaqEditor({ data }: { data: FaqBlockData }) {
  const initial = data?.items?.length
    ? data.items
    : [{ question: "", answer: "" }];
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState(data?.title ?? "");

  const payload = JSON.stringify({ title, items });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="faq-title">Block-Titel (optional)</Label>
        <Input
          id="faq-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Häufige Fragen"
          maxLength={120}
        />
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="bg-secondary/30 space-y-2 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">
                Frage {i + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={items.length === 1}
                onClick={() =>
                  setItems((s) => s.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={it.question}
              onChange={(e) =>
                setItems((s) =>
                  s.map((x, j) =>
                    j === i ? { ...x, question: e.target.value } : x,
                  ),
                )
              }
              placeholder="Frage"
              maxLength={200}
              required
            />
            <Textarea
              value={it.answer}
              onChange={(e) =>
                setItems((s) =>
                  s.map((x, j) =>
                    j === i ? { ...x, answer: e.target.value } : x,
                  ),
                )
              }
              placeholder="Antwort"
              maxLength={2000}
              rows={3}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length >= 20}
          onClick={() =>
            setItems((s) => [...s, { question: "", answer: "" }])
          }
        >
          <Plus className="mr-1 h-4 w-4" />
          Frage hinzufügen
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials editor                                               */
/* ------------------------------------------------------------------ */

function TestimonialsEditor({ data }: { data: TestimonialsBlockData }) {
  const initial = data?.items?.length
    ? data.items
    : [{ name: "", role: "", quote: "" }];
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState(data?.title ?? "");

  const payload = JSON.stringify({ title, items });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="t-title">Block-Titel (optional)</Label>
        <Input
          id="t-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Was unsere Kund:innen sagen"
          maxLength={120}
        />
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="bg-secondary/30 space-y-2 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">
                Stimme {i + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={items.length === 1}
                onClick={() =>
                  setItems((s) => s.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                value={it.name}
                onChange={(e) =>
                  setItems((s) =>
                    s.map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
                placeholder="Name"
                maxLength={120}
                required
              />
              <Input
                value={it.role ?? ""}
                onChange={(e) =>
                  setItems((s) =>
                    s.map((x, j) =>
                      j === i ? { ...x, role: e.target.value } : x,
                    ),
                  )
                }
                placeholder="Rolle (optional)"
                maxLength={120}
              />
            </div>
            <Textarea
              value={it.quote}
              onChange={(e) =>
                setItems((s) =>
                  s.map((x, j) =>
                    j === i ? { ...x, quote: e.target.value } : x,
                  ),
                )
              }
              placeholder="Zitat"
              maxLength={800}
              rows={3}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length >= 12}
          onClick={() =>
            setItems((s) => [...s, { name: "", role: "", quote: "" }])
          }
        >
          <Plus className="mr-1 h-4 w-4" />
          Stimme hinzufügen
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Opening hours editor                                              */
/* ------------------------------------------------------------------ */

function OpeningHoursEditor({ data }: { data: OpeningHoursBlockData }) {
  const [title, setTitle] = useState(data?.title ?? "Öffnungszeiten");
  const [text, setText] = useState(data?.text ?? "");

  const payload = JSON.stringify({ title, text });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="oh-title">Titel</Label>
        <Input
          id="oh-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="oh-text">Zeiten (eine Zeile pro Eintrag)</Label>
        <Textarea
          id="oh-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder={"Mo–Fr: 9:00–18:00 Uhr\nSa: 10:00–14:00 Uhr\nSonntag geschlossen"}
          required
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA banner editor                                                 */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Map editor                                                        */
/* ------------------------------------------------------------------ */

function MapEditor({ data }: { data: MapBlockData }) {
  const [title, setTitle] = useState(data?.title ?? "So finden Sie uns");
  const [address, setAddress] = useState(data?.address ?? "");

  const payload = JSON.stringify({ title, address });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="map-title">Titel (optional)</Label>
        <Input
          id="map-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="map-address">Adresse</Label>
        <Textarea
          id="map-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Musterstraße 1, 10115 Berlin"
          required
        />
        <p className="text-muted-foreground text-xs">
          Wird per Google Maps direkt eingebettet — kein API-Key nötig.
        </p>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Video editor                                                      */
/* ------------------------------------------------------------------ */

function VideoEditor({ data }: { data: VideoBlockData }) {
  const [title, setTitle] = useState(data?.title ?? "");
  const [url, setUrl] = useState(data?.url ?? "");
  const [caption, setCaption] = useState(data?.caption ?? "");

  const payload = JSON.stringify({ title, url, caption });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="vid-title">Titel (optional)</Label>
        <Input
          id="vid-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vid-url">YouTube- oder Vimeo-Link</Label>
        <Input
          id="vid-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={2000}
          placeholder="https://www.youtube.com/watch?v=…"
          required
          className="font-mono text-xs"
        />
        <p className="text-muted-foreground text-xs">
          Standard-Share-Link reicht — wir machen daraus automatisch ein Embed.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vid-caption">Bildunterschrift (optional)</Label>
        <Input
          id="vid-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={400}
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats editor                                                      */
/* ------------------------------------------------------------------ */

function StatsEditor({ data }: { data: StatsBlockData }) {
  const initial = data?.items?.length
    ? data.items
    : [{ value: "", label: "" }];
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState(data?.title ?? "");

  const payload = JSON.stringify({ title, items });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="stats-title">Block-Titel (optional)</Label>
        <Input
          id="stats-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="bg-secondary/30 grid gap-2 rounded-lg p-3 sm:grid-cols-[120px_1fr_auto]"
          >
            <Input
              value={it.value}
              onChange={(e) =>
                setItems((s) =>
                  s.map((x, j) =>
                    j === i ? { ...x, value: e.target.value } : x,
                  ),
                )
              }
              placeholder="20+"
              maxLength={40}
              className="font-mono"
              required
            />
            <Input
              value={it.label}
              onChange={(e) =>
                setItems((s) =>
                  s.map((x, j) =>
                    j === i ? { ...x, label: e.target.value } : x,
                  ),
                )
              }
              placeholder="Jahre Erfahrung"
              maxLength={120}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={items.length === 1}
              onClick={() =>
                setItems((s) => s.filter((_, j) => j !== i))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length >= 8}
          onClick={() =>
            setItems((s) => [...s, { value: "", label: "" }])
          }
        >
          <Plus className="mr-1 h-4 w-4" />
          Kennzahl hinzufügen
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Rich text editor                                                  */
/* ------------------------------------------------------------------ */

function RichTextEditor({ data }: { data: RichTextBlockData }) {
  const [title, setTitle] = useState(data?.title ?? "");
  const [body, setBody] = useState(data?.body ?? "");

  const payload = JSON.stringify({ title, body });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="rt-title">Überschrift (optional)</Label>
        <Input
          id="rt-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={160}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rt-body">Text</Label>
        <Textarea
          id="rt-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          maxLength={8000}
          placeholder="Eine Leerzeile beginnt einen neuen Absatz."
          required
        />
      </div>
    </>
  );
}

function CtaBannerEditor({ data }: { data: CtaBannerBlockData }) {
  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [subtitle, setSubtitle] = useState(data?.subtitle ?? "");
  const [buttonLabel, setButtonLabel] = useState(data?.button_label ?? "");
  const [buttonHref, setButtonHref] = useState(data?.button_href ?? "");

  const payload = JSON.stringify({
    headline,
    subtitle,
    button_label: buttonLabel,
    button_href: buttonHref,
  });

  return (
    <>
      <input type="hidden" name="data" value={payload} />
      <div className="space-y-2">
        <Label htmlFor="cta-headline">Überschrift</Label>
        <Input
          id="cta-headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          maxLength={160}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cta-subtitle">Unterzeile (optional)</Label>
        <Textarea
          id="cta-subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          maxLength={400}
          rows={2}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cta-label">Button-Text</Label>
          <Input
            id="cta-label"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-href">Ziel-Link</Label>
          <Input
            id="cta-href"
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            placeholder="#kontakt oder https://..."
            maxLength={2000}
            required
            className="font-mono text-xs"
          />
        </div>
      </div>
    </>
  );
}
