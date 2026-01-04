import { Navigate, useLocation } from 'react-router-dom';

/**
 * Handles legacy URL redirects that were previously in .htaccess.
 * These are rendered as Route elements in App.tsx.
 */

// Simple redirect component for static paths
export const RedirectToMittagsMenu = () => <Navigate to="/mittags-menu" replace />;
export const RedirectToWeihnachtsmenues = () => <Navigate to="/besondere-anlaesse/weihnachtsmenues" replace />;
export const RedirectToSilvesterparty = () => <Navigate to="/besondere-anlaesse/silvesterparty" replace />;
export const RedirectToLunchMuenchen = () => <Navigate to="/lunch-muenchen-maxvorstadt" replace />;
export const RedirectToEventlocationMuenchen = () => <Navigate to="/eventlocation-muenchen-maxvorstadt" replace />;

/**
 * Handles the /ristorantestoria-de/* prefix removal.
 * Redirects /ristorantestoria-de/any/path to /any/path
 */
export const RedirectFromLegacyPrefix = () => {
  const location = useLocation();
  const pathWithoutPrefix = location.pathname.replace(/^\/ristorantestoria-de\/?/, '/');
  const newPath = pathWithoutPrefix === '' ? '/' : pathWithoutPrefix;
  return <Navigate to={newPath + location.search + location.hash} replace />;
};
