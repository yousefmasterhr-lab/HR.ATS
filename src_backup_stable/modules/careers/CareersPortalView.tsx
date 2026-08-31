import React, { useState } from 'react';
import { 
  Globe2, 
  Share2, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Send, 
  ExternalLink,
  Briefcase,
  MapPin,
  Building,
  UploadCloud
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { JobRequisition } from '../../types/requisition';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SalaryShield } from '../../components/rbac/SalaryShield';
import { fireConfetti } from '../../utils/confetti';

export const CareersPortalView: React.FC = () => {
  const { requisitions, addCandidate } = useATSData();
  const { t } = useThemeLanguage();

  const [selectedJob, setSelectedJob] = useState<JobRequisition | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // UTM Generator State
  const [utmJobId, setUtmJobId] = useState<string>(requisitions[0]?.id || '');
  const [utmSource, setUtmSource] = useState('linkedin');
  const [utmMedium, setUtmMedium] = useState('social_post');
  const [utmCampaign, setUtmCampaign] = useState('q3_hiring_push');
  const [referralName, setReferralName] = useState('');

  // Candidate Application Form State
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candExpYears, setCandExpYears] = useState(5);
  const [candExpectedSalary, setCandExpectedSalary] = useState(55000);
  const [candSkills, setCandSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [candNoticeDays, setCandNoticeDays] = useState(30);
  const [isApplyingSuccess, setIsApplyingSuccess] = useState(false);

  const activePublishedJobs = requisitions.filter((r) => r.status === 'published' || r.status === 'approved');

  const generatedUrl = `https://careers.enterprise-ats.com/jobs/${utmJobId}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}${referralName ? `&ref=${encodeURIComponent(referralName)}` : ''}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail || !selectedJob) return;

    // Simulate AI parsing and skills match %
    const skillsArray = candSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const matched = skillsArray.filter((s) => selectedJob.skills.some((js) => js.toLowerCase().includes(s.toLowerCase())));
    const matchScore = Math.min(96, Math.max(70, Math.round((matched.length / Math.max(1, selectedJob.skills.length)) * 100) + 15));

    addCandidate({
      name: candName,
      nameEn: candName,
      email: candEmail,
      phone: candPhone || '+20 100 000 0000',
      avatar: '',
      location: 'القاهرة، مصر',
      currentTitle: 'مهندس برمجيات متقدم',
      currentCompany: 'شركة تقنية سابقة',
      experienceYears: Number(candExpYears),
      education: 'بكالوريوس علوم حاسب',
      expectedSalary: Number(candExpectedSalary),
      currency: 'ج.م',
      noticePeriodDays: Number(candNoticeDays),
      source: utmSource as any,
      utmSource,
      utmCampaign,
      referralEmployeeName: referralName || undefined,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      jobDepartment: selectedJob.department,
      stage: 'applied',
      status: 'active',
      matchScore,
      rating: 4,
      tags: ['تقديم مباشر عبر البوابة'],
      parsedResume: {
        summary: `مرشح تقدم مباشرة عبر بوابة التوظيف ولديه خبرة ${candExpYears} سنوات في المجال.`,
        extractedSkills: skillsArray,
        matchedSkills: matched.length > 0 ? matched : skillsArray.slice(0, 3),
        missingSkills: selectedJob.skills.filter((s) => !skillsArray.includes(s)),
        education: 'بكالوريوس معتمد',
        experienceSummary: `${candExpYears} سنوات من الخبرة العملية`,
        yearsOfExperience: Number(candExpYears),
        languages: ['العربية', 'الإنجليزية'],
        certifications: ['Certified Professional'],
      },
      knockoutResults: selectedJob.knockoutQuestions.map((kq) => ({
        questionId: kq.id,
        question: kq.question,
        answer: 'نعم، مطابق للشروط',
        passed: true,
      })),
    });

    setIsApplyingSuccess(true);
    fireConfetti();

    setTimeout(() => {
      setIsApplyingSuccess(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      setCandName('');
      setCandEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <Globe2 className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 3 (ب): بوابة التوظيف وقنوات الاستقطاب (Careers Hub)', 'Careers Portal & UTM Sourcing Hub')}
                </h1>
                <Badge variant="mint" size="sm">Multi-channel Sourcing</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'نشر الوظائف بضغطة واحدة مع توليد روابط التتبع المخصصة (UTM Links)، وتتبع إحالات الموظفين الداخلية.',
                  'Multiposting with dynamic UTM link generator, referral engine, and branded careers simulator.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UTM CAMPAIGN GENERATOR CARD */}
      <div className="surface-card border border-surface-border">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
          <Share2 className="w-4 h-4 text-mint-600" />
          <h3 className="font-bold text-pine text-xs sm:text-sm">
            {t('مولد روابط التتبع الذكية لقنوات النشر (UTM Tracking Link Generator)', 'UTM Link Generator')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 text-xs">
          <div>
            <label className="form-label">{t('الوظيفة المستهدفة:', 'Target Job:')}</label>
            <select
              value={utmJobId}
              onChange={(e) => setUtmJobId(e.target.value)}
              className="form-input"
            >
              {activePublishedJobs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} - {t(r.title, r.titleEn)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">{t('قناة النشر (Source):', 'UTM Source:')}</label>
            <select
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              className="form-input"
            >
              <option value="linkedin">LinkedIn (لينكد إن)</option>
              <option value="indeed">Indeed (إنديد)</option>
              <option value="bayt">Bayt.com (بيت.كوم)</option>
              <option value="twitter_x">X / Twitter (منصة إكس)</option>
              <option value="referral">Internal Referral (إحالة موظف)</option>
            </select>
          </div>

          <div>
            <label className="form-label">{t('نوع الإعلان (Medium):', 'UTM Medium:')}</label>
            <input
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              className="form-input"
              placeholder="social_post, job_board, ad"
            />
          </div>

          <div>
            <label className="form-label">{t('اسم الحملة / الموظف:', 'Campaign / Ref Name:')}</label>
            <input
              type="text"
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
              className="form-input"
              placeholder="مثال: محمود الصاوي (فريق التقنية)"
            />
          </div>
        </div>

        {/* Generated URL Result Box */}
        <div className="mt-4 p-3 bg-sand-50 rounded-xl border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden w-full font-mono text-neutral-main truncate">
            <LinkIcon className="w-4 h-4 text-mint-600 shrink-0" />
            <span className="truncate">{generatedUrl}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            onClick={() => copyToClipboard(generatedUrl)}
            className="shrink-0"
          >
            {copiedLink ? t('تم النسخ بنجاح!', 'Copied!') : t('نسخ الرابط للنشر', 'Copy Link')}
          </Button>
        </div>
      </div>

      {/* BRANDED EXTERNAL CAREERS PORTAL PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-pine flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mint-500" />
              {t('بوابة التوظيف الخارجية التفاعلية (Branded Careers Portal Preview)', 'Live Careers Page Simulator')}
            </h3>
            <p className="text-xs text-neutral-muted">
              {t('هكذا يرى المرشحون الشواغر الوظيفية ويقدمون عليها في موقع الشركة', 'Public candidate-facing job portal')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePublishedJobs.map((job) => (
            <div
              key={job.id}
              className="surface-card border border-surface-border hover:border-mint-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="mint" size="sm">
                    {t(job.department, job.departmentEn)}
                  </Badge>
                  <span className="text-[10px] text-neutral-muted font-mono">{job.code}</span>
                </div>

                <div>
                  <h4 className="font-bold text-pine text-sm">{t(job.title, job.titleEn)}</h4>
                  <div className="flex items-center gap-3 text-xs text-neutral-muted mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-mint-600" />
                      {t(job.location, job.locationEn)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-mint-600" />
                      {job.employmentType}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-main line-clamp-3 leading-relaxed">
                  {t(job.description, job.descriptionEn)}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {job.skills.slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-sand-100 text-pine px-2 py-0.5 rounded border border-sand-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-muted block">{t('الراتب التقديري:', 'Budget:')}</span>
                  <SalaryShield minAmount={job.budgetMin} maxAmount={job.budgetMax} currency={job.currency} />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setIsApplyModalOpen(true);
                  }}
                >
                  {t('تقديم الآن (Apply)', 'Apply Now')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CANDIDATE APPLICATION MODAL */}
      {selectedJob && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`${t('التقديم على شاغر:', 'Apply for:')} ${t(selectedJob.title, selectedJob.titleEn)}`}
          subtitle={t('تعبئة بيانات المرشح واختبار محرك الفرز ونسبة المطابقة الذكية', 'Simulate public candidate application')}
          maxWidth="lg"
        >
          {isApplyingSuccess ? (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-pine">
                {t('تم استلام طلب التوظيف بنجاح!', 'Application Submitted Successfully!')}
              </h4>
              <p className="text-xs text-neutral-muted max-w-sm mx-auto">
                {t(
                  'تم إدراج المرشح تلقائياً في مرحلة "تم الاستلام" بلوحة Kanban وحساب درجة المطابقة الذكية.',
                  'Candidate registered into Kanban pipeline with calculated match score.'
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{t('الاسم الكامل', 'Full Name')}</label>
                  <input
                    type="text"
                    required
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    placeholder="مثال: تركي الحربي / عمر عادل"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('البريد الإلكتروني', 'Email Address')}</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">{t('رقم الجوال', 'Phone')}</label>
                  <input
                    type="tel"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    placeholder="+20 100 123 4567"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('سنوات الخبرة', 'Experience (Years)')}</label>
                  <input
                    type="number"
                    min="1"
                    value={candExpYears}
                    onChange={(e) => setCandExpYears(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('الراتب المتوقع (ج.م)', 'Expected Salary (EGP)')}</label>
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
                <label className="form-label">{t('المهارات والتقنيات (مفصولة بفاصلة)', 'Skills (comma-separated)')}</label>
                <input
                  type="text"
                  value={candSkills}
                  onChange={(e) => setCandSkills(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Upload Resume Mock */}
              <div className="p-4 border-2 border-dashed border-sand-300 rounded-xl text-center bg-sand-50/50 hover:bg-mint-50/30 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-mint-500 mx-auto mb-1" />
                <span className="font-bold text-pine block">{t('تم إرفاق السيرة الذاتية (Resume.pdf)', 'Resume attached')}</span>
                <span className="text-[10px] text-neutral-muted">{t('محرك الـ AI سيقوم باستخراج الكيانات والمهارات تلقائياً', 'AI will auto parse skills and entities')}</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
                <Button type="button" variant="ghost" onClick={() => setIsApplyModalOpen(false)}>
                  {t('إلغاء', 'Cancel')}
                </Button>
                <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
                  {t('إرسال طلب التوظيف', 'Submit Application')}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
