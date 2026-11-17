from datetime import date, datetime, time

from models import AppointmentStatus
from pydantic import BaseModel, ConfigDict


class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: date
    start_time: time
    end_time: time
    notes: str | None = None


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: date
    start_time: time
    end_time: time
    status: AppointmentStatus
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
