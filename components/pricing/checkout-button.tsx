"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/stripe/plans";

type Props = {
  plan: PlanId;
  label?: string;
  variant?: "default" | "outline";
};

/** Which payment backend handles checkouts in this deployment. */
type Provider = "stripe" | "lemon";

function getProvider(): Provider {
  const v = process.env.NEXT_PUBLIC_BILLING_PROVIDER;
  return v === "lemon" ? "lemon" : "stripe";
}

const ENDPOINT: Record<Provider, string> = {
  stripe: "/api/billing/checkout",
  lemon: "/api/billing/lemon/checkout",
};

const PROVIDER_LABEL: Record<Provider, string> = {
  stripe: "Stripe",
  lemon: "Lemon Squeezy",
};

export function CheckoutButton({ plan, label, variant = "default" }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const provider = getProvider();

  function onClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(ENDPOINT[provider], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        const body = (await res.json()) as {
          ok: boolean;
          message?: string;
          redirect?: string;
        };
        if (!body.ok) {
          if (body.redirect) {
            window.location.href = body.redirect;
            return;
          }
          setError(body.message ?? "Checkout fehlgeschlagen.");
          return;
        }
        if (body.redirect) {
          window.location.href = body.redirect;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `Checkout fehlgeschlagen: ${err.message}`
            : "Checkout gerade nicht möglich.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={variant}
        disabled={pending}
        className="w-full"
        onClick={onClick}
      >
        {pending ? `Weiter zu ${PROVIDER_LABEL[provider]} …` : (label ?? "Plan wählen")}
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
