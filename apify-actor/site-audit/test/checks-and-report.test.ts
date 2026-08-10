import * as cheerio from 'cheerio';
import { describe, expect, it } from 'vitest';

import { auditPage } from '../src/checks.js';
import { generateReport } from '../src/report.js';

const GOOD_PAGE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Acme Plumbing — 24/7 Emergency Plumber in Austin, TX</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Fast, licensed emergency plumbing repair in Austin, TX. Call now for a free quote.">
</head>
<body>
  <h1>Acme Plumbing</h1>
  <p>${'We fix leaks, clogs, and water heaters fast. '.repeat(20)}</p>
  <p>Call us at (512) 555-0123 for a free estimate.</p>
  <form><input type="email" /><button>Request a Quote</button></form>
  <iframe src="https://www.google.com/maps/embed?pb=xyz"></iframe>
  <img src="/van.jpg" alt="Acme Plumbing service van" />
</body>
</html>
`;

const BAD_PAGE_HTML = `
<!DOCTYPE html>
<html>
<head><title>x</title></head>
<body>
  <p>Hi.</p>
  <img src="/logo.png" />
</body>
</html>
`;

describe('auditPage', () => {
    it('recognizes a well-built page', () => {
        const $ = cheerio.load(GOOD_PAGE_HTML);
        const result = auditPage($, 'https://acmeplumbing.com/', 200, 400);

        expect(result.hasContactForm).toBe(true);
        expect(result.hasPhoneNumber).toBe(true);
        expect(result.hasViewportMeta).toBe(true);
        expect(result.hasMetaDescription).toBe(true);
        expect(result.hasGoogleMapsEmbed).toBe(true);
        expect(result.h1Count).toBe(1);
        expect(result.imagesMissingAlt).toBe(0);
        expect(result.isHttps).toBe(true);
        expect(result.wordCount).toBeGreaterThan(100);
    });

    it('flags a bare-bones page', () => {
        const $ = cheerio.load(BAD_PAGE_HTML);
        const result = auditPage($, 'https://example.com/thin', 200, 5200);

        expect(result.hasContactForm).toBe(false);
        expect(result.hasPhoneNumber).toBe(false);
        expect(result.hasViewportMeta).toBe(false);
        expect(result.hasMetaDescription).toBe(false);
        expect(result.hasGoogleMapsEmbed).toBe(false);
        expect(result.title).toBe('x');
        expect(result.imagesMissingAlt).toBe(1);
        expect(result.wordCount).toBeLessThan(10);
    });
});

describe('generateReport', () => {
    it('reports a healthy multi-page site with no primary leak-worthy issue beyond minor ones', () => {
        const $ = cheerio.load(GOOD_PAGE_HTML);
        const homepage = auditPage($, 'https://acmeplumbing.com/', 200, 400);
        const about = { ...homepage, url: 'https://acmeplumbing.com/about', wordCount: 300 };

        const report = generateReport('https://acmeplumbing.com', [homepage, about], []);

        expect(report.pagesCrawled).toBe(2);
        expect(report.brokenLinks).toEqual([]);
        // A well-built site should not trigger the lead-capture or maps findings.
        expect(report.findings.find((f) => f.type === 'lead_capture')).toBeUndefined();
        expect(report.findings.find((f) => f.type === 'wrong_searchers')).toBeUndefined();
    });

    it('surfaces the worst sitewide issue as the primary finding and lists broken links', () => {
        const $bad = cheerio.load(BAD_PAGE_HTML);
        const thinPage = auditPage($bad, 'https://example.com/', 200, 6000);

        const report = generateReport('https://example.com', [thinPage], ['https://example.com/services']);

        expect(report.primaryFinding?.type).toBe('lead_capture');
        expect(report.findings.some((f) => f.type === 'broken_links')).toBe(true);
        expect(report.brokenLinks).toContain('https://example.com/services');
        expect(report.summaryText).toContain('TOP ISSUE');
        expect(report.summaryText).toContain(report.softCTA);
    });

    it('handles zero crawled pages gracefully (e.g. every request blocked)', () => {
        const report = generateReport('https://blocked-site.example', [], ['https://blocked-site.example/']);

        expect(report.pagesCrawled).toBe(0);
        expect(report.primaryFinding?.type).toBe('broken_links');
        expect(report.summaryText).toContain('TOP ISSUE');
    });
});
