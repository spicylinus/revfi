import * as cheerio from 'cheerio';

export interface SubScores {
  seo: number;
  leadCapture: number;
  localSeo: number;
  mobile: number;
}

export interface RevenueLeak {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: keyof SubScores;
  title: string;
  description: string;
  estimatedImpact: number;
  fix: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: keyof SubScores;
  priority: number;
  estimatedValue: number;
  action: string;
  timeEstimate: string;
}

export interface ActionTask {
  task: string;
  time: string;
  difficulty: number;
}

export interface ActionPlan {
  daily: ActionTask[];
  weekly: ActionTask[];
  monthly: ActionTask[];
}

export interface AuditResult {
  url: string;
  overallGrade: string;
  overallScore: number;
  subScores: SubScores;
  revenueLeaks: RevenueLeak[];
  checklist: ChecklistItem[];
  actionPlan: ActionPlan;
  images?: string[];
  warnings?: string[];
}

const MAX_PAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function runAudit(url: string): Promise<AuditResult> {
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

    // Analysis
    const seoScore = calculateSeoScore($homepage);
    const leadCaptureScore = calculateLeadCaptureScore($homepage, $contact);
    const localSeoScore = calculateLocalSeoScore($homepage, $contact);
    const mobileScore = calculateMobileScore($homepage, homepageData.loadTime || 0);
    
    const overallScore = Math.round(
      (seoScore * 0.3) +
      (leadCaptureScore * 0.3) +
      (localSeoScore * 0.25) +
      (mobileScore * 0.15)
    );
    
    const overallGrade = calculateGrade(overallScore);
    const revenueLeaks = identifyRevenueLeaks($homepage, $contact, { seoScore, leadCaptureScore, localSeoScore, mobileScore });
    const checklist = generateChecklist(revenueLeaks);
    const actionPlan = generateActionPlan(checklist);
    
    // No longer saving to filesystem, just returning the collected images
    const images = [...new Set([...homepageData.images, ...(contactPageData.images || [])])];
    
    return {
      url,
      businessName,
      overallGrade,
      overallScore,
      subScores: {
        seo: seoScore,
        leadCapture: leadCaptureScore,
        localSeo: localSeoScore,
        mobile: mobileScore,
      },
      revenueLeaks,
      checklist,
      actionPlan,
      images: images.slice(0, 10), // Limit to top 10 images
      warnings: warnings.length > 0 ? warnings : undefined,
    };
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

function calculateSeoScore($: cheerio.CheerioAPI): number {
  let score = 0;
  const title = $('title').text();
  if (title && title.length > 10) score += 20;
  
  const description = $('meta[name="description"]').attr('content');
  if (description && description.length > 50) score += 20;
  
  const h1 = $('h1');
  if (h1.length === 1) score += 20;
  
  const images = $('img');
  const imagesWithAlt = $('img[alt]');
  if (images.length > 0 && imagesWithAlt.length / images.length > 0.5) score += 20;
  
  const bodyText = $('body').text();
  if (bodyText.length > 1000) score += 20;
  
  return score;
}

function calculateLeadCaptureScore($homepage: cheerio.CheerioAPI, $contact: cheerio.CheerioAPI): number {
  let score = 0;
  
  const hasForm = $homepage('form').length > 0 || $contact('form').length > 0;
  if (hasForm) score += 40;
  
  const bodyHtml = ($homepage('body').html() || '') + ($contact('body').html() || '');
  const bodyTextLower = bodyHtml.toLowerCase();
  
  if (bodyTextLower.includes('contact') || bodyTextLower.includes('call') || bodyTextLower.includes('book')) score += 20;
  
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phoneRegex.test(bodyHtml)) score += 20;
  
  const ctas = $homepage('a, button').filter((i, el) => {
    const text = $homepage(el).text().toLowerCase();
    return text.includes('get started') || text.includes('quote') || text.includes('contact') || text.includes('sign up') || text.includes('book');
  });
  if (ctas.length > 0) score += 20;
  
  return score;
}

function calculateLocalSeoScore($homepage: cheerio.CheerioAPI, $contact: cheerio.CheerioAPI): number {
  let score = 0;
  const bodyHtml = ($homepage('body').html() || '') + ($contact('body').html() || '');
  const lowerHtml = bodyHtml.toLowerCase();
  
  if (lowerHtml.includes('st.') || lowerHtml.includes('street') || lowerHtml.includes('ave') || lowerHtml.includes('road')) score += 25;
  
  const scripts = $homepage('script[type="application/ld+json"]').add($contact('script[type="application/ld+json"]'));
  let hasLocalBusinessSchema = false;
  scripts.each((i, el) => {
    try {
      const json = JSON.parse($homepage(el).html() || '{}');
      if (json['@type'] === 'LocalBusiness' || (Array.isArray(json['@type']) && json['@type'].includes('LocalBusiness'))) {
        hasLocalBusinessSchema = true;
      }
    } catch (e) {}
  });
  if (hasLocalBusinessSchema) score += 40;
  
  if (lowerHtml.includes('google.com/maps') || lowerHtml.includes('maps.google.com')) score += 25;
  if (lowerHtml.includes('review') || lowerHtml.includes('testimonial')) score += 10;
  
  return score;
}

function calculateMobileScore($: cheerio.CheerioAPI, loadTime: number): number {
  let score = 0;
  const viewport = $('meta[name="viewport"]');
  if (viewport.length > 0) score += 50;
  const loadTimeScore = Math.max(0, Math.min(50, 50 - (loadTime - 1000) / 80));
  score += Math.round(loadTimeScore);
  return score;
}

function calculateGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function identifyRevenueLeaks($homepage: cheerio.CheerioAPI, $contact: cheerio.CheerioAPI, scores: any): RevenueLeak[] {
  const leaks: RevenueLeak[] = [];
  
  if ($homepage('form').length === 0 && $contact('form').length === 0) {
    leaks.push({
      id: 'leak-1',
      severity: 'critical',
      category: 'leadCapture',
      title: 'Missing contact form',
      description: 'Your website has no way for potential customers to contact you directly via a form.',
      estimatedImpact: 2400,
      fix: 'Add a prominent contact form on your homepage and contact page.'
    });
  }
  
  const bodyHtml = ($homepage('body').html() || '') + ($contact('body').html() || '');
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (!phoneRegex.test(bodyHtml)) {
    leaks.push({
      id: 'leak-2',
      severity: 'critical',
      category: 'leadCapture',
      title: 'No phone number visible',
      description: 'Customers cannot find a phone number to call you, which kills trust and leads.',
      estimatedImpact: 1800,
      fix: 'Place your phone number clearly in the header and footer of every page.'
    });
  }
  
  if ($homepage('meta[name="description"]').length === 0) {
    leaks.push({
      id: 'leak-3',
      severity: 'medium',
      category: 'seo',
      title: 'Missing meta description',
      description: 'Search engines do not have a summary of your page, leading to lower click-through rates.',
      estimatedImpact: 600,
      fix: 'Add a unique meta description for each page between 150-160 characters.'
    });
  }
  
  if (!bodyHtml.includes('google.com/maps')) {
    leaks.push({
      id: 'leak-4',
      severity: 'high',
      category: 'localSeo',
      title: 'Missing Google Maps integration',
      description: 'Local customers might have trouble finding your physical location or service area.',
      estimatedImpact: 1200,
      fix: 'Embed a Google Map on your contact or about page.'
    });
  }

  if (scores.mobile < 40) {
    leaks.push({
      id: 'leak-5',
      severity: 'high',
      category: 'mobile',
      title: 'Slow page load speed',
      description: 'Your site takes too long to load, causing 50%+ of mobile users to bounce before seeing your offer.',
      estimatedImpact: 3200,
      fix: 'Optimize image sizes and remove unused scripts to improve loading speed.'
    });
  }
  
  return leaks;
}

function generateChecklist(leaks: RevenueLeak[]): ChecklistItem[] {
  return leaks.map((leak, index) => ({
    id: `check-${index + 1}`,
    title: leak.title,
    category: leak.category,
    priority: index + 1,
    estimatedValue: leak.estimatedImpact,
    action: leak.fix,
    timeEstimate: leak.severity === 'critical' ? '30 minutes' : '15 minutes'
  })).sort((a, b) => b.estimatedValue - a.estimatedValue);
}

function generateActionPlan(checklist: ChecklistItem[]): ActionPlan {
  return {
    daily: checklist.filter(c => c.timeEstimate === '15 minutes').slice(0, 2).map(c => ({
      task: c.title,
      time: c.timeEstimate,
      difficulty: 1
    })),
    weekly: checklist.filter(c => c.timeEstimate === '30 minutes').slice(0, 3).map(c => ({
      task: c.title,
      time: c.timeEstimate,
      difficulty: 2
    })),
    monthly: [
      { task: 'Comprehensive SEO Overhaul', time: '4 hours', difficulty: 3 },
      { task: 'Lead Magnet Creation', time: '2 hours', difficulty: 2 }
    ]
  };
}
