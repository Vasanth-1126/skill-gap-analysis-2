export interface SkillGapItem {
  name: string;
  category: string;
  priority: 'critical' | 'high' | 'medium';
  description: string;
  currentStatus: string;
}

export interface ProjectBlueprint {
  title: string;
  description: string;
  deliverables: string[];
  techStack: string[];
}

export interface RoadmapMilestone {
  phase: string;
  duration: string;
  milestoneTitle: string;
  skillsToLearn: string[];
  keyTopics: string[];
  actionSteps: string[];
  handsOnProject: ProjectBlueprint;
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  question: string;
  suggestedTalkingPoints: string[];
}

export interface SkillGapAnalysisResult {
  matchScore: number;
  summary: string;
  strengths: string[];
  skillsGap: SkillGapItem[];
  roadmap: RoadmapMilestone[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  gaps: string[];
  modelAnswer: string;
}
