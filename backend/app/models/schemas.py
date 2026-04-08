from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ResumeRecommendationRequest(BaseModel):
    resume_text: str = Field(min_length=40)
    top_k: int = Field(default=5, ge=1, le=10)


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class SignupRequest(AuthRequest):
    full_name: str
    role: str = Field(pattern="^(candidate|recruiter)$")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class CandidateProfileRead(BaseModel):
    headline: str = ""
    location: str = ""
    bio: str = ""
    experience_years: int = 0
    skills: list[str] = Field(default_factory=list)
    resume_text: str = ""
    links: list[str] = Field(default_factory=list)


class CandidateProfileUpdate(CandidateProfileRead):
    pass


class RecruiterProfileRead(BaseModel):
    company: str = ""
    title: str = ""
    location: str = ""
    about: str = ""


class RecruiterProfileUpdate(RecruiterProfileRead):
    pass


class JobRead(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    summary: str
    required_skills: list[str]
    preferred_skills: list[str]


class JobCreate(BaseModel):
    job_id: str = Field(min_length=3)
    title: str
    company: str
    location: str
    summary: str
    required_skills: list[str]
    preferred_skills: list[str]


class RecommendationItem(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    match_score: float
    reasons: list[str]
    missing_skills: list[str]
    matched_skills: list[str]
    summary: str


class ResumeRecommendationResponse(BaseModel):
    extracted_skills: list[str]
    recommendations: list[RecommendationItem]


class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: str = ""


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationRead(BaseModel):
    id: int
    candidate_id: int
    candidate_name: str
    candidate_email: EmailStr
    job_id: str
    job_title: str
    company: str
    status: str
    cover_letter: str
    created_at: datetime


class HealthResponse(BaseModel):
    status: str
