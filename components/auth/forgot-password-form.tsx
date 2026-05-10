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

export function ForgotPasswordForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = { email: String(data.get("email") ?? "") };

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
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
              ? `Anfrage fehlgeschlagen: ${err.message}`
              : "Anfrage gerade nicht möglich.",
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

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird gesendet …" : "Reset-Link anfordern"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-foreground font-medium underline">
          Zurück zum Login
        </Link>
      </p>
    </form>
  );
}
