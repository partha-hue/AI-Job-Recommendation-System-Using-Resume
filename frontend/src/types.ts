export type RecommendationItem = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  match_score: number;
  reasons: string[];
  missing_skills: string[];
  matched_skills: string[];
  summary: string;
};

export type RecommendationResponse = {
  extracted_skills: string[];
  recommendations: RecommendationItem[];
};

export type JobItem = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  summary: string;
  required_skills: string[];
  preferred_skills: string[];
};
