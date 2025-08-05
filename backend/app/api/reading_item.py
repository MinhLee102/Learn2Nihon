from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.reading_item import *
from app.crud import reading_item as crud_reading_item
from app.database import get_db

router = APIRouter(prefix="/reading-items", tags=["reading_items"])

@router.post("/", response_model=ReadingItemOut)
def create_item(item: ReadingItemCreate, db: Session = Depends(get_db)):
    return crud_reading_item.create_reading_item(db=db, item=item)

@router.get("/{item_id}", response_model=ReadingItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud_reading_item.get_reading_item(db=db, item_id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Reading item not found")
    return db_item

@router.get("/", response_model=list[ReadingItemOut])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_reading_item.get_reading_items(db=db, skip=skip, limit=limit)

@router.put("/{item_id}", response_model=ReadingItemOut)
def update_item(item_id: int, item: ReadingItemUpdate, db: Session = Depends(get_db)):
    db_item = crud_reading_item.update_reading_item(db=db, item_id=item_id, item=item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Reading item not found")
    return db_item

@router.delete("/{item_id}", response_model=ReadingItemOut)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud_reading_item.delete_reading_item(db=db, item_id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Reading item not found")
    return db_item
