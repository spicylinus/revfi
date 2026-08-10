import type { FullAuditReport, PageAuditResult, SiteFinding } from './types.js';

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

    // 1. Lead capture — does ANY page on the site let a visitor reach the business?
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

    // 2. Outdated / not mobile-ready
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

    // 3. Broken links — only detectable by crawling more than one page
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

    // 4. Slow mobile loading
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

    // 5. SEO — missing titles/meta descriptions
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

    // 6. Google Business Profile / Maps presence, site-wide
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

    // 7. Thin content
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
            return `Fix the broken links found during this audit (listed below). Every broken link is a dead end that erodes trust and can hurt search rankings.`;
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

function buildSummaryText(url: string, pages: PageAuditResult[], findings: SiteFinding[], primary: SiteFinding | null, recommendation: string, softCTA: string): string {
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

export function generateReport(url: string, pages: PageAuditResult[], brokenLinks: string[]): FullAuditReport {
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
