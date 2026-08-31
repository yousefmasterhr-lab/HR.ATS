import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate, PipelineStageId } from '../types/candidate';
import { JobRequisition, JobTemplate, RequisitionStatus } from '../types/requisition';
import { Interview, Scorecard } from '../types/interview';
import { JobOffer, OfferStatus, PreboardingDocument } from '../types/offer';
import { AutomationRule, AuditLogItem } from '../types/automation';
import { RecruitmentKPIs } from '../types/analytics';
import { MOCK_CANDIDATES } from '../data/mockCandidates';
import { MOCK_REQUISITIONS, MOCK_JOB_TEMPLATES } from '../data/mockRequisitions';
import { MOCK_INTERVIEWS } from '../data/mockInterviews';
import { MOCK_OFFERS } from '../data/mockOffers';
import { MOCK_AUTOMATIONS } from '../data/mockAutomations';
import { MOCK_KPIS } from '../data/mockAnalytics';
import { useAuth } from './AuthContext';
import { fireConfetti } from '../utils/confetti';

interface ATSDataContextType {
  candidates: Candidate[];
  requisitions: JobRequisition[];
  jobTemplates: JobTemplate[];
  interviews: Interview[];
  offers: JobOffer[];
  automations: AutomationRule[];
  auditLogs: AuditLogItem[];
  kpis: RecruitmentKPIs;

  // Candidate Actions
  moveCandidateStage: (candidateId: string, targetStage: PipelineStageId, noteText?: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedAt' | 'updatedAt' | 'activities' | 'notes'>) => void;
  updateCandidate: (candidate: Candidate) => void;
  rejectCandidate: (candidateId: string, reason: string) => void;
  addCandidateNote: (candidateId: string, content: string, isPrivate?: boolean) => void;

  // Requisition Actions
  createRequisition: (req: Omit<JobRequisition, 'id' | 'code' | 'filledCount' | 'currentTier' | 'createdAt' | 'updatedAt'>) => void;
  updateRequisitionStatus: (reqId: string, status: RequisitionStatus) => void;
  approveRequisitionTier: (reqId: string, tier: number, comments?: string) => void;
  rejectRequisitionTier: (reqId: string, tier: number, comments: string) => void;
  publishRequisition: (reqId: string) => void;
  addJobTemplate: (tmpl: JobTemplate) => void;

  // Interview & Scorecard Actions
  scheduleInterview: (interview: Omit<Interview, 'id' | 'createdAt'>) => void;
  submitScorecard: (scorecard: Omit<Scorecard, 'id' | 'submittedAt'>) => void;
  updateInterviewStatus: (interviewId: string, status: Interview['status']) => void;

  // Offer & Preboarding Actions
  createOffer: (offer: Omit<JobOffer, 'id' | 'status' | 'isSyncedToCoreHR' | 'createdAt' | 'updatedAt'>) => void;
  signOfferAsCandidate: (offerId: string, signatureDataUrl: string) => void;
  verifyPreboardingDocument: (offerId: string, documentId: string, status: 'verified' | 'rejected', reason?: string) => void;
  uploadPreboardingDocument: (offerId: string, documentId: string, fileName: string, fileSize: string) => void;
  syncCandidateToCoreHR: (offerId: string) => void;

  // Automation Actions
  toggleAutomationRule: (ruleId: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'timesExecuted'>) => void;

  // Audit Logs
  logActivity: (action: string, actionEn: string, category: AuditLogItem['category'], targetId?: string, targetTitle?: string, details?: string) => void;
}

const ATSDataContext = createContext<ATSDataContextType | undefined>(undefined);

export const ATSDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('ats_candidates');
    return saved ? JSON.parse(saved) : MOCK_CANDIDATES;
  });

  const [requisitions, setRequisitions] = useState<JobRequisition[]>(() => {
    const saved = localStorage.getItem('ats_requisitions');
    return saved ? JSON.parse(saved) : MOCK_REQUISITIONS;
  });

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>(() => {
    const saved = localStorage.getItem('ats_job_templates');
    return saved ? JSON.parse(saved) : MOCK_JOB_TEMPLATES;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('ats_interviews');
    return saved ? JSON.parse(saved) : MOCK_INTERVIEWS;
  });

  const [offers, setOffers] = useState<JobOffer[]>(() => {
    const saved = localStorage.getItem('ats_offers');
    return saved ? JSON.parse(saved) : MOCK_OFFERS;
  });

  const [automations, setAutomations] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('ats_automations');
    return saved ? JSON.parse(saved) : MOCK_AUTOMATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('ats_audit_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'audit_01',
            userId: 'user_hr_dir',
            userName: 'سارة منصور',
            userRole: 'مديرة الموارد البشرية',
            action: 'إصدار العرض الوظيفي',
            actionEn: 'Issued Job Offer',
            category: 'offer',
            targetId: 'off_001',
            targetTitle: 'أروى سليمان - مهندس برمجيات أول',
            details: 'تم إصدار عرض العمل وإرساله للتوقيع الرقمي بمزايا معتمدة',
            timestamp: '2026-08-27 14:30',
          },
          {
            id: 'audit_02',
            userId: 'user_super_admin',
            userName: 'عبدالله القاضي',
            userRole: 'مسؤول النظام الأعلى',
            action: 'اعتماد الموازنة الوظيفية',
            actionEn: 'Approved Requisition Budget',
            category: 'requisition',
            targetId: 'req_001',
            targetTitle: 'REQ-2026-081 مهندس برمجيات أول',
            details: 'تمت المصادقة النهائية على طلب الاحتياج ونشره في بوابة التوظيف',
            timestamp: '2026-08-17 11:20',
          },
        ];
  });

  const [kpis, setKpis] = useState<RecruitmentKPIs>(MOCK_KPIS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ats_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('ats_requisitions', JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem('ats_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('ats_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('ats_automations', JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    localStorage.setItem('ats_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Recalculate KPIs dynamically
  useEffect(() => {
    const hired = candidates.filter((c) => c.stage === 'hired' || c.status === 'hired').length;
    const active = candidates.filter((c) => c.status === 'active').length;
    const openReqs = requisitions.filter((r) => r.status === 'published' || r.status === 'approved').length;

    setKpis((prev) => ({
      ...prev,
      totalHiresThisQuarter: 10 + hired,
      activeCandidatesInPipeline: active,
      totalOpenRequisitions: openReqs,
    }));
  }, [candidates, requisitions]);

  const logActivity = (
    action: string,
    actionEn: string,
    category: AuditLogItem['category'],
    targetId?: string,
    targetTitle?: string,
    details?: string
  ) => {
    const newLog: AuditLogItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.title,
      action,
      actionEn,
      category,
      targetId,
      targetTitle,
      details: details || '',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Move candidate across Kanban Pipeline & trigger automations
  const moveCandidateStage = (candidateId: string, targetStage: PipelineStageId, noteText?: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const oldStage = candidate.stage;
    const isNowHired = targetStage === 'hired';
    const isNowRejected = targetStage === 'rejected';

    const newActivity = {
      id: `act_${Date.now()}`,
      type: 'stage_change' as const,
      title: `تغيير المرحلة إلى ${targetStage}`,
      titleEn: `Stage changed to ${targetStage}`,
      description: `تم نقل المرشح من ${oldStage} إلى ${targetStage}${noteText ? ` (${noteText})` : ''}`,
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            stage: targetStage,
            status: isNowRejected ? 'rejected' : isNowHired ? 'hired' : 'active',
            activities: [newActivity, ...c.activities],
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return c;
      })
    );

    logActivity(
      `نقل المرشح للمرحلة: ${targetStage}`,
      `Candidate moved to stage: ${targetStage}`,
      'candidate',
      candidateId,
      candidate.name,
      `تم النقل من ${oldStage} إلى ${targetStage}`
    );

    if (isNowHired) {
      fireConfetti();
    }
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'appliedAt' | 'updatedAt' | 'activities' | 'notes'>) => {
    const newId = `cand_${Date.now()}`;
    const newCandidate: Candidate = {
      ...candidateData,
      id: newId,
      appliedAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
      notes: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          type: 'stage_change',
          title: 'استلام طلب التقديم',
          titleEn: 'Application Received',
          description: 'تم تسجيل المتقدم في النظام بنجاح وحساب نسبة المطابقة',
          performedBy: 'بوابة الاستقطاب الذكية',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };

    setCandidates((prev) => [newCandidate, ...prev]);

    logActivity(
      'إضافة مرشح جديد',
      'New Candidate Added',
      'candidate',
      newId,
      newCandidate.name,
      `تم التقديم على شاغر: ${newCandidate.jobTitle} بنسبة مطابقة ${newCandidate.matchScore}%`
    );
  };

  const updateCandidate = (updated: Candidate) => {
    setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const rejectCandidate = (candidateId: string, reason: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            stage: 'rejected',
            status: 'rejected',
            rejectionReason: reason,
            activities: [
              {
                id: `act_${Date.now()}`,
                type: 'stage_change',
                title: 'استبعاد المرشح',
                titleEn: 'Candidate Rejected',
                description: `السبب: ${reason}`,
                performedBy: currentUser.name,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              },
              ...c.activities,
            ],
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return c;
      })
    );
  };

  const addCandidateNote = (candidateId: string, content: string, isPrivate: boolean = false) => {
    const newNote = {
      id: `note_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isPrivate,
    };

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            notes: [newNote, ...c.notes],
          };
        }
        return c;
      })
    );
  };

  // Requisitions
  const createRequisition = (reqData: Omit<JobRequisition, 'id' | 'code' | 'filledCount' | 'currentTier' | 'createdAt' | 'updatedAt'>) => {
    const year = new Date().getFullYear();
    const count = requisitions.length + 80;
    const newCode = `REQ-${year}-${count.toString().padStart(3, '0')}`;
    const newId = `req_${Date.now()}`;

    const newReq: JobRequisition = {
      ...reqData,
      id: newId,
      code: newCode,
      filledCount: 0,
      currentTier: 1,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };

    setRequisitions((prev) => [newReq, ...prev]);
    logActivity('إنشاء طلب احتياج وظيفي', 'Created Job Requisition', 'requisition', newId, `${newCode} ${newReq.title}`);
  };

  const updateRequisitionStatus = (reqId: string, status: RequisitionStatus) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status, updatedAt: new Date().toISOString().substring(0, 10) } : r))
    );
  };

  const approveRequisitionTier = (reqId: string, tier: number, comments?: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          const updatedChain = r.approvalChain.map((step) => {
            if (step.tier === tier) {
              return {
                ...step,
                status: 'approved' as const,
                approverId: currentUser.id,
                approverName: currentUser.name,
                comments: comments || 'تم الاعتماد بنجاح',
                actionDate: new Date().toISOString().substring(0, 10),
              };
            }
            return step;
          });

          const allApproved = updatedChain.every((s) => s.status === 'approved');
          const nextTier = tier < updatedChain.length ? tier + 1 : tier;

          return {
            ...r,
            approvalChain: updatedChain,
            currentTier: nextTier,
            status: allApproved ? ('published' as const) : tier === 1 ? ('pending_finance' as const) : ('pending_executive' as const),
            publishedAt: allApproved ? new Date().toISOString().substring(0, 10) : r.publishedAt,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return r;
      })
    );

    logActivity('اعتماد مرحلة في طلب الاحتياج', 'Approved Requisition Tier', 'requisition', reqId, `المرحلة ${tier}`, comments);
  };

  const rejectRequisitionTier = (reqId: string, tier: number, comments: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          const updatedChain = r.approvalChain.map((step) => {
            if (step.tier === tier) {
              return {
                ...step,
                status: 'rejected' as const,
                approverId: currentUser.id,
                approverName: currentUser.name,
                comments,
                actionDate: new Date().toISOString().substring(0, 10),
              };
            }
            return step;
          });

          return {
            ...r,
            approvalChain: updatedChain,
            status: 'rejected' as const,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return r;
      })
    );

    logActivity('رفض طلب الاحتياج الوظيفي', 'Rejected Requisition Tier', 'requisition', reqId, `المرحلة ${tier}`, comments);
  };

  const publishRequisition = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: 'published', publishedAt: new Date().toISOString().substring(0, 10), updatedAt: new Date().toISOString().substring(0, 10) }
          : r
      )
    );
  };

  const addJobTemplate = (tmpl: JobTemplate) => {
    setJobTemplates((prev) => [tmpl, ...prev]);
  };

  // Interviews & Scorecards
  const scheduleInterview = (interviewData: Omit<Interview, 'id' | 'createdAt'>) => {
    const newId = `int_${Date.now()}`;
    const newInterview: Interview = {
      ...interviewData,
      id: newId,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setInterviews((prev) => [newInterview, ...prev]);

    // Update candidate stage to first_interview if in screening/assessment
    const cand = candidates.find((c) => c.id === interviewData.candidateId);
    if (cand && (cand.stage === 'applied' || cand.stage === 'screening' || cand.stage === 'tech_assessment')) {
      moveCandidateStage(cand.id, 'first_interview', `تمت جدولة مقابلة في ${interviewData.date}`);
    }

    logActivity(
      'جدولة موعد مقابلة',
      'Interview Scheduled',
      'interview',
      newId,
      `${interviewData.candidateName} - ${interviewData.type}`,
      `الموعد: ${interviewData.date} ${interviewData.startTime}`
    );
  };

  const submitScorecard = (scorecardData: Omit<Scorecard, 'id' | 'submittedAt'>) => {
    const newId = `sc_${Date.now()}`;
    const newScorecard: Scorecard = {
      ...scorecardData,
      id: newId,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setInterviews((prev) =>
      prev.map((i) => (i.id === scorecardData.interviewId ? { ...i, status: 'completed', scorecardId: newId, scorecard: newScorecard } : i))
    );

    logActivity(
      'تقديم بطاقة تقييم المقابلة',
      'Scorecard Submitted',
      'interview',
      newId,
      `${scorecardData.candidateName} (${scorecardData.weightedAverageScore}/5)`,
      `التوصية: ${scorecardData.recommendation}`
    );
  };

  const updateInterviewStatus = (interviewId: string, status: Interview['status']) => {
    setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, status } : i)));
  };

  // Offers & Preboarding
  const createOffer = (offerData: Omit<JobOffer, 'id' | 'status' | 'isSyncedToCoreHR' | 'createdAt' | 'updatedAt'>) => {
    const newId = `off_${Date.now()}`;
    const newOffer: JobOffer = {
      ...offerData,
      id: newId,
      status: 'sent_to_candidate',
      isSyncedToCoreHR: false,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };

    setOffers((prev) => [newOffer, ...prev]);

    // Move candidate to offer stage
    moveCandidateStage(offerData.candidateId, 'job_offer', `تم إصدار العرض الوظيفي براتب إجمالي ${offerData.compensation.totalMonthly.toLocaleString()} ج.م`);

    logActivity(
      'إصدار وتوجيه عرض وظيفي',
      'Job Offer Created & Sent',
      'offer',
      newId,
      `${offerData.candidateName} - ${offerData.jobTitle}`,
      `الراتب الشهري: ${offerData.compensation.totalMonthly} ج.م`
    );
  };

  const signOfferAsCandidate = (offerId: string, signatureDataUrl: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          return {
            ...o,
            status: 'accepted',
            candidateSignature: {
              signatureDataUrl,
              signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              ipAddress: '192.168.1.15 (Egypt - Cairo)',
            },
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return o;
      })
    );

    const targetOffer = offers.find((o) => o.id === offerId);
    if (targetOffer) {
      moveCandidateStage(targetOffer.candidateId, 'hired', 'تم توقيع العرض الوظيفي رقمياً بنجاح بواسطة المرشح');
      fireConfetti();
    }

    logActivity('توقيع العرض الوظيفي رقمياً', 'Digital Signature Applied', 'offer', offerId, targetOffer?.candidateName || '');
  };

  const verifyPreboardingDocument = (offerId: string, documentId: string, status: 'verified' | 'rejected', reason?: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          const updatedDocs = o.preboardingDocuments.map((doc) => {
            if (doc.id === documentId) {
              return {
                ...doc,
                verificationStatus: status,
                rejectionReason: reason,
              };
            }
            return doc;
          });
          return { ...o, preboardingDocuments: updatedDocs };
        }
        return o;
      })
    );

    logActivity(
      `تدقيق مستند مسوغات التعيين: ${status}`,
      `Preboarding Doc Verified: ${status}`,
      'offer',
      offerId,
      documentId,
      reason
    );
  };

  const uploadPreboardingDocument = (offerId: string, documentId: string, fileName: string, fileSize: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          const updatedDocs = o.preboardingDocuments.map((doc) => {
            if (doc.id === documentId) {
              return {
                ...doc,
                isUploaded: true,
                fileName,
                fileSize,
                uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                verificationStatus: 'pending' as const,
              };
            }
            return doc;
          });
          return { ...o, preboardingDocuments: updatedDocs };
        }
        return o;
      })
    );
  };

  const syncCandidateToCoreHR = (offerId: string) => {
    const employeeCode = `EMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          return {
            ...o,
            status: 'synced_to_core_hr',
            isSyncedToCoreHR: true,
            coreHREmployeeId: employeeCode,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return o;
      })
    );

    const offer = offers.find((o) => o.id === offerId);
    if (offer) {
      logActivity(
        'مزامنة المرشح مع نظام Core HR',
        'Synced to Core HR System',
        'offer',
        offerId,
        `${offer.candidateName} (رقم وظيفي: ${employeeCode})`,
        `تم تحويل المرشح إلى موظف نشط في النظام الرئيسي`
      );
      fireConfetti();
    }
  };

  // Automations
  const toggleAutomationRule = (ruleId: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === ruleId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const addAutomationRule = (ruleData: Omit<AutomationRule, 'id' | 'timesExecuted'>) => {
    const newId = `rule_${Date.now()}`;
    const newRule: AutomationRule = {
      ...ruleData,
      id: newId,
      timesExecuted: 0,
    };
    setAutomations((prev) => [newRule, ...prev]);
    logActivity('إنشاء قاعدة أتمتة جديدة', 'Created Automation Rule', 'automation', newId, newRule.name);
  };

  return (
    <ATSDataContext.Provider
      value={{
        candidates,
        requisitions,
        jobTemplates,
        interviews,
        offers,
        automations,
        auditLogs,
        kpis,
        moveCandidateStage,
        addCandidate,
        updateCandidate,
        rejectCandidate,
        addCandidateNote,
        createRequisition,
        updateRequisitionStatus,
        approveRequisitionTier,
        rejectRequisitionTier,
        publishRequisition,
        addJobTemplate,
        scheduleInterview,
        submitScorecard,
        updateInterviewStatus,
        createOffer,
        signOfferAsCandidate,
        verifyPreboardingDocument,
        uploadPreboardingDocument,
        syncCandidateToCoreHR,
        toggleAutomationRule,
        addAutomationRule,
        logActivity,
      }}
    >
      {children}
    </ATSDataContext.Provider>
  );
};

export const useATSData = () => {
  const context = useContext(ATSDataContext);
  if (!context) {
    throw new Error('useATSData must be used within an ATSDataProvider');
  }
  return context;
};
