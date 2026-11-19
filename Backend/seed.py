import os
from datetime import date, time, timedelta

import models
from database import SessionLocal
from dotenv import load_dotenv
from router.auth import hash_password
from sqlalchemy import func

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
                phone="01710000000",
                role=models.UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin)
            db.flush()
            print(f"Created Admin: {admin_email} / {admin_password}")

        # 2. Seed Receptionist
        receptionist_email = "receptionist@clinic.com"
        receptionist = (
            db.query(models.User)
            .filter(models.User.email == receptionist_email)
            .first()
        )
        if not receptionist:
            receptionist = models.User(
                name="Farzana Akter",
                email=receptionist_email,
                password_hash=hash_password("reception123"),
                phone="01710000001",
                role=models.UserRole.RECEPTIONIST,
                is_active=True,
            )
            db.add(receptionist)
            db.flush()
            print(f"Created Receptionist: {receptionist_email} / reception123")

        # 3. Seed 2 Patients
        dummy_patients = [
            {
                "name": "Tanvir Hasan",
                "email": "patient1@clinic.com",
                "phone": "01711000000",
            },
            {
                "name": "Mim Chowdhury",
                "email": "patient2@clinic.com",
                "phone": "01711000010",
            },
        ]

        patients: list[models.User] = []
        patient_password_hash = hash_password("patient123")

        for p in dummy_patients:
            user = db.query(models.User).filter(models.User.email == p["email"]).first()
            if not user:
                user = models.User(
                    name=p["name"],
                    email=p["email"],
                    password_hash=patient_password_hash,
                    phone=p["phone"],
                    role=models.UserRole.PATIENT,
                    is_active=True,
                )
                db.add(user)
                db.flush()
                print(f"Created Patient: {p['email']} / patient123")
            patients.append(user)

        # 4. Seed 6 Dummy Doctors (each with login account + schedule)
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
                "reviews_count": 0,
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
                "reviews_count": 0,
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
                "reviews_count": 0,
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
                "reviews_count": 0,
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
                "reviews_count": 0,
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
                "reviews_count": 0,
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
        doctor_password_hash = hash_password("doctor123")

        for item in dummy_doctors:
            user = (
                db.query(models.User).filter(models.User.email == item["email"]).first()
            )
            if not user:
                user = models.User(
                    name=item["name"],
                    email=item["email"],
                    password_hash=doctor_password_hash,
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
                print(f"Created Doctor: {item['email']} / doctor123")
            else:
                doctor = (
                    db.query(models.Doctor)
                    .filter(models.Doctor.user_id == user.id)
                    .first()
                )
                if doctor:
                    created_doctors.append(doctor)

        # 5. Seed 5 Dummy Appointments (Upcoming + Completed)
        today = date.today()
        tomorrow = today + timedelta(days=1)
        yesterday = today - timedelta(days=1)
        existing_bookings = db.query(models.Appointment).count()

        created_appointments: list[models.Appointment] = []

        if existing_bookings == 0 and len(created_doctors) >= 4 and len(patients) >= 2:
            dummy_bookings = [
                # Upcoming appointments
                {
                    "patient_id": patients[0].id,
                    "doctor_id": created_doctors[0].id,
                    "appointment_date": tomorrow,
                    "start_time": time(9, 0),
                    "end_time": time(9, 30),
                    "status": models.AppointmentStatus.CONFIRMED,
                    "notes": "Frequent migraine headaches over the past two weeks.",
                    "prescription_notes": None,
                },
                {
                    "patient_id": patients[1].id,
                    "doctor_id": created_doctors[1].id,
                    "appointment_date": tomorrow,
                    "start_time": time(10, 0),
                    "end_time": time(10, 30),
                    "status": models.AppointmentStatus.CHECKED_IN,
                    "notes": "Follow-up consultation for sleep disorder.",
                    "prescription_notes": None,
                },
                # Completed appointments (for reviews & prescription testing)
                {
                    "patient_id": patients[0].id,
                    "doctor_id": created_doctors[0].id,
                    "appointment_date": yesterday,
                    "start_time": time(10, 0),
                    "end_time": time(10, 30),
                    "status": models.AppointmentStatus.COMPLETED,
                    "notes": "Initial neurological checkup.",
                    "prescription_notes": "Prescribed Sumatriptan 50mg as needed; follow up in 2 weeks.",
                },
                {
                    "patient_id": patients[1].id,
                    "doctor_id": created_doctors[4].id,
                    "appointment_date": yesterday,
                    "start_time": time(11, 0),
                    "end_time": time(11, 30),
                    "status": models.AppointmentStatus.COMPLETED,
                    "notes": "Skin allergy and mild rash.",
                    "prescription_notes": "Apply hydrocortisone cream twice daily for 5 days.",
                },
                {
                    "patient_id": patients[0].id,
                    "doctor_id": created_doctors[5].id,
                    "appointment_date": yesterday,
                    "start_time": time(9, 30),
                    "end_time": time(10, 0),
                    "status": models.AppointmentStatus.COMPLETED,
                    "notes": "Routine blood pressure and ECG checkup.",
                    "prescription_notes": "BP normal (118/78). Continue regular exercise.",
                },
            ]

            for b in dummy_bookings:
                appointment = models.Appointment(**b)
                db.add(appointment)
                db.flush()
                created_appointments.append(appointment)

            print(f"Created {len(created_appointments)} dummy appointments")

        # 6. Seed 2 Multi-Criteria Reviews (leaves the 3rd completed appointment unreviewed for testing POST /reviews)
        existing_reviews = db.query(models.Review).count()
        if existing_reviews == 0 and len(created_appointments) >= 4:
            dummy_reviews = [
                {
                    "appointment": created_appointments[2],  # patient1 -> Dr. Sajid
                    "communication": 5,
                    "behavior": 5,
                    "punctuality": 4,
                    "treatment_effectiveness": 5,
                    "comment": "Very attentive and explained everything clearly.",
                },
                {
                    "appointment": created_appointments[3],  # patient2 -> Dr. Nusrat
                    "communication": 5,
                    "behavior": 5,
                    "punctuality": 5,
                    "treatment_effectiveness": 4,
                    "comment": "Friendly doctor and quick diagnosis.",
                },
            ]

            reviewed_doctor_ids = set()
            for r in dummy_reviews:
                appt = r["appointment"]
                avg = round(
                    (
                        r["communication"]
                        + r["behavior"]
                        + r["punctuality"]
                        + r["treatment_effectiveness"]
                    )
                    / 4,
                    1,
                )
                review = models.Review(
                    appointment_id=appt.id,
                    patient_id=appt.patient_id,
                    doctor_id=appt.doctor_id,
                    communication=r["communication"],
                    behavior=r["behavior"],
                    punctuality=r["punctuality"],
                    treatment_effectiveness=r["treatment_effectiveness"],
                    rating=avg,
                    comment=r["comment"],
                )
                db.add(review)
                reviewed_doctor_ids.add(appt.doctor_id)

            db.flush()

            # Sync doctor rating & reviews_count from seeded reviews
            for doc_id in reviewed_doctor_ids:
                stats = (
                    db.query(
                        func.avg(models.Review.rating), func.count(models.Review.id)
                    )
                    .filter(models.Review.doctor_id == doc_id)
                    .first()
                )
                doctor = (
                    db.query(models.Doctor).filter(models.Doctor.id == doc_id).first()
                )
                if doctor and stats:
                    doctor.rating = round(float(stats[0] or 0.0), 1)
                    doctor.reviews_count = int(stats[1] or 0)

            print("Created 2 dummy reviews")

        db.commit()
        print("\nSeeding completed! Login credentials:")
        print(f"  Admin:        {admin_email} / {admin_password}")
        print("  Receptionist: receptionist@clinic.com / reception123")
        print("  Patient 1:    patient1@clinic.com / patient123")
        print("  Patient 2:    patient2@clinic.com / patient123")
        print("  Doctors:      sajid@clinic.com (and others) / doctor123")
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
