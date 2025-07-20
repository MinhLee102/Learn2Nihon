from fastapi import APIRouter, Depends, status, HTTPException
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

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
#* sau se can nhac khong tra ve user info ma tra ve token, vi token se chua thong tin user, va khi client muon lay thong tin user thi se goi toi endpoint /user/me



# @router.post('/register', status_code=status.HTTP_201_CREATED, response_model=user.UserOut)
# def create_user(user: user.UserCreate, db: Session = Depends(get_db)):
#     # Hash password
#     hashed_password = utils.hash(user.password)
#     user.password = hashed_password

#     new_user = user.User(**user.model_dump())
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return new_user