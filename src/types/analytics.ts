export interface FunnelStageMetric {
  stageId: string;
  stageName: string;
  stageNameEn: string;
  count: number;
  conversionRate: number; // percentage
  averageDaysInStage: number;
}

export interface SourceMetric {
  source: string;
  sourceEn: string;
  candidatesCount: number;
  hiredCount: number;
  spendAmount: number;
  costPerHire: number;
  qualityScore: number; // 1-100
  conversionPercent: number;
}

export interface RecruiterMetric {
  recruiterId: string;
  name: string;
  avatar: string;
  activeRequisitions: number;
  totalCandidatesProcessed: number;
  hiredCount: number;
  averageTimeToHireDays: number;
  offerAcceptanceRate: number;
}

export interface RecruitmentKPIs {
  timeToHireDays: number;
  timeToFillDays: number;
  costPerHire: number;
  totalOpenRequisitions: number;
  activeCandidatesInPipeline: number;
  totalHiresThisQuarter: number;
  offerAcceptanceRate: number;
  candidateSatisfactionScore: number;
  timeToHireChange: number; // vs previous period
  costPerHireSavings: number; // percentage
  offersSignedCount: number;
  offersSentTotal: number;
}

export interface DepartmentFulfillmentMetric {
  department: string;
  departmentEn: string;
  openPositions: number;
  targetHires: number;
  filledHires: number;
  fulfillmentRate: number; // percentage
  avgTimeToHire: number;
  color: string;
}

export interface MonthlyHiringTrend {
  month: string;
  monthEn: string;
  hiresCount: number;
  applicationsCount: number;
  avgTimeToHireDays: number;
  costPerHire: number;
}

export interface QualityBracketMetric {
  bracket: string;
  bracketEn: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
  descriptionEn: string;
}

export interface ExperienceDiversityMetric {
  level: string;
  levelEn: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PeriodAnalyticsData {
  kpis: RecruitmentKPIs;
  funnel: FunnelStageMetric[];
  sources: SourceMetric[];
  recruiters: RecruiterMetric[];
  departments: DepartmentFulfillmentMetric[];
  monthlyTrends: MonthlyHiringTrend[];
  qualityBrackets: QualityBracketMetric[];
  experienceDiversity: ExperienceDiversityMetric[];
}
