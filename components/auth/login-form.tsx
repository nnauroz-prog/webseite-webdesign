"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = (await res.json()) as {
          ok: boolean;
          message?: string;
          fieldErrors?: Record<string, string>;
          redirect?: string;
        };
        if (!body.ok) {
          setState({
            status: "error",
            message: body.message,
            fieldErrors: body.fieldErrors,
          });
          return;
        }
        // Refresh server components first so cookie state is picked up,
        // then navigate.
        router.refresh();
        router.push(body.redirect ?? "/dashboard");
      } catch (err) {
        setState({
          status: "error",
          message:
            err instanceof Error
              ? `Login fehlgeschlagen: ${err.message}`
              : "Login gerade nicht möglich.",
        });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {state.status === "error" && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email) || undefined}
        />
        {state.fieldErrors?.email && (
          <p className="text-destructive text-sm">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Passwort</Label>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            Vergessen?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password) || undefined}
        />
        {state.fieldErrors?.password && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Anmelden …" : "Anmelden"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Noch kein Konto?{" "}
        <Link
          href="/register"
          className="text-foreground font-medium underline"
        >
          Registrieren
        </Link>
      </p>
    </form>
  );
}
