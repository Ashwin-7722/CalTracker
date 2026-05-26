from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta
from app.database import engine, Base, get_db
from app.models import Meal
from app.auth import decode_access_token

# Create tables (meals table already exists via meal-service, but safe to call)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Calorie Service",
    description="Handles calorie analytics, daily summaries, and weekly reports",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_user_id_from_token(token: str = Query(None)):
    """Extract user ID from JWT token."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return int(payload["sub"])


@app.get("/health")
def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "service": "calorie-service"}


@app.get("/calories/today")
def get_today_calories(
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Get calorie summary for today."""
    today = datetime.utcnow().date()
    meals = db.query(Meal).filter(
        Meal.user_id == user_id,
        cast(Meal.meal_time, Date) == today
    ).all()

    total_calories = sum(m.calories for m in meals)
    total_protein = sum(m.protein for m in meals)
    total_carbs = sum(m.carbs for m in meals)
    total_fat = sum(m.fat for m in meals)

    return {
        "date": str(today),
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
        "meal_count": len(meals),
        "meals": [
            {
                "id": m.id,
                "food_name": m.food_name,
                "calories": m.calories,
                "protein": m.protein,
                "carbs": m.carbs,
                "fat": m.fat,
                "meal_time": str(m.meal_time)
            }
            for m in meals
        ]
    }


@app.get("/calories/week")
def get_week_calories(
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Get calorie summary for the past 7 days."""
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=6)

    daily_data = []
    for i in range(7):
        day = week_ago + timedelta(days=i)
        meals = db.query(Meal).filter(
            Meal.user_id == user_id,
            cast(Meal.meal_time, Date) == day
        ).all()

        daily_data.append({
            "date": str(day),
            "day_name": day.strftime("%A"),
            "total_calories": sum(m.calories for m in meals),
            "total_protein": sum(m.protein for m in meals),
            "total_carbs": sum(m.carbs for m in meals),
            "total_fat": sum(m.fat for m in meals),
            "meal_count": len(meals)
        })

    total_calories = sum(d["total_calories"] for d in daily_data)
    avg_calories = total_calories // 7 if daily_data else 0

    return {
        "period": f"{week_ago} to {today}",
        "total_calories": total_calories,
        "average_daily_calories": avg_calories,
        "daily_breakdown": daily_data
    }


@app.get("/calories/month")
def get_month_calories(
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Get calorie summary for the past 30 days."""
    today = datetime.utcnow().date()
    month_ago = today - timedelta(days=29)

    daily_data = []
    for i in range(30):
        day = month_ago + timedelta(days=i)
        meals = db.query(Meal).filter(
            Meal.user_id == user_id,
            cast(Meal.meal_time, Date) == day
        ).all()

        daily_data.append({
            "date": str(day),
            "total_calories": sum(m.calories for m in meals),
            "total_protein": sum(m.protein for m in meals),
            "total_carbs": sum(m.carbs for m in meals),
            "total_fat": sum(m.fat for m in meals),
            "meal_count": len(meals)
        })

    total_calories = sum(d["total_calories"] for d in daily_data)
    avg_calories = total_calories // 30 if daily_data else 0

    return {
        "period": f"{month_ago} to {today}",
        "total_calories": total_calories,
        "average_daily_calories": avg_calories,
        "daily_breakdown": daily_data
    }
