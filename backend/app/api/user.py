from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import *
from app.crud import user as crud_user
from app.database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserOut)
def create_user(
    user: UserCreate, db: Session = Depends(get_db)
):
    return crud_user.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int, db: Session = Depends(get_db)
):
    db_user = crud_user.get_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/", response_model=list[UserOut])
def get_all_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return crud_user.get_users(db=db, skip=skip, limit=limit)

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, user: UserUpdate, db: Session = Depends(get_db)
):
    db_user = crud_user.update_user(db=db, user_id=user_id, user=user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}", response_model=UserOut)
def delete_user(
    user_id: int, db: Session = Depends(get_db)
):
    db_user = crud_user.delete_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user