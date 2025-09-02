from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.reading import AnswerCreate, AnswerUpdate, AnswerOut
from app.crud import answer as crud_answer
from app.database import get_db

router = APIRouter(prefix="/answers", tags=["answers"])

@router.post("/", response_model=AnswerOut)
def create_answer(
    answer: AnswerCreate, 
    db: Session = Depends(get_db)
):
    return crud_answer.create_answer(db=db, answer=answer)

@router.get("/{answer_id}", response_model=AnswerOut)
def get_answer(
    answer_id: int, 
    db: Session = Depends(get_db)
):
    db_answer = crud_answer.get_answer(db=db, answer_id=answer_id)
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return db_answer

@router.get("/", response_model=list[AnswerOut])
def get_all_answers(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return crud_answer.get_answers(db=db, skip=skip, limit=limit)

@router.put("/{answer_id}", response_model=AnswerOut)
def update_answer(
    answer_id: int, 
    answer: AnswerUpdate, 
    db: Session = Depends(get_db)
):
    db_answer = crud_answer.update_answer(db=db, answer_id=answer_id, answer=answer)
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return db_answer

@router.delete("/{answer_id}", response_model=AnswerOut)
def delete_answer(
    answer_id: int, 
    db: Session = Depends(get_db)
):
    db_answer = crud_answer.delete_answer(db=db, answer_id=answer_id)
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return db_answer