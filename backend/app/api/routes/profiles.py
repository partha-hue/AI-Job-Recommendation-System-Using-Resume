from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import CandidateProfile, RecruiterProfile, User
from app.db.session import get_db
from app.models.schemas import (
    CandidateProfileRead,
    CandidateProfileUpdate,
    RecruiterProfileRead,
    RecruiterProfileUpdate,
)

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/candidate/me", response_model=CandidateProfileRead)
def get_candidate_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> CandidateProfileRead:
    if user.role != "candidate":
        raise HTTPException(status_code=403, detail="Candidate account required.")
    profile = db.get(CandidateProfile, user.id)
    return CandidateProfileRead(**profile.__dict__)


@router.put("/candidate/me", response_model=CandidateProfileRead)
def update_candidate_profile(
    payload: CandidateProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CandidateProfileRead:
    if user.role != "candidate":
        raise HTTPException(status_code=403, detail="Candidate account required.")
    profile = db.get(CandidateProfile, user.id)
    for key, value in payload.model_dump().items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return CandidateProfileRead(**profile.__dict__)


@router.get("/recruiter/me", response_model=RecruiterProfileRead)
def get_recruiter_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> RecruiterProfileRead:
    if user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Recruiter account required.")
    profile = db.get(RecruiterProfile, user.id)
    return RecruiterProfileRead(**profile.__dict__)


@router.put("/recruiter/me", response_model=RecruiterProfileRead)
def update_recruiter_profile(
    payload: RecruiterProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecruiterProfileRead:
    if user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Recruiter account required.")
    profile = db.get(RecruiterProfile, user.id)
    for key, value in payload.model_dump().items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return RecruiterProfileRead(**profile.__dict__)
