"use client";

import { useFormStatus } from "react-dom";

import { createPortalAction } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Öffne Stripe …" : label}
    </Button>
  );
}

export function ManagePlanButton({
  label = "Plan verwalten",
}: {
  label?: string;
}) {
  return (
    <form action={createPortalAction}>
      <SubmitButton label={label} />
    </form>
  );
}
