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
      return r.status === 'pending_hr' || r.status === 'pending_finance' || r.status === 'pending_executive';
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
        return <Badge variant="active">{t('شاغر نشط للنشر', 'Published')}</Badge>;
      case 'approved':
        return <Badge variant="active">{t('معتمد بالكامل', 'Approved')}</Badge>;
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
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <FileText className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 2: إدارة طلبات الاحتياج والاعتمادات', 'Unit 2: Job Requisitions & Approvals')}
                </h1>
                <Badge variant="mint" size="sm">Manpower Planning</Badge>
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

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-sand-200">
          <div className="bg-white/80 p-3 rounded-xl border border-sand-200">
            <span className="text-[11px] text-neutral-muted block">{t('إجمالي الشواغر المفتوحة', 'Total Requisitions')}</span>
            <span className="text-lg font-bold text-pine">{requisitions.length} {t('طلب', 'Reqs')}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-sand-200">
            <span className="text-[11px] text-neutral-muted block">{t('طلبات بانتظار الاعتماد', 'Pending Approvals')}</span>
            <span className="text-lg font-bold text-amber-700">
              {requisitions.filter((r) => r.status.startsWith('pending')).length} {t('طلبات', 'Pending')}
            </span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-sand-200">
            <span className="text-[11px] text-neutral-muted block">{t('شواغر نشطة منشورة', 'Published Active')}</span>
            <span className="text-lg font-bold text-mint-600">
              {requisitions.filter((r) => r.status === 'published').length} {t('شاغر', 'Active')}
            </span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-sand-200">
            <span className="text-[11px] text-neutral-muted block">{t('إجمالي الكوادر المستهدفة', 'Target Headcounts')}</span>
            <span className="text-lg font-bold text-pine">
              {requisitions.reduce((acc, r) => acc + r.headcount, 0)} {t('موظف', 'Staff')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Table */}
      <div className="surface-card p-0 overflow-hidden border border-surface-border">
        <div className="p-4 bg-sand-50/80 border-b border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-mint-600" />
            <span className="text-xs font-bold text-pine">{t('تصفية الطلبات:', 'Filter Requisitions:')}</span>
            <div className="flex items-center gap-1">
              {[
                { key: 'all', label: 'الكل', labelEn: 'All' },
                { key: 'pending', label: 'بانتظار الاعتماد', labelEn: 'Pending Approval' },
                { key: 'published', label: 'النشطة والمنشورة', labelEn: 'Published' },
                { key: 'rejected', label: 'المرفوضة', labelEn: 'Rejected' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === f.key
                      ? 'bg-mint-500 text-canvas shadow-sm'
                      : 'text-neutral-muted hover:text-pine hover:bg-sand-200/50'
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
                  <tr key={req.id} className="hover:bg-sand-50/50 transition-colors">
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
                      <span className="font-bold text-pine block">{req.headcount} {t('مقعد', 'Seats')}</span>
                      <span className="text-[11px] text-neutral-muted">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand-50 p-3.5 rounded-xl border border-sand-200 text-xs">
              <div>
                <span className="text-neutral-muted block text-[11px]">{t('الإدارة الطالبة:', 'Department:')}</span>
                <span className="font-bold text-pine">{t(selectedReq.department, selectedReq.departmentEn)}</span>
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px]">{t('المدير المباشر:', 'Hiring Manager:')}</span>
                <span className="font-bold text-pine">{selectedReq.hiringManagerName}</span>
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px]">{t('العدد المطلوب:', 'Headcount:')}</span>
                <span className="font-bold text-pine">{selectedReq.headcount} {t('موظف', 'Headcount')}</span>
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px]">{t('الميزانية المعتمدة:', 'Budget Range:')}</span>
                <SalaryShield minAmount={selectedReq.budgetMin} maxAmount={selectedReq.budgetMax} currency={selectedReq.currency} />
              </div>
            </div>

            {/* Description & Competencies */}
            <div>
              <h4 className="text-xs font-bold text-pine mb-1.5">{t('الوصف الوظيفي والمسؤوليات:', 'Job Description & Scope:')}</h4>
              <p className="text-xs text-neutral-main bg-white p-3 rounded-xl border border-surface-border leading-relaxed">
                {t(selectedReq.description, selectedReq.descriptionEn)}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-pine mb-1.5">{t('الجدارات والمهارات الأساسية:', 'Required Competencies & Skills:')}</h4>
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
              <h4 className="text-xs font-bold text-pine mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-mint-600" />
                {t('مسار الاعتمادات متعدد المستويات (Multi-tier Approval State Machine):', 'Multi-tier Approval State Machine:')}
              </h4>

              <div className="space-y-3">
                {selectedReq.approvalChain.map((step) => {
                  const isCurrentPending = selectedReq.currentTier === step.tier && step.status === 'pending';

                  return (
                    <div
                      key={step.tier}
                      className={`p-3.5 rounded-xl border transition-all ${
                        step.status === 'approved'
                          ? 'bg-mint-50/50 border-mint-200'
                          : step.status === 'rejected'
                          ? 'bg-rose-50/50 border-rose-200'
                          : isCurrentPending
                          ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                          : 'bg-sand-50/50 border-sand-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.status === 'approved'
                                ? 'bg-mint-500 text-canvas'
                                : step.status === 'rejected'
                                ? 'bg-rose-500 text-canvas'
                                : 'bg-sand-300 text-neutral-muted'
                            }`}
                          >
                            {step.status === 'approved' ? <Check className="w-4 h-4" /> : step.tier}
                          </div>
                          <div>
                            <span className="font-bold text-pine text-xs block">
                              {t(step.tierName, step.tierNameEn)}
                            </span>
                            <span className="text-[11px] text-neutral-muted">
                              {step.approverName} ({step.role})
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
                        <p className="mt-2 text-xs text-neutral-main bg-white/70 p-2 rounded-lg border border-sand-200">
                          <span className="font-bold text-neutral-muted">{t('ملاحظة المعتمد:', 'Note:')}</span> {step.comments}
                        </p>
                      )}

                      {/* Approval Actions for Authorized User */}
                      {isCurrentPending && canApproveRequisition() && (
                        <div className="mt-3 pt-2.5 border-t border-amber-200 flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder={t('أضف ملاحظة أو توجيه للاعتماد (اختياري)...', 'Add approval comment/notes (optional)...')}
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            className="form-input text-xs"
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
              className="p-4 rounded-xl border border-surface-border bg-sand-50/50 hover:bg-white hover:border-mint-400 hover:shadow-card transition-all"
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
