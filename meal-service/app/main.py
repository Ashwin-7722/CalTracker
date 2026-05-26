from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app.database import engine, Base, get_db
from app.models import Meal
from app.schemas import MealCreate, MealUpdate, MealResponse
from app.auth import decode_access_token

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meal Service",
    description="Handles meal CRUD operations and meal history",
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
    return {"status": "healthy", "service": "meal-service"}


@app.post("/meals", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
def create_meal(
    meal: MealCreate,
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Create a new meal entry for the authenticated user."""
    db_meal = Meal(
        user_id=user_id,
        food_name=meal.food_name,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return MealResponse.model_validate(db_meal)


@app.get("/meals", response_model=List[MealResponse])
def get_meals(
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Get all meals for the authenticated user."""
    meals = db.query(Meal).filter(Meal.user_id == user_id).order_by(Meal.meal_time.desc()).all()
    return [MealResponse.model_validate(m) for m in meals]


@app.put("/meals/{meal_id}", response_model=MealResponse)
def update_meal(
    meal_id: int,
    meal_update: MealUpdate,
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Update an existing meal entry."""
    db_meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == user_id).first()
    if not db_meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    update_data = meal_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_meal, key, value)

    db.commit()
    db.refresh(db_meal)
    return MealResponse.model_validate(db_meal)


@app.delete("/meals/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    user_id: int = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
):
    """Delete a meal entry."""
    db_meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == user_id).first()
    if not db_meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )
    db.delete(db_meal)
    db.commit()
