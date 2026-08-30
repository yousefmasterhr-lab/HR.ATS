export interface TalentPoolTag {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  count: number;
}

export interface TalentCampaign {
  id: string;
  title: string;
  targetSkills: string[];
  department: string;
  candidatesCount: number;
  openRate: number;
  responseRate: number;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
}
