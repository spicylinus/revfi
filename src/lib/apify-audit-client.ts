const APIFY_API_BASE = 'https://api.apify.com/v2';

export interface SiteFinding {
  id: string;
  type: string;
  severity: number;
  title: string;
  detail: string;
  affectedPages: string[];
}

export interface FullAuditReport {
  url: string;
  generatedAt: string;
  pagesCrawled: number;
  brokenLinks: string[];
  primaryFinding: SiteFinding | null;
  findings: SiteFinding[];
  recommendation: string;
  softCTA: string;
  summaryText: string;
}

/**
 * Runs the `site-audit` Apify Actor synchronously and returns its OUTPUT record
 * (a FullAuditReport). Requires APIFY_TOKEN and APIFY_ACTOR_ID env vars — returns
 * null (never throws) if either is missing, the call fails, or it times out, so a
 * slow or unavailable Actor never blocks lead capture.
 */
export async function runFullSiteAudit(
  url: string,
  { maxPages = 8, timeoutMs = 50000 }: { maxPages?: number; timeoutMs?: number } = {}
): Promise<FullAuditReport | null> {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID;

  if (!token || !actorId) {
    console.warn('runFullSiteAudit: APIFY_TOKEN or APIFY_ACTOR_ID not configured, skipping full audit.');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${APIFY_API_BASE}/acts/${encodeURIComponent(actorId)}/run-sync?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      console.warn(`runFullSiteAudit: Apify run-sync returned HTTP ${response.status}`);
      return null;
    }

    const report = (await response.json()) as FullAuditReport;
    return report;
  } catch (err) {
    console.warn('runFullSiteAudit: failed to generate full audit report:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
