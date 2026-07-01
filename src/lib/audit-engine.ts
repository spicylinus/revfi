import * as cheerio from 'cheerio';
import { AuditData } from '@/types/audit';

const MAX_PAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface Finding {
  id: string;
  type: 'lead_capture' | 'seo' | 'wrong_searchers' | 'outdated' | 'slow_mobile';
  severity: number; // 1-10
  title: string;
  description: string;
  impactTranslation: string;
  whatThisMeans: string;
}

export async function runAudit(url: string): Promise<AuditData> {
  const warnings: string[] = [];
  
  try {
    // 1. Audit Homepage
    let homepageData = await fetchPageWithRetry(url, 2);
    if (homepageData.warning) warnings.push(`Homepage: ${homepageData.warning}`);

    const $homepage = cheerio.load(homepageData.html || '');
    
    // Extract Business Name
    let businessName = $homepage('title').text().split('|')[0].split('-')[0].trim();
    if (!businessName || businessName.length < 2) {
      businessName = $homepage('h1').first().text().trim();
    }
    if (!businessName || businessName.length < 2) {
      businessName = url.replace('https://', '').replace('www.', '').split('.')[0];
    }
    
    // 2. Find Contact Page
    let contactUrl = findContactPageUrl($homepage, url);
    let contactPageData: any = { html: "", warning: "" };
    if (contactUrl && contactUrl !== url) {
      contactPageData = await fetchPageWithRetry(contactUrl, 1);
      if (contactPageData.warning) warnings.push(`Contact Page: ${contactPageData.warning}`);
    }

    const $contact = contactPageData.html ? cheerio.load(contactPageData.html) : $homepage;

    // 3. Analysis (Internal findings)
    const findings = performAnalysis($homepage, $contact, homepageData.loadTime);

    // 4. Select Primary Leak (Ranking logic)
    const primaryFinding = selectPrimaryFinding(findings);

    // 5. Translation Logic
    const result = translateToAuditResult(url, businessName, primaryFinding, findings);
    
    return result;
  } catch (error: any) {
    console.error('Audit engine error:', error);
    throw error;
  }
}

async function fetchPageWithRetry(url: string, retries: number): Promise<{ html: string; loadTime: number; images: string[]; warning?: string }> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });
      
      clearTimeout(timeoutId);
      const loadTime = Date.now() - startTime;

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const content = await response.text();
      
      const $ = cheerio.load(content);
      const images: string[] = [];
      $('img').each((_, img) => {
        const src = $(img).attr('src');
        if (src) {
          try {
            const absoluteUrl = new URL(src, url).href;
            if (absoluteUrl.startsWith('http') && !absoluteUrl.includes('data:image')) {
              images.push(absoluteUrl);
            }
          } catch (e) {}
        }
      });

      if (content.length > MAX_PAGE_SIZE) {
        return { html: content.substring(0, MAX_PAGE_SIZE), loadTime, images, warning: 'Page too large, analyzed partial content.' };
      }

      return { html: content, loadTime, images };
    } catch (err: any) {
      lastError = err;
      console.warn(`Attempt ${i + 1} failed for ${url}: ${err.message}`);
      if (i < retries) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Linear backoff
      }
    }
  }

  // Graceful degradation: return empty but with warning
  return { html: '', loadTime: 0, images: [], warning: `Failed to reach page after ${retries + 1} attempts: ${lastError.message}` };
}

function findContactPageUrl($: cheerio.CheerioAPI, baseUrl: string): string | null {
  const contactLinks = $('a').filter((i, el) => {
    const text = $(el).text().toLowerCase();
    const href = $(el).attr('href')?.toLowerCase() || '';
    return text.includes('contact') || href.includes('contact');
  });

  const href = contactLinks.first().attr('href');
  if (!href) return null;

  try {
    return new URL(href, baseUrl).href;
  } catch (e) {
    return null;
  }
}

function performAnalysis($homepage: cheerio.CheerioAPI, $contact: cheerio.CheerioAPI, loadTime: number): Finding[] {
  const findings: Finding[] = [];
  const bodyHtml = ($homepage('body').html() || '') + ($contact('body').html() || '');
  
  // 1. Lead Capture (Priority 1)
  const hasForm = $homepage('form').length > 0 || $contact('form').length > 0;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const hasPhone = phoneRegex.test(bodyHtml);
  
  if (!hasForm && !hasPhone) {
    findings.push({
      id: 'leak_lead_capture',
      type: 'lead_capture',
      severity: 10,
      title: 'Visitors ready to call hit a dead end',
      description: 'Your website has no visible contact form or phone number for customers to reach you.',
      impactTranslation: 'Visitors ready to call or fill out a form hit a dead end — that\'s lost business every day.',
      whatThisMeans: 'People are looking for you, finding you, and then leaving because they can\'t figure out how to hire you.'
    });
  } else if (!hasForm) {
    findings.push({
      id: 'leak_form',
      type: 'lead_capture',
      severity: 8,
      title: 'Missing Digital Lead Capture',
      description: 'You\'re relying solely on phone calls, missing customers who prefer to message you.',
      impactTranslation: 'Modern customers expect to be able to request a quote or info without picking up the phone.',
      whatThisMeans: 'You\'re only capturing a fraction of your traffic by forcing everyone to call.'
    });
  } else if (!hasPhone) {
    findings.push({
      id: 'leak_phone',
      type: 'lead_capture',
      severity: 7,
      title: 'No Visible Phone Number',
      description: 'Customers on mobile can\'t tap-to-call you easily, killing your conversion rate.',
      impactTranslation: 'Mobile visitors want to reach you in one click. Without a visible number, they move to the next competitor.',
      whatThisMeans: 'In local service, the fastest way to a lead is a phone call — you\'re making it hard for them.'
    });
  }

  // 2. Outdated (Priority 1.5)
  const hasViewport = $homepage('meta[name="viewport"]').length > 0;
  if (!hasViewport) {
    findings.push({
      id: 'leak_outdated',
      type: 'outdated',
      severity: 9,
      title: 'Fundamentally Outdated Site',
      description: 'Your site isn\'t built for modern mobile devices.',
      impactTranslation: 'Google penalizes sites that aren\'t mobile-friendly, and customers lose trust the moment they see an old design.',
      whatThisMeans: 'An outdated site tells customers that your business might be outdated too — first impressions happen in less than a second.'
    });
  }

  // 3. Mobile Speed (Priority 2)
  if (loadTime > 3000) {
    findings.push({
      id: 'leak_slow_mobile',
      type: 'slow_mobile',
      severity: 8.5,
      title: 'Slow Mobile Loading',
      description: `Your site took ${Math.round(loadTime/100)/10}s to load.`,
      impactTranslation: `${Math.min(90, Math.round((loadTime/1000) * 15))}% of mobile visitors leave before this finishes loading — that's lost calls.`,
      whatThisMeans: 'In a world where 70% of local searches happen on a phone, a slow site is a brick wall between you and your next customer.'
    });
  }

  // 4. SEO (Priority 3)
  const title = $homepage('title').text();
  const description = $homepage('meta[name="description"]').attr('content');
  if (!title || title.length < 10 || !description) {
    findings.push({
      id: 'leak_seo',
      type: 'seo',
      severity: 6,
      title: 'Site functional but not showing in search',
      description: 'Critical search signals like meta titles and descriptions are missing or incomplete.',
      impactTranslation: 'This page likely isn\'t showing up for the specific local searches that would bring you the right customers.',
      whatThisMeans: 'Your competitors are taking the \'easy wins\' on Google because your site isn\'t speaking the language search engines expect.'
    });
  }

  // 5. Wrong Searchers (Priority 4)
  const hasMaps = bodyHtml.includes('google.com/maps') || bodyHtml.includes('maps.google.com');
  if (!hasMaps) {
    findings.push({
      id: 'leak_wrong_searchers',
      type: 'wrong_searchers',
      severity: 5,
      title: 'Wrong searchers finding competitors',
      description: 'Your Google Business Profile isn\'t integrated and local citations are missing.',
      impactTranslation: 'Local searchers are choosing competitors who look more active and established on Google Maps.',
      whatThisMeans: 'If you aren\'t in the top 3 on the map, you effectively don\'t exist for most local customers.'
    });
  }

  return findings;
}

function selectPrimaryFinding(findings: Finding[]): Finding {
  // Ranking order (directness to lost leads)
  const priorityMap: Record<string, number> = {
    'lead_capture': 1,
    'outdated': 2,
    'slow_mobile': 3,
    'seo': 4,
    'wrong_searchers': 5
  };

  return findings.sort((a, b) => {
    const pA = priorityMap[a.type] || 99;
    const pB = priorityMap[b.type] || 99;
    if (pA !== pB) return pA - pB;
    return b.severity - a.severity;
  })[0] || {
    id: 'no_leak',
    type: 'seo',
    severity: 1,
    title: 'Low Visibility',
    description: 'Your site is technically sound but could be reaching more customers.',
    impactTranslation: 'You\'re leaving money on the table by not being #1 for all your services.',
    whatThisMeans: 'Optimization is the difference between surviving and dominating.'
  };
}

function translateToAuditResult(url: string, businessName: string, primary: Finding, allFindings: Finding[]): AuditData {
  let recommendation = "";
  let recommendationType: 'website_fix' | 'seo' | 'signalforge' | 'rebuild' = 'website_fix';
  let softCTA = "Want me to walk you through this?";

  switch(primary.type) {
    case 'lead_capture':
      recommendation = "You need a website fix focused entirely on lead capture. We'll replace your dead ends with high-converting forms and click-to-call buttons that turn passive visitors into paying clients.";
      recommendationType = 'website_fix';
      break;
    case 'seo':
      recommendation = "You need a localized SEO strategy to start showing up where your customers are actually looking. We'll overhaul your metadata and content to climb the rankings for your top services.";
      recommendationType = 'seo';
      break;
    case 'wrong_searchers':
      recommendation = "We recommend deploying SignalForge to dominate your local market. You're losing people before they even search for you — we'll get your business appearing in front of the right searchers at the right time.";
      recommendationType = 'signalforge';
      break;
    case 'outdated':
    case 'slow_mobile':
      recommendation = "This site needs a complete rebuild, not a patch. We'll build you a modern, mobile-first revenue engine that loads instantly and positions you as the clear leader in your area.";
      recommendationType = 'rebuild';
      break;
    default:
      recommendation = "We recommend a comprehensive SEO and conversion audit to identify hidden opportunities for growth.";
      recommendationType = 'seo';
      break;
  }

  const secondaryNotes = allFindings
    .filter(f => f.id !== primary.id)
    .slice(0, 3)
    .map(f => f.title);

  return {
    url,
    businessName,
    primaryLeak: primary.title,
    primaryLeakTitle: primary.title,
    leadImpact: primary.impactTranslation,
    whatThisMeans: primary.whatThisMeans,
    secondaryNotes,
    recommendation,
    recommendationType,
    softCTA
  };
}
