/**
 * URL Normalization Utilities for GSC Monitoring
 *
 * These utilities help normalize, compare, and analyze URLs from Google Search Console
 * to detect duplicates, variants, and canonical issues.
 */

// Supported languages for the site
export const SUPPORTED_LANGUAGES = ['de', 'en', 'it', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Base domain for the site
export const SITE_DOMAIN = 'www.ristorantestoria.de';
export const SITE_URL = `https://${SITE_DOMAIN}`;

/**
 * URL variant types that can be detected
 */
export type UrlVariantType =
  | 'canonical'           // The preferred URL
  | 'trailing_slash'      // Missing or extra trailing slash
  | 'case_variant'        // Different letter casing
  | 'www_variant'         // www vs non-www
  | 'protocol_variant'    // http vs https
  | 'query_param'         // Has query parameters
  | 'fragment'            // Has URL fragment
  | 'index_html'          // Explicit /index.html
  | 'language_variant'    // Different language version
  | 'legacy_cms';         // Old /cms/ URLs

export interface UrlAnalysis {
  original: string;
  normalized: string;
  path: string;
  language: SupportedLanguage | null;
  isCanonical: boolean;
  variantTypes: UrlVariantType[];
  canonicalUrl: string;
  issues: string[];
}

export interface UrlVariantGroup {
  canonicalUrl: string;
  canonicalPath: string;
  language: SupportedLanguage | null;
  variants: {
    url: string;
    type: UrlVariantType;
    clicks?: number;
    impressions?: number;
  }[];
  totalClicks: number;
  totalImpressions: number;
}

/**
 * Normalize a URL by:
 * - Converting to lowercase
 * - Ensuring https://
 * - Ensuring www. prefix
 * - Removing query parameters
 * - Removing fragments
 * - Normalizing trailing slashes
 * - Removing /index.html
 */
export function normalizeUrl(url: string): string {
  try {
    // Handle relative URLs
    let fullUrl = url;
    if (url.startsWith('/')) {
      fullUrl = `${SITE_URL}${url}`;
    } else if (!url.startsWith('http')) {
      fullUrl = `https://${url}`;
    }

    const parsed = new URL(fullUrl);

    // Normalize protocol
    parsed.protocol = 'https:';

    // Normalize host (add www if missing)
    if (!parsed.hostname.startsWith('www.') && parsed.hostname === 'ristorantestoria.de') {
      parsed.hostname = 'www.' + parsed.hostname;
    }

    // Lowercase hostname
    parsed.hostname = parsed.hostname.toLowerCase();

    // Get path and normalize
    let path = parsed.pathname.toLowerCase();

    // Remove index.html
    path = path.replace(/\/index\.html?$/i, '/');

    // Ensure trailing slash for directories (but not for files with extensions)
    if (!path.match(/\.[a-z0-9]+$/i)) {
      if (!path.endsWith('/')) {
        path += '/';
      }
    }

    // Handle root path
    if (path === '') {
      path = '/';
    }

    return `https://${parsed.hostname}${path}`;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Extract just the path from a URL (normalized)
 */
export function extractPath(url: string): string {
  try {
    const normalized = normalizeUrl(url);
    const parsed = new URL(normalized);
    return parsed.pathname;
  } catch {
    return url;
  }
}

/**
 * Extract language from URL path
 * Returns null for German (default language) or if language cannot be detected
 */
export function extractLanguage(url: string): SupportedLanguage | null {
  const path = extractPath(url);

  // Check for language prefix pattern: /en/, /it/, /fr/
  const langMatch = path.match(/^\/([a-z]{2})\//);
  if (langMatch) {
    const lang = langMatch[1] as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.includes(lang) && lang !== 'de') {
      return lang;
    }
  }

  // German is default (no prefix)
  return null;
}

/**
 * Get the language-neutral base path (without language prefix)
 */
export function getBasePath(url: string): string {
  const path = extractPath(url);
  const lang = extractLanguage(url);

  if (lang) {
    // Remove language prefix
    return path.replace(new RegExp(`^/${lang}/`), '/');
  }

  return path;
}

/**
 * Check if a URL is the canonical version
 */
export function isCanonicalUrl(url: string): boolean {
  const normalized = normalizeUrl(url);
  return url === normalized || normalizeUrl(url) === normalizeUrl(normalized);
}

/**
 * Analyze a URL and detect all variant types
 */
export function analyzeUrl(url: string): UrlAnalysis {
  const normalized = normalizeUrl(url);
  const path = extractPath(url);
  const language = extractLanguage(url);
  const variantTypes: UrlVariantType[] = [];
  const issues: string[] = [];

  try {
    const original = new URL(url.startsWith('/') ? `${SITE_URL}${url}` : url);
    const norm = new URL(normalized);

    // Check for protocol variant
    if (original.protocol !== 'https:') {
      variantTypes.push('protocol_variant');
      issues.push('Uses HTTP instead of HTTPS');
    }

    // Check for www variant
    if (!original.hostname.startsWith('www.') && original.hostname.includes('ristorantestoria.de')) {
      variantTypes.push('www_variant');
      issues.push('Missing www prefix');
    }

    // Check for case variant
    if (original.pathname !== original.pathname.toLowerCase()) {
      variantTypes.push('case_variant');
      issues.push('Contains uppercase characters');
    }

    // Check for query parameters
    if (original.search) {
      variantTypes.push('query_param');
      issues.push(`Has query parameters: ${original.search}`);
    }

    // Check for fragment
    if (original.hash) {
      variantTypes.push('fragment');
      issues.push(`Has URL fragment: ${original.hash}`);
    }

    // Check for index.html
    if (original.pathname.match(/\/index\.html?$/i)) {
      variantTypes.push('index_html');
      issues.push('Contains explicit index.html');
    }

    // Check for trailing slash consistency
    const hasTrailingSlash = original.pathname.endsWith('/');
    const shouldHaveTrailingSlash = !original.pathname.match(/\.[a-z0-9]+$/i);
    if (shouldHaveTrailingSlash && !hasTrailingSlash) {
      variantTypes.push('trailing_slash');
      issues.push('Missing trailing slash');
    }

    // Check for legacy CMS URLs
    if (original.pathname.includes('/cms/')) {
      variantTypes.push('legacy_cms');
      issues.push('Legacy CMS URL - should be redirected');
    }

    // If no variants detected, it's canonical
    if (variantTypes.length === 0) {
      variantTypes.push('canonical');
    }

  } catch {
    issues.push('Invalid URL format');
  }

  return {
    original: url,
    normalized,
    path,
    language,
    isCanonical: variantTypes.includes('canonical'),
    variantTypes,
    canonicalUrl: normalized,
    issues
  };
}

/**
 * Group URLs by their canonical version
 */
export function groupUrlsByCanonical(urls: { url: string; clicks?: number; impressions?: number }[]): UrlVariantGroup[] {
  const groups = new Map<string, UrlVariantGroup>();

  for (const item of urls) {
    const analysis = analyzeUrl(item.url);
    const canonicalUrl = analysis.canonicalUrl;

    if (!groups.has(canonicalUrl)) {
      groups.set(canonicalUrl, {
        canonicalUrl,
        canonicalPath: extractPath(canonicalUrl),
        language: analysis.language,
        variants: [],
        totalClicks: 0,
        totalImpressions: 0
      });
    }

    const group = groups.get(canonicalUrl)!;

    // Add as variant if not canonical
    if (!analysis.isCanonical) {
      group.variants.push({
        url: item.url,
        type: analysis.variantTypes[0], // Primary variant type
        clicks: item.clicks,
        impressions: item.impressions
      });
    }

    group.totalClicks += item.clicks || 0;
    group.totalImpressions += item.impressions || 0;
  }

  return Array.from(groups.values());
}

/**
 * Detect potential cannibalization (multiple pages ranking for same query)
 */
export interface CannibalizationIssue {
  query: string;
  pages: {
    url: string;
    path: string;
    position: number;
    clicks: number;
    impressions: number;
  }[];
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export function detectCannibalization(
  queryData: {
    query: string;
    pages: { url: string; position: number; clicks: number; impressions: number }[]
  }[]
): CannibalizationIssue[] {
  const issues: CannibalizationIssue[] = [];

  for (const { query, pages } of queryData) {
    // Only consider queries with multiple ranking pages
    if (pages.length < 2) continue;

    // Filter to pages in top 20 positions
    const topPages = pages.filter(p => p.position <= 20);
    if (topPages.length < 2) continue;

    // Determine severity based on position spread and traffic
    const positions = topPages.map(p => p.position);
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const spread = maxPos - minPos;
    const totalClicks = topPages.reduce((sum, p) => sum + p.clicks, 0);

    let severity: 'low' | 'medium' | 'high' = 'low';
    let recommendation = '';

    if (spread <= 3) {
      severity = 'high';
      recommendation = 'Pages are competing directly. Consider consolidating content or using canonical tags.';
    } else if (spread <= 10) {
      severity = 'medium';
      recommendation = 'Pages may be competing. Review content overlap and internal linking.';
    } else {
      severity = 'low';
      recommendation = 'Monitor these pages. Consider if both are intentionally targeting this query.';
    }

    issues.push({
      query,
      pages: topPages.map(p => ({
        url: p.url,
        path: extractPath(p.url),
        position: p.position,
        clicks: p.clicks,
        impressions: p.impressions
      })),
      severity,
      recommendation
    });
  }

  // Sort by severity (high first) then by total impressions
  return issues.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    const aImpressions = a.pages.reduce((sum, p) => sum + p.impressions, 0);
    const bImpressions = b.pages.reduce((sum, p) => sum + p.impressions, 0);
    return bImpressions - aImpressions;
  });
}

/**
 * Format a URL for display (truncate if too long)
 */
export function formatUrlForDisplay(url: string, maxLength: number = 50): string {
  const path = extractPath(url);
  if (path.length <= maxLength) return path;

  // Truncate in the middle
  const start = path.slice(0, Math.floor(maxLength / 2) - 2);
  const end = path.slice(-(Math.floor(maxLength / 2) - 2));
  return `${start}...${end}`;
}

/**
 * Get URL status badge info
 */
export function getUrlStatusBadge(analysis: UrlAnalysis): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  description: string;
} {
  if (analysis.variantTypes.includes('legacy_cms')) {
    return {
      label: 'Legacy',
      variant: 'destructive',
      description: 'Legacy CMS URL that should be redirected'
    };
  }

  if (analysis.issues.length > 1) {
    return {
      label: 'Multiple Issues',
      variant: 'destructive',
      description: `${analysis.issues.length} issues detected`
    };
  }

  if (analysis.issues.length === 1) {
    return {
      label: 'Issue',
      variant: 'secondary',
      description: analysis.issues[0]
    };
  }

  return {
    label: 'OK',
    variant: 'default',
    description: 'URL is properly formatted'
  };
}

/**
 * Calculate percentage change between two values
 */
export function calcPercentChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage change for display
 */
export function formatPercentChange(change: number | null): string {
  if (change === null) return '—';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Get trend indicator
 */
export function getTrendIndicator(change: number | null): {
  direction: 'up' | 'down' | 'neutral';
  color: string;
  icon: string;
} {
  if (change === null || Math.abs(change) < 1) {
    return { direction: 'neutral', color: 'text-muted-foreground', icon: '→' };
  }

  if (change > 0) {
    return { direction: 'up', color: 'text-green-600', icon: '↑' };
  }

  return { direction: 'down', color: 'text-red-600', icon: '↓' };
}
