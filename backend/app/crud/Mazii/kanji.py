from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.Mazii.kanji import Kanji
from app.schemas.Mazii.kanji import KanjiCreate, KanjiUpdate
from typing import List, Optional

def create_kanji(db: Session, kanji: KanjiCreate):
    """Tạo mới một kanji"""
    db_kanji = Kanji(
        word=kanji.word,
        kunyomi=kanji.kunyomi,
        onyomi=kanji.onyomi,
        strokes=kanji.strokes,
        jlpt_level=kanji.jlpt_level,
        meaning=kanji.meaning,
        explain=kanji.explain
    )
    db.add(db_kanji)
    db.commit()
    db.refresh(db_kanji)
    return db_kanji

def get_kanji_item_count(db: Session):
    """Đếm tổng số kanji"""
    return db.query(Kanji).count()

def get_kanji(db: Session, kanji_id: int):
    """Lấy kanji theo ID"""
    return db.query(Kanji).filter(Kanji.id == kanji_id).first()

def get_kanjis(db: Session, skip: int = 0, limit: int = 100):
    """Lấy danh sách kanji với pagination"""
    return db.query(Kanji).offset(skip).limit(limit).all()

def update_kanji(db: Session, kanji_id: int, kanji: KanjiUpdate):
    """Cập nhật kanji"""
    db_kanji = db.query(Kanji).filter(Kanji.id == kanji_id).first()
    if not db_kanji:
        return None

    for key, value in kanji.model_dump(exclude_unset=True).items():
        setattr(db_kanji, key, value)
    
    db.commit()
    db.refresh(db_kanji)
    return db_kanji

def delete_kanji(db: Session, kanji_id: int):
    """Xóa kanji"""
    db_kanji = db.query(Kanji).filter(Kanji.id == kanji_id).first()
    if not db_kanji:
        return None
    
    db.delete(db_kanji)
    db.commit()
    return db_kanji

def search_kanji_by_meaning(db: Session, keyword: str, limit: int = 100):
    """Tìm kiếm kanji theo nghĩa trong ngôn ngữ cụ thể"""
    return db.query(Kanji).filter(
        Kanji.meaning.contains(keyword)
    ).limit(limit).all()


def search_kanji_by_romanji(db: Session, search_term: str, limit: int = 100):
    """Tìm kiếm kanji theo kanji, kunyomi hoặc onyomi"""
    return db.query(Kanji).filter(
        or_(
            Kanji.kanji.contains(search_term),
            Kanji.kunyomi.contains([search_term]),
            Kanji.onyomi.contains([search_term])
        )
    ).limit(limit).all()