from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import date, timedelta

from . import oauth2
from ..schemas import token as token_schema
from ..models import user as user_model
from ..database import get_db
from .. import utils

router = APIRouter(
    tags=['Authentication']
)

def update_user_streak(db: Session, user: user_model.User):
    today = date.today()
    
    # Nếu user chưa đăng nhập lần nào (last_login_date là None)
    if user.last_login_date is None:
        user.current_streak = 1
    else:
        # Nếu đã đăng nhập trong hôm nay rồi thì không làm gì cả
        if user.last_login_date == today:
            return
        
        # Nếu ngày đăng nhập cuối là hôm qua -> chuỗi tiếp tục
        yesterday = today - timedelta(days=1)
        if user.last_login_date == yesterday:
            user.current_streak += 1 # type: ignore
        # Nếu không phải hôm qua -> chuỗi bị ngắt, reset
        else:
            user.current_streak = 1
            
    # Luôn cập nhật ngày đăng nhập cuối thành hôm nay
    user.last_login_date = today
    
    db.commit()
    db.refresh(user)

@router.post('/login/', response_model=token_schema.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(
        user_model.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Invalid Credentials")

    if not user.is_verified: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Account not verified yet")

    if not utils.verify(user_credentials.password, str(user.password)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Invalid Credentials")
    
    update_user_streak(db=db, user=user)
    access_token = oauth2.create_access_token(data={"user_id": user.id})
    refresh_token = oauth2.create_refresh_token(data={"user_id": user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "current_streak": user.current_streak
    }

@router.post('/logout/')
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}