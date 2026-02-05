from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
from pydantic import BaseModel
from datetime import date

# Users table
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

# Trainers table
class TrainerDB(Base):
    __tablename__ = "trainers"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)

# Attendance table
class AttendanceDB(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)   # Must match UserDB.username
    date = Column(Date, nullable=False)
    status = Column(String, default="present")  # Added status field

# Payments table
class PaymentDB(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
