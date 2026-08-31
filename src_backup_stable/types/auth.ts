export type UserRole = 
  | 'hr_manager' 
  | 'recruiter' 
  | 'hiring_manager' 
  | 'reviewer' 
  | 'super_admin'
  | 'candidate';

export type PermissionKey =
  // Salary & Confidential Data
  | 'view_salary'
  | 'edit_salary'
  | 'view_financial_budget'
  // Job Requisitions & Approvals
  | 'view_requisitions'
  | 'create_requisition'
  | 'edit_requisition'
  | 'approve_requisition'
  | 'delete_requisition'
  | 'manage_job_library'
  // Candidates & Applications
  | 'view_candidates'
  | 'create_candidate'
  | 'edit_candidate'
  | 'move_candidate_stage'
  | 'reject_candidate'
  | 'delete_candidate'
  // Interviews & Scorecards
  | 'schedule_interview'
  | 'conduct_interview'
  | 'view_scorecards'
  | 'create_scorecard'
  | 'view_all_evaluations'
  // Offers & Preboarding
  | 'create_offer'
  | 'view_offer'
  | 'approve_offer'
  | 'send_offer'
  | 'verify_documents'
  | 'sync_core_hr'
  // Talent Pool & CRM
  | 'view_talent_pool'
  | 'manage_talent_tags'
  | 'launch_campaign'
  // Automations & Analytics
  | 'manage_automations'
  | 'view_analytics'
  | 'export_reports'
  // System Administration
  | 'manage_users'
  | 'manage_roles_matrix';

export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  departmentEn: string;
  title: string;
  titleEn: string;
  phone?: string;
  customPermissions?: PermissionKey[];
  isActive: boolean;
  lastLogin?: string;
}

export interface RoleDefinition {
  id: UserRole;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  badgeBg: string;
  badgeText: string;
  permissions: PermissionKey[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  super_admin: {
    id: 'super_admin',
    name: 'مسؤول النظام الأعلى',
    nameEn: 'Super Administrator',
    description: 'صلاحيات مطلقة لإدارة النظام، الأمان، والربط التقني',
    descriptionEn: 'Full system access, compliance, and integration controls',
    badgeBg: '#1B4938',
    badgeText: '#FAF8F5',
    permissions: [
      'view_salary', 'edit_salary', 'view_financial_budget',
      'view_requisitions', 'create_requisition', 'edit_requisition', 'approve_requisition', 'delete_requisition', 'manage_job_library',
      'view_candidates', 'create_candidate', 'edit_candidate', 'move_candidate_stage', 'reject_candidate', 'delete_candidate',
      'schedule_interview', 'conduct_interview', 'view_scorecards', 'create_scorecard', 'view_all_evaluations',
      'create_offer', 'view_offer', 'approve_offer', 'send_offer', 'verify_documents', 'sync_core_hr',
      'view_talent_pool', 'manage_talent_tags', 'launch_campaign',
      'manage_automations', 'view_analytics', 'export_reports',
      'manage_users', 'manage_roles_matrix',
    ],
  },
  hr_manager: {
    id: 'hr_manager',
    name: 'مدير الموارد البشرية',
    nameEn: 'HR Manager',
    description: 'إشراف كامل على طلبات التوظيف، الميزانيات، العروض، والتحليلات',
    descriptionEn: 'Full recruitment oversight, approvals, offer signoffs, and HR analytics',
    badgeBg: '#D8F3E5',
    badgeText: '#1B4938',
    permissions: [
      'view_salary', 'edit_salary', 'view_financial_budget',
      'view_requisitions', 'create_requisition', 'edit_requisition', 'approve_requisition', 'manage_job_library',
      'view_candidates', 'create_candidate', 'edit_candidate', 'move_candidate_stage', 'reject_candidate',
      'schedule_interview', 'conduct_interview', 'view_scorecards', 'create_scorecard', 'view_all_evaluations',
      'create_offer', 'view_offer', 'approve_offer', 'send_offer', 'verify_documents', 'sync_core_hr',
      'view_talent_pool', 'manage_talent_tags', 'launch_campaign',
      'manage_automations', 'view_analytics', 'export_reports',
      'manage_users', 'manage_roles_matrix',
    ],
  },
  recruiter: {
    id: 'recruiter',
    name: 'مسؤول التوظيف',
    nameEn: 'Talent Acquisition Recruiter',
    description: 'فرز المرشحين، إدارة خط سير التوظيف، جدولة المقابلات وإعداد العروض',
    descriptionEn: 'Pipeline execution, candidate sourcing, scheduling, and offer preparation',
    badgeBg: '#E1F0FA',
    badgeText: '#1E588F',
    permissions: [
      'view_salary', // Sees salary range for offers
      'view_requisitions', 'create_requisition', 'manage_job_library',
      'view_candidates', 'create_candidate', 'edit_candidate', 'move_candidate_stage', 'reject_candidate',
      'schedule_interview', 'conduct_interview', 'view_scorecards', 'create_scorecard', 'view_all_evaluations',
      'create_offer', 'view_offer', 'send_offer', 'verify_documents', 'sync_core_hr',
      'view_talent_pool', 'manage_talent_tags', 'launch_campaign',
      'view_analytics',
    ],
  },
  hiring_manager: {
    id: 'hiring_manager',
    name: 'مدير الإدارة الطالبة',
    nameEn: 'Hiring Manager',
    description: 'إنشاء طلبات الاحتياج، مراجعة المرشحين المؤهلين، وإجراء المقابلات الفنية',
    descriptionEn: 'Creates requisitions, evaluates shortlists, and conducts technical interviews',
    badgeBg: '#FDEED9',
    badgeText: '#8F5B1E',
    permissions: [
      // Salary is restricted/masked unless approved budget view
      'view_requisitions', 'create_requisition', 'edit_requisition',
      'view_candidates', 'move_candidate_stage',
      'schedule_interview', 'conduct_interview', 'view_scorecards', 'create_scorecard',
      'view_all_evaluations',
      'view_talent_pool',
    ],
  },
  reviewer: {
    id: 'reviewer',
    name: 'مقيّم فني / عضو لجنة المقابلة',
    nameEn: 'Technical Interviewer / Reviewer',
    description: 'تقييم المرشح في المقابلة وتعبئة بطاقة التقييم المعيارية فقط',
    descriptionEn: 'Evaluates candidates in scheduled interviews and submits scorecards',
    badgeBg: '#F3EFE6',
    badgeText: '#5F6B64',
    permissions: [
      'view_candidates',
      'conduct_interview',
      'create_scorecard',
      'view_scorecards',
    ],
  },
  candidate: {
    id: 'candidate',
    name: 'المرشح (بوابة التقديم الذاتي)',
    nameEn: 'Candidate Portal',
    description: 'متابعة الطلب، حجز موعد المقابلة، وتوقيع العرض الوظيفي',
    descriptionEn: 'Self-service portal for scheduling, offer signing, and document uploads',
    badgeBg: '#FAF7F2',
    badgeText: '#1A241F',
    permissions: [],
  },
};
