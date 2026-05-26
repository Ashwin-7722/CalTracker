from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.auth import hash_password, verify_password, create_access_token, decode_access_token

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="User Service",
    description="Handles user registration, login, and authentication",
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


@app.get("/health")
def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "service": "user-service"}


@app.post("/users/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(db_user.id), "email": db_user.email})
    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(db_user)
    )


@app.post("/users/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": str(db_user.id), "email": db_user.email})
    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(db_user)
    )


@app.get("/users/profile", response_model=UserResponse)
def get_profile(token: str = None, db: Session = Depends(get_db)):
    """Get current user profile from JWT token."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token required"
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse.model_validate(user)
