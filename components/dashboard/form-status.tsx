import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ActionState } from "@/lib/actions/shared";

export function FormStatus({ state }: { state: ActionState }) {
  if (state.status === "error" && state.message) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }
  if (state.status === "success" && state.message) {
    return (
      <Alert variant="success">
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }
  return null;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}
