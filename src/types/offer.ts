export type OfferStatus = 
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent_to_candidate'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'synced_to_core_hr';

export interface OfferCompensation {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  totalMonthly: number;
  totalAnnual: number;
  currency: string;
  bonusScheme?: string;
  probationMonths: number;
  annualLeaveDays: number;
  medicalInsuranceTier: 'VIP' | 'Class A' | 'Class B' | 'Standard';
  flightTicketAllowance?: string;
}

export type DocumentType = 
  | 'national_id'
  | 'passport'
  | 'degree_certificate'
  | 'experience_certificate'
  | 'bank_iban_letter'
  | 'medical_check'
  | 'criminal_clearance';

export interface PreboardingDocument {
  id: string;
  type: DocumentType;
  title: string;
  titleEn: string;
  isRequired: boolean;
  isUploaded: boolean;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  uploadedAt?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface JobOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  department: string;
  reportingTo: string;
  joiningDate: string;
  expiryDate: string;
  compensation: OfferCompensation;
  termsAndConditions: string;
  status: OfferStatus;
  hrSignerName: string;
  hrSignedAt?: string;
  candidateSignature?: {
    signatureDataUrl: string;
    signedAt: string;
    ipAddress?: string;
  };
  declineReason?: string;
  preboardingDocuments: PreboardingDocument[];
  isSyncedToCoreHR: boolean;
  coreHREmployeeId?: string;
  createdAt: string;
  updatedAt: string;
}
