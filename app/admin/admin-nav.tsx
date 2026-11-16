"use client";

import type { LucideIcon } from "lucide-react";

import { ChartNoAxesColumn, Images, Inbox, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Bereich = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Pfade, unter denen der Bereich aktiv ist (genau oder darunter). */
  pfade: readonly string[];
};

/** Die vier Bereiche des Mitgliederbereichs. */
const BEREICHE: readonly Bereich[] = [
  {
    href: "/admin",
    label: "Anfragen",
    icon: Inbox,
    pfade: ["/admin/anfragen"],
  },
  {
    href: "/admin/kunden",
    label: "Kunden",
    icon: Users,
    pfade: ["/admin/kunden"],
  },
  {
    href: "/admin/posts",
    label: "Posts",
    icon: Images,
    pfade: ["/admin/posts", "/admin/story"],
  },
  {
    href: "/admin/zahlen",
    label: "Zahlen",
    icon: ChartNoAxesColumn,
    pfade: ["/admin/zahlen"],
  },
];

const unter = (pathname: string, pfad: string) =>
  pathname === pfad || pathname.startsWith(`${pfad}/`);

function istAktiv(b: Bereich, pathname: string): boolean {
  if (b.href === "/admin" && pathname === "/admin") return true;
  return b.pfade.some((p) => unter(pathname, p));
}

/**
 * Detailseite und Angebots-Editor einer Anfrage haben unten ihre
 * eigene Leiste. Über den Pfad schon beim Laden ausgeblendet, damit
 * die Bereichsleiste nicht kurz aufblitzt.
 */
const EIGENE_LEISTE = /^\/admin\/anfragen\/[^/]+/;

function isTextField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)
    return true;
  if (el instanceof HTMLInputElement) {
    return ![
      "button",
      "submit",
      "checkbox",
      "radio",
      "hidden",
      "reset",
    ].includes(el.type);
  }
  return el.isContentEditable;
}

/** Ab lg: die Bereiche als Links in der Kopfzeile. */
export function AdminHeaderNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Bereiche" className="hidden items-center lg:flex">
      <ul className="flex items-center">
        {BEREICHE.map((b) => {
          const aktiv = istAktiv(b, pathname);
          return (
            <li key={b.href}>
              <Link
                href={b.href}
                aria-current={aktiv ? "page" : undefined}
                className={cn(
                  "label-mono hover:bg-background/10 inline-flex h-11 items-center rounded-[3px] px-3 text-[11px] transition-colors",
                  aktiv ? "bg-background/15" : "text-background/75",
                )}
              >
                {b.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Am iPhone: feste Leiste am unteren Rand im Stil der Daumenleiste
 * (Symbol über dem Wort). Ausgeblendet ab lg, auf Seiten mit eigener
 * Leiste oder eigenem Editor (data-thumb-bar, data-editor; per CSS am
 * Layout-Rahmen group/admin) und bei offener Tastatur.
 */
export function AdminTabBar() {
  const pathname = usePathname() ?? "";
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (isTextField(e.target)) setKeyboard(true);
    };
    const onOut = () => {
      window.setTimeout(
        () => setKeyboard(isTextField(document.activeElement)),
        50,
      );
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const zu = keyboard || EIGENE_LEISTE.test(pathname);

  return (
    <nav
      aria-label="Bereiche"
      // „offen“: Der Kontakt-Streifen der Startseite rückt darüber.
      data-tab-bar={zu ? "zu" : "offen"}
      className={cn(
        "bg-foreground text-background fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden",
        "group-has-[[data-editor]]/admin:hidden group-has-[[data-thumb-bar]]/admin:hidden",
        zu && "hidden",
      )}
    >
      <ul className="mx-auto flex max-w-2xl pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
        {BEREICHE.map((b) => {
          const aktiv = istAktiv(b, pathname);
          const Icon = b.icon;
          return (
            <li key={b.href} className="min-w-0 flex-1">
              <Link
                href={b.href}
                aria-current={aktiv ? "page" : undefined}
                className={cn(
                  "active:bg-background/10 relative flex h-14 flex-col items-center justify-center gap-0.5 text-[13px] font-medium",
                  aktiv ? "text-background" : "text-background/65",
                )}
              >
                {aktiv ? (
                  <span
                    aria-hidden="true"
                    className="bg-background absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-b-[2px]"
                  />
                ) : null}
                <Icon className="h-5 w-5" aria-hidden="true" />
                {b.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
