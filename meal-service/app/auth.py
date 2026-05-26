import os
from jose import jwt, JWTError

JWT_SECRET = os.getenv("JWT_SECRET", "mysecretkey")
JWT_ALGORITHM = "HS256"


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
