import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mailtoHref,
  normalizePhoneDigits,
  safeEmail,
  safeHttpUrl,
  telHref,
} from "@/lib/admin/links";

describe("safeEmail", () => {
  it("lässt normale Adressen durch", () => {
    assert.equal(safeEmail("kunde@firma.de"), "kunde@firma.de");
    assert.equal(
      safeEmail("max.muster+web@sub.firma-hamburg.de"),
      "max.muster+web@sub.firma-hamburg.de",
    );
  });

  it("lehnt eingeschleuste mailto-Parameter, Leerzeichen und Umbrüche ab", () => {
    for (const bad of [
      "a@b.de?bcc=x%40y.de",
      "kunde@firma.de?bcc=fremd%40evil.de",
      "a@b.de&cc=x@y.de",
      "a@b.de%0Abcc:x@y.de",
      "a b@c.de",
      "a@b .de",
      "a@b.de\n",
      "a@b.de\r\nbcc: x@y.de",
      "a@b",
      "@b.de",
      "a@",
      "a=b@c.de",
      "a@b.de/x",
      "",
    ]) {
      assert.equal(safeEmail(bad), null, bad);
    }
  });

  it("wandelt Umlaut-Domains in Punycode, behält die Sperre gegen ? & = %", () => {
    assert.equal(
      safeEmail("info@bäckerei-müller.de"),
      "info@xn--bckerei-mller-bfb28a.de",
    );
    assert.equal(safeEmail("info@bäckerei-müller.de?bcc=x@y.de"), null);
    assert.equal(safeEmail("info@bäckerei.de&cc=x"), null);
    assert.equal(safeEmail("info@bäckerei%.de"), null);
    assert.equal(safeEmail("müller@firma.de"), null); // Umlaut im lokalen Teil
  });
});

describe("mailtoHref", () => {
  it("kodiert Betreff und Text, Zeilenenden als CRLF", () => {
    const href = mailtoHref(
      "kunde@firma.de",
      "Re: Anfrage & Frage?",
      "Zeile 1\nZeile 2 ä",
    )!;
    assert.equal(
      href,
      "mailto:kunde@firma.de?subject=Re%3A%20Anfrage%20%26%20Frage%3F&body=Zeile%201%0D%0AZeile%202%20%C3%A4",
    );
  });

  it("nutzt die Punycode-Form und gibt bei unsicherer Adresse null", () => {
    assert.ok(
      mailtoHref("info@bäckerei-müller.de", "x")!.startsWith(
        "mailto:info@xn--bckerei-mller-bfb28a.de?",
      ),
    );
    assert.equal(mailtoHref("a@b.de?bcc=x%40y.de", "x", "y"), null);
  });

  it("ohne Body nur der Betreff", () => {
    assert.equal(mailtoHref("a@b.de", "Hallo"), "mailto:a@b.de?subject=Hallo");
  });

  it("kürzt den Body auf 1.800 Zeichen mit […]", () => {
    const href = mailtoHref("a@b.de", "x", "y".repeat(5000))!;
    const body = decodeURIComponent(href.split("&body=")[1]);
    assert.equal(body.length, 1800);
    assert.ok(body.endsWith(" […]"));
  });
});

describe("telHref / normalizePhoneDigits", () => {
  it("telHref", () => {
    assert.equal(telHref("+49 (0)40 123 456"), "tel:+4940123456");
    assert.equal(telHref("+49(0)40-123456"), "tel:+4940123456");
    assert.equal(telHref("0049 176 1234567"), "tel:+491761234567");
    assert.equal(telHref("0176 1234567"), "tel:01761234567");
    assert.equal(telHref("040 / 12 34 56"), "tel:040123456");
    assert.equal(telHref("abc"), null);
    assert.equal(telHref("12345"), null);
    assert.equal(telHref(undefined), null);
  });

  it("normalizePhoneDigits bringt alle Schreibweisen auf die nationale Form", () => {
    assert.equal(normalizePhoneDigits("+49 176 1234567"), "01761234567");
    assert.equal(normalizePhoneDigits("0049 176 1234567"), "01761234567");
    assert.equal(normalizePhoneDigits("0176 1234567"), "01761234567");
    assert.equal(normalizePhoneDigits("+49 (0)40 123 456"), "040123456");
    assert.equal(normalizePhoneDigits("040 123 456"), "040123456");
    assert.equal(normalizePhoneDigits("+43 1 234567"), "00431234567");
  });
});

describe("safeHttpUrl", () => {
  it("nur http(s)", () => {
    assert.equal(
      safeHttpUrl("https://example.de/a?b=1"),
      "https://example.de/a?b=1",
    );
    assert.equal(safeHttpUrl("example.de"), "https://example.de/");
    assert.equal(safeHttpUrl("javascript:alert(1)"), null);
    assert.equal(safeHttpUrl("JavaScript:alert(1)"), null);
    assert.equal(safeHttpUrl("data:text/html,x"), null);
    assert.equal(safeHttpUrl("ftp://example.de"), null);
    assert.equal(safeHttpUrl(""), null);
    assert.equal(safeHttpUrl(undefined), null);
  });
});
