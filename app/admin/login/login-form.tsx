"use client";

import { useActionState, useEffect, useRef } from "react";

import { login, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    login,
    {},
  );
  const passwordRef = useRef<HTMLInputElement>(null);

  // Nach einem Fehler steht die E-Mail noch da, nur das Passwort ist
  // leer: gleich dorthin, damit man direkt neu tippen kann.
  useEffect(() => {
    if (state.error && state.email) passwordRef.current?.focus();
  }, [state]);

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
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="next"
          required
          className="bg-card h-12 rounded-[3px] text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Passwort</Label>
        <Input
          ref={passwordRef}
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          enterKeyHint="go"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-fehler" : undefined}
          className="bg-card h-12 rounded-[3px] text-base"
        />
      </div>
      {state.error ? (
        <p
          id="login-fehler"
          role="alert"
          className="border-ink-olive/35 bg-ink-olive/8 text-foreground rounded-[4px] border px-4 py-3 text-[15px] leading-relaxed"
        >
          {state.error}
        </p>
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
