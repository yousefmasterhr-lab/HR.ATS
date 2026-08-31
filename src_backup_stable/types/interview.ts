export type InterviewType = 'hr_screening' | 'technical' | 'cultural_fit' | 'executive_final';

export type InterviewPlatform = 'google_meet' | 'ms_teams' | 'zoom' | 'in_person' | 'phone';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending_candidate_booking';

export type HiringRecommendation = 
  | 'strong_yes'  // موصى به بشدة
  | 'yes'         // مناسب للتوظيف
  | 'neutral'     // محايد / تحت المراجعة
  | 'no'          // غير مناسب
  | 'strong_no';  // استبعاد فوري

export interface CompetencyScoreItem {
  id: string;
  category: string;
  categoryEn: string;
  criterion: string;
  criterionEn: string;
  weightPercent: number; // e.g. 25%
  score: number; // 1 to 5
  notes?: string;
}

export interface Scorecard {
  id: string;
  interviewId: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  interviewerRole: string;
  criteria: CompetencyScoreItem[];
  weightedAverageScore: number; // calculated e.g. 4.25 / 5
  recommendation: HiringRecommendation;
  summaryFeedback: string;
  keyStrengths: string[];
  growthAreas: string[];
  submittedAt: string;
}

export interface InterviewSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  interviewerId: string;
  interviewerName: string;
  isBooked: boolean;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  type: InterviewType;
  platform: InterviewPlatform;
  meetingLink?: string;
  locationDetails?: string;
  date: string;
  startTime: string;
  endTime: string;
  interviewers: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  status: InterviewStatus;
  notes?: string;
  bookingToken?: string;
  availableSlots?: InterviewSlot[];
  scorecardId?: string;
  scorecard?: Scorecard;
  calendarEventId?: string;
  createdAt: string;
}
