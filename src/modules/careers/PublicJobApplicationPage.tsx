import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  Check, 
  Sparkles, 
  Send, 
  ArrowLeft, 
  ArrowRight,
  Globe, 
  Moon, 
  Sun, 
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Tag
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { JobRequisition } from '../../types/requisition';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SalaryShield } from '../../components/rbac/SalaryShield';
import { fireConfetti } from '../../utils/confetti';

interface PublicJobApplicationPageProps {
  jobId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralName?: string;
  onBackToAdmin?: () => void;
}

export const PublicJobApplicationPage: React.FC<PublicJobApplicationPageProps> = ({
  jobId,
  utmSource = 'direct',
  utmMedium = 'web',
  utmCampaign = 'organic',
  referralName,
  onBackToAdmin,
}) => {
  const { requisitions, addCandidate } = useATSData();
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const isDarkMode = theme === 'dark';
  const isArabic = language === 'ar';

  const [job, setJob] = useState<JobRequisition | null>(null);
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candLocation, setCandLocation] = useState('القاهرة، مصر');
  const [candCurrentTitle, setCandCurrentTitle] = useState('');
  const [candCompany, setCandCompany] = useState('');
  const [candExpYears, setCandExpYears] = useState(4);
  const [candExpectedSalary, setCandExpectedSalary] = useState(55000);
  const [candNoticeDays, setCandNoticeDays] = useState(30);
  const [candSkills, setCandSkills] = useState('React, TypeScript, Node.js');
  const [candSummary, setCandSummary] = useState('');
  const [knockoutAnswers, setKnockoutAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  useEffect(() => {
    const found = requisitions.find((r) => r.id === jobId || r.code === jobId);
    if (found) {
      setJob(found);
      setCandSkills(found.skills.slice(0, 3).join(', '));
      if (found.budgetMin && found.budgetMax) {
        setCandExpectedSalary(Math.round((found.budgetMin + found.budgetMax) / 2));
      }
    } else if (requisitions.length > 0) {
      // Fallback to first available requisition if id not matched
      setJob(requisitions[0]);
      setCandSkills(requisitions[0].skills.slice(0, 3).join(', '));
    }
  }, [jobId, requisitions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail || !job) return;

    setIsSubmitting(true);

    const skillsArray = candSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const matched = skillsArray.filter((s) => job.skills.some((js) => js.toLowerCase().includes(s.toLowerCase())));
    const matchScore = Math.min(96, Math.max(70, Math.round((matched.length / Math.max(1, job.skills.length)) * 100) + 15));

    const refNumber = `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationRef(refNumber);

    setTimeout(() => {
      addCandidate({
        name: candName,
        nameEn: candName,
        email: candEmail,
        phone: candPhone || '+20 100 000 0000',
        avatar: '',
        location: candLocation,
        currentTitle: candCurrentTitle || job.title,
        currentCompany: candCompany || 'شركة سابقة',
        experienceYears: Number(candExpYears),
        education: 'بكالوريوس علوم حاسب / هندسة',
        expectedSalary: Number(candExpectedSalary),
        currency: job.currency || 'ج.م',
        noticePeriodDays: Number(candNoticeDays),
        source: utmSource as any,
        utmSource,
        utmCampaign,
        referralEmployeeName: referralName || undefined,
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.department,
        stage: 'applied',
        status: 'active',
        rating: 4.5,
        matchScore,
        tags: [utmSource, 'تقديم عبر البوابة الخارجية', referralName ? 'إحالة موظف' : 'إعلان توظيف'],
        parsedResume: {
          summary: candSummary || `مرشح تقدم عبر رابط التوظيف الذكي (${utmSource}) للوظيفة ${job.title}. لديه خبرة ${candExpYears} سنوات.`,
          extractedSkills: skillsArray.length > 0 ? skillsArray : job.skills,
          matchedSkills: matched.length > 0 ? matched : job.skills.slice(0, 3),
          missingSkills: job.skills.filter((s) => !matched.includes(s)),
          education: 'بكالوريوس علوم حاسب / هندسة برمجيات',
          experienceSummary: `خبرة عملية ${candExpYears} سنوات في المجال`,
          yearsOfExperience: Number(candExpYears),
          languages: ['العربية (اللغة الأم)', 'الإنجليزية (متقدم)'],
          certifications: ['Professional Developer Certified'],
        },
        knockoutResults: job.knockoutQuestions.map((q) => ({
          questionId: q.id,
          question: q.question,
          answer: knockoutAnswers[q.id] || 'نعم',
          passed: true,
        })),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      fireConfetti();
    }, 800);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="surface-card max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold text-pine">{t('جاري تحميل بيانات الوظيفة...', 'Loading Job Posting...')}</h2>
          <Button variant="secondary" onClick={() => (window.location.href = window.location.pathname)}>
            {t('العودة لبوابة التوظيف الرئيسية', 'Back to Portal')}
          </Button>
        </div>
      </div>
    );
  }

  const isFilled = job.status === 'completed' || job.filledCount >= job.headcount;

  return (
    <div className="min-h-screen bg-canvas text-neutral-main selection:bg-mint-100 selection:text-pine transition-colors">
      {/* PUBLIC NAVBAR */}
      <header className="sticky top-0 z-30 bg-surface/90 dark:bg-surface/90 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-mint-500 text-white flex items-center justify-center font-black shadow-card shadow-mint-500/25">
              ATS
            </div>
            <div>
              <span className="font-extrabold text-pine dark:text-white text-sm tracking-tight block">
                DYNAMIC ATS
              </span>
              <span className="text-[10px] text-neutral-muted block">
                {t('بوابة التوظيف الرسمية واستقطاب الكفاءات', 'Official Careers Portal')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-surface-soft border border-surface-border flex items-center justify-center text-neutral-muted hover:text-pine transition-colors"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-pine" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-surface-soft border border-surface-border text-xs font-bold text-pine dark:text-white hover:bg-mint-500 hover:text-white transition-all flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {isArabic ? 'English' : 'عربي'}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT HERO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* JOB HERO HEADER */}
        <div className="surface-card border-surface-border space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={isFilled ? 'active' : 'mint'} size="sm">
                  {isFilled ? t('مكتمل التعيين ✓', 'Position Filled ✓') : t(job.department, job.departmentEn)}
                </Badge>
                <span className="text-xs font-mono text-neutral-muted bg-sand-100 dark:bg-surface-soft px-2 py-0.5 rounded border border-surface-border">
                  {job.code}
                </span>
                <span className="text-xs text-neutral-muted">
                  • {t('تاريخ النشر:', 'Posted:')} {job.publishedAt || job.createdAt}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-pine dark:text-white tracking-tight">
                {t(job.title, job.titleEn)}
              </h1>

              <div className="flex items-center gap-4 text-xs text-neutral-muted flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-mint-500" />
                  {t(job.location, job.locationEn)}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Briefcase className="w-4 h-4 text-mint-500" />
                  {job.employmentType}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-mint-500" />
                  {t(`خبرة ${job.experienceYearsMin} - ${job.experienceYearsMax} سنوات`, `${job.experienceYearsMin}-${job.experienceYearsMax} Yrs Exp`)}
                </span>
              </div>
            </div>

            {/* Salary Shield / Budget Info */}
            <div className="bg-sand-50/90 dark:bg-surface-soft p-3.5 rounded-2xl border border-surface-border shrink-0 text-start sm:text-end">
              <span className="text-[11px] text-neutral-muted block font-medium">
                {t('الراتب والمزايا المعتمدة:', 'Budget Range:')}
              </span>
              <SalaryShield minAmount={job.budgetMin} maxAmount={job.budgetMax} currency={job.currency} />
            </div>
          </div>
        </div>

        {/* SUBMISSION CONFIRMATION VIEW */}
        {isSubmitted ? (
          <div className="surface-card border-mint-500/40 bg-mint-950/10 text-center py-12 px-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-mint-500 text-white flex items-center justify-center mx-auto shadow-card shadow-mint-500/30">
              <Check className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-pine dark:text-white">
              {t('🎉 تم استلام طلبك بنجاح!', 'Application Received Successfully!')}
            </h2>

            <p className="text-xs text-neutral-main dark:text-neutral-200 max-w-lg mx-auto leading-relaxed">
              {t(
                `شكراً لاهتمامك بالانضمام لفريقنا! تم تسجيل بياناتك بنجاح وحساب درجة المطابقة، وسيقوم فريق الموارد البشرية بمراجعة ملفك والتواصل معك قريباً عبر البريد: ${candEmail}`,
                `Thank you for applying! Your profile has been registered and our recruitment team will review your application and contact you soon via ${candEmail}.`
              )}
            </p>

            <div className="inline-block p-3 bg-surface dark:bg-surface-soft rounded-xl border border-surface-border text-xs font-mono">
              <span className="text-neutral-muted block text-[10px]">{t('رقم مرجع التقديم (Reference ID):', 'Application Ref:')}</span>
              <strong className="text-mint-600 dark:text-mint-400 text-sm">{applicationRef}</strong>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitted(false);
                  setCandName('');
                  setCandEmail('');
                }}
              >
                {t('تقديم طلب آخر لهذه الوظيفة', 'Submit Another Application')}
              </Button>
            </div>
          </div>
        ) : (
          /* TWO-COLUMN LAYOUT: JOB DETAILS & APPLICATION FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: JOB OVERVIEW & RESPONSIBILITIES (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Job Description */}
              <div className="surface-card border-surface-border space-y-3">
                <h3 className="text-sm font-bold text-pine dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-mint-500" />
                  {t('عن الدور والمسؤوليات الوظيفية', 'About the Role')}
                </h3>
                <p className="text-xs text-neutral-main dark:text-neutral-200 leading-relaxed">
                  {t(job.description, job.descriptionEn)}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="surface-card border-surface-border space-y-3">
                  <h3 className="text-sm font-bold text-pine dark:text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-mint-500" />
                    {t('المسؤوليات والمهام الأساسية:', 'Key Responsibilities:')}
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-main dark:text-neutral-200">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Skills */}
              <div className="surface-card border-surface-border space-y-4">
                <h3 className="text-sm font-bold text-pine dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-mint-500" />
                  {t('المهارات والكفاءات المطلوبة:', 'Required Skills & Tech Stack:')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-sand-100 dark:bg-surface-soft text-pine dark:text-white font-medium px-3 py-1 rounded-xl border border-surface-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="pt-3 border-t border-surface-border space-y-2">
                    <span className="text-[11px] font-bold text-neutral-muted block">
                      {t('الشروط والمؤهلات:', 'Requirements & Qualifications:')}
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-main dark:text-neutral-200">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: APPLICATION FORM (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="surface-card border-surface-border sticky top-24 space-y-5">
                <div className="border-b border-surface-border pb-3">
                  <h3 className="text-base font-black text-pine dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-mint-500" />
                    {t('نموذج التقديم المباشر', 'Apply for this Job')}
                  </h3>
                  <p className="text-[11px] text-neutral-muted mt-0.5">
                    {t('املأ بياناتك وسيتم فحص ومطابقة السيرة الذاتية تلقائياً', 'Submit your profile for instant AI screening')}
                  </p>
                </div>

                {isFilled ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-2 text-xs">
                    <span className="font-bold block">
                      ⚠️ {t('تم استيفاء كامل المقاعد المطلوبة لهذه الوظيفة', 'Target Headcount Reached')}
                    </span>
                    <p className="leading-relaxed text-[11px]">
                      {t(
                        'اكتمل عدد التعيينات المعتمدة لهذا الشاغر، ولكن يمكنك إرسال بياناتك لحفظها في بنك المواهب والترشيح التلقائي للشواغر المشابهة.',
                        'All openings filled. You may still apply to join our priority Talent Pool.'
                      )}
                    </p>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="form-label">{t('الاسم الكامل *', 'Full Name *')}</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted" />
                      <input
                        type="text"
                        required
                        value={candName}
                        onChange={(e) => setCandName(e.target.value)}
                        placeholder="مثال: أحمد عبدالمجيد / Sarah Miller"
                        className="form-input ps-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">{t('البريد الإلكتروني *', 'Email Address *')}</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted" />
                        <input
                          type="email"
                          required
                          value={candEmail}
                          onChange={(e) => setCandEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="form-input ps-9"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">{t('رقم الهاتف / واتساب', 'Phone / WhatsApp')}</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted" />
                        <input
                          type="tel"
                          value={candPhone}
                          onChange={(e) => setCandPhone(e.target.value)}
                          placeholder="+20 100 000 0000"
                          className="form-input ps-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">{t('سنوات الخبرة', 'Experience (Years)')}</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={candExpYears}
                        onChange={(e) => setCandExpYears(Number(e.target.value))}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">{t('الراتب المتوقع شهرياً', 'Expected Salary')}</label>
                      <input
                        type="number"
                        step="1000"
                        value={candExpectedSalary}
                        onChange={(e) => setCandExpectedSalary(Number(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">{t('أبرز مهاراتك وخبراتك التقنية', 'Key Skills & Stack')}</label>
                    <input
                      type="text"
                      value={candSkills}
                      onChange={(e) => setCandSkills(e.target.value)}
                      placeholder="React, TypeScript, Node.js, Postgres..."
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">{t('نبذة مهنية موجزة / رابط لينكد إن', 'Summary / LinkedIn / Portfolio')}</label>
                    <textarea
                      rows={3}
                      value={candSummary}
                      onChange={(e) => setCandSummary(e.target.value)}
                      placeholder="اكتب نبذة مختصرة عن خبراتك وأبرز المشاريع التي شاركت فيها..."
                      className="form-input leading-relaxed"
                    />
                  </div>

                  {/* Knockout Screening Questions (if any) */}
                  {job.knockoutQuestions && job.knockoutQuestions.length > 0 && (
                    <div className="pt-2 border-t border-surface-border space-y-2">
                      <span className="text-[11px] font-bold text-pine dark:text-white block">
                        📋 {t('أسئلة الفرز والمطابقة السريعة:', 'Screening Questions:')}
                      </span>
                      {job.knockoutQuestions.map((q) => (
                        <div key={q.id} className="p-2.5 bg-sand-50/80 dark:bg-surface-soft rounded-xl border border-surface-border space-y-1.5">
                          <p className="text-xs text-neutral-main dark:text-neutral-200">{t(q.question, q.questionEn)}</p>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`ko_${q.id}`}
                                checked={knockoutAnswers[q.id] !== 'no'}
                                onChange={() => setKnockoutAnswers({ ...knockoutAnswers, [q.id]: 'yes' })}
                                className="accent-mint-500"
                              />
                              <span>{t('نعم', 'Yes')}</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`ko_${q.id}`}
                                checked={knockoutAnswers[q.id] === 'no'}
                                onChange={() => setKnockoutAnswers({ ...knockoutAnswers, [q.id]: 'no' })}
                                className="accent-mint-500"
                              />
                              <span>{t('لا', 'No')}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full mt-2"
                    disabled={isSubmitting}
                    icon={isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  >
                    {isSubmitting ? t('جاري إرسال الطلب...', 'Submitting...') : t('إرسال طلب التقديم الآن', 'Submit Application')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
