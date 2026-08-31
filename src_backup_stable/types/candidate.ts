export type PipelineStageId = 
  | 'applied'           // تم الاستلام
  | 'screening'         // فرز مبدئي
  | 'tech_assessment'   // تقييم فني
  | 'first_interview'   // مقابلة أولى
  | 'final_interview'   // مقابلة نهائية
  | 'job_offer'         // عرض عمل
  | 'hired'             // تم التعيين
  | 'rejected';         // مرفوض

export interface CandidateNote {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  isPrivate: boolean; // Only visible to HR/Hiring Manager
}

export interface CandidateActivity {
  id: string;
  type: 'stage_change' | 'note_added' | 'scorecard_submitted' | 'interview_scheduled' | 'offer_created' | 'offer_signed' | 'document_uploaded' | 'synced_hr' | 'email_sent';
  title: string;
  titleEn: string;
  description: string;
  performedBy: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface KnockoutResult {
  questionId: string;
  question: string;
  answer: string;
  passed: boolean;
}

export interface ParsedResumeData {
  summary: string;
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  education: string;
  experienceSummary: string;
  yearsOfExperience: number;
  languages: string[];
  certifications: string[];
}

export interface Candidate {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  experienceYears: number;
  education: string;
  currentSalary?: number;
  expectedSalary?: number;
  currency: string;
  noticePeriodDays: number;
  source: 'linkedin' | 'careers_page' | 'referral' | 'indeed' | 'bayt' | 'direct';
  utmSource?: string;
  utmCampaign?: string;
  referralEmployeeName?: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: string;
  stage: PipelineStageId;
  status: 'active' | 'rejected' | 'hired' | 'withdrawn';
  matchScore: number; // 0 - 100%
  rating: number; // 1 - 5
  tags: string[];
  resumeUrl?: string;
  parsedResume: ParsedResumeData;
  knockoutResults: KnockoutResult[];
  notes: CandidateNote[];
  activities: CandidateActivity[];
  rejectionReason?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface PipelineStageConfig {
  id: PipelineStageId;
  title: string;
  titleEn: string;
  color: string;
  description: string;
  order: number;
}

export const DEFAULT_STAGES: PipelineStageConfig[] = [
  { id: 'applied', title: 'تم الاستلام', titleEn: 'Applied', color: '#1B4938', description: 'طلبات التقديم الجديدة غير المفروزة', order: 1 },
  { id: 'screening', title: 'فرز مبدئي', titleEn: 'Screening', color: '#38A37F', description: 'مطابقة المعايير والخبرات الأساسية', order: 2 },
  { id: 'tech_assessment', title: 'تقييم فني', titleEn: 'Assessment', color: '#1E588F', description: 'اختبارات تقنية ولغوية', order: 3 },
  { id: 'first_interview', title: 'مقابلة أولى', titleEn: '1st Interview', color: '#8F5B1E', description: 'مقابلة الموارد البشرية والمدير المباشر', order: 4 },
  { id: 'final_interview', title: 'مقابلة نهائية', titleEn: 'Final Interview', color: '#6A2A82', description: 'المقابلة مع القيادة التنفيذية', order: 5 },
  { id: 'job_offer', title: 'عرض عمل', titleEn: 'Offer', color: '#2D8667', description: 'إصدار وتوقيع العرض الوظيفي', order: 6 },
  { id: 'hired', title: 'تم التعيين', titleEn: 'Hired', color: '#1B4938', description: 'إتمام مسوغات التعيين والتحويل للنظام', order: 7 },
  { id: 'rejected', title: 'مرفوض', titleEn: 'Rejected', color: '#C85A48', description: 'استبعاد أو اعتذار مؤتمت', order: 8 },
];
