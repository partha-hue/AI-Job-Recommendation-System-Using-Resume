from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.models import CandidateProfile, RecruiterProfile, User
from app.db.session import get_db
from app.models.schemas import AuthRequest, SignupRequest, TokenResponse, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(user)
    db.flush()

    if payload.role == "candidate":
        db.add(CandidateProfile(user_id=user.id))
    else:
        db.add(RecruiterProfile(user_id=user.id))

    db.commit()
    db.refresh(user)
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user=UserRead(id=user.id, email=user.email, full_name=user.full_name, role=user.role),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: AuthRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user=UserRead(id=user.id, email=user.email, full_name=user.full_name, role=user.role),
    )


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)) -> UserRead:
    return UserRead(id=user.id, email=user.email, full_name=user.full_name, role=user.role)
