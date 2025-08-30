from sqlalchemy.orm import Session
from app.models.reading import Answer
from app.schemas.reading import AnswerCreate, AnswerUpdate

def create_answer(db: Session, answer: AnswerCreate):
    db_answer = Answer(
        answer_text=answer.answer_text,
        is_correct=answer.is_correct,
        question_id=answer.question_id
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def get_answer(db: Session, answer_id: int):
    return db.query(Answer).filter(Answer.id == answer_id).first()

def get_answers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Answer).offset(skip).limit(limit).all()

def update_answer(db: Session, answer_id: int, answer: AnswerUpdate):
    db_answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not db_answer:
        return None
    
    for key, value in answer.model_dump().items():
        setattr(db_answer, key, value)
    
    db.commit()
    db.refresh(db_answer)
    return db_answer

def delete_answer(db: Session, answer_id: int):
    db_answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not db_answer:
        return None
    
    db.delete(db_answer)
    db.commit()
    return db_answer