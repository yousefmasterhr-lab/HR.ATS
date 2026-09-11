import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Tag, 
  Send, 
  Filter, 
  Sparkles, 
  Star, 
  Mail, 
  Check, 
  Clock, 
  Briefcase,
  Layers,
  Award
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Candidate } from '../../types/candidate';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { SalaryShield } from '../../components/rbac/SalaryShield';
import { fireConfetti } from '../../utils/confetti';

export const TalentPoolView: React.FC = () => {
  const { candidates } = useATSData();
  const { t } = useThemeLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('حملة استقطاب كوادر التقنية للربع الرابع');
  const [campaignSubject, setCampaignSubject] = useState('فرصة مهنية قيادية جديدة في شركتنا');
  const [isCampaignSent, setIsCampaignSent] = useState(false);

  const availableTags = ['all', 'مرشح استثنائي', 'React Lead', 'إحالة داخلية', 'SHRM-CP', 'خبرة سحابية'];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.parsedResume.extractedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCampaignSent(true);
    fireConfetti();
    setTimeout(() => {
      setIsCampaignSent(false);
      setIsCampaignModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-mint-500 text-white flex items-center justify-center shadow-card shadow-mint-500/25 shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 7: بنك المواهب وإدارة العلاقات', 'Unit 7: Talent Pool CRM')}
                </h1>
                <Badge variant="mint" size="sm">
                  {t('وسوم وبحث ذكي', 'Smart Tagging & CRM')}
                </Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'قاعدة بيانات مفهرسة لجميع السير الذاتية السابقة، مع وسوم ذكية وحملات إعادة تواصل مؤتمتة لملء الشواغر بسرعة.',
                  'Indexed talent bank with smart tags and 1-click candidate re-engagement campaigns.'
                )}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Mail className="w-4 h-4" />}
            onClick={() => setIsCampaignModalOpen(true)}
          >
            {t('إطلاق حملة إعادة تواصل (Campaign)', 'Launch Re-engagement Campaign')}
          </Button>
        </div>
      </div>

      {/* SEARCH AND TAG FILTERS */}
      <div className="surface-card border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted" />
            <input
              type="text"
              placeholder={t('بحث منطقي بالمهارات، الكلمات المفتاحية، المسميات، أو المدن...', 'Boolean search skills, keywords, titles...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input ps-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {availableTags.map((tg) => (
              <button
                key={tg}
                onClick={() => setSelectedTag(tg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedTag === tg
                    ? 'bg-mint-500 text-canvas shadow-xs'
                    : 'bg-sand-100 text-pine hover:bg-sand-200 border border-sand-300'
                }`}
              >
                {tg === 'all' ? t('كافة الوسوم', 'All Tags') : tg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TALENT BANK CANDIDATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            onClick={() => setSelectedCandidate(cand)}
            className="surface-card border border-surface-border hover:border-mint-400 hover:shadow-card-hover transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar
                  name={cand.name}
                  src={cand.avatar}
                  size="md"
                />
                <div>
                  <h4 className="font-bold text-pine text-xs sm:text-sm">{t(cand.name, cand.nameEn)}</h4>
                  <span className="text-[11px] text-neutral-muted block">{cand.currentTitle}</span>
                </div>
              </div>

              <span className="text-xs font-black bg-mint-100 text-pine px-2 py-0.5 rounded-full border border-mint-200">
                {cand.matchScore}%
              </span>
            </div>

            <p className="text-xs text-neutral-main line-clamp-2 leading-relaxed">
              {cand.parsedResume.summary}
            </p>

            <div className="flex flex-wrap gap-1">
              {cand.parsedResume.extractedSkills.slice(0, 4).map((sk, idx) => (
                <span key={idx} className="text-[10px] bg-sand-100 text-pine px-2 py-0.5 rounded border border-sand-200">
                  {sk}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-neutral-muted">
              <span>{cand.experienceYears} {t('سنوات خبرة', 'yrs exp')}</span>
              <SalaryShield amount={cand.expectedSalary} currency={cand.currency} />
            </div>
          </div>
        ))}
      </div>

      {/* RE-ENGAGEMENT CAMPAIGN MODAL */}
      {isCampaignModalOpen && (
        <Modal
          isOpen={isCampaignModalOpen}
          onClose={() => setIsCampaignModalOpen(false)}
          title={t('إطلاق حملة إعادة تواصل ذكية مع الكفاءات (Talent Re-engagement Campaign)', 'Launch Re-engagement Campaign')}
          subtitle={t('إرسال رسائل بريدية مخصصة إلى المرشحين المؤهلين بضغطة زر', 'Reach out to filtered candidates in talent pool')}
          maxWidth="lg"
        >
          {isCampaignSent ? (
            <div className="py-8 text-center space-y-3 animate-fade-in text-xs">
              <div className="w-14 h-14 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-pine">
                {t('تم إرسال الحملة بنجاح إلى 12 مرشحاً!', 'Campaign Sent to 12 Qualified Candidates!')}
              </h4>
              <p className="text-neutral-muted max-w-sm mx-auto">
                {t('سيتم تتبع معدل فتح الرسائل والتفاعل في لوحة المؤشرات تلقائياً.', 'Open rates & responses will be tracked live in Analytics.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
              <div>
                <label className="form-label">{t('عنوان الحملة الداخلي:', 'Campaign Name:')}</label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{t('عنوان البريد المرسل للمرشحين:', 'Email Subject Line:')}</label>
                <input
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{t('نص الرسالة والدعوة:', 'Message Template:')}</label>
                <textarea
                  rows={4}
                  defaultValue="مرحباً، بناءً على ملفك المهني المتميز في قاعدة بياناتنا، يسعدنا دعوتك لاستكشاف فرصة قيادية جديدة تتناسب تماماً مع خبراتك وإنجازاتك السابقة..."
                  className="form-input"
                />
              </div>

              <div className="p-3 bg-mint-50 rounded-xl border border-mint-200 text-pine font-medium">
                {t('عدد المرشحين المستهدفين في هذه الشريحة:', 'Targeted Candidates:')} <strong>{filteredCandidates.length} {t('مرشحاً', 'candidates')}</strong>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
                <Button type="button" variant="ghost" onClick={() => setIsCampaignModalOpen(false)}>
                  {t('إلغاء', 'Cancel')}
                </Button>
                <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
                  {t('إرسال الحملة الآن', 'Launch Campaign')}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* CANDIDATE DETAILS MODAL */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={t(selectedCandidate.name, selectedCandidate.nameEn)}
          subtitle={`${selectedCandidate.currentTitle} • ${selectedCandidate.currentCompany || t('بنك المواهب المعتمد', 'Talent Pool')}`}
          maxWidth="4xl"
        >
          <div className="space-y-4 text-xs">
            {/* Top Candidate Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-sand-50/80 dark:bg-surface-soft border border-surface-border">
              <div className="flex items-center gap-3.5">
                <Avatar
                  name={selectedCandidate.name}
                  src={selectedCandidate.avatar}
                  size="lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-pine dark:text-white">
                      {t(selectedCandidate.name, selectedCandidate.nameEn)}
                    </h3>
                    <span className="text-xs font-black bg-mint-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      {selectedCandidate.matchScore}% {t('مطابقة', 'Match')}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-muted dark:text-neutral-300 block mt-0.5">
                    {selectedCandidate.email} • {selectedCandidate.phone} • {selectedCandidate.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => {
                    fireConfetti();
                    alert(t('تم إرسال دعوة مباشرة وتواصل مع المرشح بنجاح!', 'Direct invitation sent to candidate successfully!'));
                  }}
                >
                  {t('إرسال دعوة مباشرة (Direct Outreach)', 'Direct Outreach')}
                </Button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface dark:bg-surface-soft p-3.5 rounded-xl border border-surface-border">
              <div>
                <span className="text-neutral-muted block text-[11px] font-medium">{t('سنوات الخبرة:', 'Experience:')}</span>
                <span className="font-bold text-pine dark:text-white mt-0.5 block">{selectedCandidate.experienceYears} {t('سنوات', 'Years')}</span>
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px] font-medium">{t('الراتب المتوقع (RBAC):', 'Expected Salary:')}</span>
                <SalaryShield amount={selectedCandidate.expectedSalary} currency={selectedCandidate.currency} />
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px] font-medium">{t('فترة الإشعار (Notice):', 'Notice Period:')}</span>
                <span className="font-bold text-pine dark:text-white mt-0.5 block">{selectedCandidate.noticePeriodDays} {t('يوم', 'Days')}</span>
              </div>
              <div>
                <span className="text-neutral-muted block text-[11px] font-medium">{t('مصدر الإحالة / القناة:', 'Source Channel:')}</span>
                <span className="font-bold text-mint-600 dark:text-mint-400 mt-0.5 block">{selectedCandidate.source}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h4 className="font-bold text-pine dark:text-white mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-mint-500" />
                {t('النبذة المهنية وخلاصة السيرة الذاتية:', 'Professional Summary:')}
              </h4>
              <p className="p-3.5 bg-sand-50/80 dark:bg-surface-muted rounded-xl border border-surface-border leading-relaxed text-neutral-main dark:text-neutral-200">
                {selectedCandidate.parsedResume.summary || t('سيرة ذاتية مفهرسة ومطابقة للشواغر.', 'Indexed resume profile.')}
              </p>
            </div>

            {/* Education & Experience Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-sand-50/80 dark:bg-surface-muted rounded-xl border border-surface-border">
                <span className="text-[11px] font-bold text-pine dark:text-white block mb-1">
                  🎓 {t('المؤهل العلمي والتعليم:', 'Education:')}
                </span>
                <span className="text-xs text-neutral-main dark:text-neutral-200 block">
                  {selectedCandidate.education || selectedCandidate.parsedResume.education || t('بكالوريوس هندسة / حاسبات', "Bachelor's Degree")}
                </span>
              </div>

              <div className="p-3.5 bg-sand-50/80 dark:bg-surface-muted rounded-xl border border-surface-border">
                <span className="text-[11px] font-bold text-pine dark:text-white block mb-1">
                  💼 {t('الخبرة الحالية والشركة:', 'Current Role & Company:')}
                </span>
                <span className="text-xs text-neutral-main dark:text-neutral-200 block">
                  {selectedCandidate.currentTitle} • {selectedCandidate.currentCompany}
                </span>
              </div>
            </div>

            {/* Extracted Skills */}
            <div>
              <h4 className="font-bold text-pine dark:text-white mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-mint-500" />
                {t('المهارات والكفاءات المفهرسة (AI Extracted Skills):', 'Extracted Skills:')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.parsedResume.extractedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-sand-100 dark:bg-surface-soft text-pine dark:text-white font-medium px-2.5 py-1 rounded-lg border border-surface-border"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications and Languages */}
            {selectedCandidate.parsedResume.certifications && selectedCandidate.parsedResume.certifications.length > 0 && (
              <div>
                <h4 className="font-bold text-pine dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-mint-500" />
                  {t('الشهادات والاعتمادات المهنية:', 'Certifications & Badges:')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.parsedResume.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium px-2.5 py-1 rounded-lg border border-amber-500/30"
                    >
                      🏆 {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
