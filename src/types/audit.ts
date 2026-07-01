export interface AuditData {
  url: string;
  businessName?: string;
  primaryLeak: string;
  primaryLeakTitle: string;
  leadImpact: string;
  whatThisMeans: string;
  secondaryNotes: string[];
  recommendation: string;
  recommendationType: 'website_fix' | 'seo' | 'signalforge' | 'rebuild';
  softCTA: string;
}

export interface AuditResponse {
  success: boolean;
  data?: AuditData;
  error?: string;
}
