import os

import models
from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from router import appointments, auth, doctors, reviews, schedules

# if os.getenv("USE_CREATE_ALL", "false").lower() == "true":
Base.metadata.create_all(bind=engine)  # creates the database tables

UPLOAD_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_ROOT, exist_ok=True)

app = FastAPI()
app.mount("/uploads", StaticFiles(directory=UPLOAD_ROOT), name="uploads")

origins = ["http://localhost:5173"]

# One or more extra origins, separated by commas (set in Render)
for url in os.getenv("FRONTEND_URL", "").split(","):
    url = url.strip().rstrip("/")
    if url:
        origins.append(url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(schedules.router)
app.include_router(appointments.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {"message": "Booking API running"}
