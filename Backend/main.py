import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import Base, engine
from router import auth, doctors

if os.getenv("USE_CREATE_ALL", "false").lower() == "true":
    Base.metadata.create_all(bind=engine)  # creates the database tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(doctors.router)


@app.get("/")
def root():
    return {"message": "Booking API running"}
