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
  Layers
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
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <Users className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 7: بنك المواهب وإدارة علاقات المرشحين (Talent Pool & CRM)', 'Talent Pool & Candidate CRM')}
                </h1>
                <Badge variant="mint" size="sm">Smart Tagging & Boolean Search</Badge>
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
    </div>
  );
};
