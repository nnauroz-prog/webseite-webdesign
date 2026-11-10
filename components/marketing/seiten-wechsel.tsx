/// <reference types="react/canary" />
import { ViewTransition, type ReactNode } from "react";

/**
 * Weicher Seitenwechsel über die View Transitions API (React
 * <ViewTransition>, in next.config.ts unter experimental.viewTransition
 * eingeschaltet). Beim Wechsel zwischen Seiten blendet die alte Seite
 * leicht zurück und die neue steigt herein (Klasse „seite“, Styles in
 * app/apple.css). Browser ohne die API wechseln hart wie bisher; bei
 * reduzierter Bewegung gibt es keine Bewegung.
 */
export function SeitenWechsel({ children }: { children: ReactNode }) {
  return <ViewTransition default="seite">{children}</ViewTransition>;
}
