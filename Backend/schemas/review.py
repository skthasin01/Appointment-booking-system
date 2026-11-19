from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    appointment_id: int
    communication: int = Field(ge=1, le=5)
    behavior: int = Field(ge=1, le=5)
    punctuality: int = Field(ge=1, le=5)
    treatment_effectiveness: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=1000)


class ReviewUpdate(BaseModel):
    communication: int | None = Field(default=None, ge=1, le=5)
    behavior: int | None = Field(default=None, ge=1, le=5)
    punctuality: int | None = Field(default=None, ge=1, le=5)
    treatment_effectiveness: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = Field(default=None, max_length=1000)


class ReviewPatientInfo(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ReviewResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    communication: int
    behavior: int
    punctuality: int
    treatment_effectiveness: int
    rating: float
    comment: str | None
    created_at: datetime
    patient: ReviewPatientInfo

    model_config = ConfigDict(from_attributes=True)
