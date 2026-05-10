from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    GEMINI_API_KEY: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()