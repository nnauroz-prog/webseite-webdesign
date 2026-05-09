"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

type Props = Omit<ButtonProps, "children"> & {
  label: string;
  pendingLabel?: string;
};

export function SubmitButton({ label, pendingLabel, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? (pendingLabel ?? `${label} …`) : label}
    </Button>
  );
}
