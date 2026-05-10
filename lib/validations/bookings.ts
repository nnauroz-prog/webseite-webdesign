import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/** ISO date `YYYY-MM-DD` from `<input type="date">`. */
const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte ein gültiges Datum wählen.")
  .refine(
    (s) => {
      const d = new Date(`${s}T00:00:00`);
      if (Number.isNaN(d.getTime())) return false;
      // Don't accept dates more than 1 day in the past — accommodates
      // timezone slop without letting people book yesterday.
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);
      return d >= yesterday;
    },
    { message: "Termin muss in der Zukunft liegen." },
  );

/** ISO time `HH:MM` from `<input type="time">`. Optional. */
const isoTimeSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Bitte eine gültige Uhrzeit wählen.")
  .optional()
  .or(z.literal(""));

export const submitBookingSchema = z.object({
  slug: z.string().trim().min(1).max(63),
  customer_name: z
    .string()
    .trim()
    .min(2, "Bitte gib deinen Namen an.")
    .max(120, "Maximal 120 Zeichen."),
  customer_email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ungültige E-Mail-Adresse."),
  customer_phone: z.preprocess(
    emptyToUndef,
    z.string().trim().max(40).optional(),
  ),
  // Optional service-id (uuid). Customer may pick from a dropdown or skip.
  service_id: z.preprocess(emptyToUndef, z.string().uuid().optional()),
  preferred_date: isoDateSchema,
  preferred_time: isoTimeSchema,
  message: z.preprocess(
    emptyToUndef,
    z.string().trim().max(4000).optional(),
  ),
});
export type SubmitBookingInput = z.infer<typeof submitBookingSchema>;

export const bookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "new",
    "confirmed",
    "declined",
    "cancelled",
    "completed",
  ]),
});
