import { FunnelStageMetric, RecruitmentKPIs, RecruiterMetric, SourceMetric } from '../types/analytics';

export const MOCK_KPIS: RecruitmentKPIs = {
  timeToHireDays: 21,
  timeToFillDays: 28,
  costPerHire: 8500,
  totalOpenRequisitions: 8,
  activeCandidatesInPipeline: 42,
  totalHiresThisQuarter: 14,
  offerAcceptanceRate: 88,
  candidateSatisfactionScore: 4.8,
};

export const MOCK_FUNNEL_METRICS: FunnelStageMetric[] = [
  {
    stageId: 'applied',
    stageName: 'تم الاستلام (Applied)',
    stageNameEn: 'Applied',
    count: 248,
    conversionRate: 100,
    averageDaysInStage: 2,
  },
  {
    stageId: 'screening',
    stageName: 'فرز مبدئي (Screening)',
    stageNameEn: 'Screening',
    count: 114,
    conversionRate: 46,
    averageDaysInStage: 3,
  },
  {
    stageId: 'tech_assessment',
    stageName: 'تقييم فني (Assessment)',
    stageNameEn: 'Assessment',
    count: 52,
    conversionRate: 45,
    averageDaysInStage: 4,
  },
  {
    stageId: 'first_interview',
    stageName: 'مقابلة أولى (1st Interview)',
    stageNameEn: '1st Interview',
    count: 28,
    conversionRate: 53,
    averageDaysInStage: 5,
  },
  {
    stageId: 'final_interview',
    stageName: 'مقابلة نهائية (Final Interview)',
    stageNameEn: 'Final Interview',
    count: 18,
    conversionRate: 64,
    averageDaysInStage: 4,
  },
  {
    stageId: 'job_offer',
    stageName: 'عرض عمل (Job Offer)',
    stageNameEn: 'Job Offer',
    count: 15,
    conversionRate: 83,
    averageDaysInStage: 3,
  },
  {
    stageId: 'hired',
    stageName: 'تم التعيين (Hired)',
    stageNameEn: 'Hired',
    count: 14,
    conversionRate: 93,
    averageDaysInStage: 0,
  },
];

export const MOCK_SOURCE_METRICS: SourceMetric[] = [
  {
    source: 'لينكد إن (LinkedIn Talent Solutions)',
    sourceEn: 'LinkedIn',
    candidatesCount: 142,
    hiredCount: 7,
    spendAmount: 25000,
    costPerHire: 3571,
    qualityScore: 92,
  },
  {
    source: 'بوابة التوظيف المباشرة (Careers Page)',
    sourceEn: 'Careers Portal',
    candidatesCount: 68,
    hiredCount: 4,
    spendAmount: 0,
    costPerHire: 0,
    qualityScore: 88,
  },
  {
    source: 'إحالات الموظفين الداخلية (Employee Referrals)',
    sourceEn: 'Employee Referrals',
    candidatesCount: 22,
    hiredCount: 3,
    spendAmount: 15000,
    costPerHire: 5000,
    qualityScore: 96,
  },
  {
    source: 'مواقع التوظيف والشبكات المهنية (Job Boards)',
    sourceEn: 'Job Boards',
    candidatesCount: 16,
    hiredCount: 0,
    spendAmount: 10000,
    costPerHire: 0,
    qualityScore: 68,
  },
];

export const MOCK_RECRUITER_METRICS: RecruiterMetric[] = [
  {
    recruiterId: 'user_recruiter_1',
    name: 'أحمد فؤاد',
    avatar: '',
    activeRequisitions: 5,
    totalCandidatesProcessed: 184,
    hiredCount: 9,
    averageTimeToHireDays: 19,
    offerAcceptanceRate: 90,
  },
  {
    recruiterId: 'user_hr_dir',
    name: 'سارة منصور',
    avatar: '',
    activeRequisitions: 3,
    totalCandidatesProcessed: 64,
    hiredCount: 5,
    averageTimeToHireDays: 23,
    offerAcceptanceRate: 86,
  },
];
