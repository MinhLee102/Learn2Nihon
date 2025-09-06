from sqlalchemy.orm import Session
from backend.app.models.Mazii.mazii_vocab import Mazii_vocabulary
from app.schemas.Mazii.vocabulary import VocabularyCreate, VocabularyUpdate

def create_vocab(db: Session, vocab: VocabularyCreate):
    db_vocab = Mazii_vocabulary(
        word = vocab.word,
        phonetic = vocab.phonetic,
        han_viet = vocab.han_viet,
        pronunciation = vocab.pronunciation,
        type_word = vocab.type_word
    )
    db.add(db_vocab)
    db.commit()
    db.refresh(db_vocab)
    return db_vocab

def get_vocab(db: Session, vocab_id: int):
    return db.query(Mazii_vocabulary).filter(Mazii_vocabulary.id == vocab_id).first()

def get_vocabs(db: Session, skip: int  = 0, limit: int = 100):
    return db.query(Mazii_vocabulary).offset(skip).limit(limit).all()

def update_vocab(db: Session, vocab_id: int, vocab: VocabularyUpdate):
    db_vocab = db.query(Mazii_vocabulary).filter(Mazii_vocabulary.id == vocab_id).first()
    if not db_vocab:
        return None
    
    for key, value in vocab.model_dump(exclude_unset=True).items():
        setattr(db_vocab, key, value)

    db.commit()
    db.refresh(db_vocab)
    return db_vocab

def delete_vocab(db: Session, vocab_id: int):
    db_vocab = db.query(Mazii_vocabulary).filter(Mazii_vocabulary.id == vocab_id).first()
    if not db_vocab:
        return None
    
    db.delete(db_vocab)
    db.commit()
    return db_vocab