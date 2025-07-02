from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..schemas import user

from ..models import user
from ..database import get_db
from .. import utils

router = APIRouter(
    tags=['login', 'register']
)

@router.post('/login', response_model=user.UserOut)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(user.User).filter(
        user.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")
    if not utils.verify(user_credentials.password, str(user.password)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")

    return {'Valid credential': user}   # Fix later, what should i return here:))


@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=user.UserOut)
def create_user(user: user.UserCreate, db: Session = Depends(get_db)):
    # Hash password
    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = user.User(user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user