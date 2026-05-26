from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MealCreate(BaseModel):
    """Schema for creating a new meal."""
    food_name: str
    calories: int
    protein: int = 0
    carbs: int = 0
    fat: int = 0


class MealUpdate(BaseModel):
    """Schema for updating an existing meal."""
    food_name: Optional[str] = None
    calories: Optional[int] = None
    protein: Optional[int] = None
    carbs: Optional[int] = None
    fat: Optional[int] = None


class MealResponse(BaseModel):
    """Schema for meal response."""
    id: int
    user_id: int
    food_name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    meal_time: Optional[datetime] = None

    class Config:
        from_attributes = True
