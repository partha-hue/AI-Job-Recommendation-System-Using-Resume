from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Job


def list_jobs(db: Session) -> list[Job]:
    return list(db.scalars(select(Job).order_by(Job.title)).all())


def get_jobs_for_recommendation(db: Session) -> list[dict]:
    jobs = list_jobs(db)
    return [
        {
            "job_id": job.job_id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "summary": job.summary,
            "required_skills": job.required_skills,
            "preferred_skills": job.preferred_skills,
        }
        for job in jobs
    ]
