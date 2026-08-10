import { createCheerioRouter } from '@crawlee/cheerio';

import { auditPage } from './checks.js';

export const brokenLinks: string[] = [];

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ request, response, $, log, pushData, enqueueLinks }) => {
    const statusCode = response.statusCode ?? 0;
    const startTime = (request.userData?.startTime as number | undefined) ?? Date.now();
    const loadTimeMs = Date.now() - startTime;

    const result = auditPage($, request.loadedUrl ?? request.url, statusCode, loadTimeMs);
    log.info(`Audited ${result.url}`, { title: result.title });
    await pushData(result);

    await enqueueLinks({ strategy: 'same-domain' });
});
