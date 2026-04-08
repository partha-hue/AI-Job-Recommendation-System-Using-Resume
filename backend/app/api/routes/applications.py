from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.models import Application, Job, User
from app.db.session import get_db
from app.models.schemas import ApplicationCreate, ApplicationRead, ApplicationStatusUpdate

router = APIRouter(prefix="/applications", tags=["applications"])


def serialize_application(application: Application, candidate: User, job: Job) -> ApplicationRead:
    return ApplicationRead(
        id=application.id,
        candidate_id=candidate.id,
        candidate_name=candidate.full_name,
        candidate_email=candidate.email,
        job_id=job.job_id,
        job_title=job.title,
        company=job.company,
        status=application.status,
        cover_letter=application.cover_letter,
        created_at=application.created_at,
    )


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
) -> ApplicationRead:
    job = db.get(Job, payload.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    existing = db.scalar(
        select(Application).where(Application.candidate_id == user.id, Application.job_id == payload.job_id)
    )
    if existing:
        raise HTTPException(status_code=409, detail="Already applied to this job.")

    application = Application(candidate_id=user.id, job_id=payload.job_id, cover_letter=payload.cover_letter)
    db.add(application)
    db.commit()
    db.refresh(application)
    return serialize_application(application, user, job)


@router.get("/me", response_model=list[ApplicationRead])
def list_applications(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ApplicationRead]:
    if user.role == "candidate":
        applications = list(db.scalars(select(Application).where(Application.candidate_id == user.id)).all())
    else:
        applications = list(db.scalars(select(Application)).all())

    items: list[ApplicationRead] = []
    for application in applications:
        candidate = db.get(User, application.candidate_id)
        job = db.get(Job, application.job_id)
        if candidate and job:
            items.append(serialize_application(application, candidate, job))
    return items


@router.patch("/{application_id}", response_model=ApplicationRead)
def update_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
) -> ApplicationRead:
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")
    application.status = payload.status
    db.commit()
    db.refresh(application)
    candidate = db.get(User, application.candidate_id)
    job = db.get(Job, application.job_id)
    return serialize_application(application, candidate, job)
