import { AutomationRule } from '../types/automation';

export const MOCK_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'rule_001',
    name: 'استبعاد آلي لعدم اجتياز أسئلة الفرز (Knockout Failure Rejection)',
    nameEn: 'Auto-Reject on Knockout Failure',
    description: 'نقل المرشح تلقائياً إلى خانة "مرفوض" في حال عدم الإجابة بالإيجاب على الشروط الإلزامية للوظيفة، وإرسال بريد اعتذار مهني بعد 24 ساعة.',
    descriptionEn: 'Automatically move candidate to Rejected stage on mandatory knockout failure and queue polite rejection email.',
    trigger: 'knockout_failed',
    conditions: [
      {
        field: 'knockout_passed',
        operator: 'equals',
        value: false,
      },
    ],
    actions: [
      {
        type: 'move_candidate_stage',
        params: {
          targetStage: 'rejected',
        },
      },
      {
        type: 'send_email_template',
        params: {
          templateId: 'tmpl_polite_rejection',
          delayHours: 24,
        },
      },
    ],
    isActive: true,
    timesExecuted: 34,
    lastExecutedAt: '2026-08-25 10:00',
  },
  {
    id: 'rule_002',
    name: 'إرسال رابط حجز المقابلة عند النقل للمقابلة الأولى (Self-Scheduling Trigger)',
    nameEn: 'Send Self-Scheduling Link on 1st Interview Stage',
    description: 'عند نقل المرشح إلى مرحلة "مقابلة أولى"، يتم توليد رابط الحجز الذاتي وإرساله تلقائياً عبر البريد والواتساب.',
    descriptionEn: 'Generate self-booking calendar link and send via email/SMS upon reaching 1st Interview stage.',
    trigger: 'stage_changed',
    conditions: [
      {
        field: 'stage',
        operator: 'equals',
        value: 'first_interview',
      },
    ],
    actions: [
      {
        type: 'send_candidate_booking_link',
        params: {
          templateId: 'tmpl_interview_invite',
          delayHours: 0,
        },
      },
    ],
    isActive: true,
    timesExecuted: 19,
    lastExecutedAt: '2026-08-28 09:00',
  },
  {
    id: 'rule_003',
    name: 'تنبيه المدير المالي ومدير الموارد عند تجاوز المقابلة النهائية (Finalist Offer Prep Alert)',
    nameEn: 'Notify Finance & HR upon Final Interview Approval',
    description: 'إشعار فوري لإدارة التعويضات والموارد البشرية عند حصول المرشح على توصية "موصى به بشدة" في المقابلة النهائية للبدء في صياغة العرض.',
    descriptionEn: 'Alert HR & Finance to prepare offer upon Strong Yes recommendation in Final Interview.',
    trigger: 'scorecard_submitted',
    conditions: [
      {
        field: 'recommendation',
        operator: 'equals',
        value: 'strong_yes',
      },
    ],
    actions: [
      {
        type: 'notify_hiring_manager',
        params: {
          recipient: 'hr_and_finance',
        },
      },
    ],
    isActive: true,
    timesExecuted: 12,
    lastExecutedAt: '2026-08-23 16:30',
  },
  {
    id: 'rule_004',
    name: 'مزامنة تلقائية مع Core HR وفتح بوابة مسوغات التعيين عند قبول العرض (Offer Accepted Auto Sync)',
    nameEn: 'Auto Core HR Sync & Document Portal on Offer Acceptance',
    description: 'عند توقيع المرشح على العرض إلكترونياً، يتم إنشاء ملف موظف جديد وتفعيل حسابه لرفع المسوغات الرسمية.',
    descriptionEn: 'Instantly create employee record and activate pre-boarding portal upon digital signature.',
    trigger: 'offer_accepted',
    conditions: [],
    actions: [
      {
        type: 'sync_to_core_hr',
        params: {},
      },
      {
        type: 'send_email_template',
        params: {
          templateId: 'tmpl_preboarding_welcome',
        },
      },
    ],
    isActive: true,
    timesExecuted: 8,
    lastExecutedAt: '2026-08-26 15:10',
  },
];
