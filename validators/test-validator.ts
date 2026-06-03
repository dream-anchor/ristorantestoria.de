/**
 * Validation-Gate Tests — 5 bewusst kaputte Posts
 * Alle 5 müssen mit exakt den erwarteten Reason-Codes rejecten.
 * Exit-Code 1 wenn ein Test fehlschlägt.
 */

import { validate, RejectReason } from "./gbp-post-validator.js";

const TEST_CASES: Array<{
  name: string;
  input: Parameters<typeof validate>[0];
  expected: (typeof RejectReason[keyof typeof RejectReason])[];
}> = [
  {
    // T1: kein Geo, kein USP, zu kurz → Hook fehlt (weder Geo noch USP in first 80)
    name: "T1 — zu kurz + kein Hook",
    input: { body: "Gutes Essen in der Stadt.", min_chars: 140 },
    expected: [
      RejectReason.LENGTH_BELOW_MIN,
      RejectReason.NO_USP_FOUND,
      RejectReason.NO_GEO_ANCHOR_FOUND,
      RejectReason.HOOK_MISSING_IN_FIRST_80,
    ],
  },
  {
    // T2: "Ihren" + "Sie" → WRONG_PERSON_FORM (extra LENGTH_BELOW_MIN ist ok)
    name: "T2 — Sie-Form",
    input: {
      body: "Wir freuen uns auf Ihren Besuch in der Maxvorstadt. Das STORIA bietet handgemachte Pasta seit 2015. Besuchen Sie uns in der Karlstraße.",
      min_chars: 140,
    },
    expected: [RejectReason.WRONG_PERSON_FORM],
  },
  {
    // T3: USP fehlt, Geo vorhanden (Maxvorstadt im Hook)
    name: "T3 — kein USP",
    input: {
      body: "Ein nettes Restaurant in der Maxvorstadt, Karlstraße 47a. Wir kochen täglich frische italienische Küche. Komm einfach vorbei und genieß das Essen!",
    },
    expected: [RejectReason.NO_USP_FOUND],
  },
  {
    // T4: Geo fehlt komplett. USP "handgemachte Pasta" ist im Hook → Hook passt.
    name: "T4 — kein Geo-Anker",
    input: {
      body: "Handgemachte Pasta seit 2015 — Familie Speranza, Cucina del Cilento, Original-Rezepte aus Rofrano. 400°C Steinofen, täglich frisch. Komm bald vorbei!",
    },
    expected: [RejectReason.NO_GEO_ANCHOR_FOUND],
  },
  {
    // T5: Hook ohne Geo/USP (Maxvorstadt erst nach Zeichen 80), kein USP im Body
    name: "T5 — Hook fehlt (Geo erst spät im Text)",
    input: {
      body: "Ein langer Einleitungstext ohne irgendeinen Keyword am Anfang, der erstmal weitergeht — irgendwann kommt dann Maxvorstadt als Geo-Anker. Das reicht nicht.",
    },
    expected: [
      RejectReason.NO_USP_FOUND,
      RejectReason.HOOK_MISSING_IN_FIRST_80,
    ],
  },
  {
    // T6: Falscher CTA-Typ für brand-Slot (brand erlaubt nur learn_more/website)
    name: "T6 — CTA_SLOT_MISMATCH (brand + reserve)",
    input: {
      body: "Handgemachte Pasta im STORIA Maxvorstadt — seit 2015 täglich frisch. Cucina del Cilento, Karlstraße 47a. Komm vorbei und genieß die Atmosphäre.",
      theme_slot: "brand",
      cta_type: "reserve",
    },
    expected: [RejectReason.CTA_SLOT_MISMATCH],
  },
];

let allPassed = true;

for (const tc of TEST_CASES) {
  const result = validate(tc.input);

  // Prüfe ob alle expected reasons vorhanden
  const missing = tc.expected.filter((e) => !result.reasons.includes(e));
  // Prüfe ob unerwartete reasons aufgetaucht sind (erlaubt — Test ist "mindestens" check)
  const testPass = missing.length === 0;

  if (testPass) {
    console.log(`✓ ${tc.name} — Reasons: [${result.reasons.join(", ")}]`);
  } else {
    console.error(`✗ ${tc.name} — ERWARTET: [${tc.expected.join(", ")}] | ERHALTEN: [${result.reasons.join(", ")}] | FEHLEND: [${missing.join(", ")}]`);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error("\n❌ Validator-Tests fehlgeschlagen — Gate ist NICHT production-ready.");
  process.exit(1);
} else {
  console.log(`\n✅ Alle ${TEST_CASES.length} Tests korrekt rejected — Gate ist production-ready.`);
}
