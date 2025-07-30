from sqlalchemy.orm import Session
from app.models.reading_item import ReadingItem
from app.schemas.reading_item import ReadingItemCreate, ReadingItemUpdate

def create_reading_item(db: Session, item: ReadingItemCreate):
    db_item = ReadingItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_reading_item(db: Session, item_id: int):
    return db.query(ReadingItem).filter(ReadingItem.id == item_id).first()

def get_reading_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ReadingItem).offset(skip).limit(limit).all()

def update_reading_item(db: Session, item_id: int, item: ReadingItemUpdate):
    db_item = db.query(ReadingItem).filter(ReadingItem.id == item_id).first()
    if not db_item:
        return None
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_reading_item(db: Session, item_id: int):
    db_item = db.query(ReadingItem).filter(ReadingItem.id == item_id).first()
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item
