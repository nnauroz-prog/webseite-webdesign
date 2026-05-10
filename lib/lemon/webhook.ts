import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify the X-Signature header on an incoming Lemon Squeezy webhook.
 *
 * Lemon Squeezy signs the raw request body with HMAC-SHA256 using the
 * secret configured on the webhook endpoint, hex-encoded.
 * https://docs.lemonsqueezy.com/help/webhooks/signing-requests
 */
export function verifyLemonSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  let receivedBuf: Buffer;
  try {
    receivedBuf = Buffer.from(signatureHeader, "hex");
  } catch {
    return false;
  }
  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}

/**
 * Subset of the Lemon Squeezy webhook payload we actually care about.
 * The real payload is much richer; we only type the fields the
 * subscription handler reads.
 */
export type LemonSubscriptionEvent = {
  meta: {
    event_name: string;
    custom_data?: Record<string, string>;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      product_id: number;
      variant_id: number;
      status: string;
      cancelled: boolean;
      ends_at: string | null;
      renews_at: string | null;
      user_email: string | null;
    };
  };
};
