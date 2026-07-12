from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from schemas.schemas import Token
from core.security import create_access_token
import datetime

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mocking standard login for MVP
    # In a real app, verify `form_data.username` and `form_data.password` against the database
    access_token = create_access_token(
        data={"sub": form_data.username, "role": "Fleet Manager"},
        expires_delta=datetime.timedelta(minutes=60)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "Fleet Manager"}
