import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { telHref } from "@/lib/admin/links";
import {
  TELEFON_LABEL,
  telefonAus,
  telefonGueltig,
} from "@/lib/kontakt-pflicht";

describe("Pflichtangabe Telefon (kontakt-pflicht)", () => {
  it("nimmt übliche Schreibweisen an", () => {
    for (const nummer of [
      "040 1234567",
      "0160 7621876",
      "+49 160 7621876",
      "(040) 12 34 56-7",
      "0049 40 1234567",
      " 0171/2345678 ",
    ])
      assert.ok(telefonGueltig(nummer), nummer);
  });

  it("weist Leeres und Unbrauchbares ab", () => {
    for (const nummer of ["", "   ", "12345", "keine", undefined])
      assert.ok(!telefonGueltig(nummer), String(nummer));
    // Mehr als 17 Ziffern ist keine Telefonnummer.
    assert.ok(!telefonGueltig("123456789012345678"));
  });

  it("gilt genau dann, wenn der Admin die Nummer anrufen kann", () => {
    for (const nummer of ["040 1234567", "12345", "+49 (0)40 123456", "abc"])
      assert.equal(telefonGueltig(nummer), telHref(nummer) !== null, nummer);
  });

  it("findet die Nummer nur unter dem Namen, den der Admin liest", () => {
    assert.equal(TELEFON_LABEL, "Telefon");
    assert.equal(
      telefonAus([
        ["Name", "Lisa Beispiel"],
        ["Telefon", " 040 1234567 "],
      ]),
      "040 1234567",
    );
    assert.equal(telefonAus([["Telefonnummer", "040 1234567"]]), null);
    assert.equal(telefonAus([["Telefon", "123"]]), null);
    assert.equal(telefonAus([["Name", "Lisa Beispiel"]]), null);
  });
});
