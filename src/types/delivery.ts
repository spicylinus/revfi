export type ServiceTier = 'SEO' | 'LeadGen';

export interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'content' | 'technical' | 'local' | 'aeo';
  link?: string;
}

export interface MetricTrend {
  label: string;
  value: string | number;
  change: number; // percentage
  isPositive: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  stripeUrl?: string;
  pdfUrl?: string;
}

export interface StrategyMilestone {
  week: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

export interface StrategyPlan {
  goal: string;
  primaryKeywords: string[];
  milestones: StrategyMilestone[];
  nextReviewDate: string;
}

export interface DeliveryData {
  clientName: string;
  websiteUrl: string;
  tier: ServiceTier;
  startDate: string;
  nextReportDate: string;
  activeWorkstreams: string[];
  metrics: MetricTrend[];
  recentWork: WorkLogEntry[];
  competitorAudits?: any[];
  billing?: {
    monthlyRate: number;
    nextBillingDate: string;
    invoices: Invoice[];
    stripeCustomerPortalUrl?: string;
  };
  calendlyUrl?: string;
  strategyPlan?: StrategyPlan;
}
