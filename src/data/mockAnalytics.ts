import { 
  FunnelStageMetric, 
  RecruitmentKPIs, 
  RecruiterMetric, 
  SourceMetric,
  DepartmentFulfillmentMetric,
  MonthlyHiringTrend,
  QualityBracketMetric,
  ExperienceDiversityMetric,
  PeriodAnalyticsData
} from '../types/analytics';

export const ANALYTICS_BY_PERIOD: Record<string, PeriodAnalyticsData> = {
  this_quarter: {
    kpis: {
      timeToHireDays: 21,
      timeToFillDays: 28,
      costPerHire: 8500,
      totalOpenRequisitions: 8,
      activeCandidatesInPipeline: 42,
      totalHiresThisQuarter: 14,
      offerAcceptanceRate: 88,
      candidateSatisfactionScore: 4.8,
      timeToHireChange: -5,
      costPerHireSavings: 18,
      offersSignedCount: 14,
      offersSentTotal: 16,
    },
    funnel: [
      { stageId: 'applied', stageName: 'تم الاستلام (Applied)', stageNameEn: 'Applied', count: 248, conversionRate: 100, averageDaysInStage: 2 },
      { stageId: 'screening', stageName: 'فرز مبدئي (Screening)', stageNameEn: 'Screening', count: 114, conversionRate: 46, averageDaysInStage: 3 },
      { stageId: 'tech_assessment', stageName: 'تقييم فني (Assessment)', stageNameEn: 'Assessment', count: 52, conversionRate: 45, averageDaysInStage: 4 },
      { stageId: 'first_interview', stageName: 'مقابلة أولى (1st Interview)', stageNameEn: '1st Interview', count: 28, conversionRate: 53, averageDaysInStage: 5 },
      { stageId: 'final_interview', stageName: 'مقابلة نهائية (Final Interview)', stageNameEn: 'Final Interview', count: 18, conversionRate: 64, averageDaysInStage: 4 },
      { stageId: 'job_offer', stageName: 'عرض عمل (Job Offer)', stageNameEn: 'Job Offer', count: 16, conversionRate: 88, averageDaysInStage: 3 },
      { stageId: 'hired', stageName: 'تم التعيين (Hired)', stageNameEn: 'Hired', count: 14, conversionRate: 87.5, averageDaysInStage: 0 },
    ],
    sources: [
      { source: 'لينكد إن (LinkedIn Talent)', sourceEn: 'LinkedIn Talent', candidatesCount: 142, hiredCount: 7, spendAmount: 25000, costPerHire: 3571, qualityScore: 92, conversionPercent: 4.9 },
      { source: 'بوابة التوظيف المباشرة (Careers)', sourceEn: 'Careers Portal', candidatesCount: 68, hiredCount: 4, spendAmount: 0, costPerHire: 0, qualityScore: 88, conversionPercent: 5.8 },
      { source: 'إحالات الموظفين (Referrals)', sourceEn: 'Employee Referrals', candidatesCount: 22, hiredCount: 3, spendAmount: 15000, costPerHire: 5000, qualityScore: 96, conversionPercent: 13.6 },
      { source: 'مواقع التوظيف (Wuzzuf & Bayt)', sourceEn: 'Job Boards', candidatesCount: 16, hiredCount: 0, spendAmount: 10000, costPerHire: 0, qualityScore: 68, conversionPercent: 0 },
    ],
    recruiters: [
      { recruiterId: 'user_recruiter_1', name: 'أحمد فؤاد', avatar: '', activeRequisitions: 5, totalCandidatesProcessed: 184, hiredCount: 9, averageTimeToHireDays: 19, offerAcceptanceRate: 90 },
      { recruiterId: 'user_hr_dir', name: 'سارة منصور', avatar: '', activeRequisitions: 3, totalCandidatesProcessed: 64, hiredCount: 5, averageTimeToHireDays: 23, offerAcceptanceRate: 86 },
    ],
    departments: [
      { department: 'الهندسة والبرمجيات', departmentEn: 'Engineering & Tech', openPositions: 4, targetHires: 8, filledHires: 6, fulfillmentRate: 75, avgTimeToHire: 22, color: '#38A37F' },
      { department: 'إدارة المنتجات والتصميم', departmentEn: 'Product & Design', openPositions: 2, targetHires: 4, filledHires: 3, fulfillmentRate: 75, avgTimeToHire: 18, color: '#4ADE80' },
      { department: 'التسويق ونمو الأعمال', departmentEn: 'Marketing & Growth', openPositions: 1, targetHires: 3, filledHires: 3, fulfillmentRate: 100, avgTimeToHire: 16, color: '#38BDF8' },
      { department: 'العمليات والموارد البشرية', departmentEn: 'Operations & HR', openPositions: 1, targetHires: 2, filledHires: 2, fulfillmentRate: 100, avgTimeToHire: 14, color: '#FBBF24' },
    ],
    monthlyTrends: [
      { month: 'يوليو 2026', monthEn: 'July 2026', hiresCount: 4, applicationsCount: 78, avgTimeToHireDays: 24, costPerHire: 9200 },
      { month: 'أغسطس 2026', monthEn: 'August 2026', hiresCount: 6, applicationsCount: 96, avgTimeToHireDays: 20, costPerHire: 8100 },
      { month: 'سبتمبر 2026 (حالي)', monthEn: 'Sept 2026 (Current)', hiresCount: 4, applicationsCount: 74, avgTimeToHireDays: 19, costPerHire: 8200 },
    ],
    qualityBrackets: [
      { bracket: 'مطابقة استثنائية (≥ 90%)', bracketEn: 'Exceptional (≥ 90%)', count: 48, percentage: 19.3, color: '#38A37F', description: 'جاهزون للاختيار المباشر والمقابلات النهائية', descriptionEn: 'Direct fast-track to final interview' },
      { bracket: 'مطابقة عالية (80% - 89%)', bracketEn: 'High Match (80% - 89%)', count: 96, percentage: 38.7, color: '#60A5FA', description: 'مؤهلون للتقييم الفني والمقابلة الأولى', descriptionEn: 'Qualified for tech assessment' },
      { bracket: 'مطابقة مقبولة (65% - 79%)', bracketEn: 'Standard Match (65% - 79%)', count: 72, percentage: 29.0, color: '#FBBF24', description: 'في قائمة الانتظار وبنك المواهب', descriptionEn: 'Talent pool and backup bench' },
      { bracket: 'دون المعايير (< 65%)', bracketEn: 'Under Threshold (< 65%)', count: 32, percentage: 13.0, color: '#F87171', description: 'تم استبعادهم عبر أسئلة الـ Knockout', descriptionEn: 'Filtered out via knockout questions' },
    ],
    experienceDiversity: [
      { level: 'مبتدئ / حديث تخرج (0-2 سنة)', levelEn: 'Junior / Entry (0-2y)', count: 44, percentage: 17.7, color: '#6EE7B7' },
      { level: 'متوسط الخبرة (3-5 سنوات)', levelEn: 'Mid-Level (3-5y)', count: 112, percentage: 45.2, color: '#38A37F' },
      { level: 'خبير أول (6-9 سنوات)', levelEn: 'Senior Specialist (6-9y)', count: 68, percentage: 27.4, color: '#2563EB' },
      { level: 'قيادي / إدارة عليا (10+ سنوات)', levelEn: 'Lead / Executive (10+y)', count: 24, percentage: 9.7, color: '#8B5CF6' },
    ]
  },

  last_quarter: {
    kpis: {
      timeToHireDays: 26,
      timeToFillDays: 34,
      costPerHire: 10400,
      totalOpenRequisitions: 11,
      activeCandidatesInPipeline: 38,
      totalHiresThisQuarter: 11,
      offerAcceptanceRate: 79,
      candidateSatisfactionScore: 4.5,
      timeToHireChange: 2,
      costPerHireSavings: 8,
      offersSignedCount: 11,
      offersSentTotal: 14,
    },
    funnel: [
      { stageId: 'applied', stageName: 'تم الاستلام (Applied)', stageNameEn: 'Applied', count: 210, conversionRate: 100, averageDaysInStage: 3 },
      { stageId: 'screening', stageName: 'فرز مبدئي (Screening)', stageNameEn: 'Screening', count: 88, conversionRate: 41.9, averageDaysInStage: 4 },
      { stageId: 'tech_assessment', stageName: 'تقييم فني (Assessment)', stageNameEn: 'Assessment', count: 42, conversionRate: 47.7, averageDaysInStage: 5 },
      { stageId: 'first_interview', stageName: 'مقابلة أولى (1st Interview)', stageNameEn: '1st Interview', count: 24, conversionRate: 57.1, averageDaysInStage: 6 },
      { stageId: 'final_interview', stageName: 'مقابلة نهائية (Final Interview)', stageNameEn: 'Final Interview', count: 15, conversionRate: 62.5, averageDaysInStage: 5 },
      { stageId: 'job_offer', stageName: 'عرض عمل (Job Offer)', stageNameEn: 'Job Offer', count: 14, conversionRate: 93.3, averageDaysInStage: 4 },
      { stageId: 'hired', stageName: 'تم التعيين (Hired)', stageNameEn: 'Hired', count: 11, conversionRate: 78.5, averageDaysInStage: 0 },
    ],
    sources: [
      { source: 'لينكد إن (LinkedIn Talent)', sourceEn: 'LinkedIn Talent', candidatesCount: 120, hiredCount: 5, spendAmount: 28000, costPerHire: 5600, qualityScore: 89, conversionPercent: 4.1 },
      { source: 'بوابة التوظيف المباشرة (Careers)', sourceEn: 'Careers Portal', candidatesCount: 52, hiredCount: 3, spendAmount: 0, costPerHire: 0, qualityScore: 85, conversionPercent: 5.7 },
      { source: 'إحالات الموظفين (Referrals)', sourceEn: 'Employee Referrals', candidatesCount: 18, hiredCount: 2, spendAmount: 10000, costPerHire: 5000, qualityScore: 94, conversionPercent: 11.1 },
      { source: 'مواقع التوظيف (Wuzzuf & Bayt)', sourceEn: 'Job Boards', candidatesCount: 20, hiredCount: 1, spendAmount: 12000, costPerHire: 12000, qualityScore: 71, conversionPercent: 5.0 },
    ],
    recruiters: [
      { recruiterId: 'user_recruiter_1', name: 'أحمد فؤاد', avatar: '', activeRequisitions: 6, totalCandidatesProcessed: 140, hiredCount: 7, averageTimeToHireDays: 24, offerAcceptanceRate: 80 },
      { recruiterId: 'user_hr_dir', name: 'سارة منصور', avatar: '', activeRequisitions: 5, totalCandidatesProcessed: 70, hiredCount: 4, averageTimeToHireDays: 28, offerAcceptanceRate: 77 },
    ],
    departments: [
      { department: 'الهندسة والبرمجيات', departmentEn: 'Engineering & Tech', openPositions: 6, targetHires: 7, filledHires: 5, fulfillmentRate: 71.4, avgTimeToHire: 28, color: '#38A37F' },
      { department: 'إدارة المنتجات والتصميم', departmentEn: 'Product & Design', openPositions: 3, targetHires: 4, filledHires: 3, fulfillmentRate: 75, avgTimeToHire: 24, color: '#4ADE80' },
      { department: 'التسويق ونمو الأعمال', departmentEn: 'Marketing & Growth', openPositions: 2, targetHires: 3, filledHires: 2, fulfillmentRate: 66.7, avgTimeToHire: 22, color: '#38BDF8' },
      { department: 'العمليات والموارد البشرية', departmentEn: 'Operations & HR', openPositions: 1, targetHires: 2, filledHires: 1, fulfillmentRate: 50, avgTimeToHire: 19, color: '#FBBF24' },
    ],
    monthlyTrends: [
      { month: 'أبريل 2026', monthEn: 'April 2026', hiresCount: 3, applicationsCount: 65, avgTimeToHireDays: 28, costPerHire: 11000 },
      { month: 'مايو 2026', monthEn: 'May 2026', hiresCount: 4, applicationsCount: 72, avgTimeToHireDays: 26, costPerHire: 10200 },
      { month: 'يونيو 2026', monthEn: 'June 2026', hiresCount: 4, applicationsCount: 73, avgTimeToHireDays: 25, costPerHire: 10000 },
    ],
    qualityBrackets: [
      { bracket: 'مطابقة استثنائية (≥ 90%)', bracketEn: 'Exceptional (≥ 90%)', count: 36, percentage: 17.1, color: '#38A37F', description: 'جاهزون للاختيار المباشر والمقابلات النهائية', descriptionEn: 'Direct fast-track to final interview' },
      { bracket: 'مطابقة عالية (80% - 89%)', bracketEn: 'High Match (80% - 89%)', count: 74, percentage: 35.2, color: '#60A5FA', description: 'مؤهلون للتقييم الفني والمقابلة الأولى', descriptionEn: 'Qualified for tech assessment' },
      { bracket: 'مطابقة مقبولة (65% - 79%)', bracketEn: 'Standard Match (65% - 79%)', count: 68, percentage: 32.4, color: '#FBBF24', description: 'في قائمة الانتظار وبنك المواهب', descriptionEn: 'Talent pool and backup bench' },
      { bracket: 'دون المعايير (< 65%)', bracketEn: 'Under Threshold (< 65%)', count: 32, percentage: 15.3, color: '#F87171', description: 'تم استبعادهم عبر أسئلة الـ Knockout', descriptionEn: 'Filtered out via knockout questions' },
    ],
    experienceDiversity: [
      { level: 'مبتدئ / حديث تخرج (0-2 سنة)', levelEn: 'Junior / Entry (0-2y)', count: 38, percentage: 18.1, color: '#6EE7B7' },
      { level: 'متوسط الخبرة (3-5 سنوات)', levelEn: 'Mid-Level (3-5y)', count: 98, percentage: 46.7, color: '#38A37F' },
      { level: 'خبير أول (6-9 سنوات)', levelEn: 'Senior Specialist (6-9y)', count: 54, percentage: 25.7, color: '#2563EB' },
      { level: 'قيادي / إدارة عليا (10+ سنوات)', levelEn: 'Lead / Executive (10+y)', count: 20, percentage: 9.5, color: '#8B5CF6' },
    ]
  },

  ytd: {
    kpis: {
      timeToHireDays: 23,
      timeToFillDays: 30,
      costPerHire: 9100,
      totalOpenRequisitions: 8,
      activeCandidatesInPipeline: 58,
      totalHiresThisQuarter: 37,
      offerAcceptanceRate: 84,
      candidateSatisfactionScore: 4.7,
      timeToHireChange: -8,
      costPerHireSavings: 15,
      offersSignedCount: 37,
      offersSentTotal: 44,
    },
    funnel: [
      { stageId: 'applied', stageName: 'تم الاستلام (Applied)', stageNameEn: 'Applied', count: 680, conversionRate: 100, averageDaysInStage: 2.5 },
      { stageId: 'screening', stageName: 'فرز مبدئي (Screening)', stageNameEn: 'Screening', count: 295, conversionRate: 43.4, averageDaysInStage: 3.5 },
      { stageId: 'tech_assessment', stageName: 'تقييم فني (Assessment)', stageNameEn: 'Assessment', count: 140, conversionRate: 47.5, averageDaysInStage: 4.5 },
      { stageId: 'first_interview', stageName: 'مقابلة أولى (1st Interview)', stageNameEn: '1st Interview', count: 76, conversionRate: 54.3, averageDaysInStage: 5.5 },
      { stageId: 'final_interview', stageName: 'مقابلة نهائية (Final Interview)', stageNameEn: 'Final Interview', count: 48, conversionRate: 63.1, averageDaysInStage: 4.5 },
      { stageId: 'job_offer', stageName: 'عرض عمل (Job Offer)', stageNameEn: 'Job Offer', count: 44, conversionRate: 91.6, averageDaysInStage: 3.5 },
      { stageId: 'hired', stageName: 'تم التعيين (Hired)', stageNameEn: 'Hired', count: 37, conversionRate: 84.1, averageDaysInStage: 0 },
    ],
    sources: [
      { source: 'لينكد إن (LinkedIn Talent)', sourceEn: 'LinkedIn Talent', candidatesCount: 380, hiredCount: 18, spendAmount: 72000, costPerHire: 4000, qualityScore: 91, conversionPercent: 4.7 },
      { source: 'بوابة التوظيف المباشرة (Careers)', sourceEn: 'Careers Portal', candidatesCount: 185, hiredCount: 10, spendAmount: 0, costPerHire: 0, qualityScore: 87, conversionPercent: 5.4 },
      { source: 'إحالات الموظفين (Referrals)', sourceEn: 'Employee Referrals', candidatesCount: 65, hiredCount: 8, spendAmount: 40000, costPerHire: 5000, qualityScore: 95, conversionPercent: 12.3 },
      { source: 'مواقع التوظيف (Wuzzuf & Bayt)', sourceEn: 'Job Boards', candidatesCount: 50, hiredCount: 1, spendAmount: 25000, costPerHire: 25000, qualityScore: 70, conversionPercent: 2.0 },
    ],
    recruiters: [
      { recruiterId: 'user_recruiter_1', name: 'أحمد فؤاد', avatar: '', activeRequisitions: 5, totalCandidatesProcessed: 460, hiredCount: 23, averageTimeToHireDays: 21, offerAcceptanceRate: 86 },
      { recruiterId: 'user_hr_dir', name: 'سارة منصور', avatar: '', activeRequisitions: 3, totalCandidatesProcessed: 220, hiredCount: 14, averageTimeToHireDays: 25, offerAcceptanceRate: 82 },
    ],
    departments: [
      { department: 'الهندسة والبرمجيات', departmentEn: 'Engineering & Tech', openPositions: 4, targetHires: 22, filledHires: 18, fulfillmentRate: 81.8, avgTimeToHire: 24, color: '#38A37F' },
      { department: 'إدارة المنتجات والتصميم', departmentEn: 'Product & Design', openPositions: 2, targetHires: 10, filledHires: 8, fulfillmentRate: 80, avgTimeToHire: 20, color: '#4ADE80' },
      { department: 'التسويق ونمو الأعمال', departmentEn: 'Marketing & Growth', openPositions: 1, targetHires: 8, filledHires: 7, fulfillmentRate: 87.5, avgTimeToHire: 18, color: '#38BDF8' },
      { department: 'العمليات والموارد البشرية', departmentEn: 'Operations & HR', openPositions: 1, targetHires: 5, filledHires: 4, fulfillmentRate: 80, avgTimeToHire: 16, color: '#FBBF24' },
    ],
    monthlyTrends: [
      { month: 'يناير 2026', monthEn: 'Jan 2026', hiresCount: 3, applicationsCount: 58, avgTimeToHireDays: 29, costPerHire: 11500 },
      { month: 'فبراير 2026', monthEn: 'Feb 2026', hiresCount: 4, applicationsCount: 62, avgTimeToHireDays: 27, costPerHire: 10800 },
      { month: 'مارس 2026', monthEn: 'Mar 2026', hiresCount: 5, applicationsCount: 71, avgTimeToHireDays: 26, costPerHire: 9800 },
      { month: 'أبريل 2026', monthEn: 'Apr 2026', hiresCount: 3, applicationsCount: 65, avgTimeToHireDays: 28, costPerHire: 11000 },
      { month: 'مايو 2026', monthEn: 'May 2026', hiresCount: 4, applicationsCount: 72, avgTimeToHireDays: 26, costPerHire: 10200 },
      { month: 'يونيو 2026', monthEn: 'Jun 2026', hiresCount: 4, applicationsCount: 73, avgTimeToHireDays: 25, costPerHire: 10000 },
      { month: 'يوليو 2026', monthEn: 'Jul 2026', hiresCount: 4, applicationsCount: 78, avgTimeToHireDays: 24, costPerHire: 9200 },
      { month: 'أغسطس 2026', monthEn: 'Aug 2026', hiresCount: 6, applicationsCount: 96, avgTimeToHireDays: 20, costPerHire: 8100 },
      { month: 'سبتمبر 2026', monthEn: 'Sep 2026', hiresCount: 4, applicationsCount: 74, avgTimeToHireDays: 19, costPerHire: 8200 },
    ],
    qualityBrackets: [
      { bracket: 'مطابقة استثنائية (≥ 90%)', bracketEn: 'Exceptional (≥ 90%)', count: 128, percentage: 18.8, color: '#38A37F', description: 'جاهزون للاختيار المباشر والمقابلات النهائية', descriptionEn: 'Direct fast-track to final interview' },
      { bracket: 'مطابقة عالية (80% - 89%)', bracketEn: 'High Match (80% - 89%)', count: 262, percentage: 38.5, color: '#60A5FA', description: 'مؤهلون للتقييم الفني والمقابلة الأولى', descriptionEn: 'Qualified for tech assessment' },
      { bracket: 'مطابقة مقبولة (65% - 79%)', bracketEn: 'Standard Match (65% - 79%)', count: 198, percentage: 29.1, color: '#FBBF24', description: 'في قائمة الانتظار وبنك المواهب', descriptionEn: 'Talent pool and backup bench' },
      { bracket: 'دون المعايير (< 65%)', bracketEn: 'Under Threshold (< 65%)', count: 92, percentage: 13.5, color: '#F87171', description: 'تم استبعادهم عبر أسئلة الـ Knockout', descriptionEn: 'Filtered out via knockout questions' },
    ],
    experienceDiversity: [
      { level: 'مبتدئ / حديث تخرج (0-2 سنة)', levelEn: 'Junior / Entry (0-2y)', count: 122, percentage: 17.9, color: '#6EE7B7' },
      { level: 'متوسط الخبرة (3-5 سنوات)', levelEn: 'Mid-Level (3-5y)', count: 310, percentage: 45.6, color: '#38A37F' },
      { level: 'خبير أول (6-9 سنوات)', levelEn: 'Senior Specialist (6-9y)', count: 184, percentage: 27.1, color: '#2563EB' },
      { level: 'قيادي / إدارة عليا (10+ سنوات)', levelEn: 'Lead / Executive (10+y)', count: 64, percentage: 9.4, color: '#8B5CF6' },
    ]
  }
};

export const MOCK_KPIS: RecruitmentKPIs = ANALYTICS_BY_PERIOD.this_quarter.kpis;
export const MOCK_FUNNEL_METRICS: FunnelStageMetric[] = ANALYTICS_BY_PERIOD.this_quarter.funnel;
export const MOCK_SOURCE_METRICS: SourceMetric[] = ANALYTICS_BY_PERIOD.this_quarter.sources;
export const MOCK_RECRUITER_METRICS: RecruiterMetric[] = ANALYTICS_BY_PERIOD.this_quarter.recruiters;
