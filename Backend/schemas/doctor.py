from datetime import time

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class DoctorCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    specialty: str = Field(min_length=2, max_length=100)
    bio: str | None = None
    consultation_fee: int = Field(ge=0, default=0)
    image_url: str | None = None


class DoctorUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    specialty: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = None
    consultation_fee: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    is_available: bool | None = None


class DoctorResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    specialty: str
    bio: str | None
    consultation_fee: int
    image_url: str | None
    is_available: bool

    model_config = ConfigDict(from_attributes=True)


class ScheduleItem(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    start_time: time
    end_time: time
    slot_duration_minutes: int = Field(ge=10, le=120, default=30)
    is_active: bool = True


class ScheduleResponse(BaseModel):
    id: int
    day_of_week: int
    start_time: time
    end_time: time
    slot_duration_minutes: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class SlotResponse(BaseModel):
    start_time: time
    end_time: time
