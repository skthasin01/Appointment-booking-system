import os
from datetime import date, time, timedelta

import models
from database import SessionLocal
from dotenv import load_dotenv
from router.auth import hash_password

load_dotenv()


def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Admin
        admin_email = os.getenv("ADMIN_EMAIL", "admin@clinic.com").strip().lower()
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin:
            admin = models.User(
                name="System Admin",
                email=admin_email,
                password_hash=hash_password(admin_password),
                role=models.UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin)
            db.flush()
            print(f"Created Admin: {admin_email} / {admin_password}")

        # 2. Seed Dummy Patient (for the 3 bookings)
        patient_email = "patient@clinic.com"
        patient = (
            db.query(models.User).filter(models.User.email == patient_email).first()
        )
        if not patient:
            patient = models.User(
                name="Tanvir Hasan",
                email=patient_email,
                password_hash=hash_password("patient123"),
                phone="01711000000",
                role=models.UserRole.PATIENT,
                is_active=True,
            )
            db.add(patient)
            db.flush()
            print(f"Created Patient: {patient_email} / patient123")

        # 3. Seed 6 Dummy Doctors + Pictures + Schedules
        dummy_doctors = [
            {
                "name": "Dr. Sajid Mahmud",
                "email": "sajid@clinic.com",
                "phone": "01711000001",
                "specialty": "Neurology",
                "bio": "Senior Consultant Neurologist specializing in stroke and epilepsy.",
                "location": "Shaheb Bazar, Rajshahi",
                "experience_years": 24,
                "rating": 5.0,
                "reviews_count": 243,
                "free_cancellation": False,
                "cancellation_fee": 200,
                "consultation_fee": 700,
                "image_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "days": [
                    models.DayOfWeek.SAT,
                    models.DayOfWeek.MON,
                    models.DayOfWeek.WED,
                ],
                "start_time": time(9, 0),
                "end_time": time(13, 0),
            },
            {
                "name": "Dr. Arif Mahmud",
                "email": "arif@clinic.com",
                "phone": "01711000002",
                "specialty": "Neurology",
                "bio": "Specialist in migraine, headache disorders, and clinical neurology.",
                "location": "Motijheel, Dhaka",
                "experience_years": 20,
                "rating": 5.0,
                "reviews_count": 119,
                "free_cancellation": True,
                "cancellation_fee": 0,
                "consultation_fee": 700,
                "image_url": "https://randomuser.me/api/portraits/men/46.jpg",
                "days": [
                    models.DayOfWeek.SUN,
                    models.DayOfWeek.TUE,
                    models.DayOfWeek.THU,
                ],
                "start_time": time(10, 0),
                "end_time": time(14, 0),
            },
            {
                "name": "Dr. Moniruzzaman Khan",
                "email": "monir@clinic.com",
                "phone": "01711000003",
                "specialty": "Neurology",
                "bio": "Consultant in neuro-medicine and movement disorders.",
                "location": "Shibbari, Khulna",
                "experience_years": 16,
                "rating": 5.0,
                "reviews_count": 415,
                "free_cancellation": True,
                "cancellation_fee": 0,
                "consultation_fee": 700,
                "image_url": "https://randomuser.me/api/portraits/men/64.jpg",
                "days": [
                    models.DayOfWeek.SAT,
                    models.DayOfWeek.SUN,
                    models.DayOfWeek.TUE,
                    models.DayOfWeek.THU,
                ],
                "start_time": time(9, 0),
                "end_time": time(13, 0),
            },
            {
                "name": "Dr. Wasiur Rahman",
                "email": "wasiur@clinic.com",
                "phone": "01711000004",
                "specialty": "Neurology",
                "bio": "Specialist in peripheral neuropathy and sleep disorders.",
                "location": "Kafrul, Dhaka",
                "experience_years": 12,
                "rating": 5.0,
                "reviews_count": 291,
                "free_cancellation": True,
                "cancellation_fee": 0,
                "consultation_fee": 700,
                "image_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "days": [
                    models.DayOfWeek.MON,
                    models.DayOfWeek.WED,
                    models.DayOfWeek.FRI,
                ],
                "start_time": time(15, 0),
                "end_time": time(19, 0),
            },
            {
                "name": "Dr. Nusrat Jahan",
                "email": "nusrat@clinic.com",
                "phone": "01711000005",
                "specialty": "Dermatology",
                "bio": "Specialist in clinical dermatology, acne, and laser treatments.",
                "location": "Dhanmondi, Dhaka",
                "experience_years": 14,
                "rating": 4.9,
                "reviews_count": 180,
                "free_cancellation": False,
                "cancellation_fee": 150,
                "consultation_fee": 1000,
                "image_url": "https://randomuser.me/api/portraits/women/68.jpg",
                "days": [
                    models.DayOfWeek.SAT,
                    models.DayOfWeek.MON,
                    models.DayOfWeek.WED,
                ],
                "start_time": time(10, 0),
                "end_time": time(14, 0),
            },
            {
                "name": "Dr. Sabrina Rahman",
                "email": "sabrina@clinic.com",
                "phone": "01711000006",
                "specialty": "Cardiology",
                "bio": "Consultant in clinical and preventive cardiology.",
                "location": "Uttara, Dhaka",
                "experience_years": 18,
                "rating": 5.0,
                "reviews_count": 310,
                "free_cancellation": True,
                "cancellation_fee": 0,
                "consultation_fee": 1200,
                "image_url": "https://randomuser.me/api/portraits/women/65.jpg",
                "days": [
                    models.DayOfWeek.SUN,
                    models.DayOfWeek.TUE,
                    models.DayOfWeek.THU,
                ],
                "start_time": time(9, 0),
                "end_time": time(13, 0),
            },
        ]

        created_doctors: list[models.Doctor] = []
        default_password_hash = hash_password("doctor123")

        for item in dummy_doctors:
            user = (
                db.query(models.User).filter(models.User.email == item["email"]).first()
            )
            if not user:
                user = models.User(
                    name=item["name"],
                    email=item["email"],
                    password_hash=default_password_hash,
                    phone=item["phone"],
                    role=models.UserRole.DOCTOR,
                    is_active=True,
                )
                db.add(user)
                db.flush()

                doctor = models.Doctor(
                    user_id=user.id,
                    name=item["name"],
                    email=item["email"],
                    phone=item["phone"],
                    specialty=item["specialty"],
                    bio=item["bio"],
                    location=item["location"],
                    experience_years=item["experience_years"],
                    rating=item["rating"],
                    reviews_count=item["reviews_count"],
                    free_cancellation=item["free_cancellation"],
                    cancellation_fee=item["cancellation_fee"],
                    consultation_fee=item["consultation_fee"],
                    image_url=item["image_url"],
                    is_available=True,
                )
                db.add(doctor)
                db.flush()

                for day in item["days"]:
                    schedule = models.DoctorSchedule(
                        doctor_id=doctor.id,
                        day_of_week=day,
                        start_time=item["start_time"],
                        end_time=item["end_time"],
                        slot_duration_minutes=30,
                        is_active=True,
                    )
                    db.add(schedule)

                created_doctors.append(doctor)
                print(f"Created Doctor: {item['name']} ({item['specialty']})")
            else:
                doctor = (
                    db.query(models.Doctor)
                    .filter(models.Doctor.user_id == user.id)
                    .first()
                )
                if doctor:
                    if not doctor.image_url:
                        doctor.image_url = item["image_url"]
                    created_doctors.append(doctor)

        # 4. Seed 3 Dummy Bookings for Tomorrow
        tomorrow = date.today() + timedelta(days=1)
        existing_bookings = db.query(models.Appointment).count()

        if existing_bookings == 0 and len(created_doctors) >= 3:
            dummy_bookings = [
                {
                    "doctor_id": created_doctors[0].id,
                    "start_time": time(9, 0),
                    "end_time": time(9, 30),
                    "status": models.AppointmentStatus.CONFIRMED,
                    "notes": "Routine blood pressure and ECG checkup.",
                },
                {
                    "doctor_id": created_doctors[1].id,
                    "start_time": time(10, 0),
                    "end_time": time(10, 30),
                    "status": models.AppointmentStatus.CONFIRMED,
                    "notes": "Skin allergy consultation.",
                },
                {
                    "doctor_id": created_doctors[2].id,
                    "start_time": time(11, 0),
                    "end_time": time(11, 30),
                    "status": models.AppointmentStatus.CHECKED_IN,
                    "notes": "Seasonal flu and fever checkup.",
                },
            ]

            for b in dummy_bookings:
                appointment = models.Appointment(
                    patient_id=patient.id,
                    doctor_id=b["doctor_id"],
                    appointment_date=tomorrow,
                    start_time=b["start_time"],
                    end_time=b["end_time"],
                    status=b["status"],
                    notes=b["notes"],
                )
                db.add(appointment)

            print(f"Created 3 bookings for {tomorrow}")

        db.commit()
        print("Seeding completed!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
