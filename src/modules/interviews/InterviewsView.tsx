import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  Video, 
  Plus, 
  CheckSquare, 
  Star, 
  ExternalLink, 
  UserCheck, 
  Calendar, 
  Sparkles,
  MapPin,
  CheckCircle,
  FileCheck2,
  Award
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Interview, Scorecard, InterviewType, InterviewPlatform, HiringRecommendation } from '../../types/interview';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { PermissionGate } from '../../components/rbac/PermissionGate';

export const InterviewsView: React.FC = () => {
  const { interviews, candidates, scheduleInterview, submitScorecard } = useATSData();
  const { currentUser, hasPermission } = useAuth();
  const { t } = useThemeLanguage();

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [isSelfBookingPreviewOpen, setIsSelfBookingPreviewOpen] = useState(false);

  // Schedule Form State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  const [interviewType, setInterviewType] = useState<InterviewType>('technical');
  const [platform, setPlatform] = useState<InterviewPlatform>('google_meet');
  const [interviewDate, setInterviewDate] = useState('2026-09-02');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('11:45');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Scorecard Form State
  const [techScore, setTechScore] = useState(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [commScore, setCommScore] = useState(5);
  const [cultureScore, setCultureScore] = useState(4);
  const [recommendation, setRecommendation] = useState<HiringRecommendation>('strong_yes');
  const [scorecardSummary, setScorecardSummary] = useState('');
  const [strengthInput, setStrengthInput] = useState('إتقان تقني عالٍ، سرعة بديهة، تواصل مميز');
  const [growthInput, setGrowthInput] = useState('التعمق في الخدمات السحابية الموزعة');

  const calculatedWeightedAverage = Number(
    ((techScore * 0.35) + (problemSolvingScore * 0.25) + (commScore * 0.20) + (cultureScore * 0.20)).toFixed(2)
  );

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === selectedCandidateId);
    if (!cand) return;

    const meetLink = platform === 'google_meet' 
      ? `https://meet.google.com/ats-${Date.now().toString().slice(-6)}`
      : platform === 'ms_teams'
      ? `https://teams.microsoft.com/meet/ats-${Date.now().toString().slice(-6)}`
      : `https://zoom.us/j/ats${Date.now().toString().slice(-6)}`;

    scheduleInterview({
      candidateId: cand.id,
      candidateName: cand.name,
      candidateEmail: cand.email,
      candidateAvatar: cand.avatar,
      jobId: cand.jobId,
      jobTitle: cand.jobTitle,
      type: interviewType,
      platform,
      meetingLink: meetLink,
      date: interviewDate,
      startTime,
      endTime,
      interviewers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.title,
        },
      ],
      status: 'scheduled',
      notes: meetingNotes,
    });

    setIsScheduleModalOpen(false);
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    submitScorecard({
      interviewId: selectedInterview.id,
      candidateId: selectedInterview.candidateId,
      candidateName: selectedInterview.candidateName,
      jobId: selectedInterview.jobId,
      jobTitle: selectedInterview.jobTitle,
      interviewerId: currentUser.id,
      interviewerName: currentUser.name,
      interviewerRole: currentUser.title,
      criteria: [
        {
          id: 'c1',
          category: 'الجدارات التقنية الأساسية',
          categoryEn: 'Technical Competence',
          criterion: 'التمكن المعماري والبرمجي',
          criterionEn: 'Architecture & Coding',
          weightPercent: 35,
          score: techScore,
        },
        {
          id: 'c2',
          category: 'حل المشكلات والتفكير المنطقي',
          categoryEn: 'Problem Solving',
          criterion: 'تحليل المعضلات والسرعة التحليلية',
          criterionEn: 'Analytical Thinking',
          weightPercent: 25,
          score: problemSolvingScore,
        },
        {
          id: 'c3',
          category: 'التواصل والتعاون',
          categoryEn: 'Communication',
          criterion: 'وضوح الأفكار والعمل الجماعي',
          criterionEn: 'Clarity & Teamwork',
          weightPercent: 20,
          score: commScore,
        },
        {
          id: 'c4',
          category: 'الملاءمة الثقافية وقيم العمل',
          categoryEn: 'Culture Fit',
          criterion: 'الالتزام بقيم الشركة وشغف التطور',
          criterionEn: 'Values & Ownership',
          weightPercent: 20,
          score: cultureScore,
        },
      ],
      weightedAverageScore: calculatedWeightedAverage,
      recommendation,
      summaryFeedback: scorecardSummary || 'تم تقييم المرشح وفق الجدارات المعتمدة ويوصى بالمتابعة.',
      keyStrengths: strengthInput.split(',').map((s) => s.trim()).filter(Boolean),
      growthAreas: growthInput.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsScorecardModalOpen(false);
  };

  const getRecommendationBadge = (rec: HiringRecommendation) => {
    switch (rec) {
      case 'strong_yes':
        return <Badge variant="active">{t('موصى به بشدة (Strong Yes)', 'Strong Yes')}</Badge>;
      case 'yes':
        return <Badge variant="active">{t('مناسب للتوظيف (Yes)', 'Yes')}</Badge>;
      case 'neutral':
        return <Badge variant="pending">{t('محايد / مراجعة', 'Neutral')}</Badge>;
      case 'no':
        return <Badge variant="rejected">{t('غير مناسب (No)', 'No')}</Badge>;
      case 'strong_no':
        return <Badge variant="rejected">{t('استبعاد فوري (Strong No)', 'Strong No')}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <CalendarCheck className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 4: المقابلات والتقييمات المعيارية (Interviews & Scorecards)', 'Unit 4: Interviews & Scorecards')}
                </h1>
                <Badge variant="mint" size="sm">Competency Scorecards</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'بوابة الحجز الذاتي للمرشحين، مزامنة التقاويم وروابط الاجتماع، وبطاقات تقييم الجدارات الموزونة.',
                  'Candidate self-scheduling portal, calendar integrations, and structured weighted competency scorecards.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => setIsSelfBookingPreviewOpen(true)}
            >
              {t('بوابة الحجز الذاتي للمرشح', 'Self-Scheduling Portal')}
            </Button>

            <PermissionGate permission="schedule_interview">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsScheduleModalOpen(true)}
              >
                {t('جدولة مقابلة جديدة', 'Schedule Interview')}
              </Button>
            </PermissionGate>
          </div>
        </div>
      </div>

      {/* INTERVIEWS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview) => {
          const hasScorecard = Boolean(interview.scorecard);

          return (
            <div
              key={interview.id}
              className="surface-card border border-surface-border hover:border-mint-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={interview.candidateName}
                      src={interview.candidateAvatar}
                      size="md"
                    />
                    <div>
                      <h4 className="font-bold text-pine text-sm">{interview.candidateName}</h4>
                      <span className="text-[11px] text-neutral-muted block">{interview.jobTitle}</span>
                    </div>
                  </div>

                  <Badge variant={interview.status === 'completed' ? 'active' : 'info'} size="sm">
                    {interview.status === 'completed' ? t('اكتملت المقابلة', 'Completed') : t('مجدولة قادمة', 'Scheduled')}
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 bg-sand-50 p-3 rounded-xl border border-sand-200 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-muted block">{t('نوع المقابلة:', 'Type:')}</span>
                    <span className="font-bold text-pine">{interview.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-muted block">{t('التاريخ والموعد:', 'Time:')}</span>
                    <span className="font-bold text-pine">{interview.date} ({interview.startTime} - {interview.endTime})</span>
                  </div>
                </div>

                {/* Meeting link */}
                {interview.meetingLink && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-soft border border-surface-border text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-mint-700">
                      <Video className="w-4 h-4 text-mint-600" />
                      {interview.platform} Meeting Room
                    </span>
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-white bg-mint-500 hover:bg-mint-600 px-3 py-1 rounded-lg inline-flex items-center gap-1 transition-all shadow-xs"
                    >
                      {t('دخول الاجتماع', 'Join')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Scorecard Summary Pill if exists */}
                {hasScorecard && interview.scorecard && (
                  <div className="p-3 bg-mint-50/60 rounded-xl border border-mint-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pine flex items-center gap-1">
                        <FileCheck2 className="w-4 h-4 text-mint-600" />
                        {t('بطاقة التقييم المعتمدة:', 'Scorecard Result:')}
                      </span>
                      <span className="text-xs font-black bg-mint-500 text-canvas px-2 py-0.5 rounded-md">
                        {interview.scorecard.weightedAverageScore} / 5.0
                      </span>
                    </div>
                    <div>
                      {getRecommendationBadge(interview.scorecard.recommendation)}
                    </div>
                    <p className="text-neutral-muted line-clamp-2 mt-1">
                      {interview.scorecard.summaryFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 mt-3 border-t border-surface-border flex items-center justify-end gap-2">
                {!hasScorecard ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckSquare className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedInterview(interview);
                      setIsScorecardModalOpen(true);
                    }}
                  >
                    {t('تعبئة بطاقة التقييم (Scorecard)', 'Fill Scorecard')}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FileCheck2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedInterview(interview);
                      setIsScorecardModalOpen(true);
                    }}
                  >
                    {t('عرض بطاقة التقييم', 'View Scorecard')}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: SCHEDULE INTERVIEW */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={t('جدولة موعد مقابلة جديد (Schedule Interview)', 'Schedule New Interview')}
        subtitle={t('تحديد المرشح، المنصة، الموعد، وتوليد رابط المقابلة الذاتي', 'Select candidate, meeting link, and calendar slot')}
        maxWidth="lg"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="form-label">{t('المرشح المستهدف:', 'Candidate:')}</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="form-input"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.jobTitle} ({c.matchScore}% Match)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('نوع المقابلة:', 'Interview Type:')}</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                className="form-input"
              >
                <option value="hr_screening">{t('فرز أولي (HR Screening)', 'HR Screening')}</option>
                <option value="technical">{t('مقابلة فنية وتقنية (Technical)', 'Technical')}</option>
                <option value="cultural_fit">{t('الملاءمة الثقافية (Culture Fit)', 'Culture Fit')}</option>
                <option value="executive_final">{t('مقابلة نهائية تنفيذية (Executive)', 'Executive Final')}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('المنصة / وسيلة الاجتماع:', 'Platform:')}</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as InterviewPlatform)}
                className="form-input"
              >
                <option value="google_meet">Google Meet (جوجل ميت)</option>
                <option value="ms_teams">Microsoft Teams (تيمز)</option>
                <option value="zoom">Zoom (زووم)</option>
                <option value="in_person">{t('مقابلة حضورية في المقر', 'In-Person')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">{t('التاريخ:', 'Date:')}</label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('وقت البدء:', 'Start Time:')}</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('وقت الانتهاء:', 'End Time:')}</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">{t('ملاحظات وإرشادات للمرشح:', 'Notes for Candidate:')}</label>
            <textarea
              rows={2}
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="يرجى تحضير استعراض لأهم المشاريع السابقة..."
              className="form-input"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsScheduleModalOpen(false)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('تأكيد وحجز الموعد', 'Confirm & Schedule')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: STRUCTURED COMPETENCY SCORECARD */}
      {selectedInterview && (
        <Modal
          isOpen={isScorecardModalOpen}
          onClose={() => setIsScorecardModalOpen(false)}
          title={`${t('بطاقة التقييم المعيارية:', 'Scorecard:')} ${selectedInterview.candidateName}`}
          subtitle={`${selectedInterview.jobTitle} • ${selectedInterview.type}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleScorecardSubmit} className="space-y-4 text-xs">
            {/* Scorecard Rubrics */}
            <div className="space-y-3">
              {/* Criterion 1 */}
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-pine block">{t('الجدارات التقنية والهندسية (الوزن: 35%)', 'Technical Competence (35%)')}</span>
                    <span className="text-[10px] text-neutral-muted">{t('إتقان React, TypeScript, Node.js ومعمارية النظم', 'Core Architecture and Coding')}</span>
                  </div>
                  <span className="font-black text-mint-700 text-sm">{techScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={techScore}
                  onChange={(e) => setTechScore(Number(e.target.value))}
                  className="w-full accent-mint-500 cursor-pointer"
                />
              </div>

              {/* Criterion 2 */}
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-pine block">{t('حل المشكلات والتفكير المنطقي (الوزن: 25%)', 'Problem Solving (25%)')}</span>
                    <span className="text-[10px] text-neutral-muted">{t('تشخيص المشكلات المعقدة والسرعة التحليلية', 'Debugging and Logic')}</span>
                  </div>
                  <span className="font-black text-mint-700 text-sm">{problemSolvingScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={problemSolvingScore}
                  onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                  className="w-full accent-mint-500 cursor-pointer"
                />
              </div>

              {/* Criterion 3 */}
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-pine block">{t('مهارات التواصل والتعاون (الوزن: 20%)', 'Communication & Teamwork (20%)')}</span>
                    <span className="text-[10px] text-neutral-muted">{t('وضوح الطرح والعمل بروح الفريق', 'Clarity and Collaboration')}</span>
                  </div>
                  <span className="font-black text-mint-700 text-sm">{commScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={commScore}
                  onChange={(e) => setCommScore(Number(e.target.value))}
                  className="w-full accent-mint-500 cursor-pointer"
                />
              </div>

              {/* Criterion 4 */}
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-pine block">{t('الملاءمة الثقافية وقيم الشركة (الوزن: 20%)', 'Culture Fit & Core Values (20%)')}</span>
                    <span className="text-[10px] text-neutral-muted">{t('الشغف بالابتكار وتحمل المسؤولية', 'Ownership and Drive')}</span>
                  </div>
                  <span className="font-black text-mint-700 text-sm">{cultureScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={cultureScore}
                  onChange={(e) => setCultureScore(Number(e.target.value))}
                  className="w-full accent-mint-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Weighted Average */}
            <div className="p-3.5 bg-mint-500 text-canvas rounded-xl flex items-center justify-between shadow-sm">
              <span className="font-bold text-xs">{t('المتوسط التراكمي الموزون (Weighted Average):', 'Weighted Average Score:')}</span>
              <span className="text-base font-black">{calculatedWeightedAverage} / 5.0</span>
            </div>

            {/* Recommendation Select */}
            <div>
              <label className="form-label">{t('التوصية النهائية للتوظيف (Hiring Recommendation):', 'Recommendation:')}</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as HiringRecommendation)}
                className="form-input font-bold"
              >
                <option value="strong_yes">{t('موصى به بشدة للتوظيف (Strong Yes)', 'Strong Yes')}</option>
                <option value="yes">{t('مناسب ومقبول (Yes)', 'Yes')}</option>
                <option value="neutral">{t('محايد / تحت المراجعة (Neutral)', 'Neutral')}</option>
                <option value="no">{t('غير مناسب (No)', 'No')}</option>
                <option value="strong_no">{t('استبعاد فوري (Strong No)', 'Strong No')}</option>
              </select>
            </div>

            {/* Summary */}
            <div>
              <label className="form-label">{t('ملخص التقييم والملاحظات التفصيلية:', 'Summary Notes:')}</label>
              <textarea
                rows={3}
                value={scorecardSummary}
                onChange={(e) => setScorecardSummary(e.target.value)}
                placeholder="أبرز ما لفت انطباع لجنة المقابلة..."
                className="form-input"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
              <Button type="button" variant="ghost" onClick={() => setIsScorecardModalOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {t('حفظ واعتماد بطاقة التقييم', 'Save & Submit Scorecard')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: CANDIDATE SELF-SCHEDULING PORTAL PREVIEW */}
      <Modal
        isOpen={isSelfBookingPreviewOpen}
        onClose={() => setIsSelfBookingPreviewOpen(false)}
        title={t('بوابة الحجز الذاتي لمواعيد المقابلات (Candidate Self-Scheduling)', 'Self-Scheduling Candidate Portal')}
        subtitle={t('واجهة المرشح لاختيار الوقت الأنسب ومزامنة التقويم تلقائياً', 'How candidate picks available slots')}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-mint-50 rounded-xl border border-mint-200">
            <span className="font-bold text-pine block">{t('مرحباً بك! يرجى اختيار الموعد الأنسب لمقابلتك الفنية:', 'Welcome! Please select your preferred interview slot:')}</span>
            <span className="text-[11px] text-neutral-muted">{t('المقابلة مع: م. طارق المهدي (نائب الرئيس للهندسة) عبر Google Meet', 'With: Eng. Tariq El-Mahdy via Google Meet')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { date: 'الأربعاء، 2 سبتمبر 2026', time: '10:00 ص - 10:45 ص' },
              { date: 'الأربعاء، 2 سبتمبر 2026', time: '02:00 م - 02:45 م' },
              { date: 'الخميس، 3 سبتمبر 2026', time: '11:00 ص - 11:45 ص' },
              { date: 'الخميس، 3 سبتمبر 2026', time: '03:30 م - 04:15 م' },
            ].map((slot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  alert(t('تم تأكيد حجز الموعد وإرسال دعوة التقويم ورابط Google Meet إلى بريدك الإلكتروني!', 'Slot booked! Calendar invite and Google Meet link sent.'));
                  setIsSelfBookingPreviewOpen(false);
                }}
                className="p-3 rounded-xl border border-sand-300 bg-white hover:border-mint-500 hover:bg-mint-50 text-start transition-all"
              >
                <span className="font-bold text-pine block">{slot.date}</span>
                <span className="text-[11px] text-mint-700 font-semibold mt-0.5 block">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
