from datetime import date, datetime, timedelta

import models
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query, status
from router.auth import get_current_user
from schemas.doctor import (
    ScheduleItem,
    ScheduleResponse,
    ScheduleUpdate,
    SlotResponse,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/doctors", tags=["Schedules"])


@router.get(
    "/{doctor_id}/schedule",
    response_model=list[ScheduleResponse],
    summary="[Public / Admin / Doctor] Get Doctor Weekly Schedule",
)
def get_doctor_schedule(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    return (
        db.query(models.DoctorSchedule)
        .filter(models.DoctorSchedule.doctor_id == doctor_id)
        .order_by(models.DoctorSchedule.day_of_week.asc())
        .all()
    )


@router.put(
    "/{doctor_id}/schedule",
    response_model=list[ScheduleResponse],
    summary="[Admin / Doctor] Replace Full Weekly Schedule",
)
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

    seen_days = set()
    for item in items:
        if item.start_time >= item.end_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start time must be before end time",
            )
        if item.day_of_week in seen_days:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate schedule for {item.day_of_week.value}",
            )
        seen_days.add(item.day_of_week)

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


@router.post(
    "/{doctor_id}/schedule",
    response_model=ScheduleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin / Doctor] Add Single Day Schedule",
)
def add_doctor_schedule(
    doctor_id: int,
    data: ScheduleItem,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in (models.UserRole.ADMIN, models.UserRole.DOCTOR):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted"
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
            detail="You can only add to your own schedule",
        )

    if data.start_time >= data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time",
        )

    existing = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.doctor_id == doctor_id,
            models.DoctorSchedule.day_of_week == data.day_of_week,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Schedule for {data.day_of_week.value} already exists",
        )

    schedule = models.DoctorSchedule(doctor_id=doctor_id, **data.model_dump())

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return schedule


@router.patch(
    "/{doctor_id}/schedule/{schedule_id}",
    response_model=ScheduleResponse,
    summary="[Admin / Doctor] Update Single Schedule",
)
def update_single_schedule(
    doctor_id: int,
    schedule_id: int,
    data: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in (models.UserRole.ADMIN, models.UserRole.DOCTOR):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted"
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
            detail="You can only update your own schedule",
        )

    schedule = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.id == schedule_id,
            models.DoctorSchedule.doctor_id == doctor_id,
        )
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    if data.day_of_week is not None:
        duplicate_day = (
            db.query(models.DoctorSchedule)
            .filter(
                models.DoctorSchedule.doctor_id == doctor_id,
                models.DoctorSchedule.day_of_week == data.day_of_week,
                models.DoctorSchedule.id != schedule_id,
            )
            .first()
        )
        if duplicate_day:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Schedule for {data.day_of_week.value} already exists",
            )
        schedule.day_of_week = data.day_of_week
    if data.start_time is not None:
        schedule.start_time = data.start_time
    if data.end_time is not None:
        schedule.end_time = data.end_time
    if data.slot_duration_minutes is not None:
        schedule.slot_duration_minutes = data.slot_duration_minutes
    if data.is_active is not None:
        schedule.is_active = data.is_active

    if schedule.start_time >= schedule.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start time must be before end time",
        )

    db.commit()
    db.refresh(schedule)

    return schedule


@router.delete(
    "/{doctor_id}/schedule/{schedule_id}",
    summary="[Admin / Doctor] Delete Single Schedule",
)
def delete_single_schedule(
    doctor_id: int,
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in (models.UserRole.ADMIN, models.UserRole.DOCTOR):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted"
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
            detail="You can only delete your own schedule",
        )

    schedule = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.id == schedule_id,
            models.DoctorSchedule.doctor_id == doctor_id,
        )
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    db.delete(schedule)
    db.commit()

    return {"message": "Schedule deleted"}


@router.get(
    "/{doctor_id}/slots",
    response_model=list[SlotResponse],
    summary="[Public] Get Available Time Slots",
)
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

    day_enum = models.DayOfWeek(target_date.strftime("%a").lower())

    schedules = (
        db.query(models.DoctorSchedule)
        .filter(
            models.DoctorSchedule.doctor_id == doctor_id,
            models.DoctorSchedule.day_of_week == day_enum,
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
