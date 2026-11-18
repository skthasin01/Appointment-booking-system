from datetime import time

from models import DayOfWeek
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ScheduleItem(BaseModel):
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    slot_duration_minutes: int = Field(ge=10, le=120, default=30)
    is_active: bool = True


class ScheduleUpdate(BaseModel):
    day_of_week: DayOfWeek | None = None
    start_time: time | None = None
    end_time: time | None = None
    slot_duration_minutes: int | None = Field(default=None, ge=10, le=120)
    is_active: bool | None = None


class ScheduleResponse(BaseModel):
    id: int
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    slot_duration_minutes: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class DoctorCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    specialty: str = Field(min_length=2, max_length=100)
    bio: str | None = None
    location: str | None = None
    experience_years: int = Field(ge=0, default=0)
    rating: float = Field(ge=0.0, le=5.0, default=5.0)
    reviews_count: int = Field(ge=0, default=0)
    free_cancellation: bool = True
    cancellation_fee: int = Field(ge=0, default=0)
    consultation_fee: int = Field(ge=0, default=0)


class DoctorUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    specialty: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = None
    location: str | None = None
    experience_years: int | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0.0, le=5.0)
    reviews_count: int | None = Field(default=None, ge=0)
    free_cancellation: bool | None = None
    cancellation_fee: int | None = Field(default=None, ge=0)
    consultation_fee: int | None = Field(default=None, ge=0)
    is_available: bool | None = None


class DoctorResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    phone: str | None
    specialty: str | None
    bio: str | None
    location: str | None
    experience_years: int
    rating: float
    reviews_count: int
    free_cancellation: bool
    cancellation_fee: int
    consultation_fee: int
    image_url: str | None
    is_available: bool
    schedules: list[ScheduleResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SlotResponse(BaseModel):
    start_time: time
    end_time: time
