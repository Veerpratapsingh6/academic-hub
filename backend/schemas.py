from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Name cannot be empty.")

        if not value.replace(" ", "").isalpha():
            raise ValueError("Name must contain only letters and spaces.")

        return value

    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")

        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one capital letter.")

        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one small letter.")

        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one number.")

        if not any(not char.isalnum() for char in value):
            raise ValueError("Password must contain at least one special symbol.")

        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr




class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value):
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one capital letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one small letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not any(not char.isalnum() for char in value):
            raise ValueError(
                "Password must contain at least one special symbol."
            )

        return value
