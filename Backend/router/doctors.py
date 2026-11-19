import os
import shutil
import uuid

import models
from database import get_db
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from router.auth import get_current_user, hash_password
from schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
    DoctorUpdate,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/doctors", tags=["Doctors"])

UPLOAD_DIR = "uploads/doctors"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post(
    "",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin] Create Doctor",
)
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

    cancellation_fee = 0 if data.free_cancellation else data.cancellation_fee

    doctor = models.Doctor(
        user_id=user.id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        specialty=data.specialty,
        bio=data.bio,
        location=data.location,
        experience_years=data.experience_years,
        rating=data.rating,
        reviews_count=data.reviews_count,
        free_cancellation=data.free_cancellation,
        cancellation_fee=cancellation_fee,
        consultation_fee=data.consultation_fee,
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor


@router.post(
    "/{doctor_id}/image",
    response_model=DoctorResponse,
    summary="[Admin] Upload Doctor Image",
)
def upload_doctor_image(
    doctor_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in (models.UserRole.ADMIN, models.UserRole.DOCTOR):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or the doctor can upload an image",
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
            detail="You can only upload your own image",
        )

    ext = os.path.splitext(image.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .jpg, .jpeg, .png, .webp images are allowed",
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    doctor.image_url = f"/uploads/doctors/{filename}"

    db.commit()
    db.refresh(doctor)

    return doctor


@router.get(
    "", response_model=list[DoctorResponse], summary="[Public] List & Filter Doctor"
)
def doctors_list(
    name: str | None = Query(default=None),
    specialty: str | None = Query(default=None),
    location: str | None = Query(default=None),
    max_fee: int | None = Query(default=None, ge=0),
    is_available: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Doctor)

    if name:
        query = query.filter(models.Doctor.name.ilike(f"%{name}%"))
    if specialty:
        query = query.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))
    if location:
        query = query.filter(models.Doctor.location.ilike(f"%{location}%"))
    if max_fee is not None:
        query = query.filter(models.Doctor.consultation_fee <= max_fee)
    if is_available is not None:
        query = query.filter(models.Doctor.is_available.is_(is_available))

    return query.all()


@router.get(
    "/{doctor_id}", response_model=DoctorResponse, summary="[Public] Get Doctor Details"
)
def get_individual_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    return doctor


@router.put(
    "/{doctor_id}", response_model=DoctorResponse, summary="[Admin] Update Doctor"
)
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
        doctor.name = data.name
        doctor.user.name = data.name
    if data.phone is not None:
        doctor.phone = data.phone
        doctor.user.phone = data.phone
    if data.specialty is not None:
        doctor.specialty = data.specialty
    if data.bio is not None:
        doctor.bio = data.bio
    if data.location is not None:
        doctor.location = data.location
    if data.experience_years is not None:
        doctor.experience_years = data.experience_years
    if data.rating is not None:
        doctor.rating = data.rating
    if data.reviews_count is not None:
        doctor.reviews_count = data.reviews_count
    if data.free_cancellation is not None:
        doctor.free_cancellation = data.free_cancellation
    if data.cancellation_fee is not None:
        doctor.cancellation_fee = data.cancellation_fee
    if doctor.free_cancellation:
        doctor.cancellation_fee = 0
    if data.consultation_fee is not None:
        doctor.consultation_fee = data.consultation_fee
    if data.is_available is not None:
        doctor.is_available = data.is_available

    db.commit()
    db.refresh(doctor)

    return doctor


@router.delete("/{doctor_id}", summary="[Admin] Delete Doctor")
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

    db.query(models.Appointment).filter(
        models.Appointment.doctor_id == doctor_id
    ).delete()

    user = db.query(models.User).filter(models.User.id == doctor.user_id).first()

    db.delete(doctor)
    if user:
        db.delete(user)

    db.commit()

    return {"message": "Doctor deleted"}
