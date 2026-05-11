export interface CriteriaScore {
  id: number;
  criterion: string;
  score: number;
  maxScore: number;
  confidence: string;
  comment: string;
  evidence: string;
  evidenceLevel: string;
  missingInfo: string;
  recommendation: string;
}

export interface GroupScore {
  groupName: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface EvidenceMatrixItem {
  criterionId: number;
  criterion: string;
  evidenceFromReport: string;
  evidenceLevel: string;
  impactOnScore: string;
  suggestedAdditionalEvidence: string;
}

export interface ReportCompleteness {
  generalInfo: boolean;
  featureDescription: boolean;
  applicationScope: boolean;
  effectivenessEvidence: boolean;
  beforeAfterData: boolean;
  userFeedback: boolean;
  videoOrImageEvidence: boolean;
  productLinkOrTestAccount: boolean;
  implementationPlan: boolean;
  dataProtection: boolean;
  aiGuardrails: boolean;
  professionalAccuracy: boolean;
  scalabilityPotential: boolean;
  comments: string[];
}

export interface RoleBasedPerspective {
  reviewerRoleDisplay: string;
  reviewerRoleFull: string;
  focus: string;
  comments: string[];
  specificConcerns: string[];
  roleSpecificQuestions: string[];
}

export interface CouncilQuestions {
  effectivenessQuestions: string[];
  technologyQuestions: string[];
  securityQuestions: string[];
  scalabilityQuestions: string[];
  roleSpecificQuestions: string[];
}

export interface ImprovementPlan {
  immediateAdditions: string[];
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
}

export interface FinalRecommendation {
  awardPotential: string;
  summary: string;
  requiredAdditions: string[];
  finalNote: string;
}

export interface EvaluationMetadata {
  appName: string;
  organization: string;
  governingBody: string;
  evaluationDate: string;
  reviewerRoleDisplay: string;
  reviewerRoleFull: string;
  productName: string;
  unitName: string;
  authors: string;
  mainAuthor: string;
  members: string;
  aiToolsUsed: string;
  productType: string;
  applicationArea: string;
  targetUsers: string;
  productLink: string;
  testAccount: string;
  detectedInfoStatus: string;
  missingMetadata: string[];
}

export interface EvaluationOverall {
  totalScore: number;
  maxScore: number;
  level: string;
  executiveSummary: string;
  awardPotential: string;
  scalabilitySummary: string;
  disclaimer: string;
}

export interface EvaluationResult {
  metadata: EvaluationMetadata;
  overall: EvaluationOverall;
  groupScores: GroupScore[];
  criteriaScores: CriteriaScore[];
  reportCompleteness: ReportCompleteness;
  evidenceMatrix: EvidenceMatrixItem[];
  strengths: string[];
  weaknesses: string[];
  roleBasedPerspective: RoleBasedPerspective;
  councilQuestions: CouncilQuestions;
  improvementPlan: ImprovementPlan;
  finalRecommendation: FinalRecommendation;
}

export interface HistoryRecord {
  id: string;
  productName: string;
  unitName: string;
  reviewerRole: string;
  totalScore: number;
  groupScores: number[];
  timestamp: string;
  completenessStatus: string;
  fullResult: EvaluationResult;
}
