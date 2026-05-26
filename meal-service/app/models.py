from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Meal(Base):
    """Meal model for tracking food intake and nutrition."""
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    food_name = Column(String(255), nullable=False)
    calories = Column(Integer, nullable=False, default=0)
    protein = Column(Integer, nullable=False, default=0)
    carbs = Column(Integer, nullable=False, default=0)
    fat = Column(Integer, nullable=False, default=0)
    meal_time = Column(DateTime, server_default=func.now())
