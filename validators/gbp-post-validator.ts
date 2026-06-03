/**
 * GBP-Post Validation-Gate — Phase 3
 * Alle generierten Posts laufen durch dieses Gate bevor sie gepostet werden.
 * Reject-Reasons als Enum-Konstanten (nicht Free-Text).
 */

import { USPS, GEO_ANCHORS, FORBIDDEN_PERSON_FORMS, SLOT_CTA_MAP } from "../gbp-routine/gbp-constants.js";

// ── Reject-Reason Enum ─────────────────────────────────────────────────────────

export const RejectReason = {
  LENGTH_BELOW_MIN:       "LENGTH_BELOW_MIN",
  LENGTH_ABOVE_MAX:       "LENGTH_ABOVE_MAX",
  NO_USP_FOUND:           "NO_USP_FOUND",
  NO_GEO_ANCHOR_FOUND:    "NO_GEO_ANCHOR_FOUND",
  WRONG_PERSON_FORM:      "WRONG_PERSON_FORM",
  HOOK_MISSING_IN_FIRST_80: "HOOK_MISSING_IN_FIRST_80",
  CTA_SLOT_MISMATCH:      "CTA_SLOT_MISMATCH",
  IMAGE_TAG_MISMATCH:     "IMAGE_TAG_MISMATCH",
  THEME_SLOT_MISMATCH:    "THEME_SLOT_MISMATCH",
} as const;

export type RejectReason = typeof RejectReason[keyof typeof RejectReason];

// CTA-Types die für jeden Theme-Slot erlaubt sind — aus gbp-constants (Single Source of Truth)
const CTA_SLOT_MAP = SLOT_CTA_MAP;

// ── Validation Input ───────────────────────────────────────────────────────────

export interface ValidationInput {
  body:                string;
  min_chars?:          number;   // default 140
  max_chars?:          number;   // default 280
  must_include_usp?:   boolean;  // default true
  must_include_geo?:   boolean;  // default true
  cta_type?:           string;   // für CTA_SLOT_MISMATCH
  theme_slot?:         string;   // aktueller Slot (from schedule)
  allowed_theme_slots?: string[]; // Cluster-erlaubte Slots (für THEME_SLOT_MISMATCH)
  image_tags?:         string[]; // vom Image-Selector gewählt
  required_tags?:      string[]; // vom Cluster definiert (für IMAGE_TAG_MISMATCH)
}

export interface ValidationResult {
  pass:    boolean;
  reasons: RejectReason[];
  /** Menschenlesbare Hints für den Regenerate-Prompt */
  hints:   string[];
}

// ── Hauptvalidierung ───────────────────────────────────────────────────────────

export function validate(input: ValidationInput): ValidationResult {
  const reasons: RejectReason[] = [];
  const { body } = input;
  const min = input.min_chars ?? 140;
  const max = input.max_chars ?? 280;
  const mustUSP = input.must_include_usp !== false;  // default true
  const mustGeo = input.must_include_geo !== false;  // default true

  // 1. Zeichenlänge
  if (body.length < min) reasons.push(RejectReason.LENGTH_BELOW_MIN);
  if (body.length > max) reasons.push(RejectReason.LENGTH_ABOVE_MAX);

  // 2. USP vorhanden (wenn Cluster das fordert)
  if (mustUSP) {
    const bodyLow = body.toLowerCase();
    if (!USPS.some((u) => bodyLow.includes(u.toLowerCase()))) {
      reasons.push(RejectReason.NO_USP_FOUND);
    }
  }

  // 3. Geo-Anker vorhanden (wenn Cluster das fordert)
  if (mustGeo) {
    if (!GEO_ANCHORS.some((a) => body.includes(a))) {
      reasons.push(RejectReason.NO_GEO_ANCHOR_FOUND);
    }
  }

  // 4. Keine verbotene Höflichkeitsform (Sie/Ihr/Ihnen)
  if (FORBIDDEN_PERSON_FORMS.some((f) => body.includes(f))) {
    reasons.push(RejectReason.WRONG_PERSON_FORM);
  }

  // 5. Hook: erste 80 Zeichen enthalten Geo-Anker ODER USP
  const hook = body.substring(0, 80);
  const hookHasGeo = GEO_ANCHORS.some((a) => hook.includes(a));
  const hookHasUSP = USPS.some((u) => hook.toLowerCase().includes(u.toLowerCase()));
  if (!hookHasGeo && !hookHasUSP) {
    reasons.push(RejectReason.HOOK_MISSING_IN_FIRST_80);
  }

  // 6. Image-Tag-Match (nur wenn beide Arrays übergeben)
  if (
    input.image_tags?.length &&
    input.required_tags?.length &&
    !input.image_tags.some((t) => input.required_tags!.includes(t))
  ) {
    reasons.push(RejectReason.IMAGE_TAG_MISMATCH);
  }

  // 7. Theme-Slot-Match (Cluster darf in diesem Slot posten)
  if (input.theme_slot && input.allowed_theme_slots?.length) {
    if (!input.allowed_theme_slots.includes(input.theme_slot)) {
      reasons.push(RejectReason.THEME_SLOT_MISMATCH);
    }
  }

  // 8. CTA-Slot-Match
  if (input.cta_type && input.theme_slot) {
    const allowed = CTA_SLOT_MAP[input.theme_slot] || [];
    if (allowed.length > 0 && !allowed.includes(input.cta_type)) {
      reasons.push(RejectReason.CTA_SLOT_MISMATCH);
    }
  }

  return {
    pass: reasons.length === 0,
    reasons,
    hints: buildHints(reasons),
  };
}

function buildHints(reasons: RejectReason[]): string[] {
  const map: Record<RejectReason, string> = {
    LENGTH_BELOW_MIN:         "Text ist zu kurz — mindestens 140 Zeichen.",
    LENGTH_ABOVE_MAX:         "Text ist zu lang — maximal 280 Zeichen.",
    NO_USP_FOUND:             `Kein USP gefunden — mindestens einen einbauen: ${USPS.slice(0, 4).join(" | ")} | …`,
    NO_GEO_ANCHOR_FOUND:      `Kein Geo-Anker — mindestens einen einbauen: ${GEO_ANCHORS.join(" | ")}.`,
    WRONG_PERSON_FORM:        'Falsche Anrede — kein "Sie/Ihr/Ihnen", nur "du".',
    HOOK_MISSING_IN_FIRST_80: `Hook fehlt — erste 80 Zeichen müssen Geo-Anker oder USP enthalten.`,
    CTA_SLOT_MISMATCH:        "CTA passt nicht zum Theme-Slot (lunch→call/reserve, event→reserve, brand→learn_more).",
    IMAGE_TAG_MISMATCH:       "Bild-Tags überlappen nicht mit Cluster-Required-Tags.",
    THEME_SLOT_MISMATCH:      "Cluster ist für diesen Theme-Slot nicht zugelassen.",
  };
  return reasons.map((r) => map[r]);
}
