from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
from database import Base, engine, get_db
from models import UserDB, TrainerDB, AttendanceDB, PaymentDB
from schemas import UserLogin, UserRegister, Trainer, Attendance
from auth import hash_password, verify_password, create_token
from datetime import date as dt_date
from fastapi import status
from schemas import UserLogin, UserRegister, Trainer, Attendance, Payment


app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ------------------ STARTUP EVENT ------------------
@app.on_event("startup")
async def startup():
    """
    Create all tables on startup if they don't exist.
    This is the async-safe way to create tables using Async SQLAlchemy.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created / ready")

# ------------------ HOME ------------------
@app.get("/")
async def home():
    return {"msg": "API is running"}

# ------------------ AUTH ------------------
@app.post("/register")
async def register(user: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if username exists
    result = await db.execute(
        select(UserDB).where(UserDB.username == user.username)
    )
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create new user
    new_user = UserDB(
        username=user.username,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    await db.commit()
    return {"msg": "User registered"}


@app.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserDB).where(UserDB.username == user.username)
    )
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token({"sub": db_user.username})

    # Return role along with token
    return {
        "access_token": token,
        "role": db_user.role,        # <-- add role here
        "username": db_user.username # optional, useful for frontend
    }

# ------------------ TRAINERS ------------------
@app.post("/trainers")
async def add_trainer(trainer: Trainer, db: AsyncSession = Depends(get_db)):
    t = TrainerDB(**trainer.dict())
    db.add(t)
    await db.commit()
    return {"msg": "Trainer added"}

@app.get("/trainers")
async def get_trainers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TrainerDB))
    return result.scalars().all()
@app.put("/trainers/{trainer_id}")
async def update_trainer(trainer_id: int, trainer: Trainer, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TrainerDB).where(TrainerDB.id == trainer_id))
    t = result.scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Trainer not found")
    t.name = trainer.name
    t.specialization = trainer.specialization
    await db.commit()
    return {"msg": "Trainer updated"}

@app.delete("/trainers/{trainer_id}", status_code=200)
async def remove_trainer(trainer_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TrainerDB).where(TrainerDB.id == trainer_id))
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    
    await db.delete(trainer)
    await db.commit()
    return {"msg": f"Trainer {trainer.name} removed successfully"}


# ------------------ ATTENDANCE ------------------
@app.post("/attendance", status_code=status.HTTP_201_CREATED)
async def mark_attendance(att: Attendance, db: AsyncSession = Depends(get_db)):
    # 1. Check if user exists
    result = await db.execute(select(UserDB).where(UserDB.username == att.username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Prevent duplicate attendance for same date
    result = await db.execute(
        select(AttendanceDB).where(
            AttendanceDB.username == att.username,
            AttendanceDB.date == att.date
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    # 3. Save attendance
    record = AttendanceDB(username=att.username, date=att.date, status=att.status)
    db.add(record)
    await db.commit()
    return {"msg": f"Attendance marked for {att.username} on {att.date}"}


@app.get("/attendance")
async def get_attendance(
    username: str = Query(None),  
    db: AsyncSession = Depends(get_db)
):
    if username:
        result = await db.execute(select(AttendanceDB).where(AttendanceDB.username == username))
    else:
        result = await db.execute(select(AttendanceDB))

    records = result.scalars().all()
    return [
        {"id": r.id, "username": r.username, "date": r.date.isoformat(), "status": r.status}
        for r in records
    ]

# ------------------ PAYMENTS ------------------
@app.post("/payments", status_code=status.HTTP_201_CREATED)
async def make_payment(payment: Payment, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(UserDB).where(UserDB.username == payment.username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save payment
    record = PaymentDB(username=payment.username, amount=payment.amount, date=payment.date)
    db.add(record)
    await db.commit()
    return {"msg": f"Payment of ₹{payment.amount} made by {payment.username} on {payment.date}"}


@app.get("/payments")
async def get_payments(username: str = Query(None), db: AsyncSession = Depends(get_db)):
    """
    If username is provided, return payments only for that user.
    """
    if username:
        result = await db.execute(select(PaymentDB).where(PaymentDB.username == username))
    else:
        result = await db.execute(select(PaymentDB))

    records = result.scalars().all()
    return [
        {
            "id": r.id,
            "username": r.username,
            "amount": r.amount,
            "date": r.date.isoformat()
        }
        for r in records
    ]

# ------------------ CHART DATA ------------------
@app.get("/chart-data")
async def chart_data(db: AsyncSession = Depends(get_db)):
    payments = await db.execute(select(PaymentDB))
    attendance = await db.execute(select(AttendanceDB))

    return {
        "total_payments": len(payments.scalars().all()),
        "total_attendance": len(attendance.scalars().all())
    }
