import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const submitLeadSchema = z.object({
  slug: z.string().trim().min(1).max(63),
  name: z
    .string()
    .trim()
    .min(2, "Bitte gib deinen Namen an.")
    .max(120, "Maximal 120 Zeichen."),
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse."),
  phone: z.preprocess(emptyToUndef, z.string().trim().max(40).optional()),
  message: z
    .string()
    .trim()
    .min(10, "Bitte schreibe mindestens 10 Zeichen.")
    .max(4000, "Maximal 4000 Zeichen."),
});
export type SubmitLeadInput = z.infer<typeof submitLeadSchema>;

export const leadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed"]),
});
