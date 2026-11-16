from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import models
from database import get_db
from router.auth import get_current_user, hash_password
from schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
    DoctorUpdate,
    ScheduleItem,
    ScheduleResponse,
    SlotResponse,
)

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.post("", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized, only admins can create doctors.",
        )

    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user = models.User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        role=models.UserRole.DOCTOR,
    )
    db.add(user)
    db.flush()

    doctor = models.Doctor(
        user_id=user.id,
        specialty=data.specialty,
        bio=data.bio,
        consultation_fee=data.consultation_fee,
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor


@router.get("", response_model=list[DoctorResponse])
def doctors_list(
    db: Session = Depends(get_db), specialty: str | None = Query(default=None)
):
    query = db.query(models.Doctor).filter(models.Doctor.is_available.is_(True))
    if specialty:
        query = query.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))

    return query.all()


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_individual_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    return doctor


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    data: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not permitted, only admin can update doctor",
        )

    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    if data.name is not None:
        doctor.user.name = data.name
    if data.phone is not None:
        doctor.user.phone = data.phone
    if data.specialty is not None:
        doctor.specialty = data.specialty
    if data.bio is not None:
        doctor.bio = data.bio
    if data.consultation_fee is not None:
        doctor.consultation_fee = data.consultation_fee
    if data.image_url is not None:
        doctor.image_url = data.image_url
    if data.is_available is not None:
        doctor.is_available = data.is_available

    db.commit()
    db.refresh(doctor)

    return doctor


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete doctors",
        )

    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    user = db.query(models.User).filter(models.User.id == doctor.user_id).first()

    db.delete(doctor)
    if user:
        db.delete(user)

    db.commit()

    return {"message": "Doctor deleted"}


@router.put("/{doctor_id}/schedule", response_model=list[ScheduleResponse])
def set_doctor_schedule(
    doctor_id: int,
    items: list[ScheduleItem],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in (models.UserRole.ADMIN, models.UserRole.DOCTOR):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted."
        )

    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    if (
        current_user.role == models.UserRole.DOCTOR
        and doctor.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can update your own schedule",
        )

    for item in items:
        if item.start_time >= item.end_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start time must be before end time",
            )

    db.query(models.DoctorSchedule).filter(
        models.DoctorSchedule.doctor_id == doctor_id
    ).delete()

    new_schedules = []
    for item in items:
        schedule = models.DoctorSchedule(doctor_id=doctor_id, **item.model_dump())
        db.add(schedule)
        new_schedules.append(schedule)

    db.commit()

    return new_schedules


@router.get("/{doctor_id}/slots", response_model=list[SlotResponse])
def get_available_slots(
    doctor_id: int, target_date: date = Query(...), db: Session = Depends(get_db)
):
    if target_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check slots for past dates",
        )

    doctor = (
        db.query(models.Doctor)
        .filter(models.Doctor.id == doctor_id, models.Doctor.is_available.is_(True))
        .first()
    )
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found or unavailable",
        )

    schedules = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.doctor_id == doctor_id,
            models.DoctorSchedule.day_of_week == target_date.weekday(),
            models.DoctorSchedule.is_active.is_(True),
        )
        .all()
    )
    if not schedules:
        return []

    booked = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Appointment.appointment_date == target_date,
            models.Appointment.status.notin_([models.AppointmentStatus.CANCELLED]),
        )
        .all()
    )

    now_time = datetime.now().time()
    available_slots: list[SlotResponse] = []

    for schedule in schedules:
        start_dt = datetime.combine(target_date, schedule.start_time)
        end_dt = datetime.combine(target_date, schedule.end_time)
        total_minutes = int((end_dt - start_dt).total_seconds() // 60)
        num_slots = total_minutes // schedule.slot_duration_minutes

        for i in range(num_slots):
            slot_start = (
                start_dt + timedelta(minutes=i * schedule.slot_duration_minutes)
            ).time()
            slot_end = (
                start_dt + timedelta(minutes=(i + 1) * schedule.slot_duration_minutes)
            ).time()

            if target_date == date.today() and slot_start <= now_time:
                continue

            is_booked = False
            for appt in booked:
                if not (slot_end <= appt.start_time or slot_start >= appt.end_time):
                    is_booked = True
                    break

            if not is_booked:
                available_slots.append(
                    SlotResponse(start_time=slot_start, end_time=slot_end)
                )

    return available_slots
