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

export interface AuditData {
  url: string;
  businessName?: string;
  overallGrade: string;
  overallScore: number;
  subScores: SubScores;
  revenueLeaks: RevenueLeak[];
  checklist: ChecklistItem[];
  actionPlan: ActionPlan;
  images?: string[];
  warnings?: string[];
}

export interface AuditResponse {
  success: boolean;
  data?: AuditData;
  error?: string;
}
