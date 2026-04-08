from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_optional_user
from app.db.models import CandidateProfile, User
from app.models.schemas import (
    ResumeRecommendationRequest,
    ResumeRecommendationResponse,
)
from app.db.session import get_db
from app.repositories.jobs import get_jobs_for_recommendation
from app.services.recommender import generate_recommendations
from app.services.resume_parser import extract_text_from_upload

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("/text", response_model=ResumeRecommendationResponse)
def recommend_from_text(
    payload: ResumeRecommendationRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> ResumeRecommendationResponse:
    if user and user.role == "candidate":
        profile = db.get(CandidateProfile, user.id)
        if profile:
            profile.resume_text = payload.resume_text
            db.commit()
    jobs = get_jobs_for_recommendation(db)
    result = generate_recommendations(payload.resume_text, jobs, payload.top_k)
    return ResumeRecommendationResponse(**result)


@router.post("/file", response_model=ResumeRecommendationResponse)
def recommend_from_file(
    file: UploadFile = File(...),
    top_k: int = 5,
    db: Session = Depends(get_db),
) -> ResumeRecommendationResponse:
    resume_text = extract_text_from_upload(file)
    jobs = get_jobs_for_recommendation(db)
    result = generate_recommendations(resume_text, jobs, top_k)
    return ResumeRecommendationResponse(**result)
