from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.reading import ReadingCreate, ReadingUpdate, ReadingOut
from app.crud import reading as crud_reading
from app.database import get_db

router = APIRouter(prefix="/readings", tags=["readings"])

@router.post("/", response_model=ReadingOut)
def create_reading(
    reading: ReadingCreate, 
    db: Session = Depends(get_db)
):
    return crud_reading.create_reading(db=db, reading=reading)

@router.get("/count", response_model=int)
def get_reading_count(db: Session = Depends(get_db)):
    return crud_reading.get_reading_item_count(db=db)

@router.get("/{reading_id}", response_model=ReadingOut)
def get_reading(
    reading_id: int, 
    db: Session = Depends(get_db)
):
    db_reading = crud_reading.get_reading(db=db, reading_id=reading_id)
    if not db_reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    return db_reading

@router.get("/", response_model=list[ReadingOut])
def get_all_readings(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return crud_reading.get_readings(db=db, skip=skip, limit=limit)

@router.put("/{reading_id}", response_model=ReadingOut)
def update_reading(
    reading_id: int, 
    reading: ReadingUpdate, 
    db: Session = Depends(get_db)
):
    db_reading = crud_reading.update_reading(db=db, reading_id=reading_id, reading=reading)
    if not db_reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    return db_reading

@router.delete("/{reading_id}", response_model=ReadingOut)
def delete_reading(
    reading_id: int, 
    db: Session = Depends(get_db)
):
    db_reading = crud_reading.delete_reading(db=db, reading_id=reading_id)
    if not db_reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    return db_reading