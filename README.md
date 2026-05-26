# 🔥 CalTrack - Advanced Microservices-Based Calorie Tracker Platform

## Using React, FastAPI, PostgreSQL, Docker, GitHub Actions, Jenkins

---

## 📋 Project Overview

CalTrack is a **full-stack microservices-based calorie tracking platform** built to demonstrate DevOps concepts including containerization, orchestration, and CI/CD automation. The application allows users to register, log meals, track calories/macros, and view analytics through a modern React dashboard.

### Key Technologies
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Auth | JWT (JSON Web Tokens) |
| Containerization | Docker |
| Orchestration | Docker Compose |
| CI/CD | GitHub Actions + Jenkins |

---

## 🏗️ System Architecture

```
                     ┌────────────────────┐
                     │ React Frontend     │
                     │ Vite + Nginx       │
                     └─────────┬──────────┘
                               │ Port 3000
                               ▼
                     ┌────────────────────┐
                     │ API Gateway        │
                     │ FastAPI            │
                     └─────────┬──────────┘
                               │ Port 8000
       ┌───────────────────────┼──────────────────────────┐
       │                       │                          │
       ▼                       ▼                          ▼
┌───────────────┐     ┌───────────────┐     ┌────────────────┐
│ User Service  │     │ Meal Service  │     │ Calorie Service│
│ Port 8001     │     │ Port 8002     │     │ Port 8003      │
└───────────────┘     └───────────────┘     └────────────────┘
       │                       │                          │
       └───────────────────────┼──────────────────────────┘
                               ▼
                      ┌────────────────┐
                      │ PostgreSQL DB  │
                      │ Port 5432      │
                      └────────────────┘
```

---

## 📁 Project Structure

```
calorie-tracker/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/             # API client (axios)
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   └── pages/           # Page components
│   ├── Dockerfile
│   └── nginx.conf
├── api-gateway/             # FastAPI API Gateway
│   ├── app/main.py
│   ├── Dockerfile
│   └── requirements.txt
├── user-service/            # User Auth Microservice
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   └── database.py
│   ├── Dockerfile
│   └── requirements.txt
├── meal-service/            # Meal CRUD Microservice
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── calorie-service/         # Calorie Analytics Microservice
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── .github/workflows/ci.yml # GitHub Actions CI/CD
├── Jenkinsfile              # Jenkins Pipeline
├── docker-compose.yml       # Docker Compose
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Quick Start with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/your-username/calorie-tracker.git
cd calorie-tracker

# 2. Build and start all services
docker compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8000
# API Docs: http://localhost:8001/docs (User Service)
```

### Local Development (Without Docker)

```bash
# Terminal 1 - Start PostgreSQL (or use Docker)
docker run -d --name postgres -e POSTGRES_DB=calorie_tracker \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# Terminal 2 - User Service
cd user-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# Terminal 3 - Meal Service
cd meal-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload

# Terminal 4 - Calorie Service
cd calorie-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload

# Terminal 5 - API Gateway
cd api-gateway
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 6 - Frontend
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Architecture

| Container | Image | Port | Purpose |
|---|---|---|---|
| frontend-container | Node/Nginx | 3000:80 | React SPA |
| gateway-container | Python 3.11 | 8000 | API Routing |
| user-service-container | Python 3.11 | 8001 | Authentication |
| meal-service-container | Python 3.11 | 8002 | Meal CRUD |
| calorie-service-container | Python 3.11 | 8003 | Analytics |
| postgres-container | PostgreSQL 15 | 5432 | Database |

### Docker Commands
```bash
docker compose up --build      # Build & start
docker compose down            # Stop all
docker compose ps              # List containers
docker compose logs -f         # View logs
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)
- **Backend Job**: Installs Python deps, runs flake8 linting
- **Frontend Job**: Installs Node deps, builds React app
- **Docker Job**: Builds all Docker Compose images

### Jenkins (`Jenkinsfile`)
- Clone → Install Deps → Build Frontend → Build Docker → Deploy → Health Check

---

## 📡 API Endpoints

### User Service (Port 8001)
| Method | Endpoint | Description |
|---|---|---|
| POST | /users/register | Register new user |
| POST | /users/login | Login & get JWT |
| GET | /users/profile | Get user profile |

### Meal Service (Port 8002)
| Method | Endpoint | Description |
|---|---|---|
| POST | /meals | Create meal |
| GET | /meals | Get all meals |
| PUT | /meals/{id} | Update meal |
| DELETE | /meals/{id} | Delete meal |

### Calorie Service (Port 8003)
| Method | Endpoint | Description |
|---|---|---|
| GET | /calories/today | Today's summary |
| GET | /calories/week | Weekly report |
| GET | /calories/month | Monthly report |

---

## 🔐 Authentication Flow

1. User registers/logs in via frontend
2. User Service validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token attached as query param to API requests
6. Gateway forwards requests with token to services

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    food_name VARCHAR(255),
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    meal_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 👨‍💻 Course Information

- **Course**: INT332 - DevOps Virtualization & Configuration Management
- **University**: Lovely Professional University, Punjab
- **Technologies Demonstrated**: Docker, Docker Compose, GitHub Actions, Jenkins, Microservices, CI/CD

---

## 📄 License

This project is created for educational purposes as part of the INT332 DevOps course.
