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
}

export interface ClientProfile {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  industry: 'Home Services' | 'Health & Wellness' | 'Food & Beverage' | 'Retail' | 'Professional Services' | 'Other';
  address: string;
  bio: string;
  logoUrl?: string;
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
  profile?: ClientProfile;
  competitorAudits?: any[];
  billing?: {
    monthlyRate: number;
    nextBillingDate: string;
    invoices: Invoice[];
  };
}
