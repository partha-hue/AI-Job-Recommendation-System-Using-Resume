from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Job
from app.db.session import get_db
from app.models.schemas import JobCreate, JobRead
from app.repositories.jobs import list_jobs

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[JobRead])
def get_jobs(db: Session = Depends(get_db)) -> list[JobRead]:
    jobs = list_jobs(db)
    return [
        JobRead(
            job_id=job.job_id,
            title=job.title,
            company=job.company,
            location=job.location,
            summary=job.summary,
            required_skills=job.required_skills,
            preferred_skills=job.preferred_skills,
        )
        for job in jobs
    ]


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)) -> JobRead:
    existing = db.get(Job, payload.job_id)
    if existing:
        raise HTTPException(status_code=409, detail="Job with this ID already exists.")

    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return JobRead(
        job_id=job.job_id,
        title=job.title,
        company=job.company,
        location=job.location,
        summary=job.summary,
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
    )
