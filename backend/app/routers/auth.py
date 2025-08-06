from fastapi import APIRouter, Depends, status, HTTPException, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import oauth2
from ..schemas import token as token_schema
from ..models import user as user_model
from ..database import get_db
from .. import utils

router = APIRouter(
    tags=['Authentication']
)

@router.post('/login', response_model=token_schema.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(
        user_model.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Invalid Credentials")
    
    if not utils.verify(user_credentials.password, str(user.password)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Invalid Credentials")
    
    access_token = oauth2.create_access_token(data={"user_id": user.id})
    refresh_token = oauth2.create_refresh_token(data={"user_id": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

@router.post('/refresh', response_model=token_schema.Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate refresh token',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    token_data = oauth2.verify_refresh_token(refresh_token, credentials_exception)
    user = db.query(user_model.User).filter(user_model.User.id == token_data.id).first()
    if not user:
        raise credentials_exception
    access_token = oauth2.create_access_token(data={"user_id": user.id})
    new_refresh_token = oauth2.create_refresh_token(data={"user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": new_refresh_token
    }

@router.get("/test-access-token")
def test_access_token(current_user: user_model.User = Depends(oauth2.get_current_user)):
    return {"user_id": current_user.id, "username": current_user.username}

@router.post("/test-refresh-token")
def test_refresh_token(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate refresh token',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise credentials_exception
    refresh_token = auth_header.split(" ")[1]
    token_data = oauth2.verify_refresh_token(refresh_token, credentials_exception)
    user = db.query(user_model.User).filter(user_model.User.id == token_data.id).first()
    if not user:
        raise credentials_exception
    return {"user_id": user.id, "username": user.username}



