from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from pwdlib import PasswordHash
from pydantic import BaseModel, Field
from fastapi_mail import FastMail, MessageSchema
from fastapi_mail import MessageType
from pydantic import EmailStr
import secrets
import hashlib
from email_config import conf

import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

from database import engine, Base, get_db
import models

from schemas import (
    UserCreate,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)



load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"

app = FastAPI()


class CommentCreate(BaseModel):
    text: str


class ProfileUpdate(BaseModel):
    name: str
    department: str | None = None
    year: str | None = None
    college: str | None = None

class RatingCreate(BaseModel):
    rating: int= Field(ge=1, le=5)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
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
def profile(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated user profile",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "department": current_user.department,
            "year": current_user.year,
            "college": current_user.college
        }
    }


@app.put("/profile")
def update_profile(
    profile_data: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    name = profile_data.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name cannot be empty."
        )

    current_user.name = name

    current_user.department = (
        profile_data.department.strip()
        if profile_data.department and profile_data.department.strip()
        else None
    )

    current_user.year = (
        profile_data.year.strip()
        if profile_data.year and profile_data.year.strip()
        else None
    )

    current_user.college = (
        profile_data.college.strip()
        if profile_data.college and profile_data.college.strip()
        else None
    )

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "department": current_user.department,
            "year": current_user.year,
            "college": current_user.college
        }
    }



@app.get("/dashboard/stats")
def get_dashboard_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    uploaded_count = db.query(models.Document).filter(
        models.Document.user_id == current_user.id
    ).count()

    saved_count = db.query(models.SavedDocument).filter(
        models.SavedDocument.user_id == current_user.id
    ).count()

    comments_count = db.query(models.Comment).filter(
        models.Comment.user_id == current_user.id
    ).count()

    contributions_count = uploaded_count + comments_count

    return {
        "uploaded_documents": uploaded_count,
        "saved_documents": saved_count,
        "contributions": contributions_count
    }


@app.get("/home/stats")
def get_home_stats(db: Session = Depends(get_db)):
    resources_count = db.query(models.Document).count()

    students_count = db.query(models.User).count()

    departments_count = db.query(
        func.count(distinct(func.trim(models.User.department)))
    ).filter(
        models.User.department.isnot(None),
        func.trim(models.User.department) != ""
    ).scalar()

    return {
        "resources": resources_count,
        "students": students_count,
        "departments": departments_count
    }



@app.get("/documents/{document_id}/rating")
def get_document_rating(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    ratings = db.query(models.Rating).filter(
        models.Rating.document_id == document_id
    )

    average_rating = ratings.with_entities(
        func.avg(models.Rating.rating)
    ).scalar()

    total_ratings = ratings.count()

    user_rating = ratings.filter(
        models.Rating.user_id == current_user.id
    ).with_entities(
        models.Rating.rating
    ).scalar()

    return {
        "average_rating": round(float(average_rating), 1) if average_rating is not None else 0,
        "total_ratings": total_ratings,
        "user_rating": user_rating
    }


@app.post("/documents/{document_id}/rating")
def submit_document_rating(
    document_id: int,
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    existing_rating = db.query(models.Rating).filter(
        models.Rating.document_id == document_id,
        models.Rating.user_id == current_user.id
    ).first()

    if existing_rating:
        existing_rating.rating = rating_data.rating
    else:
        new_rating = models.Rating(
            user_id=current_user.id,
            document_id=document_id,
            rating=rating_data.rating
        )
        db.add(new_rating)

    db.commit()

    return {
        "message": "Rating saved successfully",
        "rating": rating_data.rating
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
                "uploadedBy": db.query(models.User).filter(
                    models.User.id == document.user_id
                ).first().name,
                "file_extension": os.path.splitext(document.file_path)[1].lower(),
                "rating": round(
                                    float(
                                        db.query(func.avg(models.Rating.rating))
                                        .filter(models.Rating.document_id == document.id)
                                        .scalar() or 0
                                    ),
                                    1
                                ),
                "downloads": document.downloads
            }
            for document in documents
        ]
    }


# Download document
@app.get("/documents/{document_id}/download")
def download_document(
    document_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()
    
    print("DOWNLOAD FUNCTION HIT")
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found."
        )

    file_extension = os.path.splitext(document.file_path)[1]

    document.downloads += 1

    print("Downloads before commit:", document.downloads)
    
    db.commit()
    db.refresh(document)
    
    print("Downloads after commit:", document.downloads)

    return FileResponse(
        path=document.file_path,
        filename=f"{document.title}{file_extension}",
        media_type="application/octet-stream"
    )


@app.get("/documents/{document_id}/comments")
def get_comments(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    comments = db.query(models.Comment).filter(
        models.Comment.document_id == document_id
    ).order_by(models.Comment.id.desc()).all()

    result = []

    for comment in comments:
        user = db.query(models.User).filter(
            models.User.id == comment.user_id
        ).first()

        result.append({
            "id": comment.id,
            "text": comment.text,
            "user_id": comment.user_id,
            "name": user.name if user else "Unknown"
        })

    return {"comments": result}


@app.post("/documents/{document_id}/comments")
def create_comment(
    document_id: int,
    comment_data: CommentCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    text = comment_data.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Comment cannot be empty.")

    new_comment = models.Comment(
        text=text,
        user_id=current_user.id,
        document_id=document_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {
        "id": new_comment.id,
        "text": new_comment.text,
        "user_id": current_user.id,
        "name": current_user.name
    }



@app.post("/documents/{document_id}/save")
def save_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    existing_save = db.query(models.SavedDocument).filter(
        models.SavedDocument.user_id == current_user.id,
        models.SavedDocument.document_id == document_id
    ).first()

    if existing_save:
        return {"message": "Document already saved."}

    saved_document = models.SavedDocument(
        user_id=current_user.id,
        document_id=document_id
    )

    db.add(saved_document)
    db.commit()

    return {"message": "Document saved successfully."}


@app.delete("/documents/{document_id}/save")
def unsave_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_document = db.query(models.SavedDocument).filter(
        models.SavedDocument.user_id == current_user.id,
        models.SavedDocument.document_id == document_id
    ).first()

    if saved_document is None:
        raise HTTPException(
            status_code=404,
            detail="Saved document not found."
        )

    db.delete(saved_document)
    db.commit()

    return {"message": "Document removed from saved documents."}



@app.get("/documents/saved")
def get_saved_documents(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_documents = db.query(models.SavedDocument).filter(
        models.SavedDocument.user_id == current_user.id
    ).all()

    document_ids = [item.document_id for item in saved_documents]

    documents = db.query(models.Document).filter(
        models.Document.id.in_(document_ids)
    ).all()

    return {
        "documents": [
            {
                "id": document.id,
                "title": document.title,
                "subject": document.subject
            }
            for document in documents
        ]
    }


@app.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == request.email
    ).first()

    # Do not reveal whether an email is registered
    if user is None:
        return {
            "message": "If this email is registered, a password reset link will be sent."
        }

    # Invalidate previous unused reset tokens
    db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.user_id == user.id,
        models.PasswordResetToken.is_used == False
    ).update({"is_used": True})

    # Generate a secure reset token
    reset_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        reset_token.encode()
    ).hexdigest()

    reset_record = models.PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc).replace(tzinfo=None)
        + timedelta(minutes=30),
        is_used=False
    )

    db.add(reset_record)
    db.commit()

    reset_link = (
        f"{os.getenv('FRONTEND_URL')}/reset-password"
        f"?token={reset_token}"
    )

    message = MessageSchema(
        subject="Academic Hub - Password Reset",
        recipients=[user.email],
        body=f"""
            <h2>Password Reset Request</h2>
            <p>You requested to reset your Academic Hub password.</p>
            <p>
                <a href="{reset_link}">Reset My Password</a>
            </p>
            <p>This link expires in 30 minutes and can only be used once.</p>
            <p>If you did not request this, ignore this email.</p>
        """,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {
        "message": "If this email is registered, a password reset link will be sent."
    }


@app.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    # Hash the token received from the frontend
    token_hash = hashlib.sha256(
        request.token.encode()
    ).hexdigest()

    reset_record = db.query(
        models.PasswordResetToken
    ).filter(
        models.PasswordResetToken.token_hash == token_hash,
        models.PasswordResetToken.is_used == False
    ).first()

    # Reject invalid or already-used tokens
    if reset_record is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    # Check token expiry
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)

    if reset_record.expires_at <= current_time:
        reset_record.is_used = True
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    # Find the user
    user = db.query(models.User).filter(
        models.User.id == reset_record.user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    # Update the password using the existing hashing system
    user.password = password_hash.hash(request.new_password)

    # Mark this token as used
    reset_record.is_used = True

    # Invalidate other reset tokens belonging to this user
    db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.user_id == user.id,
        models.PasswordResetToken.is_used == False
    ).update({"is_used": True})

    db.commit()

    return {
        "message": "Password reset successful. Please log in with your new password."
    }


