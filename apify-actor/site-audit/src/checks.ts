import type { CheerioCrawlingContext } from '@crawlee/cheerio';

import type { PageAuditResult } from './types.js';

type CheerioAPI = CheerioCrawlingContext['$'];

const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

export function auditPage($: CheerioAPI, url: string, statusCode: number, loadTimeMs: number): PageAuditResult {
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

    const isHttps = url.startsWith('https://');

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
        isHttps,
    };
}
