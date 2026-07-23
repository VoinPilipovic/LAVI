import { z } from "zod";

/**
 * Shared by the admin login form (React Hook Form resolver) and
 * auth.actions.ts (server-side re-validation) — one definition, both
 * sides trust it.
 */
export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
