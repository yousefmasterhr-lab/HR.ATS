import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle, 
  Plus, 
  Users, 
  Info,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { PermissionKey, UserRole } from '../../types/auth';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const RBACMatrixView: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    roleDefinitions, 
    users, 
    switchRole, 
    togglePermissionForRole,
    addUser 
  } = useAuth();
  const { t } = useThemeLanguage();

  const [activeTab, setActiveTab] = useState<'matrix' | 'users' | 'simulation'>('matrix');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('recruiter');
  const [newUserDepartment, setNewUserDepartment] = useState('الموارد البشرية والتوظيف');
  const [newUserTitle, setNewUserTitle] = useState('أخصائي توظيف');

  const permissionGroups: {
    groupName: string;
    groupNameEn: string;
    description: string;
    descriptionEn: string;
    permissions: { key: PermissionKey; label: string; labelEn: string; isSensitive?: boolean }[];
  }[] = [
    {
      groupName: 'البيانات المالية وسرية الرواتب',
      groupNameEn: 'Financial & Salary Confidentiality',
      description: 'التحكم في رؤية وتعديل الرواتب والميزانيات المعتمدة لمنع تسرب البيانات الحساسة',
      descriptionEn: 'Control visibility of salaries and budgets to prevent data leaks',
      permissions: [
        { key: 'view_salary', label: 'الاطلاع على الرواتب وتفاصيل الأجور', labelEn: 'View Salary & Compensation', isSensitive: true },
        { key: 'edit_salary', label: 'تحديد وتعديل عروض الرواتب', labelEn: 'Edit / Set Compensation Offers', isSensitive: true },
        { key: 'view_financial_budget', label: 'الاطلاع على الموازنة التقديرية للوظيفة', labelEn: 'View Requisition Budget', isSensitive: true },
      ],
    },
    {
      groupName: 'طلبات الاحتياج والاعتمادات',
      groupNameEn: 'Requisitions & Approvals',
      description: 'إنشاء ومصادقة طلبات التوظيف ومكتبة الأوصاف الوظيفية',
      descriptionEn: 'Create, edit, and approve job requisitions and library',
      permissions: [
        { key: 'view_requisitions', label: 'عرض طلبات الاحتياج الوظيفي', labelEn: 'View Requisitions' },
        { key: 'create_requisition', label: 'إنشاء طلب احتياج جديد', labelEn: 'Create New Requisition' },
        { key: 'edit_requisition', label: 'تعديل بيانات طلب الاحتياج', labelEn: 'Edit Requisition' },
        { key: 'approve_requisition', label: 'المصادقة والاعتماد الإداري والمالي', labelEn: 'Approve Requisitions (Multi-tier)' },
        { key: 'delete_requisition', label: 'حذف أو إلغاء الشواغر', labelEn: 'Delete Requisition' },
        { key: 'manage_job_library', label: 'إدارة مكتبة الأوصاف الوظيفية', labelEn: 'Manage Job Description Library' },
      ],
    },
    {
      groupName: 'إدارة وتتبع المرشحين',
      groupNameEn: 'Candidates & Pipeline',
      description: 'فرز المتقدمين، نقل المراحل في Kanban، والاستبعاد',
      descriptionEn: 'Screen candidates, transition pipeline stages, and reject',
      permissions: [
        { key: 'view_candidates', label: 'عرض ملفات وسير المرشحين الذاتية', labelEn: 'View Candidates & Resumes' },
        { key: 'create_candidate', label: 'إضافة مرشح يدوياً للنظام', labelEn: 'Create / Import Candidate' },
        { key: 'move_candidate_stage', label: 'نقل المرشح بين مراحل التوظيف (Kanban)', labelEn: 'Move Stage (Drag & Drop)' },
        { key: 'reject_candidate', label: 'استبعاد المرشح وتوثيق الأسباب', labelEn: 'Reject Candidate' },
      ],
    },
    {
      groupName: 'المقابلات والتقييمات المعيارية',
      groupNameEn: 'Interviews & Scorecards',
      description: 'جدولة المقابلات وتعبئة بطاقات الجدارات وحساب المتوسط',
      descriptionEn: 'Schedule meetings, submit competency scorecards',
      permissions: [
        { key: 'schedule_interview', label: 'جدولة المقابلات وتوليد الروابط', labelEn: 'Schedule Interviews & Links' },
        { key: 'conduct_interview', label: 'المشاركة كمقابل رسمي', labelEn: 'Conduct Interview' },
        { key: 'create_scorecard', label: 'تعبئة بطاقة التقييم المعيارية', labelEn: 'Submit Evaluation Scorecard' },
        { key: 'view_scorecards', label: 'الاطلاع على تقييمات المقابلين الآخرين', labelEn: 'View All Scorecards' },
      ],
    },
    {
      groupName: 'العروض الوظيفية والتهيئة (Offers & Preboarding)',
      groupNameEn: 'Job Offers & Pre-boarding',
      description: 'توليد خطابات التعيين، التوقيع الرقمي، ومزامنة Core HR',
      descriptionEn: 'Generate offer letters, e-signature, and Core HR sync',
      permissions: [
        { key: 'create_offer', label: 'صياغة العرض الوظيفي', labelEn: 'Draft Job Offer' },
        { key: 'view_offer', label: 'الاطلاع على خطابات العروض', labelEn: 'View Job Offers' },
        { key: 'send_offer', label: 'إرسال العرض للمرشح للتوقيع الرقمي', labelEn: 'Send Offer to Candidate' },
        { key: 'verify_documents', label: 'تدقيق واعتماد مسوغات التعيين الرسمية', labelEn: 'Verify Pre-boarding Documents' },
        { key: 'sync_core_hr', label: 'ترحيل الموظف المعتمد لنظام الموارد الأساسي (Core HR)', labelEn: 'Sync New Hire to Core HR' },
      ],
    },
    {
      groupName: 'محرك الأتمتة والتحليلات والأمان',
      groupNameEn: 'Automation, Analytics & Admin',
      description: 'إدارة قواعد العمل الآلية، مصفوفة الصلاحيات، ومؤشرات الأداء',
      descriptionEn: 'Manage automation rules, RBAC matrix, and KPIs',
      permissions: [
        { key: 'manage_automations', label: 'بناء وتفعيل قواعد الأتمتة التلقائية', labelEn: 'Manage Workflow Automations' },
        { key: 'view_analytics', label: 'الاطلاع على لوحة المؤشرات التنفيذية (KPIs)', labelEn: 'View Executive Analytics' },
        { key: 'export_reports', label: 'تصدير التقارير وسجلات التدقيق', labelEn: 'Export Reports & Audit Logs' },
        { key: 'manage_roles_matrix', label: 'تعديل مصفوفة الصلاحيات والأدوار (RBAC)', labelEn: 'Manage Roles & RBAC Matrix' },
      ],
    },
  ];

  const roles: UserRole[] = ['hr_manager', 'recruiter', 'hiring_manager', 'reviewer', 'super_admin'];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUser({
      id: `user_${Date.now()}`,
      name: newUserName,
      nameEn: newUserName,
      email: newUserEmail,
      avatar: '',
      role: newUserRole,
      department: newUserDepartment,
      departmentEn: newUserDepartment,
      title: newUserTitle,
      titleEn: newUserTitle,
      isActive: true,
      lastLogin: 'الآن',
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card shadow-pine/20">
              <ShieldCheck className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 1: قاعدة البيانات ومصفوفة الصلاحيات (RBAC)', 'Unit 1: DB Schema & RBAC Engine')}
                </h1>
                <Badge variant="mint" size="sm">Active Engine</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'تحكم دقيق ومباشر في أذونات المستخدمين، سرية الرواتب، مسارات الاعتماد، ومحاكاة الأدوار في الوقت الفعلي.',
                  'Granular permission matrix, salary privacy shields, multi-tier approvals, and real-time role simulation.'
                )}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sand-200/70 border border-sand-300">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-pine shadow-sm'
                  : 'text-neutral-muted hover:text-pine'
              }`}
            >
              {t('مصفوفة الصلاحيات التفاعلية', 'Permissions Matrix')}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-pine shadow-sm'
                  : 'text-neutral-muted hover:text-pine'
              }`}
            >
              {t('سجل المستخدمين والأدوار', 'Users Directory')}
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-pine shadow-sm'
                  : 'text-neutral-muted hover:text-pine'
              }`}
            >
              {t('مختبر المحاكاة الفوري', 'Role Simulator')}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="surface-card p-0 overflow-hidden border border-surface-border">
          <div className="p-4 bg-sand-50/80 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-mint-600" />
              <span className="text-sm font-bold text-pine">
                {t('مصفوفة الصلاحيات التفصيلية (Role-Based Access Control)', 'Detailed RBAC Permission Matrix')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-muted">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-mint-500" />
                {t('صلاحية مفعّلة', 'Enabled')}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sand-300" />
                {t('صلاحية محجوبة', 'Restricted')}
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                {t('بيانات مالية حساسة', 'Confidential')}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/70 border-b border-sand-300 text-pine">
                  <th className="p-3.5 text-start font-bold min-w-[280px]">
                    {t('المجال الوظيفي / الصلاحية البرمجية', 'Functional Domain / Permission')}
                  </th>
                  {roles.map((r) => {
                    const rDef = roleDefinitions[r];
                    const isCurrent = currentRole === r;
                    return (
                      <th
                        key={r}
                        className={`p-3.5 text-center font-bold min-w-[130px] transition-colors ${
                          isCurrent ? 'bg-mint-100/60 border-x border-mint-200' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs">{t(rDef.name, rDef.nameEn)}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-mint-500 text-canvas px-1.5 py-0.2 rounded-full font-normal mt-0.5">
                              {t('دورك الحالي', 'Current Role')}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {permissionGroups.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    {/* Group Header */}
                    <tr className="bg-sand-50/90 font-bold text-pine border-t border-b border-sand-300">
                      <td colSpan={roles.length + 1} className="p-3">
                        <div className="flex items-center gap-2">
                          <span>{t(group.groupName, group.groupNameEn)}</span>
                          <span className="text-[11px] font-normal text-neutral-muted">
                            ({t(group.description, group.descriptionEn)})
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Permissions in Group */}
                    {group.permissions.map((perm) => (
                      <tr key={perm.key} className="hover:bg-sand-50/50 transition-colors">
                        <td className="p-3.5 ps-6 font-medium text-neutral-main">
                          <div className="flex items-center gap-2">
                            {perm.isSensitive && <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                            <div>
                              <span>{t(perm.label, perm.labelEn)}</span>
                              <span className="block text-[10px] text-neutral-subtle font-mono">
                                {perm.key}
                              </span>
                            </div>
                          </div>
                        </td>

                        {roles.map((r) => {
                          const rDef = roleDefinitions[r];
                          const has = rDef.permissions.includes(perm.key);
                          const isCurrent = currentRole === r;

                          return (
                            <td
                              key={r}
                              className={`p-3.5 text-center transition-colors ${
                                isCurrent ? 'bg-mint-50/40 border-x border-mint-200' : ''
                              }`}
                            >
                              <button
                                onClick={() => togglePermissionForRole(r, perm.key)}
                                className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                                  has
                                    ? 'bg-mint-500 text-canvas shadow-sm hover:bg-mint-600'
                                    : 'bg-sand-200 text-neutral-muted hover:bg-sand-300'
                                }`}
                                title={t(
                                  has ? 'انقر لتعطيل الصلاحية لهذا الدور' : 'انقر لتفعيل الصلاحية لهذا الدور',
                                  has ? 'Click to revoke permission' : 'Click to grant permission'
                                )}
                              >
                                {has ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 opacity-40" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-pine">{t('سجل المستخدمين والموظفين المصرحين', 'Authorized Users Directory')}</h2>
              <p className="text-xs text-neutral-muted mt-0.5">
                {t('إدارة حسابات مسؤولي التوظيف والمديرين والمقيّمين وتعيين الأدوار', 'Manage recruiters, hiring managers, reviewers and their roles')}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddUserModalOpen(true)}
            >
              {t('إضافة مستخدم جديد', 'Add New User')}
            </Button>
          </div>

          <div className="surface-card p-0 overflow-hidden border border-surface-border">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/70 border-b border-sand-300 text-pine font-bold">
                  <th className="p-3.5 text-start">{t('المستخدم', 'User')}</th>
                  <th className="p-3.5 text-start">{t('الدور والصلاحيات', 'Role & Permissions')}</th>
                  <th className="p-3.5 text-start">{t('الإدارة / القسم', 'Department')}</th>
                  <th className="p-3.5 text-start">{t('المسمى الوظيفي', 'Job Title')}</th>
                  <th className="p-3.5 text-start">{t('حالة النشاط', 'Status / Last Login')}</th>
                  <th className="p-3.5 text-center">{t('تبديل فوري', 'Quick Switch')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((u) => {
                  const rDef = roleDefinitions[u.role];
                  const isCurrent = currentUser.id === u.id;

                  return (
                    <tr key={u.id} className={`hover:bg-sand-50/50 transition-colors ${isCurrent ? 'bg-mint-50/40' : ''}`}>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={u.name}
                            src={u.avatar}
                            size="sm"
                          />
                          <div>
                            <span className="font-bold text-pine block text-xs">{t(u.name, u.nameEn)}</span>
                            <span className="text-[11px] text-neutral-muted font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <Badge variant="mint" size="sm">
                          {t(rDef?.name || '', rDef?.nameEn || '')}
                        </Badge>
                      </td>

                      <td className="p-3.5 font-medium text-neutral-main">
                        {t(u.department, u.departmentEn)}
                      </td>

                      <td className="p-3.5 text-neutral-muted">
                        {t(u.title, u.titleEn)}
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-muted">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {u.lastLogin || t('نشط', 'Active')}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-mint-600 bg-mint-100 px-2.5 py-1 rounded-lg">
                            {t('أنت الآن', 'Active')}
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => switchRole(u.role)}
                          >
                            {t('تجربة الدخول كـ', 'Login as')}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE SIMULATOR & SALARY SHIELD DEMO */}
      {activeTab === 'simulation' && (
        <div className="space-y-4">
          <div className="surface-card bg-sand-50/60 border border-sand-300">
            <h2 className="text-base font-bold text-pine flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-mint-500" />
              {t('مختبر فحص وحماية البيانات الحساسة (Salary Shield & RBAC Test)', 'Salary Shield & RBAC Live Sandbox')}
            </h2>
            <p className="text-xs text-neutral-muted mt-1">
              {t(
                'شاهد كيف تتغير رؤية الرواتب وأزرار الاعتماد وتعديل المراحل مباشرة عند التبديل بين الأدوار:',
                'See how salary visibility, approval buttons, and stage edit controls adapt in real-time as you switch roles:'
              )}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {roles.map((r) => {
                const rDef = roleDefinitions[r];
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      isSelected
                        ? 'bg-mint-500 text-canvas border-mint-600 shadow-md transform -translate-y-0.5'
                        : 'bg-white text-neutral-main border-sand-300 hover:border-mint-400 hover:bg-sand-50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{t(rDef.name, rDef.nameEn)}</span>
                    <span className={`text-[10px] mt-1 block ${isSelected ? 'text-canvas/80' : 'text-neutral-muted'}`}>
                      {r === 'hr_manager' || r === 'super_admin'
                        ? t('يرى كافة الرواتب والاعتمادات', 'Full salary & approvals')
                        : r === 'hiring_manager'
                        ? t('رواتب مقيدة - مراجعة فنية', 'Masked salary - tech review')
                        : r === 'reviewer'
                        ? t('رواتب محجوبة بالكامل', 'Salary 100% masked')
                        : t('مسؤول استقطاب', 'Recruiter views')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="surface-card">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="text-xs font-bold text-pine">{t('اختبار حجب الرواتب في بطاقة المرشح', 'Candidate Salary Card Test')}</span>
                <Badge variant={roleDefinitions[currentRole]?.permissions.includes('view_salary') ? 'active' : 'pending'}>
                  {roleDefinitions[currentRole]?.permissions.includes('view_salary') ? t('متاح للعرض', 'Visible') : t('محجوب بحسب الصلاحية', 'Masked')}
                </Badge>
              </div>
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-muted">{t('الراتب الحالي للمرشح:', 'Candidate Current Salary:')}</span>
                  {roleDefinitions[currentRole]?.permissions.includes('view_salary') ? (
                    <span className="font-bold text-pine text-sm">45,000 ج.م / شهرياً</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sand-200 text-neutral-muted text-xs">
                      <EyeOff className="w-3.5 h-3.5 text-sand-500" />
                      <span>•••• ج.م</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">{t('سري', 'Restricted')}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-muted">{t('الراتب المتوقع للمرشح:', 'Candidate Expected Salary:')}</span>
                  {roleDefinitions[currentRole]?.permissions.includes('view_salary') ? (
                    <span className="font-bold text-pine text-sm">60,000 ج.م / شهرياً</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sand-200 text-neutral-muted text-xs">
                      <EyeOff className="w-3.5 h-3.5 text-sand-500" />
                      <span>•••• ج.م</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">{t('سري', 'Restricted')}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="surface-card">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="text-xs font-bold text-pine">{t('اختبار أزرار الإجراءات الحساسة', 'Sensitive Action Buttons Test')}</span>
                <Badge variant="info">Role State</Badge>
              </div>
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-muted">{t('زر اعتماد الميزانية والشاغر:', 'Approve Requisition Action:')}</span>
                  {roleDefinitions[currentRole]?.permissions.includes('approve_requisition') ? (
                    <Button variant="primary" size="sm">{t('اعتماد الطلب الآن', 'Approve Now')}</Button>
                  ) : (
                    <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                      {t('معطل - لا تملك صلاحية الاعتماد', 'Disabled - No Approval Rights')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-muted">{t('زر إصدار العرض الوظيفي:', 'Create Job Offer Action:')}</span>
                  {roleDefinitions[currentRole]?.permissions.includes('create_offer') ? (
                    <Button variant="secondary" size="sm">{t('صياغة العرض', 'Draft Offer')}</Button>
                  ) : (
                    <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                      {t('معطل للمقيم الفني', 'Disabled for Reviewer')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title={t('إضافة مستخدم جديد للنظام', 'Add New User')}
        subtitle={t('تخصيص الصلاحيات والدور الوظيفي', 'Assign role and permissions')}
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="form-label">{t('الاسم الكامل', 'Full Name')}</label>
            <input
              type="text"
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="مثال: خالد السعدون"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">{t('البريد الإلكتروني المهني', 'Work Email')}</label>
            <input
              type="email"
              required
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="name@company.com"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('الدور الوظيفي (Role)', 'Role')}</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="form-input"
              >
                <option value="hr_manager">{t('مدير الموارد البشرية', 'HR Manager')}</option>
                <option value="recruiter">{t('مسؤول التوظيف', 'Recruiter')}</option>
                <option value="hiring_manager">{t('مدير الإدارة الطالبة', 'Hiring Manager')}</option>
                <option value="reviewer">{t('مقيّم فني', 'Reviewer')}</option>
                <option value="super_admin">{t('مسؤول النظام الأعلى', 'Super Admin')}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('الإدارة / القسم', 'Department')}</label>
              <input
                type="text"
                required
                value={newUserDepartment}
                onChange={(e) => setNewUserDepartment(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">{t('المسمى الوظيفي', 'Job Title')}</label>
            <input
              type="text"
              required
              value={newUserTitle}
              onChange={(e) => setNewUserTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('حفظ المستخدم', 'Save User')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
