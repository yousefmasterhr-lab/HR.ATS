import React, { useState } from 'react';
import { 
  Kanban, 
  Search, 
  Filter, 
  Star, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Plus, 
  UserCheck, 
  MessageSquare, 
  History, 
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Candidate, PipelineStageId, DEFAULT_STAGES } from '../../types/candidate';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { SalaryShield } from '../../components/rbac/SalaryShield';

export const PipelineKanbanView: React.FC = () => {
  const { candidates, requisitions, moveCandidateStage, rejectCandidate, addCandidateNote } = useATSData();
  const { currentUser, hasPermission } = useAuth();
  const { t } = useThemeLanguage();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'knockout' | 'notes' | 'activity'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCandidateId(id);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStageId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (id) {
      moveCandidateStage(id, targetStage);
    }
    setDraggedCandidateId(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedCandidateId(null);
    setDragOverStage(null);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.parsedResume.extractedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesJob = jobFilter === 'all' || c.jobId === jobFilter;
    const matchesScore = c.matchScore >= minScoreFilter;

    return matchesSearch && matchesJob && matchesScore;
  });

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-mint-500 text-white shadow-xs">
          <Sparkles className="w-3 h-3" />
          {score}% {t('مطابقة استثنائية', 'Match')}
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-mint-100 dark:bg-mint-900/70 text-pine dark:text-mint-300 border border-mint-200 dark:border-mint-700">
          {score}% {t('مطابقة عالية', 'Match')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sand-200 dark:bg-sand-300/40 text-neutral-muted dark:text-neutral-main">
        {score}% {t('مطابقة مقبولة', 'Match')}
      </span>
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText || !selectedCandidate) return;

    addCandidateNote(selectedCandidate.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header & Pipeline Control Bar */}
      <div className="surface-card border-surface-border p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-mint-500 text-white flex items-center justify-center shadow-card shadow-mint-500/25 shrink-0">
              <Kanban className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-pine">
                  {t('الوحدة 3: مسار وتتبع المرشحين', 'Unit 3: Candidate Pipeline')}
                </h1>
                <Badge variant="mint" size="sm">
                  {t('لوحة كانبان', 'Kanban Board')}
                </Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-0.5">
                {t(
                  'لوحة تحكم تفاعلية بالسحب والإفلات لمتابعة مراحل المرشحين وقارئ السير الذاتية الذكي.',
                  'Interactive Kanban board with live drag & drop and AI resume matching.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Job Filter */}
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-surface-soft border border-surface-border rounded-xl px-3 py-2 text-xs text-pine font-bold focus:outline-none focus:ring-2 focus:ring-mint-500/30 max-w-[200px] sm:max-w-[240px] truncate"
            >
              <option value="all">{t('جميع الوظائف المفتوحة', 'All Job Requisitions')}</option>
              {requisitions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} - {t(r.title, r.titleEn)}
                </option>
              ))}
            </select>

            {/* Match Score Filter */}
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="bg-surface-soft border border-surface-border rounded-xl px-3 py-2 text-xs text-pine font-bold focus:outline-none focus:ring-2 focus:ring-mint-500/30 shrink-0"
            >
              <option value={0}>{t('كل نسب المطابقة', 'All Match Scores')}</option>
              <option value={80}>{t('المطابقة ≥ 80%', 'Match ≥ 80%')}</option>
              <option value={90}>{t('المطابقة ≥ 90%', 'Match ≥ 90%')}</option>
            </select>
          </div>
        </div>

        {/* Dynamic Headcount & Hiring Fill Progress Indicator for Selected Job */}
        {(() => {
          const selectedReq = jobFilter !== 'all' ? requisitions.find((r) => r.id === jobFilter) : null;
          if (!selectedReq) return null;

          const isFilled = selectedReq.status === 'completed' || selectedReq.filledCount >= selectedReq.headcount;
          const remaining = Math.max(0, selectedReq.headcount - selectedReq.filledCount);
          const percent = Math.min(100, Math.round((selectedReq.filledCount / selectedReq.headcount) * 100));

          return (
            <div className="mt-4 pt-3.5 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    isFilled
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                      : 'bg-mint-500 text-white shadow-sm shadow-mint-500/25'
                  }`}
                >
                  {selectedReq.filledCount}/{selectedReq.headcount}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pine dark:text-white text-xs">
                      {t(selectedReq.title, selectedReq.titleEn)}
                    </span>
                    {isFilled ? (
                      <Badge variant="active" size="sm">
                        {t('مكتمل التعيين بالكامل ✓', '100% Filled ✓')}
                      </Badge>
                    ) : (
                      <Badge variant="mint" size="sm">
                        {t(`متبقي ${remaining} شواغر للتعيين`, `${remaining} Openings Left`)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-muted block mt-0.5">
                    {t(
                      `تم تعيين ${selectedReq.filledCount} من إجمالي ${selectedReq.headcount} مقاعد معتمدة لهذا الشاغر`,
                      `Hired ${selectedReq.filledCount} of ${selectedReq.headcount} target headcount`
                    )}
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-56 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-neutral-muted font-bold">
                  <span>{t('نسبة إشغال الشاغر', 'Hiring Target')}</span>
                  <span className="font-mono text-pine dark:text-white">{percent}%</span>
                </div>
                <div className="w-full bg-sand-200 dark:bg-surface-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFilled ? 'bg-emerald-500' : 'bg-mint-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* KANBAN BOARD CONTAINER */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start w-full">
        {DEFAULT_STAGES.filter((s) => s.id !== 'rejected').map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);
          const isOverThisStage = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-80 shrink-0 bg-sidebar/80 dark:bg-surface/50 rounded-2xl border transition-all duration-200 flex flex-col max-h-[calc(100vh-270px)] overflow-hidden shadow-xs ${
                isOverThisStage
                  ? 'ring-2 ring-mint-500 border-mint-500 bg-mint-50/20 dark:bg-mint-950/40 scale-[1.015] shadow-lg shadow-mint-500/15'
                  : 'border-sidebar-border hover:border-mint-400/50'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-sidebar-border bg-surface/80 dark:bg-surface-muted/60 rounded-t-2xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-xs"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="font-bold text-pine text-xs">{t(stage.title, stage.titleEn)}</h3>
                </div>
                <span className="text-xs font-extrabold bg-sand-200 dark:bg-surface-soft text-pine px-2 py-0.5 rounded-full border border-surface-border">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1 kanban-scroll overscroll-contain">
                {/* Active Drop Placeholder Indicator */}
                {isOverThisStage && (
                  <div className="p-3 border-2 border-dashed border-mint-500 bg-mint-500/15 rounded-xl flex items-center justify-center gap-2 text-mint-700 dark:text-mint-300 font-bold text-xs animate-pulse">
                    <span>↓</span>
                    {t('إفلات المرشح هنا لتحديث المرحلة', 'Drop candidate here')}
                  </div>
                )}

                {stageCandidates.map((cand) => {
                  const isBeingDragged = draggedCandidateId === cand.id;

                  return (
                    <div
                      key={cand.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cand.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setActiveTab('overview');
                      }}
                      className={`bg-surface rounded-xl p-3.5 border shadow-card cursor-grab active:cursor-grabbing transition-all transform space-y-2.5 group ${
                        isBeingDragged
                          ? 'opacity-40 scale-95 border-dashed border-2 border-mint-500 shadow-none'
                          : 'border-surface-border hover:shadow-card-hover hover:border-mint-400 hover:-translate-y-1'
                      }`}
                    >
                      {/* Header: Avatar, Name, Match Score */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={cand.name}
                            src={cand.avatar}
                            size="sm"
                          />
                          <div>
                            <h4 className="font-bold text-pine text-xs group-hover:text-mint-600 transition-colors leading-tight">
                              {t(cand.name, cand.nameEn)}
                            </h4>
                            <span className="text-[10px] text-neutral-muted block truncate max-w-[140px]">
                              {cand.currentTitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score & Stars */}
                      <div className="flex items-center justify-between pt-1 border-t border-surface-border">
                        {getMatchScoreBadge(cand.matchScore)}
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < cand.rating ? 'fill-amber-400 text-amber-400' : 'text-sand-300 dark:text-sand-400/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Job Title & Experience */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-muted">
                        <span className="truncate max-w-[130px] font-medium text-pine">
                          {cand.jobTitle}
                        </span>
                        <span className="shrink-0 font-medium">{cand.experienceYears} {t('سنوات خبرة', 'yrs exp')}</span>
                      </div>

                      {/* Tags */}
                      {cand.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {cand.tags.slice(0, 2).map((tg, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold bg-sand-100 dark:bg-surface-muted text-pine px-1.5 py-0.5 rounded border border-surface-border"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && !isOverThisStage && (
                  <div className="py-5 text-center text-xs text-neutral-subtle border-2 border-dashed border-surface-border rounded-xl">
                    {t('اسحب المرشحين إلى هنا', 'Drop candidates here')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CANDIDATE DETAILS DRAWER MODAL */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={t(selectedCandidate.name, selectedCandidate.nameEn)}
          subtitle={`${selectedCandidate.currentTitle} • ${selectedCandidate.jobTitle}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            {/* Top Candidate Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-sand-50 border border-sand-200">
              <div className="flex items-center gap-3">
                <Avatar
                  name={selectedCandidate.name}
                  src={selectedCandidate.avatar}
                  size="lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-pine">
                      {t(selectedCandidate.name, selectedCandidate.nameEn)}
                    </h3>
                    {getMatchScoreBadge(selectedCandidate.matchScore)}
                  </div>
                  <span className="text-xs text-neutral-muted block">
                    {selectedCandidate.email} • {selectedCandidate.phone} • {selectedCandidate.location}
                  </span>
                </div>
              </div>

              {/* Stage Switcher in Drawer */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => {
                    moveCandidateStage(selectedCandidate.id, e.target.value as PipelineStageId);
                    setSelectedCandidate({
                      ...selectedCandidate,
                      stage: e.target.value as PipelineStageId,
                    });
                  }}
                  className="form-input text-xs font-bold text-pine py-1.5"
                >
                  {DEFAULT_STAGES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {t(st.title, st.titleEn)}
                    </option>
                  ))}
                </select>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  {t('استبعاد المرشح', 'Reject')}
                </Button>
              </div>
            </div>

            {/* Tab navigation inside Drawer */}
            <div className="flex border-b border-surface-border gap-2 text-xs font-bold">
              {[
                { key: 'overview', label: 'الملف التعريفي', labelEn: 'Overview' },
                { key: 'resume', label: 'محلل السيرة الذاتية (Parser)', labelEn: 'Parsed Resume' },
                { key: 'knockout', label: 'أسئلة الاستبعاد (Knockout)', labelEn: 'Knockout Questions' },
                { key: 'notes', label: `الملاحظات المشتركة (${selectedCandidate.notes.length})`, labelEn: `Notes (${selectedCandidate.notes.length})` },
                { key: 'activity', label: 'سجل التتبع والتدقيق', labelEn: 'Audit Trail' },
              ].map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setActiveTab(tb.key as any)}
                  className={`pb-2.5 px-3 transition-colors border-b-2 ${
                    activeTab === tb.key
                      ? 'border-mint-500 text-pine font-extrabold'
                      : 'border-transparent text-neutral-muted hover:text-pine'
                  }`}
                >
                  {t(tb.label, tb.labelEn)}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-surface-border">
                  <div>
                    <span className="text-neutral-muted block text-[11px]">{t('الراتب الحالي (RBAC):', 'Current Salary:')}</span>
                    <SalaryShield amount={selectedCandidate.currentSalary} currency={selectedCandidate.currency} />
                  </div>
                  <div>
                    <span className="text-neutral-muted block text-[11px]">{t('الراتب المتوقع (RBAC):', 'Expected Salary:')}</span>
                    <SalaryShield amount={selectedCandidate.expectedSalary} currency={selectedCandidate.currency} />
                  </div>
                  <div>
                    <span className="text-neutral-muted block text-[11px]">{t('مهلة المباشرة (Notice):', 'Notice Period:')}</span>
                    <span className="font-bold text-pine">{selectedCandidate.noticePeriodDays} {t('يوم', 'Days')}</span>
                  </div>
                  <div>
                    <span className="text-neutral-muted block text-[11px]">{t('مصدر الاستقطاب:', 'Source Channel:')}</span>
                    <span className="font-bold text-mint-700">{selectedCandidate.source} ({selectedCandidate.utmSource || 'Direct'})</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-pine mb-1.5">{t('النبذة المهنية:', 'Professional Summary:')}</h4>
                  <p className="p-3 bg-sand-50 rounded-xl border border-sand-200 leading-relaxed text-neutral-main">
                    {selectedCandidate.parsedResume.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-pine mb-1.5">{t('المهارات المطابقة للشروط:', 'Matched Competencies:')}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.parsedResume.matchedSkills.map((sk, idx) => (
                      <Badge key={idx} variant="active" size="sm">
                        ✓ {sk}
                      </Badge>
                    ))}
                    {selectedCandidate.parsedResume.missingSkills.map((sk, idx) => (
                      <Badge key={idx} variant="rejected" size="sm">
                        ✕ {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PARSED RESUME */}
            {activeTab === 'resume' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-mint-50/50 border border-mint-200">
                  <div className="flex items-center gap-2 font-bold text-pine text-sm mb-2">
                    <Sparkles className="w-4 h-4 text-mint-600" />
                    {t('المعلومات المستخرجة تلقائياً عبر محرك الـ AI Parser', 'AI Extracted Profile & Entities')}
                  </div>
                  <p className="text-neutral-muted leading-relaxed">
                    {selectedCandidate.parsedResume.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
                    <h5 className="font-bold text-pine">{t('التعليم والمؤهلات الأكاديمية:', 'Education:')}</h5>
                    <p className="text-neutral-main">{selectedCandidate.parsedResume.education}</p>
                    <h5 className="font-bold text-pine pt-2">{t('الشهادات المهنية:', 'Certifications:')}</h5>
                    <ul className="list-disc list-inside text-neutral-muted space-y-1">
                      {selectedCandidate.parsedResume.certifications.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
                    <h5 className="font-bold text-pine">{t('اللغات المتقنة:', 'Languages:')}</h5>
                    <div className="flex gap-2">
                      {selectedCandidate.parsedResume.languages.map((l, i) => (
                        <Badge key={i} variant="neutral">{l}</Badge>
                      ))}
                    </div>
                    <h5 className="font-bold text-pine pt-2">{t('كافة المهارات المكتشفة:', 'All Extracted Skills:')}</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.parsedResume.extractedSkills.map((s, i) => (
                        <span key={i} className="bg-sand-100 text-pine text-[10px] px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: KNOCKOUT QUESTIONS */}
            {activeTab === 'knockout' && (
              <div className="space-y-3 text-xs">
                {selectedCandidate.knockoutResults.map((kq, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      kq.passed ? 'bg-mint-50/60 border-mint-200' : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-pine block">{kq.question}</span>
                      <span className="text-neutral-muted mt-0.5 block">{t('إجابة المرشح:', 'Answer:')} {kq.answer}</span>
                    </div>
                    <Badge variant={kq.passed ? 'active' : 'rejected'}>
                      {kq.passed ? t('مطابق للشروط', 'Passed') : t('غير مطابق (مستبعد)', 'Failed')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: COLLABORATIVE NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('أضف ملاحظة أو تقييماً مشتركاً لفريق التوظيف...', 'Add team note or mention...')}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="form-input"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    {t('إضافة ملاحظة', 'Post Note')}
                  </Button>
                </form>

                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {selectedCandidate.notes.map((nt) => (
                    <div key={nt.id} className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pine">{nt.authorName}</span>
                        <span className="text-[10px] text-neutral-muted">{nt.createdAt}</span>
                      </div>
                      <p className="text-neutral-main">{nt.content}</p>
                    </div>
                  ))}
                  {selectedCandidate.notes.length === 0 && (
                    <p className="text-center text-neutral-muted py-4">{t('لا توجد ملاحظات مسجلة بعد.', 'No notes added yet.')}</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: AUDIT ACTIVITY TRAIL */}
            {activeTab === 'activity' && (
              <div className="space-y-3 text-xs max-h-72 overflow-y-auto">
                {selectedCandidate.activities.map((act) => (
                  <div key={act.id} className="p-3 bg-surface rounded-xl border border-surface-border flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-mint-100 text-pine flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pine">{t(act.title, act.titleEn)}</span>
                        <span className="text-[10px] text-neutral-muted">{act.timestamp}</span>
                      </div>
                      <p className="text-neutral-muted mt-0.5">{act.description}</p>
                      <span className="text-[10px] text-mint-700 font-semibold block mt-1">
                        {t('بواسطة:', 'By:')} {act.performedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* REJECT MODAL */}
      {isRejectModalOpen && selectedCandidate && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title={t('استبعاد المرشح وتوثيق السبب', 'Reject Candidate')}
          subtitle={selectedCandidate.name}
          maxWidth="md"
        >
          <div className="space-y-3 text-xs">
            <label className="form-label">{t('سبب الاستبعاد (Rejection Reason):', 'Reason:')}</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="form-input"
            >
              <option value="">{t('-- اختر سبب الاستبعاد --', '-- Select Reason --')}</option>
              <option value="عدم مطابقة سنوات الخبرة المطلوبة">{t('عدم مطابقة سنوات الخبرة المطلوبة', 'Experience mismatch')}</option>
              <option value="الراتب المتوقع أعلى من الميزانية المعتمدة">{t('الراتب المتوقع أعلى من الميزانية', 'Salary above budget')}</option>
              <option value="أداء غير كافٍ في التقييم الفني">{t('أداء غير كافٍ في التقييم الفني', 'Technical assessment score low')}</option>
              <option value="عدم اجتياز المقابلة النهائية">{t('عدم اجتياز المقابلة النهائية', 'Did not pass final interview')}</option>
              <option value="اختيار مرشح آخر أكثر ملاءمة">{t('اختيار مرشح آخر أكثر ملاءمة', 'Another candidate selected')}</option>
            </select>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  rejectCandidate(selectedCandidate.id, rejectReason || 'استبعاد عام');
                  setIsRejectModalOpen(false);
                  setSelectedCandidate(null);
                }}
              >
                {t('تأكيد الاستبعاد', 'Confirm Rejection')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
