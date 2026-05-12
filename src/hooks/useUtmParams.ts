import { useEffect, useState } from "react";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const SESSION_KEY = "storia_utm";

/**
 * Reads UTM parameters from the current URL and persists them in sessionStorage.
 * Subsequent calls (after SPA navigation) return the original landing UTMs.
 * Use the returned object as extra parameters in GA4 events.
 */
export const useUtmParams = (): UtmParams => {
  const [params, setParams] = useState<UtmParams>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) return JSON.parse(stored) as UtmParams;
    } catch {
      // sessionStorage not available (private browsing edge cases)
    }
    return {};
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ] as const;

    const current: UtmParams = {};
    let hasUtm = false;

    for (const key of utmKeys) {
      const val = search.get(key);
      if (val) {
        current[key] = val;
        hasUtm = true;
      }
    }

    if (hasUtm) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
      } catch {
        // ignore
      }
      setParams(current);
    }
  }, []);

  return params;
};
