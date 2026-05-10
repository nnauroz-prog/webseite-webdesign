import type {
  CtaBannerBlockData,
  FaqBlockData,
  OpeningHoursBlockData,
  PageBlockRow,
  TestimonialsBlockData,
} from "@/types/website";

import { BlockCtaBanner } from "./block-cta-banner";
import { BlockFaq } from "./block-faq";
import { BlockOpeningHours } from "./block-opening-hours";
import { BlockTestimonials } from "./block-testimonials";

/**
 * Render a stack of blocks. Unknown / unpublished blocks are skipped.
 */
export function BlockRenderer({ blocks }: { blocks: PageBlockRow[] }) {
  if (blocks.length === 0) return null;
  return (
    <div className="space-y-0">
      {blocks
        .filter((b) => b.is_published)
        .map((b) => (
          <BlockRow key={b.id} block={b} />
        ))}
    </div>
  );
}

function BlockRow({ block }: { block: PageBlockRow }) {
  switch (block.type) {
    case "faq":
      return <BlockFaq data={block.data as FaqBlockData} />;
    case "testimonials":
      return (
        <BlockTestimonials data={block.data as TestimonialsBlockData} />
      );
    case "opening_hours":
      return (
        <BlockOpeningHours data={block.data as OpeningHoursBlockData} />
      );
    case "cta_banner":
      return <BlockCtaBanner data={block.data as CtaBannerBlockData} />;
    default:
      return null;
  }
}
