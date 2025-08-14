from sqlalchemy.orm import Session
from app.models.reading import Question
from app.schemas.reading import QuestionCreate, QuestionUpdate

def create_question(db: Session, question: QuestionCreate):
    db_question = Question(
        question_text=question.question_text,
        explanation=question.explanation,
        reading_id=question.reading_id
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_question(db: Session, question_id: int):
    return db.query(Question).filter(Question.id == question_id).first()

def get_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Question).offset(skip).limit(limit).all()

def update_question(db: Session, question_id: int, question: QuestionUpdate):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        return None
    
    for key, value in question.model_dump().items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        return None
    
    db.delete(db_question)
    db.commit()
    return db_question