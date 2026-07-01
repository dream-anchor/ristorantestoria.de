import { supabase } from "@/integrations/supabase/client";
import type { ParsedMenu } from "@/hooks/useSpecialMenus";

export type MenuLang = "de" | "en" | "it" | "fr";
export const ALL_MENU_LANGS: MenuLang[] = ["de", "en", "it", "fr"];

const suffix = (lang: MenuLang) => (lang === "de" ? "" : `_${lang}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getField = (obj: any, base: string, lang: MenuLang): string =>
  (obj?.[`${base}${suffix(lang)}`] ?? "") as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setField = (obj: any, base: string, lang: MenuLang, val: string) => {
  obj[`${base}${suffix(lang)}`] = val;
};

const cloneMenu = (d: ParsedMenu): ParsedMenu => JSON.parse(JSON.stringify(d));

/** Build the source-language payload sent to the edge function. */
export function buildSourcePayload(data: ParsedMenu, source: MenuLang) {
  return {
    title: getField(data, "title", source),
    subtitle: getField(data, "subtitle", source),
    categories: data.categories.map((c) => ({
      name: getField(c, "name", source),
      description: getField(c, "description", source),
      items: c.items.map((i) => ({
        name: getField(i, "name", source),
        description: getField(i, "description", source),
        price_display: getField(i, "price_display", source),
      })),
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchTranslations(payload: unknown, source: MenuLang): Promise<Record<string, any>> {
  const { data, error } = await supabase.functions.invoke("translate-special-menu", {
    body: { source_language: source, menu: payload },
  });
  if (error || data?.error) {
    throw new Error(data?.error ?? error?.message ?? "Übersetzung fehlgeschlagen");
  }
  return (data?.translations ?? {}) as Record<string, any>;
}

interface ApplyOpts {
  /** When provided, only changed source fields or empty targets are (re)written (sync mode). */
  original?: ParsedMenu | null;
}

function applyTranslations(
  data: ParsedMenu,
  source: MenuLang,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: Record<string, any>,
  opts?: ApplyOpts
): ParsedMenu {
  const result = cloneMenu(data);
  const syncMode = !!opts;
  const original = opts?.original ?? null;
  const targets = ALL_MENU_LANGS.filter((l) => l !== source);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writeField = (curObj: any, origObj: any, base: string, lang: MenuLang, translatedVal: unknown) => {
    if (translatedVal == null) return;
    const curSource = getField(curObj, base, source);
    const sourceChanged = origObj ? getField(origObj, base, source) !== curSource : true;
    const curTarget = getField(curObj, base, lang);
    if (!syncMode || sourceChanged || !curTarget) {
      setField(curObj, base, lang, String(translatedVal));
    }
  };

  for (const lang of targets) {
    const tRoot = translations[lang];
    if (!tRoot) continue;
    writeField(result, original, "title", lang, tRoot.title);
    writeField(result, original, "subtitle", lang, tRoot.subtitle);
    (tRoot.categories ?? []).forEach((tCat: any, ci: number) => {
      const curCat = result.categories[ci];
      const origCat = original?.categories?.[ci] ?? null;
      if (!curCat) return;
      writeField(curCat, origCat, "name", lang, tCat?.name);
      writeField(curCat, origCat, "description", lang, tCat?.description);
      (tCat?.items ?? []).forEach((tItem: any, ii: number) => {
        const curItem = curCat.items[ii];
        const origItem = origCat?.items?.[ii] ?? null;
        if (!curItem) return;
        writeField(curItem, origItem, "name", lang, tItem?.name);
        writeField(curItem, origItem, "description", lang, tItem?.description);
        writeField(curItem, origItem, "price_display", lang, tItem?.price_display);
      });
    });
  }

  return result;
}

/** Determine whether any target field needs (re)translation in sync mode. */
export function needsSync(data: ParsedMenu, original: ParsedMenu | null, source: MenuLang): boolean {
  const targets = ALL_MENU_LANGS.filter((l) => l !== source);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const check = (cur: any, orig: any, base: string): boolean => {
    const curSource = getField(cur, base, source);
    if (!curSource) return false; // nothing to translate from
    const changed = orig ? getField(orig, base, source) !== curSource : true;
    if (changed) return true;
    return targets.some((l) => !getField(cur, base, l));
  };
  if (check(data, original, "title")) return true;
  if (check(data, original, "subtitle")) return true;
  for (let ci = 0; ci < data.categories.length; ci++) {
    const c = data.categories[ci];
    const oc = original?.categories?.[ci] ?? null;
    if (check(c, oc, "name") || check(c, oc, "description")) return true;
    for (let ii = 0; ii < c.items.length; ii++) {
      const it = c.items[ii];
      const oit = oc?.items?.[ii] ?? null;
      if (check(it, oit, "name") || check(it, oit, "description") || check(it, oit, "price_display")) {
        return true;
      }
    }
  }
  return false;
}

/** Manual "translate all" — fills all target languages from the chosen source. */
export async function translateAllLanguages(data: ParsedMenu, source: MenuLang): Promise<ParsedMenu> {
  const payload = buildSourcePayload(data, source);
  const translations = await fetchTranslations(payload, source);
  return applyTranslations(data, source, translations);
}

/**
 * Sync-on-save — retranslates only fields whose source changed or whose target is empty.
 * Manually maintained targets with unchanged source are preserved.
 */
export async function syncTranslations(
  data: ParsedMenu,
  original: ParsedMenu | null,
  source: MenuLang = "de"
): Promise<ParsedMenu> {
  if (!needsSync(data, original, source)) return data;
  const payload = buildSourcePayload(data, source);
  const translations = await fetchTranslations(payload, source);
  return applyTranslations(data, source, translations, { original });
}