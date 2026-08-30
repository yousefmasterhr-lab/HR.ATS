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
  timeToHireDays: number; // e.g. 21 days
  timeToFillDays: number;
  costPerHire: number; // e.g. 8,500 EGP
  totalOpenRequisitions: number;
  activeCandidatesInPipeline: number;
  totalHiresThisQuarter: number;
  offerAcceptanceRate: number; // e.g. 88%
  candidateSatisfactionScore: number; // e.g. 4.8 / 5
}
