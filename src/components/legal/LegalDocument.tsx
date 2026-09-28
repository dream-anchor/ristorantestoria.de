/**
 * Rendert einen Rechtstext aus src/content/legal/*.json (Impressum, Datenschutz, Cookie-Richtlinie).
 *
 * Die Texte der Speranza GmbH gelten für ristorantestoria.de UND events-storia.de. Hauptfassung liegt
 * in events-storia.de/src/content/legal/; die JSON-Dateien hier müssen byte-gleich sein. Der Text wird
 * unverändert ausgegeben — keine inhaltlichen Anpassungen in dieser Komponente.
 *
 * Schema: Array von Teilen { title, sections: [{ title, blocks }] }; ein Block ist
 * { type: "p", text, strong? } oder { type: "ul" | "ol", items: [{ text, sub: string[] }] }.
 * Absatztext darf Zeilenumbrüche (\n) enthalten und wird mit whitespace-pre-line gesetzt.
 */

export type LegalListItem = { text: string; sub: string[] };
export type LegalBlock =
  | { type: "p"; text: string; strong?: boolean }
  | { type: "ul" | "ol"; items: LegalListItem[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalPart = { title: string; sections: LegalSection[] };

/** Anker-ID aus einer Überschrift, z. B. „18. Google Analytics“ → „18-google-analytics“. */
export const legalAnchorId = (title: string): string =>
  title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/§/g, "paragraf")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Block = ({ block }: { block: LegalBlock }) => {
  if (block.type === "p") {
    return (
      <p className={`whitespace-pre-line mb-3${block.strong ? " font-semibold" : ""}`}>
        {block.text}
      </p>
    );
  }
  const ListTag = block.type === "ol" ? "ol" : "ul";
  const listClass = block.type === "ol" ? "list-decimal" : "list-disc";
  return (
    <ListTag className={`${listClass} pl-6 space-y-2 mb-3`}>
      {block.items.map((item, ii) => (
        <li key={ii} className="whitespace-pre-line">
          {item.text}
          {item.sub.length > 0 && (
            <ul className="list-[circle] pl-6 mt-2 space-y-1">
              {item.sub.map((sub, si) => (
                <li key={si}>{sub}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ListTag>
  );
};

interface LegalDocumentProps {
  parts: LegalPart[];
  /** Seitentitel (h1). Besteht das Dokument nur aus einem Teil mit genau diesem Titel, entfällt dessen h2. */
  pageTitle: string;
}

const LegalDocument = ({ parts, pageTitle }: LegalDocumentProps) => {
  const skipPartHeading = parts.length === 1 && parts[0].title.trim() === pageTitle.trim();

  return (
    <div className="prose prose-lg max-w-none text-foreground/90">
      {parts.map((part) => (
        <section key={part.title} id={skipPartHeading ? undefined : legalAnchorId(part.title)} className="scroll-mt-32">
          {!skipPartHeading && (
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mt-12 mb-4">
              {part.title}
            </h2>
          )}
          {part.sections.map((section) => (
            <section key={section.title} id={legalAnchorId(section.title)} className="scroll-mt-32">
              <h3 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                {section.title}
              </h3>
              {section.blocks.map((block, bi) => (
                <Block key={bi} block={block} />
              ))}
            </section>
          ))}
        </section>
      ))}
    </div>
  );
};

export default LegalDocument;
