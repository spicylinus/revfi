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
