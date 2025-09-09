from sqlalchemy.orm import Session
from app.models.Mazii.vocab import Meaning_detail
from app.schemas.Mazii.vocab import MeaningCreate, MeaningUpdate

def create_meaning(db: Session, meaning: MeaningCreate):
    db_meaning = Meaning_detail(
        meaning = meaning.meaning,
        vocab_id = meaning.vocab_id
    )
    db.add(db_meaning)
    db.commit()
    db.refresh(db_meaning)
    return db_meaning

def get_meaning(db: Session, meaning_id: int):
    return db.query(Meaning_detail).filter(Meaning_detail.id == meaning_id).first()

def get_meanings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Meaning_detail).offset(skip).limit(limit).all()

def update_meaning(db: Session, meaning_id: int, meaning: MeaningUpdate):
    db_meaning = db.query(Meaning_detail).filter(Meaning_detail.id == meaning_id).first()
    if not db_meaning:
        return None
    
    for key, value in meaning.model_dump(exclude_unset=True).items():
        setattr(db_meaning, key, value)

    db.commit()
    db.refresh(db_meaning)
    return db_meaning

def delete_meaning(db: Session, meaning_id: int):
    db_meaning = db.query(Meaning_detail).filter(Meaning_detail.id == meaning_id).first()
    if not db_meaning:
        return None
    
    db.delete(db_meaning)
    db.commit()
    return db_meaning