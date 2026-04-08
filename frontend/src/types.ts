export type UserRole = "candidate" | "recruiter";

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

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

export type CandidateProfile = {
  headline: string;
  location: string;
  bio: string;
  experience_years: number;
  skills: string[];
  resume_text: string;
  links: string[];
};

export type RecruiterProfile = {
  company: string;
  title: string;
  location: string;
  about: string;
};

export type ApplicationItem = {
  id: number;
  candidate_id: number;
  candidate_name: string;
  candidate_email: string;
  job_id: string;
  job_title: string;
  company: string;
  status: string;
  cover_letter: string;
  created_at: string;
};
