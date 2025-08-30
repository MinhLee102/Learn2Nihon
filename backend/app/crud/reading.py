from sqlalchemy.orm import Session
from app.models.reading import Reading
from app.schemas.reading import ReadingCreate, ReadingUpdate

def create_reading(db: Session, reading: ReadingCreate):
    db_reading = Reading(
        title=reading.title,
        content=reading.content
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_reading_item_count(db: Session):
    return db.query(Reading).count()

def get_reading(db: Session, reading_id: int):
    return db.query(Reading).filter(Reading.id == reading_id).first()

def get_readings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Reading).offset(skip).limit(limit).all()

def update_reading(db: Session, reading_id: int, reading: ReadingUpdate):
    db_reading = db.query(Reading).filter(Reading.id == reading_id).first()
    if not db_reading:
        return None
    
    for key, value in reading.model_dump().items():
        setattr(db_reading, key, value)
    
    db.commit()
    db.refresh(db_reading)
    return db_reading

def delete_reading(db: Session, reading_id: int):
    db_reading = db.query(Reading).filter(Reading.id == reading_id).first()
    if not db_reading:
        return None
    
    db.delete(db_reading)
    db.commit()
    return db_reading