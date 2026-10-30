import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/login/login-form";
import { getAdminEmail } from "@/lib/admin/auth";
import { adminConfigured } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  if (await getAdminEmail()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm pt-8 sm:pt-16">
      <h1 className="text-2xl font-semibold tracking-tight">Anmelden</h1>
      <p className="text-muted-foreground mt-2 text-[15px]">
        Zugang zur Anfragen-Verwaltung.
      </p>
      <div className="mt-8">
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <div className="border-border bg-card rounded-2xl border p-5 text-[14px] leading-relaxed">
            <p className="font-medium">Noch nicht eingerichtet.</p>
            <p className="text-muted-foreground mt-2">
              In Vercel fehlen die Variablen{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> oder{" "}
              <code>ADMIN_EMAILS</code>. Anleitung steht in{" "}
              <code>.env.example</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
