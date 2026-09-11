export type RequisitionStatus = 
  | 'draft'
  | 'pending_hr'
  | 'pending_finance'
  | 'pending_executive'
  | 'approved'
  | 'published'
  | 'completed'
  | 'archived'
  | 'rejected'
  | 'closed';

export type RequisitionReason = 'replacement' | 'expansion' | 'new_project' | 'seasonal';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'remote' | 'hybrid';

export interface ApprovalStep {
  tier: number;
  tierName: string;
  tierNameEn: string;
  role: 'hr_manager' | 'finance_director' | 'executive';
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comments?: string;
  actionDate?: string;
}

export interface KnockoutRule {
  id: string;
  question: string;
  questionEn: string;
  expectedAnswer: 'yes' | 'no' | string;
  isMandatory: boolean;
}

export interface JobRequisition {
  id: string;
  code: string; // e.g. REQ-2026-081
  title: string;
  titleEn: string;
  department: string;
  departmentEn: string;
  reason: RequisitionReason;
  headcount: number;
  filledCount: number;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  employmentType: EmploymentType;
  location: string;
  locationEn: string;
  experienceYearsMin: number;
  experienceYearsMax: number;
  educationLevel: string;
  educationLevelEn: string;
  skills: string[];
  description: string;
  descriptionEn: string;
  responsibilities: string[];
  requirements: string[];
  hiringManagerId: string;
  hiringManagerName: string;
  recruiterId?: string;
  recruiterName?: string;
  approvalChain: ApprovalStep[];
  currentTier: number;
  status: RequisitionStatus;
  knockoutQuestions: KnockoutRule[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  targetHireDate: string;
}

export interface JobTemplate {
  id: string;
  title: string;
  titleEn: string;
  department: string;
  departmentEn: string;
  defaultDescription: string;
  defaultResponsibilities: string[];
  defaultRequirements: string[];
  defaultSkills: string[];
  suggestedSalaryRange: { min: number; max: number };
}
