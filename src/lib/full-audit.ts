import * as cheerio from 'cheerio';

const MAX_PAGE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_PAGES = 8;
const FETCH_TIMEOUT_MS = 15000;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const SKIP_EXTENSIONS = /\.(pdf|jpe?g|png|gif|svg|webp|zip|docx?|xlsx?|pptx?|css|js|mp4|mp3)$/i;

export interface PageAuditResult {
  url: string;
  statusCode: number;
  loadTimeMs: number;
  title: string;
  hasMetaDescription: boolean;
  hasViewportMeta: boolean;
  h1Count: number;
  wordCount: number;
  hasContactForm: boolean;
  hasPhoneNumber: boolean;
  hasGoogleMapsEmbed: boolean;
  imagesTotal: number;
  imagesMissingAlt: number;
  isHttps: boolean;
}

export interface SiteFinding {
  id: string;
  type: 'lead_capture' | 'seo' | 'wrong_searchers' | 'outdated' | 'slow_mobile' | 'broken_links' | 'thin_content';
  severity: number; // 1-10
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

function normalizeStartUrl(input: string): string {
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function fetchPage(url: string): Promise<{ html: string; statusCode: number; loadTimeMs: number } | null> {
  try {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    clearTimeout(timeoutId);
    const loadTimeMs = Date.now() - startTime;

    if (!response.ok) {
      return { html: '', statusCode: response.status, loadTimeMs };
    }

    const content = await response.text();
    return {
      html: content.length > MAX_PAGE_SIZE ? content.slice(0, MAX_PAGE_SIZE) : content,
      statusCode: response.status,
      loadTimeMs,
    };
  } catch {
    // Network error, DNS failure, or timeout — treat as unreachable.
    return null;
  }
}

function auditPage($: cheerio.CheerioAPI, url: string, statusCode: number, loadTimeMs: number): PageAuditResult {
  const bodyHtml = $('body').html() || '';
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  const hasForm = $('form').length > 0;
  const hasPhoneNumber = PHONE_REGEX.test(bodyText);
  const hasViewportMeta = $('meta[name="viewport"]').length > 0;
  const title = $('title').first().text().trim();
  const hasMetaDescription = !!$('meta[name="description"]').attr('content')?.trim();
  const h1Count = $('h1').length;
  const wordCount = bodyText.length ? bodyText.split(' ').filter(Boolean).length : 0;
  const hasGoogleMapsEmbed = bodyHtml.includes('google.com/maps') || bodyHtml.includes('maps.google.com');

  let imagesTotal = 0;
  let imagesMissingAlt = 0;
  $('img').each((_, img) => {
    imagesTotal += 1;
    const alt = $(img).attr('alt');
    if (!alt || !alt.trim()) imagesMissingAlt += 1;
  });

  return {
    url,
    statusCode,
    loadTimeMs,
    title,
    hasMetaDescription,
    hasViewportMeta,
    h1Count,
    wordCount,
    hasContactForm: hasForm,
    hasPhoneNumber,
    hasGoogleMapsEmbed,
    imagesTotal,
    imagesMissingAlt,
    isHttps: url.startsWith('https://'),
  };
}

function extractSameDomainLinks($: cheerio.CheerioAPI, baseUrl: string, origin: string, seen: Set<string>): string[] {
  const links: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    try {
      const abs = new URL(href, baseUrl);
      abs.hash = '';
      if (abs.origin !== origin) return;
      if (SKIP_EXTENSIONS.test(abs.pathname)) return;
      const clean = abs.toString();
      if (!seen.has(clean)) {
        seen.add(clean);
        links.push(clean);
      }
    } catch {
      // Ignore malformed hrefs (mailto:, tel:, javascript:, etc.)
    }
  });
  return links;
}

const PRIORITY: Record<SiteFinding['type'], number> = {
  lead_capture: 1,
  outdated: 2,
  broken_links: 3,
  slow_mobile: 4,
  seo: 5,
  wrong_searchers: 6,
  thin_content: 7,
};

function buildFindings(pages: PageAuditResult[], brokenLinks: string[]): SiteFinding[] {
  const findings: SiteFinding[] = [];

  const pagesWithLeadCapture = pages.filter((p) => p.hasContactForm || p.hasPhoneNumber);
  if (pagesWithLeadCapture.length === 0 && pages.length > 0) {
    findings.push({
      id: 'leak_lead_capture',
      type: 'lead_capture',
      severity: 10,
      title: 'Visitors ready to call hit a dead end on every page',
      detail: 'None of the pages crawled have a visible phone number or contact form. People who are ready to hire you are landing on your site and leaving because there is no way to take the next step.',
      affectedPages: pages.map((p) => p.url),
    });
  } else if (pagesWithLeadCapture.length < pages.length) {
    const missing = pages.filter((p) => !p.hasContactForm && !p.hasPhoneNumber);
    findings.push({
      id: 'leak_lead_capture_partial',
      type: 'lead_capture',
      severity: 6,
      title: 'Lead capture is missing from some pages',
      detail: `${missing.length} of ${pages.length} pages crawled have no phone number or contact form, so visitors who land there directly (from search or a shared link) hit a dead end.`,
      affectedPages: missing.map((p) => p.url),
    });
  }

  const pagesWithoutViewport = pages.filter((p) => !p.hasViewportMeta);
  if (pagesWithoutViewport.length > 0) {
    findings.push({
      id: 'leak_outdated',
      type: 'outdated',
      severity: pagesWithoutViewport.length === pages.length ? 9 : 6,
      title: 'Site is not built for mobile devices',
      detail: `${pagesWithoutViewport.length} of ${pages.length} pages crawled have no mobile viewport tag, so they render like a desktop site squeezed onto a phone screen.`,
      affectedPages: pagesWithoutViewport.map((p) => p.url),
    });
  }

  if (brokenLinks.length > 0) {
    findings.push({
      id: 'leak_broken_links',
      type: 'broken_links',
      severity: Math.min(9, 4 + brokenLinks.length),
      title: `${brokenLinks.length} broken link${brokenLinks.length === 1 ? '' : 's'} found on the site`,
      detail: 'Broken links send visitors to dead ends and signal to search engines that the site is poorly maintained.',
      affectedPages: brokenLinks,
    });
  }

  const slowPages = pages.filter((p) => p.loadTimeMs > 3000);
  if (slowPages.length > 0) {
    findings.push({
      id: 'leak_slow_mobile',
      type: 'slow_mobile',
      severity: slowPages.length === pages.length ? 8.5 : 6,
      title: 'Pages load too slowly on mobile',
      detail: `${slowPages.length} of ${pages.length} pages crawled took over 3 seconds to load. Most mobile visitors leave before a page that slow finishes loading.`,
      affectedPages: slowPages.map((p) => p.url),
    });
  }

  const pagesMissingSeo = pages.filter((p) => !p.hasMetaDescription || !p.title || p.title.length < 10);
  if (pagesMissingSeo.length > 0) {
    findings.push({
      id: 'leak_seo',
      type: 'seo',
      severity: pagesMissingSeo.length === pages.length ? 6 : 4,
      title: 'Pages are missing search-engine signals',
      detail: `${pagesMissingSeo.length} of ${pages.length} pages crawled are missing a page title or meta description, so search engines can't tell what those pages are about.`,
      affectedPages: pagesMissingSeo.map((p) => p.url),
    });
  }

  const hasMapsAnywhere = pages.some((p) => p.hasGoogleMapsEmbed);
  if (!hasMapsAnywhere && pages.length > 0) {
    findings.push({
      id: 'leak_wrong_searchers',
      type: 'wrong_searchers',
      severity: 5,
      title: 'Local customers are finding your competitors instead of you',
      detail: 'No page links to a Google Business Profile or embeds a Google Maps location. Most local searches end on the map, not the search results page.',
      affectedPages: [pages[0]?.url].filter(Boolean),
    });
  }

  const thinPages = pages.filter((p) => p.wordCount > 0 && p.wordCount < 150);
  if (thinPages.length > 0) {
    findings.push({
      id: 'leak_thin_content',
      type: 'thin_content',
      severity: 4,
      title: 'Some pages have almost no content',
      detail: `${thinPages.length} page(s) crawled have fewer than 150 words, giving visitors and search engines very little to go on.`,
      affectedPages: thinPages.map((p) => p.url),
    });
  }

  return findings.sort((a, b) => {
    const pA = PRIORITY[a.type] ?? 99;
    const pB = PRIORITY[b.type] ?? 99;
    if (pA !== pB) return pA - pB;
    return b.severity - a.severity;
  });
}

function recommendationFor(finding: SiteFinding | null): string {
  if (!finding) {
    return 'Take a closer look at both your search visibility and how easily visitors can act once they land on your site. There are hidden opportunities to convert more of the traffic you are already getting.';
  }

  switch (finding.type) {
    case 'lead_capture':
      return 'Put a phone number and a short contact form above the fold on every page, ideally right in the header, so visitors can reach you the instant they decide to buy.';
    case 'outdated':
      return 'Rebuild the site as a fast, mobile-first layout: pages that load in under two seconds and a clean structure designed for a phone screen first. Most local searches happen on mobile.';
    case 'broken_links':
      return 'Fix the broken links found during this audit (listed below). Every broken link is a dead end that erodes trust and can hurt search rankings.';
    case 'slow_mobile':
      return 'Compress images, remove unused scripts, and cut anything that delays the page from becoming usable. Aim for pages that load in under two seconds on mobile.';
    case 'seo':
      return 'Rewrite page titles and meta descriptions to match the specific services and city or neighborhood names people actually search for. Search engines can only send you customers for language that is on the page.';
    case 'wrong_searchers':
      return 'Claim and fully build out your Google Business Profile, hours, photos, service categories, and a steady stream of reviews, and link it from your site.';
    case 'thin_content':
      return 'Add real, specific detail to the thin pages: what the service includes, who it is for, and what it costs to start. A page with almost no content gives search engines and visitors nothing to work with.';
    default:
      return 'Take a closer look at both your search visibility and how easily visitors can act once they land on your site.';
  }
}

function buildSummaryText(
  url: string,
  pages: PageAuditResult[],
  findings: SiteFinding[],
  primary: SiteFinding | null,
  recommendation: string,
  softCTA: string
): string {
  const lines: string[] = [];

  lines.push(`SITE AUDIT REPORT — ${url}`);
  lines.push(`Pages crawled: ${pages.length}`);
  lines.push('');

  if (primary) {
    lines.push(`TOP ISSUE: ${primary.title}`);
    lines.push(primary.detail);
  } else {
    lines.push('No major issues found across the pages crawled.');
  }
  lines.push('');

  lines.push('RECOMMENDATION');
  lines.push(recommendation);
  lines.push('');

  const secondary = findings.filter((f) => f !== primary);
  if (secondary.length > 0) {
    lines.push('ALSO WORTH KNOWING');
    for (const f of secondary) {
      lines.push(`- ${f.title}: ${f.detail}`);
    }
    lines.push('');
  }

  lines.push(softCTA);

  return lines.join('\n');
}

function generateReport(url: string, pages: PageAuditResult[], brokenLinks: string[]): FullAuditReport {
  const findings = buildFindings(pages, brokenLinks);
  const primary = findings[0] ?? null;
  const recommendation = recommendationFor(primary);
  const softCTA = 'Want us to walk through it together on a free 15-minute video call?';
  const summaryText = buildSummaryText(url, pages, findings, primary, recommendation, softCTA);

  return {
    url,
    generatedAt: new Date().toISOString(),
    pagesCrawled: pages.length,
    brokenLinks,
    primaryFinding: primary,
    findings,
    recommendation,
    softCTA,
    summaryText,
  };
}

/**
 * Crawls a business's site (homepage + same-domain internal pages, breadth-first)
 * and produces a comprehensive, multi-page audit report — entirely in-process, no
 * external service or fees. Runs directly in the Next.js server runtime using the
 * same fetch+cheerio approach as src/lib/audit-engine.ts, just extended across
 * multiple pages and aggregated sitewide.
 */
export async function runFullSiteAudit(
  startUrl: string,
  { maxPages = DEFAULT_MAX_PAGES }: { maxPages?: number } = {}
): Promise<FullAuditReport> {
  const normalizedStart = normalizeStartUrl(startUrl);
  const origin = new URL(normalizedStart).origin;

  const seen = new Set<string>([normalizedStart]);
  const queue: string[] = [normalizedStart];
  const pages: PageAuditResult[] = [];
  const brokenLinks: string[] = [];

  while (queue.length > 0 && pages.length < maxPages) {
    const url = queue.shift()!;
    const fetched = await fetchPage(url);

    if (!fetched || fetched.statusCode >= 400 || !fetched.html) {
      brokenLinks.push(url);
      continue;
    }

    const $ = cheerio.load(fetched.html);
    pages.push(auditPage($, url, fetched.statusCode, fetched.loadTimeMs));

    if (pages.length < maxPages) {
      const newLinks = extractSameDomainLinks($, url, origin, seen);
      for (const link of newLinks) {
        if (queue.length < maxPages * 2) queue.push(link);
      }
    }
  }

  return generateReport(normalizedStart, pages, brokenLinks);
}
