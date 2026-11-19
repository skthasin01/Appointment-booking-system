from datetime import date, datetime, time

from models import AppointmentStatus
from pydantic import BaseModel, ConfigDict


class AppointmentCreate(BaseModel):
    doctor_id: int
    patient_id: int | None
    appointment_date: date
    start_time: time
    end_time: time
    notes: str | None = None


class AppointmentReschedule(BaseModel):
    appointment_date: date
    start_time: time
    end_time: time


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus
    prescription_notes: str | None = None


class AppointmentPatientInfo(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None

    model_config = ConfigDict(from_attributes=True)


class AppointmentDoctorInfo(BaseModel):
    id: int
    name: str
    specialty: str | None
    location: str | None
    consultation_fee: int
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: date
    start_time: time
    end_time: time
    status: AppointmentStatus
    notes: str | None
    prescription_notes: str | None
    created_at: datetime
    patient: AppointmentPatientInfo
    doctor: AppointmentDoctorInfo

    model_config = ConfigDict(from_attributes=True)


class AppointmentStatsResponse(BaseModel):
    total_doctors: int
    total_patients: int
    total_appointments: int
    today_appointments: int
    confirmed: int
    checked_in: int
    in_consultation: int
    completed: int
    cancelled: int
