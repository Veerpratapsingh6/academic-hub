from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

from database import engine, Base, get_db
import models
from schemas import UserCreate, UserLogin


load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

password_hash = PasswordHash.recommended()


def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token

def verify_access_token(token: str):

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return int(user_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user_id = verify_access_token(credentials.credentials)

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Academic Hub Backend is Running"}

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_valid = password_hash.verify(
        user.password,
        existing_user.password
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(existing_user.id)

    return {
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": existing_user.id,
        "name": existing_user.name,
        "email": existing_user.email
    }
}

@app.get("/profile")
def profile(current_user = Depends(get_current_user)):

    return {
        "message": "Authenticated user profile",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }


@app.post("/documents/upload")
def upload_document(
    title: str = Form(...),
    subject: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed_extensions = {".pdf", ".doc", ".docx"}

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC, and DOCX files are allowed."
        )

    if not title.strip() or not subject.strip() or not description.strip():
        raise HTTPException(
            status_code=400,
            detail="All fields are required."
        )

    file_content = file.file.read()

    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5 MB."
        )

    safe_filename = f"{datetime.now(timezone.utc).timestamp()}_{os.path.basename(file.filename)}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as uploaded_file:
        uploaded_file.write(file_content)

    new_document = models.Document(
        title=title.strip(),
        subject=subject.strip(),
        description=description.strip(),
        file_path=file_path,
        user_id=current_user.id
    )

    try:
        db.add(new_document)
        db.commit()
        db.refresh(new_document)
    except Exception:
        db.rollback()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail="Could not save document."
        )
    finally:
        file.file.close()

    return {
        "message": "Document uploaded successfully!",
        "document": {
            "id": new_document.id,
            "title": new_document.title,
            "subject": new_document.subject,
            "description": new_document.description,
            "user_id": new_document.user_id
        }
    }


@app.get("/documents")
def get_documents(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = db.query(models.Document).order_by(
        models.Document.id.desc()
    ).all()

    return {
        "documents": [
            {
                "id": document.id,
                "title": document.title,
                "subject": document.subject,
                "description": document.description,
                "rating": 0,
                "downloads": 0
            }
            for document in documents
        ]
    }

