import os
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API Gateway",
    description="Central API Gateway for routing requests to microservices",
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

# Service URLs (Docker Compose service names)
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8001")
MEAL_SERVICE_URL = os.getenv("MEAL_SERVICE_URL", "http://meal-service:8002")
CALORIE_SERVICE_URL = os.getenv("CALORIE_SERVICE_URL", "http://calorie-service:8003")


@app.get("/health")
def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "service": "api-gateway"}


# ---------- User Service Routes ----------

@app.post("/api/users/register")
async def register(request: Request):
    """Proxy user registration to user service."""
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/users/register", json=body)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.post("/api/users/login")
async def login(request: Request):
    """Proxy user login to user service."""
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/users/login", json=body)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.get("/api/users/profile")
async def get_profile(request: Request):
    """Proxy profile request to user service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{USER_SERVICE_URL}/users/profile", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


# ---------- Meal Service Routes ----------

@app.post("/api/meals")
async def create_meal(request: Request):
    """Proxy meal creation to meal service."""
    body = await request.json()
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{MEAL_SERVICE_URL}/meals", json=body, params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.get("/api/meals")
async def get_meals(request: Request):
    """Proxy get meals to meal service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{MEAL_SERVICE_URL}/meals", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.put("/api/meals/{meal_id}")
async def update_meal(meal_id: int, request: Request):
    """Proxy meal update to meal service."""
    body = await request.json()
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{MEAL_SERVICE_URL}/meals/{meal_id}", json=body, params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.delete("/api/meals/{meal_id}")
async def delete_meal(meal_id: int, request: Request):
    """Proxy meal deletion to meal service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{MEAL_SERVICE_URL}/meals/{meal_id}", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


# ---------- Calorie Service Routes ----------

@app.get("/api/calories/today")
async def get_today_calories(request: Request):
    """Proxy today's calorie request to calorie service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CALORIE_SERVICE_URL}/calories/today", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.get("/api/calories/week")
async def get_week_calories(request: Request):
    """Proxy weekly calorie request to calorie service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CALORIE_SERVICE_URL}/calories/week", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")


@app.get("/api/calories/month")
async def get_month_calories(request: Request):
    """Proxy monthly calorie request to calorie service."""
    params = dict(request.query_params)
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CALORIE_SERVICE_URL}/calories/month", params=params)
    return Response(content=response.content, status_code=response.status_code,
                    media_type="application/json")
