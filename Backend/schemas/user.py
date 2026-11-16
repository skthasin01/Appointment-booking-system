from pydantic import BaseModel, ConfigDict, EmailStr, Field

from models import UserRole


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    phone: str | None = Field(default=None, max_length=20)


class AdminUserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    role: UserRole = UserRole.PATIENT


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    role: UserRole
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
