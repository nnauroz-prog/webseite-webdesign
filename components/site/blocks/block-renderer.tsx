import type {
  CtaBannerBlockData,
  FaqBlockData,
  ImageTextSplitBlockData,
  LogoCloudBlockData,
  MapBlockData,
  OpeningHoursBlockData,
  PageBlockRow,
  PricingTableBlockData,
  RichTextBlockData,
  StatsBlockData,
  StepsBlockData,
  TestimonialsBlockData,
  VideoBlockData,
} from "@/types/website";

import { BlockCtaBanner } from "./block-cta-banner";
import { BlockFaq } from "./block-faq";
import { BlockImageTextSplit } from "./block-image-text-split";
import { BlockLogoCloud } from "./block-logo-cloud";
import { BlockMap } from "./block-map";
import { BlockOpeningHours } from "./block-opening-hours";
import { BlockPricingTable } from "./block-pricing-table";
import { BlockRichText } from "./block-rich-text";
import { BlockStats } from "./block-stats";
import { BlockSteps } from "./block-steps";
import { BlockTestimonials } from "./block-testimonials";
import { BlockVideo } from "./block-video";

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
    case "map":
      return <BlockMap data={block.data as MapBlockData} />;
    case "video":
      return <BlockVideo data={block.data as VideoBlockData} />;
    case "stats":
      return <BlockStats data={block.data as StatsBlockData} />;
    case "rich_text":
      return <BlockRichText data={block.data as RichTextBlockData} />;
    case "pricing_table":
      return (
        <BlockPricingTable data={block.data as PricingTableBlockData} />
      );
    case "steps":
      return <BlockSteps data={block.data as StepsBlockData} />;
    case "image_text_split":
      return (
        <BlockImageTextSplit data={block.data as ImageTextSplitBlockData} />
      );
    case "logo_cloud":
      return <BlockLogoCloud data={block.data as LogoCloudBlockData} />;
    default:
      return null;
  }
}
