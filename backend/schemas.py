from pydantic import BaseModel
from datetime import date

# ------------------ USER ------------------
class UserRegister(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

# ------------------ TRAINER ------------------
class Trainer(BaseModel):
    name: str
    specialization: str

# ------------------ ATTENDANCE ------------------
class Attendance(BaseModel):
    username: str   # must match DB field
    date: date
    status: str = "present"  # default to "present"

# ------------------ PAYMENT ------------------
class Payment(BaseModel):
    username: str
    amount: float
    date: date
