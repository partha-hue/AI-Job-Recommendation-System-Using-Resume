from pydantic import BaseModel, Field


class ResumeRecommendationRequest(BaseModel):
    resume_text: str = Field(min_length=40, description="Raw resume text content.")
    top_k: int = Field(default=5, ge=1, le=10)


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


class HealthResponse(BaseModel):
    status: str
