import React, { useState, useRef } from 'react';
import { 
  FileSignature, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  UploadCloud, 
  FileCheck, 
  Send, 
  Download, 
  Sparkles, 
  DollarSign, 
  UserCheck, 
  FileText, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { JobOffer, OfferCompensation } from '../../types/offer';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SalaryShield } from '../../components/rbac/SalaryShield';
import { PermissionGate } from '../../components/rbac/PermissionGate';
import { fireConfetti } from '../../utils/confetti';

export const OffersView: React.FC = () => {
  const { 
    offers, 
    candidates, 
    createOffer, 
    signOfferAsCandidate, 
    verifyPreboardingDocument, 
    uploadPreboardingDocument, 
    syncCandidateToCoreHR 
  } = useATSData();
  const { currentUser, canViewSalary } = useAuth();
  const { t } = useThemeLanguage();

  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Create Offer Form
  const [candidateId, setCandidateId] = useState(candidates[1]?.id || candidates[0]?.id || '');
  const [basicSalary, setBasicSalary] = useState(38000);
  const [housingAllowance, setHousingAllowance] = useState(10000);
  const [transportAllowance, setTransportAllowance] = useState(4000);
  const [otherAllowance, setOtherAllowance] = useState(6000);
  const [joiningDate, setJoiningDate] = useState('2026-10-01');
  const [expiryDate, setExpiryDate] = useState('2026-09-10');

  const totalMonthly = basicSalary + housingAllowance + transportAllowance + otherAllowance;
  const totalAnnual = totalMonthly * 12;

  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    createOffer({
      candidateId: cand.id,
      candidateName: cand.name,
      candidateEmail: cand.email,
      candidatePhone: cand.phone,
      jobId: cand.jobId,
      jobTitle: cand.jobTitle,
      department: cand.jobDepartment,
      reportingTo: 'م. طارق المهدي (نائب الرئيس لقطاع الهندسة)',
      joiningDate,
      expiryDate,
      compensation: {
        basicSalary,
        housingAllowance,
        transportAllowance,
        otherAllowance,
        totalMonthly,
        totalAnnual,
        currency: 'ج.م',
        probationMonths: 3,
        annualLeaveDays: 30,
        medicalInsuranceTier: 'VIP',
      },
      termsAndConditions: 'عرض عمل رسمي خاضع لقانون العمل المنظم واللوائح الداخلية للشركة.',
      hrSignerName: currentUser.name,
      hrSignedAt: new Date().toISOString().substring(0, 10),
      preboardingDocuments: [
        {
          id: 'doc_1',
          type: 'national_id',
          title: 'صورة بطاقة الرقم القومي / الهوية',
          titleEn: 'National ID Copy',
          isRequired: true,
          isUploaded: false,
          verificationStatus: 'pending',
        },
        {
          id: 'doc_2',
          type: 'degree_certificate',
          title: 'شهادة المؤهل الجامعي المعتمدة',
          titleEn: 'University Degree Certificate',
          isRequired: true,
          isUploaded: false,
          verificationStatus: 'pending',
        },
        {
          id: 'doc_3',
          type: 'bank_iban_letter',
          title: 'خطاب الحساب البنكي الرسمي (IBAN)',
          titleEn: 'Bank IBAN Letter',
          isRequired: true,
          isUploaded: false,
          verificationStatus: 'pending',
        },
      ],
    });

    setIsCreateOfferModalOpen(false);
  };

  // E-Signature Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.strokeStyle = '#1B4938';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApplySignature = () => {
    if (!selectedOffer) return;
    const canvas = canvasRef.current;
    const sigUrl = canvas ? canvas.toDataURL() : '';
    signOfferAsCandidate(selectedOffer.id, sigUrl);
    setIsSignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <FileSignature className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 5: العروض الوظيفية والتهيئة (Offers & Pre-boarding)', 'Unit 5: Offers & Pre-boarding')}
                </h1>
                <Badge variant="mint" size="sm">E-Sign & Core HR Sync</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'محرك توليد خطابات التعيين، التوقيع الإلكتروني المعتمد، بوابة رفع وتدقيق مسوغات التعيين، ومزامنة الموظف مع Core HR.',
                  'Dynamic offer builder, legal e-signature, document verification portal, and 1-click Core HR sync.'
                )}
              </p>
            </div>
          </div>

          <PermissionGate permission="create_offer">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOfferModalOpen(true)}
            >
              {t('إصدار عرض وظيفي جديد', 'Create Job Offer')}
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* OFFERS LIST */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="surface-card border border-surface-border hover:border-mint-400 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint-100 text-pine flex items-center justify-center font-bold text-sm">
                  {offer.candidateName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-pine text-sm">{offer.candidateName}</h4>
                  <span className="text-xs text-neutral-muted">{offer.jobTitle} • {offer.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {offer.status === 'accepted' ? (
                  <Badge variant="active" size="md">
                    ✓ {t('تم التوقيع رقمياً وقبول العرض', 'Offer Accepted & Signed')}
                  </Badge>
                ) : offer.status === 'synced_to_core_hr' ? (
                  <Badge variant="active" size="md">
                    ★ {t('مربوط بـ Core HR (موظف نشط)', 'Active Core HR Employee')}
                  </Badge>
                ) : (
                  <Badge variant="pending" size="md">
                    ⏳ {t('بانتظار توقيع المرشح', 'Pending Candidate Signature')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Compensation Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-sand-50 p-3.5 rounded-xl border border-sand-200 text-xs">
              <div>
                <span className="text-[11px] text-neutral-muted block">{t('الراتب الأساسي:', 'Basic Salary:')}</span>
                <SalaryShield amount={offer.compensation.basicSalary} currency={offer.compensation.currency} />
              </div>
              <div>
                <span className="text-[11px] text-neutral-muted block">{t('بدل السكن:', 'Housing Allowance:')}</span>
                <SalaryShield amount={offer.compensation.housingAllowance} currency={offer.compensation.currency} />
              </div>
              <div>
                <span className="text-[11px] text-neutral-muted block">{t('بدل النقل:', 'Transport Allowance:')}</span>
                <SalaryShield amount={offer.compensation.transportAllowance} currency={offer.compensation.currency} />
              </div>
              <div>
                <span className="text-[11px] text-neutral-muted block">{t('بدلات ومزايا أخرى:', 'Other Allowances:')}</span>
                <SalaryShield amount={offer.compensation.otherAllowance} currency={offer.compensation.currency} />
              </div>
              <div className="bg-white p-2 rounded-lg border border-mint-200">
                <span className="text-[11px] text-mint-800 font-bold block">{t('إجمالي الراتب الشهري:', 'Total Monthly:')}</span>
                <SalaryShield amount={offer.compensation.totalMonthly} currency={offer.compensation.currency} />
              </div>
            </div>

            {/* Preboarding Documents Checklist */}
            <div className="pt-1">
              <h5 className="text-xs font-bold text-pine mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-mint-600" />
                {t('مسوغات التعيين والمستندات الرسمية المطلوبة (Pre-boarding Documents):', 'Required Documents:')}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {offer.preboardingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      doc.verificationStatus === 'verified'
                        ? 'bg-mint-50/50 border-mint-200'
                        : doc.isUploaded
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-sand-50/60 border-sand-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-pine block">{t(doc.title, doc.titleEn)}</span>
                      <span className="text-[10px] text-neutral-muted">
                        {doc.isUploaded ? `${doc.fileName} (${doc.fileSize})` : t('لم يُرفع بعد', 'Not uploaded')}
                      </span>
                    </div>

                    <div>
                      {doc.verificationStatus === 'verified' ? (
                        <span className="text-[10px] font-bold text-mint-700 bg-mint-100 px-2 py-0.5 rounded">
                          {t('معتمد ✓', 'Verified')}
                        </span>
                      ) : doc.isUploaded ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => verifyPreboardingDocument(offer.id, doc.id, 'verified')}
                        >
                          {t('تدقيق واعتماد', 'Verify')}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => uploadPreboardingDocument(offer.id, doc.id, `${doc.type}_sample.pdf`, '1.4 MB')}
                        >
                          {t('رفع تجريبي', 'Upload')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer Letter Actions */}
            <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-neutral-muted">
                {t('تاريخ المباشرة المتوقع:', 'Joining Date:')} <strong className="text-pine">{offer.joiningDate}</strong> • {t('صلاحية العرض:', 'Valid until:')} <strong className="text-pine">{offer.expiryDate}</strong>
              </div>

              <div className="flex items-center gap-2">
                {offer.status === 'sent_to_candidate' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FileSignature className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsSignModalOpen(true);
                    }}
                  >
                    {t('محاكاة توقيع المرشح إلكترونياً (E-Sign)', 'Candidate E-Signature')}
                  </Button>
                )}

                {offer.status === 'accepted' && !offer.isSyncedToCoreHR && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<UserCheck className="w-4 h-4" />}
                    onClick={() => syncCandidateToCoreHR(offer.id)}
                  >
                    {t('ترحيل وإنشاء ملف موظف في Core HR', 'Sync to Core HR')}
                  </Button>
                )}

                {offer.isSyncedToCoreHR && (
                  <div className="bg-mint-100 text-pine font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-mint-200">
                    <Sparkles className="w-3.5 h-3.5 text-mint-600" />
                    <span>{t('الرقم الوظيفي في Core HR:', 'Employee ID:')} {offer.coreHREmployeeId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: CREATE JOB OFFER */}
      <Modal
        isOpen={isCreateOfferModalOpen}
        onClose={() => setIsCreateOfferModalOpen(false)}
        title={t('صياغة وإصدار عرض وظيفي معتمد (Generate Offer Letter)', 'Generate Job Offer')}
        subtitle={t('تحديد تفاصيل الراتب والبدلات وتاريخ المباشرة', 'Define compensation breakdown & onboarding date')}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateOfferSubmit} className="space-y-4 text-xs">
          <div>
            <label className="form-label">{t('المرشح المستحق للعرض:', 'Candidate:')}</label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="form-input"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.jobTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('الراتب الأساسي (Basic Salary):', 'Basic Salary:')}</label>
              <input
                type="number"
                step="500"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="form-input font-bold text-pine"
              />
            </div>
            <div>
              <label className="form-label">{t('بدل السكن (Housing):', 'Housing Allowance:')}</label>
              <input
                type="number"
                step="500"
                value={housingAllowance}
                onChange={(e) => setHousingAllowance(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('بدل النقل (Transport):', 'Transport Allowance:')}</label>
              <input
                type="number"
                step="200"
                value={transportAllowance}
                onChange={(e) => setTransportAllowance(Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('بدلات ومزايا أخرى:', 'Other Allowance:')}</label>
              <input
                type="number"
                step="200"
                value={otherAllowance}
                onChange={(e) => setOtherAllowance(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          {/* Monthly Total Computed */}
          <div className="p-3 bg-mint-50 rounded-xl border border-mint-200 flex items-center justify-between">
            <span className="font-bold text-pine">{t('إجمالي الراتب الشهري المستحق:', 'Total Monthly Package:')}</span>
            <span className="text-base font-black text-mint-700">{totalMonthly.toLocaleString()} ج.م</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('تاريخ المباشرة المتوقع:', 'Joining Date:')}</label>
              <input
                type="date"
                required
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('مهلة صلاحية العرض:', 'Offer Expiry Date:')}</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOfferModalOpen(false)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
              {t('إصدار وتوجيه العرض للمرشح', 'Generate & Send Offer')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: CANDIDATE DIGITAL E-SIGNATURE PAD */}
      {selectedOffer && (
        <Modal
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          title={t('بوابة التوقيع الإلكتروني المعتمد (Digital E-Signature Pad)', 'E-Signature Portal')}
          subtitle={`${t('المرشح:', 'Candidate:')} ${selectedOffer.candidateName} • ${selectedOffer.jobTitle}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 leading-relaxed text-neutral-main">
              {t(
                'أقر أنا الموقع أدناه بقبولي للعرض الوظيفي المقدم براتب شهري إجمالي قدره ',
                'I hereby accept the job offer with total monthly compensation of '
              )}
              <strong className="text-pine">{selectedOffer.compensation.totalMonthly.toLocaleString()} ج.م</strong>
              {t(' والالتزام بكافة الشروط واللوائح.', ' and agree to all terms and conditions.')}
            </div>

            {/* Canvas Sign Pad */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">{t('التوقيع باليد / الفأرة في المساحة أدناه:', 'Draw your signature below:')}</label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-terracotta hover:underline text-[11px] font-bold"
                >
                  {t('مسح التوقيع وإعادة المحاولة', 'Clear Signature')}
                </button>
              </div>

              <div className="border-2 border-dashed border-mint-400 rounded-xl bg-white p-1">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 cursor-crosshair touch-none"
                />
              </div>
              <span className="text-[10px] text-neutral-muted block mt-1">
                {t('سيتم ختم التوقيع برقم الـ IP والطابع الزمني المعتمد قانونياً.', 'Signature is legally stamped with IP address and UTC timestamp.')}
              </span>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
              <Button type="button" variant="ghost" onClick={() => setIsSignModalOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={!hasDrawn}
                onClick={handleApplySignature}
                icon={<Check className="w-4 h-4" />}
              >
                {t('اعتماد التوقيع الرقمي وقبول العرض', 'Submit Digital Signature')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
