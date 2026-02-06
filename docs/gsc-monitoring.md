# GSC Monitoring System

Google Search Console monitoring system for ristorantestoria.de admin area.

## Overview

This system fetches, stores, aggregates, and visualizes Google Search Console data to help monitor SEO performance, detect issues, and track trends over time.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin UI                                  │
│  /admin/gsc → GSCDashboard (Apple 2026 Glassmorphism)           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    React Hooks                                   │
│  useGSCMetrics.ts → React Query + Supabase Client               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                 Supabase Database                                │
│  gsc_* tables → PostgreSQL with RLS                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                Supabase Edge Functions                           │
│  gsc-sync → Fetch from GSC API                                  │
│  gsc-aggregate → Compute aggregates & detect anomalies          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              Google Search Console API                           │
│  Service Account authentication (JWT)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `gsc_site_metrics` | Daily site-level metrics (clicks, impressions, CTR, position) |
| `gsc_page_metrics` | Daily page-level metrics |
| `gsc_query_metrics` | Daily query-level metrics |
| `gsc_page_query_metrics` | Daily page+query combinations |
| `gsc_device_metrics` | Metrics by device type |
| `gsc_country_metrics` | Metrics by country |
| `gsc_search_appearance_metrics` | Metrics by search appearance type |

### Aggregation Tables

| Table | Description |
|-------|-------------|
| `gsc_site_aggregates` | Rolling window aggregates (7d, 28d, 90d) for site |
| `gsc_page_aggregates` | Rolling window aggregates for pages |
| `gsc_query_aggregates` | Rolling window aggregates for queries |

### URL Management

| Table | Description |
|-------|-------------|
| `gsc_url_registry` | Normalized URL registry with language detection |
| `gsc_url_variants` | URL variants (duplicates, trailing slash issues, etc.) |
| `gsc_canonical_groups` | Canonical URL groupings |

### Alerting

| Table | Description |
|-------|-------------|
| `gsc_alert_rules` | Alert rule definitions |
| `gsc_alerts` | Generated alerts |
| `gsc_sync_jobs` | Sync job history |
| `gsc_sync_state` | Sync state tracking |

## Edge Functions

### gsc-sync

Fetches data from Google Search Console API.

**Actions:**
- `backfill` - Fetch last 90 days of historical data
- `daily_sync` - Fetch yesterday's data
- `manual_sync` - Fetch specific date range

**Authentication:**
Uses Service Account with JWT. Credentials stored in Supabase secrets:
- `GSC_CLIENT_EMAIL`
- `GSC_PRIVATE_KEY`
- `GSC_SITE_URL`

**Invoke:**
```typescript
await supabase.functions.invoke('gsc-sync', {
  body: { action: 'daily_sync' }
});
```

### gsc-aggregate

Computes rolling window aggregates and detects anomalies.

**Actions:**
- `aggregate` - Compute all aggregates and run anomaly detection

**Anomaly Detection:**
1. **Duplicate URLs** - Multiple URL variants in GSC data
2. **Legacy CMS URLs** - URLs containing `/cms/`
3. **Cannibalization** - Multiple pages ranking for same query
4. **Performance Drops** - Significant WoW/MoM traffic decreases
5. **Position Drops** - Ranking losses

**Invoke:**
```typescript
await supabase.functions.invoke('gsc-aggregate', {
  body: { action: 'aggregate' }
});
```

## Frontend Components

### Location: `src/components/admin/gsc/`

| Component | Description |
|-----------|-------------|
| `GSCDashboard` | Main dashboard with 60/40 split view |
| `GSCMetricCard` | Glassmorphism metric card with trend |
| `GSCTopPagesTable` | Top pages table with sorting |
| `GSCTopQueriesTable` | Top queries table |
| `GSCAlertsPanel` | Alerts display with severity indicators |

### Hooks: `src/hooks/useGSCMetrics.ts`

| Hook | Description |
|------|-------------|
| `useGSCDashboard` | All dashboard data in one query |
| `useGSCSiteMetrics` | Site-level daily metrics |
| `useGSCSiteAggregates` | Site-level aggregates |
| `useGSCTopPages` | Top pages by window |
| `useGSCTopQueries` | Top queries by window |
| `useGSCAlerts` | Active alerts |
| `useTriggerGSCSync` | Trigger sync mutation |
| `useTriggerGSCAggregate` | Trigger aggregation mutation |

## URL Normalization

### Location: `src/lib/urlNormalization.ts`

**Functions:**
- `normalizeUrl(url)` - Normalize to canonical form
- `extractPath(url)` - Extract path from URL
- `extractLanguage(url)` - Detect language from path
- `analyzeUrl(url)` - Full URL analysis with issue detection
- `groupUrlsByCanonical(urls)` - Group variants by canonical
- `detectCannibalization(data)` - Find cannibalization issues

**Variant Types:**
- `canonical` - Properly formatted URL
- `trailing_slash` - Missing/extra trailing slash
- `case_variant` - Uppercase characters
- `www_variant` - Missing www prefix
- `protocol_variant` - HTTP instead of HTTPS
- `query_param` - Has query parameters
- `fragment` - Has URL fragment
- `index_html` - Explicit index.html
- `legacy_cms` - Old /cms/ URL

## Setup Instructions

### 1. Apply Database Migration

```bash
supabase db push
# Or manually apply: supabase/migrations/20240206000000_gsc_monitoring_schema.sql
```

### 2. Deploy Edge Functions

```bash
supabase functions deploy gsc-sync
supabase functions deploy gsc-aggregate
```

### 3. Configure Secrets

```bash
supabase secrets set GSC_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
supabase secrets set GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
supabase secrets set GSC_SITE_URL="sc-domain:ristorantestoria.de"
```

### 4. Initial Backfill

After setup, run a backfill to populate historical data:

1. Go to Admin → Search Console
2. Click "90-Tage Backfill" button
3. Wait for completion (may take several minutes)

### 5. Schedule Daily Sync

Set up a cron job or Supabase scheduled function to run daily:

```sql
-- Example: Run daily at 6 AM UTC
SELECT cron.schedule(
  'gsc-daily-sync',
  '0 6 * * *',
  $$SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/gsc-sync',
    body := '{"action": "daily_sync"}'::jsonb,
    headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  )$$
);
```

## UI Design

The admin UI follows **Apple 2026 Design Guidelines**:

- **Glassmorphism**: Semi-transparent backgrounds with blur
- **60/40 Split View**: Main content left, sidebar right
- **Smooth Animations**: Slide-in panels, hover states
- **Semantic Colors**: Green=good, Amber=warning, Red=critical
- **Responsive**: Mobile-first with progressive enhancement

## Alert Configuration

Default alert rules are created by the migration:

| Rule | Type | Severity | Threshold |
|------|------|----------|-----------|
| Duplicate URLs | duplicate_url | warning | any |
| Legacy CMS URLs | legacy_cms | critical | any |
| Cannibalization | cannibalization | warning | 2+ pages |
| Performance Drop WoW | performance_drop | warning | -20% |
| Performance Drop MoM | performance_drop | critical | -30% |

Custom rules can be added to `gsc_alert_rules` table.

## Metrics Explained

| Metric | Description |
|--------|-------------|
| **Clicks** | Number of times users clicked through to your site |
| **Impressions** | Number of times your pages appeared in search results |
| **CTR** | Click-through rate (clicks / impressions) |
| **Position** | Average ranking position (lower is better) |
| **WoW** | Week-over-Week comparison |
| **MoM** | Month-over-Month comparison |

## Troubleshooting

### No data appearing

1. Check Service Account has access to Search Console property
2. Verify secrets are correctly set
3. Check Edge Function logs: `supabase functions logs gsc-sync`

### Sync fails with authentication error

1. Verify `GSC_PRIVATE_KEY` includes `\n` line breaks
2. Check Service Account email is correct
3. Ensure property is verified and Service Account has access

### Alerts not generating

1. Run aggregation manually: Admin → Search Console → Aktualisieren
2. Check `gsc_alert_rules.is_active = true`
3. Verify data exists in aggregation tables

## Files Reference

```
src/
├── components/admin/gsc/
│   ├── index.ts
│   ├── GSCDashboard.tsx
│   ├── GSCMetricCard.tsx
│   ├── GSCTopPagesTable.tsx
│   ├── GSCTopQueriesTable.tsx
│   └── GSCAlertsPanel.tsx
├── hooks/
│   └── useGSCMetrics.ts
├── lib/
│   └── urlNormalization.ts
└── pages/
    └── AdminGSC.tsx

supabase/
├── functions/
│   ├── gsc-sync/
│   │   └── index.ts
│   └── gsc-aggregate/
│       └── index.ts
└── migrations/
    └── 20240206000000_gsc_monitoring_schema.sql
```
