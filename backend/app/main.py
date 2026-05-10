from fastapi import FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongo import db
from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.history import router as history_router

security = HTTPBearer()

app = FastAPI(title="SumifyX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # specific origin, not *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {"message": "SumifyX backend is running!"}

@app.get("/test-db")
def test_db():
    try:
        db.command("ping")
        return {"message": "MongoDB connected successfully!"}
    except Exception as e:
        return {"error": str(e)}