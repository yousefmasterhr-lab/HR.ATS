import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Clock, 
  Sliders, 
  Settings, 
  Mail, 
  MessageSquare, 
  Calendar, 
  UserCheck, 
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { AutomationRule, TriggerType, ActionType } from '../../types/automation';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { fireConfetti } from '../../utils/confetti';

export const AutomationsView: React.FC = () => {
  const { automations, toggleAutomationRule, addAutomationRule, candidates } = useATSData();
  const { t } = useThemeLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTestSimulatorOpen, setIsTestSimulatorOpen] = useState(false);
  const [simulatorOutput, setSimulatorOutput] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<TriggerType>('stage_changed');
  const [conditionField, setConditionField] = useState('match_score');
  const [conditionValue, setConditionValue] = useState('85');
  const [actionType, setActionType] = useState<ActionType>('send_email_template');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addAutomationRule({
      name,
      nameEn: name,
      description: description || 'قاعدة أتمتة مخصصة وفق شروط التوظيف.',
      descriptionEn: description || 'Custom automation workflow rule.',
      trigger,
      conditions: [
        {
          field: conditionField as any,
          operator: 'greater_than',
          value: Number(conditionValue) || conditionValue,
        },
      ],
      actions: [
        {
          type: actionType,
          params: {
            delayHours: 0,
          },
        },
      ],
      isActive: true,
    });

    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleRunSimulation = (rule: AutomationRule) => {
    setSimulatorOutput(
      `تم فحص قاعدة "${rule.name}" وتطبيقها بنجاح على المرشحين المتوافقين مع الشروط. تم إرسال 3 إشعارات وتحديث خط السير بنجاح!`
    );
    fireConfetti();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <Zap className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('الوحدة 6: محرك الأتمتة وقواعد العمل (Automation Engine)', 'Unit 6: Workflow Automation Engine')}
                </h1>
                <Badge variant="mint" size="sm">Trigger → Condition → Action</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'أتمتة إجراءات التوظيف (مثل: استبعاد Knockout التلقائي، إرسال روابط المواعيد، تنبيهات مديري الإدارات، ومزامنة Core HR).',
                  'Trigger automated emails, calendar invites, rejection delays, and Core HR data syncs.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('بناء قاعدة أتمتة جديدة', 'New Automation Rule')}
            </Button>
          </div>
        </div>
      </div>

      {/* AUTOMATION RULES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className={`surface-card border transition-all flex flex-col justify-between ${
              rule.isActive ? 'border-surface-border hover:border-mint-400' : 'opacity-60 bg-sand-50/50'
            }`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-mint-100 text-pine flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4 text-mint-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pine text-xs sm:text-sm">{t(rule.name, rule.nameEn)}</h4>
                    <span className="text-[10px] text-neutral-muted">
                      {t('مرات التنفيذ:', 'Executed:')} <strong>{rule.timesExecuted}</strong> {t('مرة', 'times')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAutomationRule(rule.id)}
                  className="text-mint-600 hover:text-mint-700 transition-colors"
                  title={t('تفعيل / تعطيل القاعدة', 'Toggle Rule Active')}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-mint-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-subtle" />
                  )}
                </button>
              </div>

              <p className="text-xs text-neutral-main leading-relaxed">
                {t(rule.description, rule.descriptionEn)}
              </p>

              {/* Workflow Pipeline Logic Pill */}
              <div className="p-2.5 bg-sand-50 rounded-xl border border-sand-200 flex items-center justify-between text-xs font-semibold">
                <span className="text-pine bg-white px-2 py-0.5 rounded border border-sand-200">
                  ⚡ {rule.trigger}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-muted" />
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  🔍 IF condition
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-muted" />
                <span className="text-mint-800 bg-mint-100 px-2 py-0.5 rounded border border-mint-200">
                  🚀 {rule.actions[0]?.type}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-neutral-muted">
                {rule.lastExecutedAt ? `${t('آخر تشغيل:', 'Last run:')} ${rule.lastExecutedAt}` : t('جاهزة للتفعيل', 'Ready')}
              </span>

              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3.5 h-3.5" />}
                onClick={() => {
                  handleRunSimulation(rule);
                  setIsTestSimulatorOpen(true);
                }}
              >
                {t('اختبار وتشغيل فوري', 'Test Rule')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: CREATE AUTOMATION RULE */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('بناء قاعدة أتمتة تلقائية جديدة (Trigger → Action Rule)', 'New Automation Rule')}
        subtitle={t('تحديد الحدث المشغّل، الشروط المنطقية، والإجراء المنفذ', 'Define Trigger, Conditions & Actions')}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
          <div>
            <label className="form-label">{t('اسم القاعدة:', 'Rule Name:')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: إشعار المقابل عند حجز موعد تقني"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{t('الحدث المشغل (When Trigger):', 'Trigger Event:')}</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as TriggerType)}
                className="form-input"
              >
                <option value="stage_changed">{t('تغيير مرحلة المرشح (Stage Changed)', 'Stage Changed')}</option>
                <option value="scorecard_submitted">{t('تقديم بطاقة تقييم (Scorecard Submitted)', 'Scorecard Submitted')}</option>
                <option value="offer_accepted">{t('قبول وتوقيع العرض (Offer Accepted)', 'Offer Accepted')}</option>
                <option value="knockout_failed">{t('فشل أسئلة الاستبعاد (Knockout Failed)', 'Knockout Failed')}</option>
                <option value="requisition_approved">{t('اعتماد شاغر جديد (Requisition Approved)', 'Requisition Approved')}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('الإجراء التلقائي (Then Action):', 'Action to Perform:')}</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                className="form-input"
              >
                <option value="send_email_template">{t('إرسال بريد إلكتروني مخصص', 'Send Email Template')}</option>
                <option value="send_candidate_booking_link">{t('إرسال رابط الحجز الذاتي للمرشح', 'Send Booking Link')}</option>
                <option value="notify_hiring_manager">{t('إرسال إشعار فوري لمدير الإدارة', 'Notify Hiring Manager')}</option>
                <option value="sync_to_core_hr">{t('مزامنة فورية مع Core HR', 'Sync to Core HR')}</option>
                <option value="move_candidate_stage">{t('نقل المرشح لمرحلة تالية', 'Move Candidate Stage')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">{t('وصف وتفاصيل القاعدة:', 'Description:')}</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح آلية عمل القاعدة وفائدتها التشغيلية..."
              className="form-input"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('حفظ وتفعيل القاعدة', 'Save & Activate')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: SIMULATION RESULTS */}
      {isTestSimulatorOpen && (
        <Modal
          isOpen={isTestSimulatorOpen}
          onClose={() => setIsTestSimulatorOpen(false)}
          title={t('نتائج اختبار الأتمتة المباشرة', 'Live Automation Test Results')}
          maxWidth="md"
        >
          <div className="py-4 space-y-3 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-mint-100 text-pine flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-mint-600" />
            </div>
            <p className="text-pine font-bold leading-relaxed">{simulatorOutput}</p>
            <Button variant="primary" size="sm" onClick={() => setIsTestSimulatorOpen(false)}>
              {t('إغلاق', 'Done')}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
