// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)
import { CheerioCrawler } from '@crawlee/cheerio';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor, log } from 'apify';

import { generateReport } from './report.js';
import { brokenLinks,router } from './routes.js';
import type { PageAuditResult } from './types.js';

interface Input {
    url: string;
    maxPages?: number;
}

await Actor.init();

const { url, maxPages = 15 } = (await Actor.getInput<Input>()) ?? ({} as Input);

if (!url) {
    throw new Error('Input is missing the required "url" field.');
}

const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: maxPages,
    requestHandlerTimeoutSecs: 30,
    requestHandler: router,
    preNavigationHooks: [
        async ({ request }) => {
            request.userData = { ...request.userData, startTime: Date.now() };
        },
    ],
    failedRequestHandler: async ({ request }, error) => {
        log.warning(`Could not reach ${request.url}: ${(error as Error).message}`);
        brokenLinks.push(request.url);
    },
});

await crawler.run([url]);

const dataset = await Actor.openDataset();
const { items } = await dataset.getData();
const pages = items as unknown as PageAuditResult[];

const report = generateReport(url, pages, brokenLinks);

log.info(`Audit complete: ${pages.length} page(s) crawled, ${brokenLinks.length} broken link(s) found.`);
await Actor.setValue('OUTPUT', report);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
