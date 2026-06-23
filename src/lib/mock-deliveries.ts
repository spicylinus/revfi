import { DeliveryData } from '@/types/delivery';

export const CLIENT_DELIVERIES: Record<string, DeliveryData> = {
  'sd-plumbing': {
    clientName: 'S & D Plumbing',
    websiteUrl: 'https://sdplumbing.com',
    tier: 'SEO',
    startDate: 'May 1, 2026',
    nextReportDate: 'June 1, 2026',
    calendlyUrl: 'https://calendly.com/social-linus/siteauditor-follow-up-meeting',
    activeWorkstreams: [
      'Technical SEO Implementation',
      'Google Business Profile Posting',
      'Pillar Page Internal Linking',
      'Local Keyword Targeting',
      'Backlink Acquisition'
    ],
    metrics: [
      { label: 'Organic Traffic', value: '1.2K', change: 24, isPositive: true },
      { label: 'Keyword Rankings', value: 156, change: 5, isPositive: true },
      { label: 'Avg Load Time', value: '1.2s', change: 12, isPositive: true },
      { label: 'Qualified Leads', value: 42, change: 18, isPositive: true }
    ],
    billing: {
      monthlyRate: 1500,
      nextBillingDate: 'June 1, 2026',
      stripeCustomerPortalUrl: 'https://billing.stripe.com/p/login/test_123',
      invoices: [
        {
          id: 'INV-001',
          amount: 2500,
          date: 'May 1, 2026',
          status: 'paid',
          description: 'Website Redesign Deposit',
          stripeUrl: 'https://stripe.com/i/inv-001'
        },
        {
          id: 'INV-002',
          amount: 1500,
          date: 'May 1, 2026',
          status: 'paid',
          description: 'SEO Monthly Subscription - May',
          stripeUrl: 'https://stripe.com/i/inv-002'
        }
      ]
    },
    strategyPlan: {
      goal: 'Rank #1 on Google for "Austin emergency plumber" and "Austin drain cleaning" within 90 days.',
      primaryKeywords: ['Austin emergency plumber', 'Austin drain cleaning', 'Austin plumber near me', '24 hour plumber Austin'],
      milestones: [
        { week: 'Weeks 1-2', title: 'Technical SEO Foundation', description: 'Fix crawl errors, optimize site speed, submit XML sitemap.', status: 'completed' },
        { week: 'Weeks 3-4', title: 'Local SEO Push', description: 'GBP optimization, local citation building, review acquisition strategy.', status: 'in-progress' },
        { week: 'Weeks 5-8', title: 'Content Engine', description: 'Publish 8 service area pages, 2 blog posts targeting emergency plumbing keywords.', status: 'upcoming' },
        { week: 'Weeks 9-12', title: 'Authority Building', description: 'Backlink outreach to local Austin directories, home services publications, and partnerships.', status: 'upcoming' },
      ],
      nextReviewDate: 'June 1, 2026'
    },
    competitorAudits: [
      {
        competitorUrl: 'https://www.rooterhero.com',
        auditedAt: '2026-05-11T14:30:00Z',
        result: {
          overallGrade: 'D',
          overallScore: 62,
          subScores: {
            seo: 70,
            leadCapture: 40,
            localSeo: 80,
            mobile: 55
          },
          revenueLeaks: [
            {
              id: 'c-leak-1',
              severity: 'critical',
              title: 'No Real-time Booking',
              estimatedImpact: 3500
            },
            {
              id: 'c-leak-2',
              severity: 'high',
              title: 'Poor Mobile Performance',
              estimatedImpact: 2200
            }
          ]
        }
      }
    ],
    recentWork: [
      {
        id: '1',
        date: 'May 9, 2026',
        title: 'GBP Daily Post: Emergency Repair',
        description: 'Published localized post targeting Austin metro area for emergency plumbing services.',
        category: 'local'
      },
      {
        id: '2',
        date: 'May 8, 2026',
        title: 'Pillar Page Update: Residential Services',
        description: 'Implemented internal linking model between residential pillar and 5 new service sub-posts.',
        category: 'content',
        link: '#'
      },
      {
        id: '3',
        date: 'May 7, 2026',
        title: 'AEO Optimization: Leaky Faucet FAQ',
        description: 'Restructured FAQ schema to target Google Answer Box for common plumbing queries.',
        category: 'aeo'
      },
      {
        id: '4',
        date: 'May 5, 2026',
        title: 'Core Web Vitals Optimization',
        description: 'Reduced LCP from 2.4s to 1.1s via image compression and script deferral.',
        category: 'technical'
      }
    ],
    profile: {
      businessName: 'S & D Plumbing',
      ownerName: 'Sam Draper',
      email: 'sam@sdplumbing.com',
      phone: '512-555-0123',
      websiteUrl: 'https://sdplumbing.com',
      industry: 'Home Services',
      address: '123 Pipe Lane, Austin, TX 78701',
      bio: 'Family owned and operated plumbing experts serving the Austin area for over 20 years.'
    }
  },
  'spruce-salon': {
    clientName: 'Spruce Salon',
    websiteUrl: 'https://www.sprucesalonaustin.com/',
    tier: 'LeadGen',
    startDate: 'May 10, 2026',
    nextReportDate: 'June 10, 2026',
    calendlyUrl: 'https://calendly.com/social-linus/siteauditor-follow-up-meeting',
    activeWorkstreams: [
      'Ski Slope Content Strategy',
      'Visual Brand Integration',
      'Answer Engine Optimization (AEO)',
      'On-Page Optimization',
      'Service Page Expansion'
    ],
    metrics: [
      { label: 'Qualified Leads', value: 24, change: 100, isPositive: true },
      { label: 'Organic Traffic', value: '850', change: 12, isPositive: true },
      { label: 'Ranking Keywords', value: 42, change: 8, isPositive: true },
      { label: 'Mobile Score', value: 92, change: 45, isPositive: true }
    ],
    billing: {
      monthlyRate: 1900,
      nextBillingDate: 'June 10, 2026',
      stripeCustomerPortalUrl: 'https://billing.stripe.com/p/login/test_456',
      invoices: [
        {
          id: 'INV-003',
          amount: 2500,
          date: 'May 10, 2026',
          status: 'paid',
          description: 'Website Redesign Deposit',
          stripeUrl: 'https://stripe.com/i/inv-003'
        },
        {
          id: 'INV-004',
          amount: 1900,
          date: 'May 10, 2026',
          status: 'pending',
          description: 'Lead Gen Monthly Subscription - May',
          stripeUrl: 'https://stripe.com/i/inv-004'
        }
      ]
    },
    strategyPlan: {
      goal: 'Increase qualified leads by 200% in 90 days through local SEO dominance and conversion-optimized service pages.',
      primaryKeywords: ['Austin hair salon', 'balayage Austin', 'best salon South Congress Austin', 'Austin salon near me'],
      milestones: [
        { week: 'Weeks 1-2', title: 'Site Speed & Mobile Audit', description: 'Fix all Core Web Vitals issues, ensure 90+ mobile score across all pages.', status: 'completed' },
        { week: 'Weeks 3-4', title: 'Service Page Overhaul', description: 'Rewrite all service pages with keyword-rich copy, booking CTAs, and gallery integration.', status: 'in-progress' },
        { week: 'Weeks 5-8', title: 'Content Flywheel', description: 'Launch Ski Slope content strategy: publish 4 blog posts targeting high-intent beauty keywords.', status: 'upcoming' },
        { week: 'Weeks 9-12', title: 'Local Map Dominance', description: 'GBP optimization, local guide features, and partnership outreach to wedding and event venues.', status: 'upcoming' },
      ],
      nextReviewDate: 'June 10, 2026'
    },
    recentWork: [
      {
        id: '1',
        date: 'May 10, 2026',
        title: 'Initial SEO Audit & Strategy',
        description: 'Identified core high-intent keywords for salon services in the Austin area.',
        category: 'technical'
      },
      {
        id: '2',
        date: 'May 10, 2026',
        title: 'Mobile Optimization Suite',
        description: 'Fixed core layout shifts and image sizing issues to reach 90+ lighthouse score.',
        category: 'technical'
      }
    ],
    profile: {
      businessName: 'Spruce Salon',
      ownerName: 'Elena Spruce',
      email: 'elena@sprucesalon.com',
      phone: '512-555-0987',
      websiteUrl: 'https://www.sprucesalonaustin.com/',
      industry: 'Health & Wellness',
      address: '456 Style Blvd, Austin, TX 78704',
      bio: 'Eco-friendly boutique salon specializing in modern cuts and organic coloring.'
    }
  }
};
