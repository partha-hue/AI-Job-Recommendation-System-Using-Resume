import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Job


def seed_jobs(db: Session) -> None:
    existing = db.scalar(select(Job.job_id).limit(1))
    if existing:
        return

    data_path = Path(__file__).resolve().parent.parent / "data" / "jobs.json"
    with data_path.open("r", encoding="utf-8") as file:
        jobs = json.load(file)

    for job in jobs:
        db.add(Job(**job))

    db.commit()
