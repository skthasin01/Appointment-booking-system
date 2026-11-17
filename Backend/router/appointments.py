from datetime import date, datetime

import models
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from router.auth import get_current_user
from schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post(
    "", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def book_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book appointment",
        )

    if data.appointment_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book an appointment in the past",
        )

    if data.start_time >= data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time",
        )

    if (
        data.appointment_date == date.today()
        and data.start_time <= datetime.now().time()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Slot already passed"
        )

    doctor = (
        db.query(models.Doctor)
        .filter(
            models.Doctor.id == data.doctor_id, models.Doctor.is_available.is_(True)
        )
        .first()
    )
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found or unavailable",
        )

    day_enum = models.DayOfWeek(data.appointment_date.strftime("%a").lower())

    schedule = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.doctor_id == data.doctor_id,
            models.DoctorSchedule.day_of_week == day_enum,
            models.DoctorSchedule.is_active.is_(True),
            models.DoctorSchedule.start_time <= data.start_time,
            models.DoctorSchedule.end_time >= data.end_time,
        )
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected time is outside doctor's schedule",
        )

    existing = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == data.doctor_id,
            models.Appointment.appointment_date == data.appointment_date,
            models.Appointment.status.notin_([models.AppointmentStatus.CANCELLED]),
            models.Appointment.start_time < data.end_time,
            models.Appointment.end_time > data.start_time,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="This slot is already booked"
        )

    appointment = models.Appointment(
        patient_id=current_user.id,
        doctor_id=data.doctor_id,
        appointment_date=data.appointment_date,
        start_time=data.start_time,
        end_time=data.end_time,
        status=models.AppointmentStatus.CONFIRMED,
        notes=data.notes,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


@router.get("/my-appointments", response_model=list[AppointmentResponse])
def my_appointments_list(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role == models.UserRole.PATIENT:
        return (
            db.query(models.Appointment)
            .filter(models.Appointment.patient_id == current_user.id)
            .order_by(
                models.Appointment.appointment_date.desc(),
                models.Appointment.start_time.desc(),
            )
            .all()
        )

    if current_user.role == models.UserRole.DOCTOR:
        doctor = (
            db.query(models.Doctor)
            .filter(models.Doctor.user_id == current_user.id)
            .first()
        )
        if not doctor:
            return []

        return (
            db.query(models.Appointment)
            .filter(models.Appointment.doctor_id == doctor.id)
            .order_by(
                models.Appointment.appointment_date.desc(),
                models.Appointment.start_time.desc(),
            )
            .all()
        )

    return (
        db.query(models.Appointment)
        .order_by(
            models.Appointment.appointment_date.desc(),
            models.Appointment.start_time.desc(),
        )
        .all()
    )


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if current_user.role == models.UserRole.PATIENT:
        if appointment.patient_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not your appointment"
            )
        if data.status != models.AppointmentStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Patients can only cancel appointments",
            )
        if appointment.status == models.AppointmentStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel a completed appointment",
            )

        appointment.status = models.AppointmentStatus.CANCELLED

        db.commit()
        db.refresh(appointment)

        return appointment

    if current_user.role == models.UserRole.DOCTOR:
        doctor = (
            db.query(models.Doctor)
            .filter(models.Doctor.user_id == current_user.id)
            .first()
        )
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not assigned to this appointment",
            )

    appointment.status = data.status

    db.commit()
    db.refresh(appointment)

    return appointment
