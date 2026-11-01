"use client";

import { useActionState } from "react";

import { login, type ActionState } from "@/app/admin/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    login,
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="admin-email">E-Mail</Label>
        <Input
          // key + defaultValue: Nach einem Fehler setzt React das Formular
          // zurück; so bleibt die E-Mail stehen, nur das Passwort ist leer.
          key={state.email ?? ""}
          defaultValue={state.email}
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-12 text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Passwort</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 text-base"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-[3px] text-base"
      >
        {pending ? "Anmelden …" : "Anmelden"}
      </Button>
    </form>
  );
}
