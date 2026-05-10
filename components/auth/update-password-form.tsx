"use client";

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

export function UpdatePasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      password: String(data.get("password") ?? ""),
      confirm: String(data.get("confirm") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/update-password", {
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
        router.refresh();
        router.push(body.redirect ?? "/dashboard");
      } catch (err) {
        setState({
          status: "error",
          message:
            err instanceof Error
              ? `Aktualisierung fehlgeschlagen: ${err.message}`
              : "Aktualisierung gerade nicht möglich.",
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
        <Label htmlFor="password">Neues Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(state.fieldErrors?.password) || undefined}
        />
        {state.fieldErrors?.password && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Passwort bestätigen</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(state.fieldErrors?.confirm) || undefined}
        />
        {state.fieldErrors?.confirm && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.confirm}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird gespeichert …" : "Passwort speichern"}
      </Button>
    </form>
  );
}
