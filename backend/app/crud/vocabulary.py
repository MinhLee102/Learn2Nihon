from sqlalchemy.orm import Session
from app.models.vocabulary import Vocabulary
from app.schemas.vocabulary import VocabularyCreate, VocabularyUpdate, VocabularyOut

def create_vocabulary(db: Session, vocab: VocabularyCreate):
    db_vocab = Vocabulary(
        word=vocab.word,
        description=vocab.description,
        meaning=vocab.meaning,
        pronunciation=vocab.pronunciation,
        lesson=vocab.lesson,
        level=vocab.level,
        example=vocab.example
    )
    db.add(db_vocab)
    db.commit()
    db.refresh(db_vocab)
    return db_vocab

def get_vocabulary(db: Session, vocab_id: int):
    return db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()

def get_vocabularies(db: Session, skip: int = 0, limit: int = 100): 
    #* số bản ghi tối đa trả về trong một truy vấn là 100, và 0 bỏ qua bản ghi nào.
    return db.query(Vocabulary).offset(skip).limit(limit).all()

def update_vocabulary(db: Session, vocab_id: int, vocab: VocabularyUpdate):
    db_vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not db_vocab:
        return None
    
    for key, value in vocab.model_dump().items(): #* Chuyen doi tuong Pandetic sang dictionary
        setattr(db_vocab, key, value)  #* Cho phép cập nhật động các thuộc tính mà không cần biết trước tên thuộc tính, rất hữu ích khi làm việc với dữ liệu từ dictionary hoặc JSON.
    
    db.commit()
    db.refresh(db_vocab)
    return db_vocab

def delete_vocabulary(db: Session, vocab_id: int):
    db_vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not db_vocab:
        return None
    
    db.delete(db_vocab)
    db.commit()
    return db_vocab