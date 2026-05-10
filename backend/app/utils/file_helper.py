import os

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = [".pdf"]
MAX_FILE_SIZE_MB = 50

def is_valid_pdf(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def save_upload_file(file_bytes: bytes, filename: str) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    return file_path

def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)