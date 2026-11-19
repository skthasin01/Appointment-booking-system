import models
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from router.auth import get_current_user
from schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/reviews", tags=["Reviews"])


def calculate_review_average(
    communication: int, behavior: int, punctuality: int, treatment_effectiveness: int
) -> float:
    return round(
        (communication + behavior + punctuality + treatment_effectiveness) / 4, 1
    )


def recalculate_doctor_rating(doctor_id: int, db: Session) -> None:
    stats = (
        db.query(func.avg(models.Review.rating), func.count(models.Review.id))
        .filter(models.Review.doctor_id == doctor_id)
        .first()
    )
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if doctor and stats:
        doctor.rating = round(float(stats[0] or 0.0), 1)
        doctor.reviews_count = int(stats[1] or 0)


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Patient] Create Review",
)
def create_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patient can leave reviews",
        )

    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == data.appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if appointment.patient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review your own appointment",
        )

    if appointment.status != models.AppointmentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only review a completed appointment",
        )

    existing = (
        db.query(models.Review)
        .filter(models.Review.appointment_id == data.appointment_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already reviewed this appointment",
        )

    avg_rating = calculate_review_average(
        data.communication,
        data.behavior,
        data.punctuality,
        data.treatment_effectiveness,
    )

    review = models.Review(
        appointment_id=appointment.id,
        patient_id=current_user.id,
        doctor_id=appointment.doctor_id,
        communication=data.communication,
        behavior=data.behavior,
        punctuality=data.punctuality,
        treatment_effectiveness=data.treatment_effectiveness,
        rating=avg_rating,
        comment=data.comment,
    )

    db.add(review)
    db.flush()

    recalculate_doctor_rating(appointment.doctor_id, db)

    db.commit()
    db.refresh(review)

    return review


@router.get("", response_model=list[ReviewResponse], summary="[Admin] List All Reviews")
def list_all_reviews(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all reviews",
        )

    reviews = db.query(models.Review).order_by(models.Review.created_at.desc()).all()

    return reviews


@router.get(
    "/doctor/{doctor_id}",
    response_model=list[ReviewResponse],
    summary="[Public] List Doctor Reviews",
)
def doctor_review_list(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    reviews = (
        db.query(models.Review)
        .filter(models.Review.doctor_id == doctor_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )

    return reviews


@router.patch(
    "/{review_id}",
    response_model=ReviewResponse,
    summary="[Patient / Admin] Update Review",
)
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )

    if (
        current_user.role != models.UserRole.ADMIN
        and review.patient_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the review author or an admin can update this review",
        )

    if data.communication is not None:
        review.communication = data.communication
    if data.behavior is not None:
        review.behavior = data.behavior
    if data.punctuality is not None:
        review.punctuality = data.punctuality
    if data.treatment_effectiveness is not None:
        review.treatment_effectiveness = data.treatment_effectiveness
    if data.comment is not None:
        review.comment = data.comment

    review.rating = calculate_review_average(
        review.communication,
        review.behavior,
        review.punctuality,
        review.treatment_effectiveness,
    )

    db.flush()
    recalculate_doctor_rating(review.doctor_id, db)

    db.commit()
    db.refresh(review)

    return review


@router.delete("/{review_id}", summary="[Patient / Admin] Delete Review")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )

    if (
        current_user.role != models.UserRole.ADMIN
        and review.patient_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the review author or an admin can delete this review",
        )

    doctor_id = review.doctor_id
    db.delete(review)
    db.flush()

    recalculate_doctor_rating(doctor_id, db)
    db.commit()

    return {"message": "Review deleted"}
