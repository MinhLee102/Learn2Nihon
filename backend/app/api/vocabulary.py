from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.vocabulary import *
from app.crud import vocabulary as crud_vocabulary
from app.database import get_db

router = APIRouter(prefix="/vocabularies", tags=["vocabularies"])

@router.post("/", response_model=VocabularyOut)
def create_vocab(
    vocab: VocabularyCreate, db: Session = Depends(get_db)
):
    return crud_vocabulary.create_vocabulary(db=db, vocab=vocab)

@router.get("/{vocab_id}", response_model=VocabularyOut)
def get_vocab(
    vocab_id: int, db: Session = Depends(get_db)
):
    db_vocab = crud_vocabulary.get_vocabulary(db=db, vocab_id=vocab_id)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return db_vocab

@router.get("/", response_model=list[VocabularyOut])
def get_all_vocab(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return crud_vocabulary.get_vocabularies(db=db, skip=skip, limit=limit)

@router.put("/{vocab_id}", response_model=VocabularyOut)
def update_vocab(
    vocab_id: int, vocab: VocabularyUpdate, db: Session = Depends(get_db)
):
    db_vocab = crud_vocabulary.update_vocabulary(db=db, vocab_id=vocab_id, vocab=vocab)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return db_vocab

@router.delete("/{vocab_id}", response_model=VocabularyOut)
def delete_vocab(
    vocab_id: int, db: Session = Depends(get_db)
):
    db_vocab = crud_vocabulary.delete_vocabulary(db=db, vocab_id=vocab_id)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return db_vocab
