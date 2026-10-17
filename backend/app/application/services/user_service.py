
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.application.schemas.user import UserCreate
from app.core.security import hash_password
from app.infrastructure.database.models.user_model import UserModel


def create_user(db: Session, user_data: UserCreate) -> UserModel:
    """Create a customer account."""

    normalized_email = str(user_data.email).strip().lower()

    existing_user = db.scalar(
        select(UserModel).where(UserModel.email == normalized_email)
    )

    if existing_user is not None:
        raise ValueError("Email is already registered.")

    user = UserModel(
        email=normalized_email,
        password_hash=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role="customer",
        is_active=True,
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Email is already registered.") from exc

    return user
