import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  DollarSign, 
  Users, 
  BookOpen, 
  Send, 
  ChevronDown, 
  Check, 
  AlertCircle,
  Eye,
  Filter,
  Sparkles
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { JobRequisition, RequisitionReason, EmploymentType, JobTemplate } from '../../types/requisition';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SalaryShield } from '../../components/rbac/SalaryShield';
import { PermissionGate } from '../../components/rbac/PermissionGate';

export const RequisitionsView: React.FC = () => {
  const { 
    requisitions, 
    jobTemplates, 
    createRequisition, 
    updateRequisitionHeadcount,
    archiveRequisition,
    reopenRequisition,
    approveRequisitionTier, 
    rejectRequisitionTier, 
    publishRequisition 
  } = useATSData();
  const { currentUser, hasPermission, canApproveRequisition } = useAuth();
  const { t } = useThemeLanguage();

  const [selectedReq, setSelectedReq] = useState<JobRequisition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [department, setDepartment] = useState('الهندسة والتقنية');
  const [reason, setReason] = useState<RequisitionReason>('expansion');
  const [headcount, setHeadcount] = useState(1);
  const [budgetMin, setBudgetMin] = useState(45000);
  const [budgetMax, setBudgetMax] = useState(70000);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [location, setLocation] = useState('القاهرة (القرية الذكية - نمط هجين)');
  const [experienceMin, setExperienceMin] = useState(4);
  const [experienceMax, setExperienceMax] = useState(8);
  const [educationLevel, setEducationLevel] = useState('بكالوريوس في علوم الحاسب');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('2026-10-30');

  // Filtered requisitions
  const filteredRequisitions = requisitions.filter((r) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') {
      return r.status.startsWith('pending');
    }
    if (statusFilter === 'published') {
      return r.status === 'published' || r.status === 'approved';
    }
    if (statusFilter === 'completed') {
      return r.status === 'completed';
    }
    if (statusFilter === 'archived') {
      return r.status === 'archived';
    }
    if (statusFilter === 'rejected') {
      return r.status === 'rejected';
    }
    return r.status === statusFilter;
  });

  const handleApplyTemplate = (tmpl: JobTemplate) => {
    setTitle(tmpl.title);
    setTitleEn(tmpl.titleEn);
    setDepartment(tmpl.department);
    setDescription(tmpl.defaultDescription);
    setSkillsInput(tmpl.defaultSkills.join(', '));
    setBudgetMin(tmpl.suggestedSalaryRange.min);
    setBudgetMax(tmpl.suggestedSalaryRange.max);
    setIsLibraryModalOpen(false);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    createRequisition({
      title,
      titleEn: titleEn || title,
      department,
      departmentEn: department,
      reason,
      headcount: Number(headcount),
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      currency: 'ج.م',
      employmentType,
      location,
      locationEn: location,
      experienceYearsMin: Number(experienceMin),
      experienceYearsMax: Number(experienceMax),
      educationLevel,
      educationLevelEn: educationLevel,
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      description: description || 'تفاصيل الوظيفة ومسؤولياتها المعيارية.',
      descriptionEn: description || 'Standard Job Description',
      responsibilities: ['تنفيذ المهام والمشاريع الموكلة وفق خطة العمل.'],
      requirements: ['خبرة سابقة وإتقان للمهارات المطلوبة.'],
      hiringManagerId: currentUser.id,
      hiringManagerName: currentUser.name,
      recruiterId: 'user_recruiter_1',
      recruiterName: 'أحمد فؤاد',
      approvalChain: [
        {
          tier: 1,
          tierName: 'إدارة الموارد البشرية والتوظيف',
          tierNameEn: 'Talent Acquisition & HR',
          role: 'hr_manager',
          approverId: 'user_hr_dir',
          approverName: 'سارة منصور',
          status: 'pending',
        },
        {
          tier: 2,
          tierName: 'الإدارة المالية والميزانيات',
          tierNameEn: 'Finance & Budget Control',
          role: 'finance_director',
          approverId: 'user_fin_dir',
          approverName: 'أيمن عبدالسلام (المدير المالي)',
          status: 'pending',
        },
        {
          tier: 3,
          tierName: 'الرئيس التنفيذي / الإدارة العليا',
          tierNameEn: 'Executive Office (CEO / VP)',
          role: 'executive',
          approverId: 'user_super_admin',
          approverName: 'عبدالله القاضي',
          status: 'pending',
        },
      ],
      status: 'pending_hr',
      knockoutQuestions: [],
      targetHireDate: targetDate,
    });

    setIsCreateModalOpen(false);
    // Reset fields
    setTitle('');
    setDescription('');
  };

  const getStatusBadge = (status: JobRequisition['status']) => {
    switch (status) {
      case 'published':
        return <Badge variant="active">{t('شاغر نشط للنشر', 'Published Active')}</Badge>;
      case 'approved':
        return <Badge variant="active">{t('معتمد ومتاح للتقديم', 'Approved Active')}</Badge>;
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
            <Check className="w-3 h-3 text-emerald-500" />
            {t('مكتمل التعيين ✓', 'Filled & Completed')}
          </span>
        );
      case 'archived':
        return <Badge variant="neutral">{t('مؤرشف', 'Archived')}</Badge>;
      case 'pending_hr':
        return <Badge variant="pending">{t('بانتظار اعتماد الموارد البشرية', 'Pending HR')}</Badge>;
      case 'pending_finance':
        return <Badge variant="pending">{t('بانتظار اعتماد المالية', 'Pending Finance')}</Badge>;
      case 'pending_executive':
        return <Badge variant="pending">{t('بانتظار اعتماد الإدارة العليا', 'Pending Executive')}</Badge>;
      case 'rejected':
        return <Badge variant="rejected">{t('طلب مرفوض', 'Rejected')}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Stats */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-mint-500 text-white flex items-center justify-center shadow-card shadow-mint-500/25 shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 2: إدارة طلبات الاحتياج والاعتمادات', 'Unit 2: Job Requisitions & Approvals')}
                </h1>
                <Badge variant="mint" size="sm">{t('تخطيط الاحتياج', 'Manpower Planning')}</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'ضبط التعيينات بالخطة التشغيلية والموازنة المعتمدة، مع مسار اعتماد متعدد المستويات (HR ← المالية ← الإدارة العليا).',
                  'Align hiring with approved budgets through multi-tier approval state machine (HR → Finance → Executive).'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => setIsLibraryModalOpen(true)}
            >
              {t('مكتبة الأوصاف المعتمدة', 'Job Library')}
            </Button>

            <PermissionGate permission="create_requisition">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                {t('طلب احتياج جديد', 'New Requisition')}
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Quick Stats Grid with Rejected Requisitions Metric */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-4 border-t border-surface-border">
          <div className="bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border hover:border-mint-400 card-interactive animate-fade-in-up stagger-1">
            <span className="text-[11px] text-neutral-muted font-bold block">{t('إجمالي الشواغر المفتوحة', 'Total Requisitions')}</span>
            <span className="text-xl font-black text-pine dark:text-white mt-1 block">{requisitions.length} <span className="text-xs font-normal text-neutral-muted">{t('طلب', 'Reqs')}</span></span>
          </div>

          <div className="bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border hover:border-amber-400 card-interactive animate-fade-in-up stagger-2">
            <span className="text-[11px] text-neutral-muted font-bold block">{t('طلبات بانتظار الاعتماد', 'Pending Approvals')}</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
              {requisitions.filter((r) => r.status.startsWith('pending')).length} <span className="text-xs font-normal text-neutral-muted">{t('طلبات', 'Pending')}</span>
            </span>
          </div>

          <div className="bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border hover:border-mint-400 card-interactive animate-fade-in-up stagger-3">
            <span className="text-[11px] text-neutral-muted font-bold block">{t('شواغر نشطة منشورة', 'Published Active')}</span>
            <span className="text-xl font-black text-mint-600 dark:text-mint-400 mt-1 block">
              {requisitions.filter((r) => r.status === 'published' || r.status === 'approved').length} <span className="text-xs font-normal text-neutral-muted">{t('شاغر', 'Active')}</span>
            </span>
          </div>

          <div className="bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border hover:border-emerald-400 card-interactive animate-fade-in-up stagger-4">
            <span className="text-[11px] text-neutral-muted font-bold block">{t('شواغر مكتملة التعيين', 'Filled & Completed')}</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {requisitions.filter((r) => r.status === 'completed').length} <span className="text-xs font-normal text-neutral-muted">{t('مكتمل', 'Filled')}</span>
            </span>
          </div>

          <div className="bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border hover:border-rose-400 card-interactive animate-fade-in-up stagger-5">
            <span className="text-[11px] text-neutral-muted font-bold block">{t('إجمالي الطلبات المرفوضة', 'Rejected Requests')}</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              {requisitions.filter((r) => r.status === 'rejected').length} <span className="text-xs font-normal text-neutral-muted">{t('مرفوض', 'Rejected')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Table */}
      <div className="surface-card p-0 overflow-hidden border border-surface-border animate-fade-in-up stagger-3">
        <div className="p-4 bg-sand-50/80 dark:bg-surface-soft border-b border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-mint-600" />
            <span className="text-xs font-bold text-pine dark:text-white">{t('تصفية الطلبات:', 'Filter Requisitions:')}</span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { key: 'all', label: 'الكل', labelEn: 'All' },
                { key: 'pending', label: 'بانتظار الاعتماد', labelEn: 'Pending Approval' },
                { key: 'published', label: 'النشطة والمنشورة', labelEn: 'Published' },
                { key: 'completed', label: 'مكتملة التعيين', labelEn: 'Filled' },
                { key: 'rejected', label: 'المرفوضة', labelEn: 'Rejected' },
                { key: 'archived', label: 'المؤرشفة', labelEn: 'Archived' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === f.key
                      ? 'bg-mint-500 text-white shadow-sm scale-105'
                      : 'text-neutral-muted hover:text-pine dark:hover:text-white hover:bg-sand-200/50 dark:hover:bg-surface-muted'
                  }`}
                >
                  {t(f.label, f.labelEn)}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-neutral-muted">
            {t('عرض', 'Showing')} {filteredRequisitions.length} {t('من أصل', 'of')} {requisitions.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-sand-100/70 border-b border-sand-300 text-pine font-bold">
                <th className="p-3.5 text-start">{t('رمز الشاغر والمسمى', 'Code & Title')}</th>
                <th className="p-3.5 text-start">{t('الإدارة والقسم', 'Department')}</th>
                <th className="p-3.5 text-start">{t('السبب والعدد', 'Reason & Headcount')}</th>
                <th className="p-3.5 text-start">{t('الموازنة التقديرية (RBAC)', 'Budget Range')}</th>
                <th className="p-3.5 text-start">{t('مسار الاعتماد (3 Tiers)', 'Approval Stepper')}</th>
                <th className="p-3.5 text-start">{t('الحالة', 'Status')}</th>
                <th className="p-3.5 text-center">{t('الإجراء', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredRequisitions.map((req) => {
                const approvedTiers = req.approvalChain.filter((s) => s.status === 'approved').length;

                return (
                  <tr key={req.id} className="table-row-hover hover:bg-sand-50/50 dark:hover:bg-surface-muted transition-all">
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-mint-700 font-bold">{req.code}</span>
                        <span className="font-bold text-pine text-xs hover:text-mint-600 transition-colors cursor-pointer" onClick={() => setSelectedReq(req)}>
                          {t(req.title, req.titleEn)}
                        </span>
                        <span className="text-[10px] text-neutral-subtle">{t(req.location, req.locationEn)}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-neutral-main">
                      {t(req.department, req.departmentEn)}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-pine dark:text-white block text-xs">
                          {req.headcount} {t('مقاعد مستهدفة', 'Target Seats')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.filledCount >= req.headcount
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : req.filledCount > 0
                              ? 'bg-mint-500/20 text-mint-600 dark:text-mint-400'
                              : 'bg-sand-200 dark:bg-surface-muted text-neutral-muted'
                          }`}
                        >
                          {req.filledCount}/{req.headcount} {t('معينين', 'Hired')}
                        </span>
                      </div>

                      {/* Headcount Fill Progress Bar */}
                      <div className="w-full bg-sand-200 dark:bg-surface-soft h-1.5 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            req.filledCount >= req.headcount ? 'bg-emerald-500' : 'bg-mint-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.round((req.filledCount / req.headcount) * 100))}%`,
                          }}
                        />
                      </div>

                      <span className="text-[10px] text-neutral-muted dark:text-neutral-subtle block">
                        {req.reason === 'expansion'
                          ? t('توسع ونمو', 'Expansion')
                          : req.reason === 'replacement'
                          ? t('إحلال وبديل', 'Replacement')
                          : t('مشروع جديد', 'New Project')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <SalaryShield
                        minAmount={req.budgetMin}
                        maxAmount={req.budgetMax}
                        currency={req.currency}
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1">
                        {req.approvalChain.map((step) => (
                          <div
                            key={step.tier}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.status === 'approved'
                                ? 'bg-mint-500 text-canvas'
                                : step.status === 'rejected'
                                ? 'bg-rose-500 text-canvas'
                                : req.currentTier === step.tier
                                ? 'bg-amber-400 text-pine animate-pulse'
                                : 'bg-sand-200 text-neutral-muted'
                            }`}
                            title={`${t(step.tierName, step.tierNameEn)}: ${step.status}`}
                          >
                            {step.status === 'approved' ? (
                              <Check className="w-3 h-3" />
                            ) : step.status === 'rejected' ? (
                              '✕'
                            ) : (
                              step.tier
                            )}
                          </div>
                        ))}
                        <span className="text-[11px] text-neutral-muted ms-1.5">
                          {approvedTiers} / {req.approvalChain.length}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {getStatusBadge(req.status)}
                    </td>

                    <td className="p-3.5 text-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedReq(req)}
                      >
                        {t('المعاينة والاعتماد', 'Review')}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Requisition Details & Multi-tier Approval Stepper */}
      {selectedReq && (
        <Modal
          isOpen={Boolean(selectedReq)}
          onClose={() => setSelectedReq(null)}
          title={`${selectedReq.code} - ${t(selectedReq.title, selectedReq.titleEn)}`}
          subtitle={t('تفاصيل الشاغر ومسار الاعتمادات الإدارية والمالية', 'Requisition details & multi-tier approval workflow')}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand-50/80 dark:bg-surface-muted p-3.5 rounded-xl border border-surface-border text-xs">
              <div>
                <span className="text-neutral-muted dark:text-neutral-subtle block text-[11px] font-semibold">{t('الإدارة الطالبة:', 'Department:')}</span>
                <span className="font-bold text-pine dark:text-white mt-0.5 block">{t(selectedReq.department, selectedReq.departmentEn)}</span>
              </div>
              <div>
                <span className="text-neutral-muted dark:text-neutral-subtle block text-[11px] font-semibold">{t('المدير المباشر:', 'Hiring Manager:')}</span>
                <span className="font-bold text-pine dark:text-white mt-0.5 block">{selectedReq.hiringManagerName}</span>
              </div>
              <div>
                <span className="text-neutral-muted dark:text-neutral-subtle block text-[11px] font-semibold">{t('العدد المطلوب:', 'Headcount:')}</span>
                <span className="font-bold text-pine dark:text-white mt-0.5 block">{selectedReq.headcount} {t('موظف', 'Headcount')}</span>
              </div>
              <div>
                <span className="text-neutral-muted dark:text-neutral-subtle block text-[11px] font-semibold">{t('الميزانية المعتمدة:', 'Budget Range:')}</span>
                <div className="mt-0.5">
                  <SalaryShield minAmount={selectedReq.budgetMin} maxAmount={selectedReq.budgetMax} currency={selectedReq.currency} />
                </div>
              </div>
            </div>

            {/* Description & Competencies */}
            <div>
              <h4 className="text-xs font-bold text-pine dark:text-white mb-1.5">{t('الوصف الوظيفي والمسؤوليات:', 'Job Description & Scope:')}</h4>
              <p className="text-xs text-neutral-main dark:text-neutral-200 bg-surface-muted dark:bg-surface-soft p-3 rounded-xl border border-surface-border leading-relaxed">
                {t(selectedReq.description, selectedReq.descriptionEn)}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-pine dark:text-white mb-1.5">{t('الجدارات والمهارات الأساسية:', 'Required Competencies & Skills:')}</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedReq.skills.map((skill, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Multi-tier Approval Stepper */}
            <div className="pt-3 border-t border-surface-border">
              <h4 className="text-xs font-bold text-pine dark:text-white mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-mint-500" />
                {t('مسار الاعتمادات متعدد المستويات (Multi-tier Approval State Machine):', 'Multi-tier Approval State Machine:')}
              </h4>

              <div className="space-y-3">
                {selectedReq.approvalChain.map((step) => {
                  const isCurrentPending = selectedReq.currentTier === step.tier && step.status === 'pending';

                  return (
                    <div
                      key={step.tier}
                      className={`p-4 rounded-xl border transition-all ${
                        step.status === 'approved'
                          ? 'bg-mint-50/70 dark:bg-mint-950/40 border-mint-200 dark:border-mint-800/60'
                          : step.status === 'rejected'
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
                          : isCurrentPending
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/60 ring-1 ring-amber-400/80 dark:ring-amber-500/50 shadow-sm'
                          : 'bg-sand-50/70 dark:bg-surface-muted border-surface-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              step.status === 'approved'
                                ? 'bg-mint-500 text-white shadow-sm shadow-mint-500/30'
                                : step.status === 'rejected'
                                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                                : isCurrentPending
                                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 animate-pulse-glow'
                                : 'bg-sand-300 dark:bg-surface text-neutral-muted dark:text-neutral-subtle border border-surface-border'
                            }`}
                          >
                            {step.status === 'approved' ? <Check className="w-4 h-4" /> : step.tier}
                          </div>
                          <div>
                            <span className="font-bold text-pine dark:text-white text-xs sm:text-sm block">
                              {t(step.tierName, step.tierNameEn)}
                            </span>
                            <span className="text-[11px] text-neutral-muted dark:text-neutral-300 block mt-0.5">
                              {step.approverName} <span className="text-neutral-subtle dark:text-neutral-400">({step.role})</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          {step.status === 'approved' ? (
                            <Badge variant="active" size="sm">
                              {t('تم الاعتماد', 'Approved')} {step.actionDate}
                            </Badge>
                          ) : step.status === 'rejected' ? (
                            <Badge variant="rejected" size="sm">
                              {t('مرفوض', 'Rejected')}
                            </Badge>
                          ) : (
                            <Badge variant="pending" size="sm">
                              {t('بانتظار الاعتماد', 'Pending Tier')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {step.comments && (
                        <p className="mt-3 text-xs text-neutral-main dark:text-neutral-200 bg-surface/90 dark:bg-surface-soft p-2.5 rounded-lg border border-surface-border leading-relaxed">
                          <span className="font-bold text-mint-700 dark:text-mint-400">{t('ملاحظة المعتمد:', 'Note:')}</span> {step.comments}
                        </p>
                      )}

                      {/* Approval Actions for Authorized User */}
                      {isCurrentPending && canApproveRequisition() && (
                        <div className="mt-3.5 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-col gap-2.5">
                          <input
                            type="text"
                            placeholder={t('أضف ملاحظة أو توجيه للاعتماد (اختياري)...', 'Add approval comment/notes (optional)...')}
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-600/60 bg-surface dark:bg-surface-soft text-xs text-neutral-main dark:text-white placeholder:text-neutral-muted/60 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                rejectRequisitionTier(selectedReq.id, step.tier, approvalComments || 'تم الرفض لعدم توافق الشروط');
                                setSelectedReq(null);
                              }}
                            >
                              {t('رفض الطلب', 'Reject Tier')}
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Check className="w-4 h-4" />}
                              onClick={() => {
                                approveRequisitionTier(selectedReq.id, step.tier, approvalComments || 'معتمد للمضي قدماً');
                                setSelectedReq(null);
                              }}
                            >
                              {t('اعتماد هذه المرحلة والمتابعة', 'Approve & Next Tier')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Headcount & Lifecycle Control Section */}
              <div className="p-4 rounded-xl bg-sand-50/90 dark:bg-surface-soft border border-surface-border space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h4 className="text-xs font-bold text-pine dark:text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-mint-500" />
                      {t('إدارة المقاعد وتتبع شغل الشاغر (Headcount Lifecycle):', 'Headcount & Vacancy Lifecycle:')}
                    </h4>
                    <p className="text-[11px] text-neutral-muted dark:text-neutral-300 mt-0.5">
                      {t(
                        `المعينين الفعليين: ${selectedReq.filledCount} من أصل ${selectedReq.headcount} مقعد مطلوب (${Math.round((selectedReq.filledCount / selectedReq.headcount) * 100)}%)`,
                        `Hired: ${selectedReq.filledCount} of ${selectedReq.headcount} target seats (${Math.round((selectedReq.filledCount / selectedReq.headcount) * 100)}%)`
                      )}
                    </p>
                  </div>

                  {selectedReq.filledCount >= selectedReq.headcount ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {t('اكتمل التعيين بالكامل ✓', '100% Filled ✓')}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-mint-500/20 text-mint-700 dark:text-mint-300 border border-mint-500/30">
                      {t(`متبقي ${selectedReq.headcount - selectedReq.filledCount} مقاعد`, `${selectedReq.headcount - selectedReq.filledCount} Slots Left`)}
                    </span>
                  )}
                </div>

                {/* Headcount Progress Bar */}
                <div className="w-full bg-sand-200 dark:bg-surface-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      selectedReq.filledCount >= selectedReq.headcount ? 'bg-emerald-500' : 'bg-mint-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((selectedReq.filledCount / selectedReq.headcount) * 100))}%` }}
                  />
                </div>

                {/* Headcount Lifecycle Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        updateRequisitionHeadcount(selectedReq.id, selectedReq.headcount + 1);
                        setSelectedReq((prev) => (prev ? { ...prev, headcount: prev.headcount + 1, status: 'approved' } : null));
                      }}
                    >
                      {t('+ فتح مقعد إضافي (توسيع الاحتياج)', '+ Add 1 More Slot')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        updateRequisitionHeadcount(selectedReq.id, selectedReq.headcount + 2);
                        setSelectedReq((prev) => (prev ? { ...prev, headcount: prev.headcount + 2, status: 'approved' } : null));
                      }}
                    >
                      {t('+ فتح مقعدين', '+ Add 2 Slots')}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedReq.status === 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          reopenRequisition(selectedReq.id);
                          setSelectedReq((prev) => (prev ? { ...prev, status: 'approved', headcount: prev.headcount + 1 } : null));
                        }}
                      >
                        {t('إعادة تنشيط وفتح التقديم', 'Reopen & Reactivate')}
                      </Button>
                    )}
                    {selectedReq.status !== 'archived' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          archiveRequisition(selectedReq.id);
                          setSelectedReq((prev) => (prev ? { ...prev, status: 'archived' } : null));
                        }}
                      >
                        {t('أرشفة الشاغر', 'Archive')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Create Requisition Form */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('إنشاء طلب احتياج وظيفي جديد (New Job Requisition)', 'New Job Requisition')}
        subtitle={t('تحديد المسمى، الموازنة، المهارات، وأسئلة الاستبعاد المسبقة', 'Define role, budget, competencies & knockout rules')}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('المسمى الوظيفي (عربي)', 'Job Title (Arabic)')}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مهندس برمجيات أول"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('المسمى بالإنجليزية (اختياري)', 'Job Title (English)')}</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Senior Full-Stack Engineer"
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">{t('الإدارة / القسم', 'Department')}</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input"
              >
                <option value="الهندسة والتقنية">{t('الهندسة والتقنية', 'Engineering & Tech')}</option>
                <option value="المنتج والابتكار">{t('المنتج والابتكار', 'Product & Innovation')}</option>
                <option value="الموارد البشرية والتوظيف">{t('الموارد البشرية', 'People & HR')}</option>
                <option value="المالية والاستثمار">{t('المالية والمحاسبة', 'Finance & Accounts')}</option>
                <option value="التسويق والمبيعات">{t('التسويق والنمو', 'Marketing & Growth')}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('سبب الاحتياج', 'Requisition Reason')}</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as RequisitionReason)}
                className="form-input"
              >
                <option value="expansion">{t('توسع ونمو بالخطة', 'Expansion')}</option>
                <option value="replacement">{t('إحلال وبديل لمستقيل', 'Replacement')}</option>
                <option value="new_project">{t('مشروع استراتيجي جديد', 'New Strategic Project')}</option>
                <option value="seasonal">{t('موسمي / مؤقت', 'Seasonal')}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('العدد المطلوب (Headcount)', 'Headcount')}</label>
              <input
                type="number"
                min="1"
                max="50"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('الحد الأدنى للراتب (ج.م)', 'Salary Min (EGP)')}</label>
              <input
                type="number"
                step="1000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('الحد الأعلى للراتب (ج.م)', 'Salary Max (EGP)')}</label>
              <input
                type="number"
                step="1000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">{t('المهارات المطلوبة (مفصولة بفاصلة)', 'Required Skills (comma-separated)')}</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Docker, System Architecture"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">{t('الوصف الوظيفي والمسؤوليات الأساسية', 'Job Description & Duties')}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح موجز لأهداف الوظيفة والمهام الأساسية..."
              className="form-input"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
              {t('إرسال لمسار الاعتماد (Submit for Approval)', 'Submit for Approval')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Job Description Library Drawer */}
      <Modal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        title={t('مكتبة بطاقات الوصف الوظيفي المعتمدة (Job Library)', 'Job Description Library')}
        subtitle={t('اختر قالباً معتمداً لتعبئة بيانات طلب الاحتياج بنقرة واحدة', 'Select approved standard template to prefill requisition')}
        maxWidth="xl"
      >
        <div className="space-y-3">
          {jobTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl border border-surface-border bg-sand-50/50 dark:bg-surface-muted hover:bg-surface hover:border-mint-400 hover:shadow-card transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-pine">{t(tmpl.title, tmpl.titleEn)}</h4>
                  <span className="text-[11px] text-neutral-muted">{t(tmpl.department, tmpl.departmentEn)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleApplyTemplate(tmpl);
                    setIsCreateModalOpen(true);
                  }}
                >
                  {t('استخدام القالب', 'Use Template')}
                </Button>
              </div>

              <p className="text-xs text-neutral-main mt-2 line-clamp-2">
                {tmpl.defaultDescription}
              </p>

              <div className="flex flex-wrap gap-1 mt-2.5">
                {tmpl.defaultSkills.map((sk, idx) => (
                  <span key={idx} className="text-[10px] bg-sand-200 text-pine px-2 py-0.5 rounded">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
