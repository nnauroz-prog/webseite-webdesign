"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/lib/actions/auth";
import type { AuthActionState } from "@/lib/actions/shared";

const initialState: AuthActionState = { status: "idle" };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
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
