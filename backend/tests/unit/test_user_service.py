
import pytest

from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.application.schemas.user import UserCreate, UserResponse
from app.application.services.user_service import create_user
from app.core.security import verify_password
from app.infrastructure.database.base import Base
from app.infrastructure.database.models.user_model import UserModel


@pytest.fixture
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    Base.metadata.create_all(engine)

    with Session(engine) as session:
        yield session

    Base.metadata.drop_all(engine)
    engine.dispose()


def valid_user_data(**overrides):
    data = {
        "email": "Test@Example.com",
        "password": "StrongPassword123!",
        "first_name": "Test",
        "last_name": "Customer",
    }
    data.update(overrides)
    return UserCreate(**data)


def test_create_user_successfully(db):
    data = valid_user_data()

    user = create_user(db, data)

    assert user.id is not None
    assert user.email == "test@example.com"
    assert user.first_name == "Test"
    assert user.role == "customer"
    assert user.is_active is True
    assert user.password_hash != data.password
    assert verify_password(data.password, user.password_hash)


def test_duplicate_email_is_rejected(db):
    create_user(db, valid_user_data())

    with pytest.raises(ValueError, match="already registered"):
        create_user(
            db,
            valid_user_data(email="test@example.com"),
        )


def test_invalid_email_is_rejected():
    with pytest.raises(ValidationError):
        valid_user_data(email="not-an-email")


def test_short_password_is_rejected():
    with pytest.raises(ValidationError):
        valid_user_data(password="123")


def test_customer_cannot_choose_admin_role():
    with pytest.raises(ValidationError):
        valid_user_data(role="admin")


def test_response_does_not_expose_password_hash(db):
    user = create_user(db, valid_user_data())

    response = UserResponse.model_validate(user)

    assert response.email == "test@example.com"
    assert "password_hash" not in response.model_dump()
    assert "password" not in response.model_dump()
