import { useLanguage } from '@/contexts/LanguageContext';

interface StaticBotContentProps {
  title: string;
  description: string;
  sections?: Array<{
    heading?: string;
    content: string | string[];
  }>;
  includeContact?: boolean;
}

/**
 * StaticBotContent renders static page content for search engine crawlers.
 * - <noscript> block for bots that don't execute JavaScript
 * - sr-only div for JS-enabled crawlers like Googlebot
 */
const StaticBotContent = ({ title, description, sections = [], includeContact = true }: StaticBotContentProps) => {
  const { t } = useLanguage();

  const content = (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
      
      {sections.map((section, index) => (
        <section key={index}>
          {section.heading && <h2>{section.heading}</h2>}
          {Array.isArray(section.content) ? (
            <ul>
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{section.content}</p>
          )}
        </section>
      ))}
      
      {includeContact && (
        <footer>
          <p>STORIA – Ristorante • Pizzeria • Bar</p>
          <address>
            Karlstraße 47a, 80333 München
          </address>
          <p>+49 89 51519696</p>
          <p>info@ristorantestoria.de</p>
          <p>
            {t.common.openingHoursLabel}: {t.common.openingHoursText}
          </p>
        </footer>
      )}
    </article>
  );

  return (
    <>
      <noscript>{content}</noscript>
      <div className="sr-only" aria-hidden="true">
        {content}
      </div>
    </>
  );
};

export default StaticBotContent;