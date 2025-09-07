from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.Mazii.vocab import MeaningCreate, MeaningUpdate, MeaningOut
from app.crud.Mazii import meaning as crud_meaning
from app.database import get_db

router = APIRouter(prefix="/meanings", tags=["meanings"])

@router.post("/", response_model=MeaningOut)
def create_meaning(
    meaning: MeaningCreate,
    db: Session = Depends(get_db)
):
    return crud_meaning.create_meaning(db=db, meaning=meaning)

@router.get("/{meaning_id}", response_model=MeaningOut)
def get_meaning(
    meaning_id: int,
    db: Session = Depends(get_db)
):
    db_meaning = crud_meaning.get_meaning(db=db, meaning_id=meaning_id)
    if not db_meaning:
        raise HTTPException(status_code=404, detail="Meaning not found")
    return db_meaning

@router.get("/", response_model=list[MeaningOut])
def get_all_meanings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_meaning.get_meanings(db=db, skip=skip, limit=limit)

@router.put("/{meaning_id}", response_model=MeaningOut)
def update_meaning(
    meaning_id: int,
    meaning: MeaningUpdate,
    db: Session = Depends(get_db)
):
    db_meaning = crud_meaning.update_meaning(db=db, meaning_id=meaning_id, meaning=meaning)
    if not db_meaning:
        raise HTTPException(status_code=404, detail="Meaning not found")
    return db_meaning

@router.delete("/{meaning_id}", response_model=MeaningOut)
def delete_meaning(
    meaning_id: int,
    db: Session = Depends(get_db)
):
    db_meaning = crud_meaning.delete_meaning(db=db, meaning_id=meaning_id)
    if not db_meaning:
        raise HTTPException(status_code=404, detail="Meaning not found")
    return db_meaning