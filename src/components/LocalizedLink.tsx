import { Link, type LinkProps } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";

interface LocalizedLinkProps extends Omit<LinkProps, "to"> {
  /**
   * The base slug (German/default) without leading slash
   * e.g., "reservierung", "ueber-uns", "kontakt"
   */
  to: string;
}

/**
 * A Link component that automatically translates paths based on current language.
 * 
 * Usage:
 * <LocalizedLink to="reservierung">Reserve</LocalizedLink>
 * 
 * In German: renders as /reservierung
 * In English: renders as /en/reservation
 * In Italian: renders as /it/prenotazione
 * In French: renders as /fr/reservation
 */
const LocalizedLink = ({ to, children, ...props }: LocalizedLinkProps) => {
  const { language } = useLanguage();
  
  // Handle external URLs and hash links
  if (to.startsWith("http") || to.startsWith("#") || to.startsWith("mailto:") || to.startsWith("tel:")) {
    return <Link to={to} {...props}>{children}</Link>;
  }
  
  // Handle paths with hash (e.g., "kontakt#map")
  let baseSlug = to;
  let hash = "";
  if (to.includes("#")) {
    [baseSlug, hash] = to.split("#");
    hash = `#${hash}`;
  }
  
  // Get the localized path
  const localizedPath = getLocalizedPath(baseSlug, language) + hash;
  
  return <Link to={localizedPath} {...props}>{children}</Link>;
};

export default LocalizedLink;
