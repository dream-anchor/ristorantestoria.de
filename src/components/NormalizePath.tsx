import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Client-side path normalization component.
 * Handles:
 * 1. Trailing slash removal (e.g., /admin/ -> /admin)
 * 2. Legacy query string redirects (e.g., ?page_id=2881 -> /impressum)
 */
export const NormalizePath = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { pathname, search, hash } = location;

    // Handle legacy query string: ?page_id=2881 -> /impressum
    if (pathname === '/' && searchParams.get('page_id') === '2881') {
      navigate('/impressum', { replace: true });
      return;
    }

    // Remove trailing slash (except for root "/")
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const normalizedPath = pathname.slice(0, -1);
      navigate(normalizedPath + search + hash, { replace: true });
      return;
    }
  }, [location, navigate, searchParams]);

  return null;
};

export default NormalizePath;
