import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, "Mindestens 2 Zeichen.").max(120),
  role: z.preprocess(emptyToUndef, z.string().trim().max(120).optional()),
  bio: z.preprocess(emptyToUndef, z.string().trim().max(2000).optional()),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberSchema = createTeamMemberSchema.extend({
  id: z.string().uuid(),
});

export const deleteTeamMemberSchema = z.object({
  id: z.string().uuid(),
});

export const teamImageSchema = z.object({
  member_id: z.string().uuid(),
});
