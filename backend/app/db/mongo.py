from pymongo import MongoClient
from app.config import settings
client = MongoClient(
    settings.MONGODB_URI,
    tls=True,
    tlsAllowInvalidCertificates=True
)
db = client["sumifyx"]
