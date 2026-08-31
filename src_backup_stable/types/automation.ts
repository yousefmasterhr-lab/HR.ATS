export type TriggerType = 
  | 'stage_changed'
  | 'scorecard_submitted'
  | 'offer_accepted'
  | 'candidate_applied'
  | 'knockout_failed'
  | 'requisition_approved';

export type ActionType = 
  | 'send_email_template'
  | 'send_whatsapp_sms'
  | 'move_candidate_stage'
  | 'notify_hiring_manager'
  | 'send_candidate_booking_link'
  | 'create_calendar_invite'
  | 'sync_to_core_hr';

export interface AutomationCondition {
  field: 'stage' | 'match_score' | 'department' | 'rating' | 'recommendation' | 'knockout_passed';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean;
}

export interface AutomationAction {
  type: ActionType;
  params: {
    templateId?: string;
    targetStage?: string;
    recipient?: string;
    delayHours?: number;
    customMessage?: string;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  trigger: TriggerType;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  timesExecuted: number;
  lastExecutedAt?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  actionEn: string;
  category: 'auth' | 'candidate' | 'requisition' | 'offer' | 'interview' | 'automation' | 'rbac';
  targetId?: string;
  targetTitle?: string;
  details: string;
  timestamp: string;
}
