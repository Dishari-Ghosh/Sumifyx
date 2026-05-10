from fastapi import APIRouter, HTTPException
from app.models.user import UserSignup, UserLogin
from app.utils.auth_helper import hash_password, verify_password, create_access_token
from app.db.mongo import db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: UserSignup):
    # Check if email already exists
    existing = db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and save user
    hashed = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed
    }
    result = db["users"].insert_one(new_user)

    # Generate token
    token = create_access_token({"sub": str(result.inserted_id)})

    return {
        "message": "Account created successfully!",
        "token": token,
        "user": {
            "name": user.name,
            "email": user.email
        }
    }

@router.post("/login")
def login(user: UserLogin):
    # Find user by email
    existing = db["users"].find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify password
    if not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Generate token
    token = create_access_token({"sub": str(existing["_id"])})

    return {
        "message": "Login successful!",
        "token": token,
        "user": {
            "name": existing["name"],
            "email": existing["email"]
        }
    }