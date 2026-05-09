"use client";

import { useActionState } from "react";

import {
  createCheckoutAction,
  initialState,
} from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/stripe/plans";

type Props = {
  plan: PlanId;
  label?: string;
  variant?: "default" | "outline";
};

export function CheckoutButton({ plan, label, variant = "default" }: Props) {
  const [state, action, pending] = useActionState(
    createCheckoutAction,
    initialState,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="plan" value={plan} />
      <Button
        type="submit"
        variant={variant}
        disabled={pending}
        className="w-full"
      >
        {pending ? "Weiter zu Stripe …" : (label ?? "Plan wählen")}
      </Button>
      {state.status === "error" && state.message ? (
        <p className="text-destructive text-xs">{state.message}</p>
      ) : null}
    </form>
  );
}
