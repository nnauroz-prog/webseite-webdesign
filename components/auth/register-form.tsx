"use client";

import Link from "next/link";
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

export function RegisterForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      full_name: String(data.get("full_name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = (await res.json()) as {
          ok: boolean;
          message?: string;
          fieldErrors?: Record<string, string>;
        };
        setState({
          status: body.ok ? "success" : "error",
          message: body.message,
          fieldErrors: body.fieldErrors,
        });
      } catch (err) {
        setState({
          status: "error",
          message:
            err instanceof Error
              ? `Fehler bei der Registrierung: ${err.message}`
              : "Konto-Erstellung gerade nicht möglich.",
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
      {state.status === "success" && state.message && (
        <Alert variant="success">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(state.fieldErrors?.full_name) || undefined}
        />
        {state.fieldErrors?.full_name && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.full_name}
          </p>
        )}
      </div>

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
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(state.fieldErrors?.password) || undefined}
        />
        <p className="text-muted-foreground text-xs">Mindestens 8 Zeichen.</p>
        {state.fieldErrors?.password && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Konto wird erstellt …" : "Konto erstellen"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Bereits ein Konto?{" "}
        <Link href="/login" className="text-foreground font-medium underline">
          Anmelden
        </Link>
      </p>
    </form>
  );
}
