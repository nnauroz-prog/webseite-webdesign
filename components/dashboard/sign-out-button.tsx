"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Even if the network call fails, force the user back to /login —
        // the cookie will be re-validated there.
      }
      router.refresh();
      router.push("/login");
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={onClick}
    >
      {pending ? "Abmelden …" : "Abmelden"}
    </Button>
  );
}
