import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Mindestens 8 Zeichen.")
  .max(72, "Maximal 72 Zeichen.");

export const registerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Bitte gib deinen Namen an.")
    .max(120, "Name ist zu lang."),
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse."),
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse."),
  password: z.string().min(1, "Passwort ist erforderlich."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse."),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, "Bitte Passwort bestätigen."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwörter stimmen nicht überein.",
  });
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
