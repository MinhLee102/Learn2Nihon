from sqlalchemy.orm import Session
from app.models.Mazii.vocab import Example
from app.schemas.Mazii.vocab import ExampleCreate, ExampleUpdate

def create_example(db: Session, example: ExampleCreate):
    db_example = Example(
        jp = example.jp,
        vi = example.vi,
        meaning_detail_id = example.meaning_detail_id
    )
    db.add(db_example)
    db.commit()
    db.refresh(db_example)
    return db_example

def get_example(db: Session, example_id: int):
    return db.query(Example).filter(Example.id == example_id).first()

def get_examples(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Example).offset(skip).limit(limit).all()

def update_example(db: Session, example_id: int, example: ExampleUpdate):
    db_example = db.query(Example).filter(Example.id == example_id).first()
    if not db_example:
        return None
    
    for key, value in example.model_dump(exclude_unset=True).items():
        setattr(db_example, key, value)

    db.commit()
    db.refresh(db_example)
    return db_example

def delete_example(db: Session, example_id: int):
    db_example = db.query(Example).filter(Example.id == example_id).first()
    if not db_example:
        return None
    db.delete(db_example)
    db.commit()
    return db_example