from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.reading import QuestionCreate, QuestionUpdate, QuestionOut
from app.crud import question as crud_question
from app.database import get_db

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/", response_model=QuestionOut)
def create_question(
    question: QuestionCreate, 
    db: Session = Depends(get_db)
):
    return crud_question.create_question(db=db, question=question)

@router.get("/{question_id}", response_model=QuestionOut)
def get_question(
    question_id: int, 
    db: Session = Depends(get_db)
):
    db_question = crud_question.get_question(db=db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.get("/", response_model=list[QuestionOut])
def get_all_questions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return crud_question.get_questions(db=db, skip=skip, limit=limit)

@router.put("/{question_id}", response_model=QuestionOut)
def update_question(
    question_id: int, 
    question: QuestionUpdate, 
    db: Session = Depends(get_db)
):
    db_question = crud_question.update_question(db=db, question_id=question_id, question=question)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.delete("/{question_id}", response_model=QuestionOut)
def delete_question(
    question_id: int, 
    db: Session = Depends(get_db)
):
    db_question = crud_question.delete_question(db=db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question