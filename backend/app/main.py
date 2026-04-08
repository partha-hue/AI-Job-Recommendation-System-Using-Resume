from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.jobs import router as jobs_router
from app.api.routes.recommendations import router as recommendations_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.seed import seed_jobs
from app.db.session import SessionLocal, engine
from app.models.schemas import HealthResponse

settings = get_settings()

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_jobs(session)


app.include_router(jobs_router, prefix=settings.api_prefix)
app.include_router(recommendations_router, prefix=settings.api_prefix)
