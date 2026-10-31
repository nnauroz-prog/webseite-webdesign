/**
 * Sichere mailto:-, tel:- und http(s)-Links aus Kundeneingaben.
 *
 * /api/anfrage prüft E-Mail-Adressen bewusst locker (echte Anfragen
 * sollen nie abgelehnt werden). Eine Adresse wie
 * `kunde@firma.de?bcc=fremd%40evil.de` käme dort durch und würde in
 * einem mailto:-Link eine Blindkopie einschleusen. Deshalb wird hier
 * bei der Anzeige streng geprüft.
 */

const LOCAL_RE = /^[A-Za-z0-9._+-]+$/;
const DOMAIN_RE = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
/** Zeichen, die im Domain-Teil nie vorkommen dürfen (vor der Punycode-Umwandlung). */
const DOMAIN_FORBIDDEN = /[\s/?#@:%&=\\[\]<>"'`,;()!*$^{}|~]/;

export const MAILTO_BODY_MAX = 1800;

/**
 * Gibt die Adresse in sicherer Form zurück (Umlaut-Domains als
 * Punycode, z. B. info@xn--bckerei-mller-...), sonst null.
 */
export function safeEmail(addr: string): string | null {
  if (typeof addr !== "string" || addr.length === 0 || addr.length > 254)
    return null;
  const at = addr.lastIndexOf("@");
  if (at <= 0 || at === addr.length - 1) return null;
  const local = addr.slice(0, at);
  let domain = addr.slice(at + 1);
  if (!LOCAL_RE.test(local)) return null;
  if (DOMAIN_FORBIDDEN.test(domain)) return null;
  if (/[^\x00-\x7F]/.test(domain)) {
    try {
      domain = new URL(`http://${domain}`).hostname;
    } catch {
      return null;
    }
  }
  if (!DOMAIN_RE.test(domain)) return null;
  return `${local}@${domain}`;
}

/** Zeilenenden auf \n vereinheitlichen. */
function normalizeNewlines(s: string): string {
  return s.replace(/\r\n?/g, "\n");
}

/** Kürzt einen Mail-Text auf MAILTO_BODY_MAX Zeichen (mit „[…]“ am Ende). */
export function clampBody(body: string): string {
  const text = normalizeNewlines(body);
  if (text.length <= MAILTO_BODY_MAX) return text;
  return `${text.slice(0, MAILTO_BODY_MAX - 4)} […]`;
}

/**
 * mailto:-Link mit kodiertem Betreff und Text (Zeilenenden als CRLF).
 * null, wenn die Adresse unsicher ist.
 */
export function mailtoHref(
  to: string,
  subject: string,
  body?: string,
): string | null {
  const addr = safeEmail(to);
  if (!addr) return null;
  const params = [
    `subject=${encodeURIComponent(normalizeNewlines(subject).replace(/\n/g, " "))}`,
  ];
  if (body) {
    params.push(
      `body=${encodeURIComponent(clampBody(body).replace(/\n/g, "\r\n"))}`,
    );
  }
  return `mailto:${addr}?${params.join("&")}`;
}

/**
 * Zerlegt eine Telefonnummer: „(0)“ fällt weg, ein führendes + oder
 * 00 markiert eine internationale Nummer, danach zählen nur Ziffern.
 * Gemeinsame Grundlage für telHref und die Telefonsuche.
 */
export function splitPhone(raw: string): {
  international: boolean;
  digits: string;
} {
  const cleaned = raw.replace(/\(\s*0\s*\)/g, "").trim();
  if (cleaned.startsWith("+")) {
    return { international: true, digits: cleaned.replace(/\D/g, "") };
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.startsWith("00"))
    return { international: true, digits: digits.slice(2) };
  return { international: false, digits };
}

/**
 * Ziffernfolge zum Vergleichen: deutsche Nummern in nationaler Form
 * („+49 176 …“, „0049 176 …“ und „0176 …“ ergeben alle „0176…“,
 * „+49 (0)40 …“ ergibt „040…“), ausländische mit „00“ davor.
 */
export function normalizePhoneDigits(raw: string): string {
  const { international, digits } = splitPhone(raw);
  if (!international) return digits;
  if (digits.startsWith("49")) return `0${digits.slice(2)}`;
  return `00${digits}`;
}

/** tel:-Link; „+49 (0)40 123“ → tel:+4940123. Weniger als 6 Ziffern → null. */
export function telHref(raw: string | undefined): string | null {
  if (!raw) return null;
  const { international, digits } = splitPhone(raw);
  if (digits.length < 6 || digits.length > 17) return null;
  return international ? `tel:+${digits}` : `tel:${digits}`;
}

/** Nur http(s)-Adressen; ohne Schema wird https:// angenommen. */
export function safeHttpUrl(v: string | undefined): string | null {
  const value = v?.trim();
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}
