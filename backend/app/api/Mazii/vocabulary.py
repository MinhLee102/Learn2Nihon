from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.Mazii.vocabulary import VocabularyCreate, VocabularyUpdate, VocabularyOut
from app.crud.Mazii import vocabulary as crud_vocab
from app.database import get_db

router = APIRouter(prefix="/vocabs", tags=["vocabs"])

@router.post("/", response_model=VocabularyOut)
def create_vocab(
    vocab: VocabularyCreate,
    db: Session = Depends(get_db)
):
    return crud_vocab.create_vocab(db=db, vocab=vocab)

@router.get("/{vocab_id}", response_model=VocabularyOut)
def get_vocab(
    vocab_id: int,
    db: Session = Depends(get_db)
):
    db_vocab = crud_vocab.get_vocab(db=db, vocab_id=vocab_id)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocab not found")
    return db_vocab

@router.get("/", response_model=list[VocabularyOut])
def get_all_vocabs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_vocab.get_vocabs(db=db, skip=skip, limit=limit)

@router.put("/{vocab_id}", response_model=VocabularyOut)
def update_vocab(
    vocab_id: int,
    vocab: VocabularyUpdate,
    db: Session = Depends(get_db)
):
    db_vocab = crud_vocab.update_vocab(db=db, vocab_id=vocab_id, vocab=vocab)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocab not found")
    return db_vocab

@router.delete("/{vocab_id}", response_model=VocabularyOut)
def delete_vocab(
    vocab_id: int,
    db: Session = Depends(get_db)
):
    db_vocab = crud_vocab.delete_vocab(db=db, vocab_id=vocab_id)
    if not db_vocab:
        raise HTTPException(status_code=404, detail="Vocab not found")
    return db_vocab