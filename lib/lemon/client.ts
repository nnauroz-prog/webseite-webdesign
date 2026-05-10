/**
 * Minimal Lemon Squeezy API client. We only call a handful of endpoints
 * (checkout creation, webhook signature verification) so we use plain
 * fetch instead of pulling in @lemonsqueezy/lemonsqueezy.js.
 *
 * https://docs.lemonsqueezy.com/api
 */

const API_BASE = "https://api.lemonsqueezy.com/v1";

export type LemonCheckoutInput = {
  storeId: string;
  variantId: string;
  email: string;
  /** Maps a Supabase user.id back from the webhook to our DB row. */
  customData: Record<string, string>;
  redirectUrl: string;
  receiptButtonText?: string;
  receiptLinkUrl?: string;
};

export async function createLemonCheckout(
  input: LemonCheckoutInput,
): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set.");
  }

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: input.email,
          custom: input.customData,
        },
        product_options: {
          redirect_url: input.redirectUrl,
          receipt_button_text: input.receiptButtonText ?? "Zum Dashboard",
          receipt_link_url: input.receiptLinkUrl,
        },
      },
      relationships: {
        store: { data: { type: "stores", id: input.storeId } },
        variant: { data: { type: "variants", id: input.variantId } },
      },
    },
  };

  const res = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Lemon Squeezy checkout failed (${res.status}): ${text.slice(0, 500)}`,
    );
  }

  const json = (await res.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("Lemon Squeezy did not return a checkout URL.");
  return url;
}
