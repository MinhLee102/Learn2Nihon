from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.kanji import Kanji
from app.schemas.kanji import KanjiCreate, KanjiUpdate
from typing import List, Optional

def create_kanji(db: Session, kanji: KanjiCreate):
    """Tạo mới một kanji"""
    db_kanji = Kanji(
        edition=kanji.edition,
        kanji=kanji.kanji,
        kana=kanji.kana,
        romaji=kanji.romaji,
        meaning=kanji.meaning.dict()
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

def get_kanjis_with_filter(db: Session, 
                          skip: int = 0, 
                          limit: int = 100,
                          edition: Optional[int] = None,
                          search: Optional[str] = None):
    """Lấy danh sách kanji với filter và pagination"""
    query = db.query(Kanji)
    
    # Filter theo edition
    if edition:
        query = query.filter(Kanji.edition.contains([edition]))
    
    # Tìm kiếm theo kanji, kana hoặc romaji
    if search:
        query = query.filter(
            or_(
                Kanji.kanji.contains(search),
                Kanji.kana.contains(search),
                Kanji.romaji.contains(search)
            )
        )
    
    return query.offset(skip).limit(limit).all()

def update_kanji(db: Session, kanji_id: int, kanji: KanjiUpdate):
    """Cập nhật kanji"""
    db_kanji = db.query(Kanji).filter(Kanji.id == kanji_id).first()
    if not db_kanji:
        return None
    
    # Sử dụng model_dump() thay vì dict()
    update_data = kanji.model_dump(exclude_unset=True)
    
    # Xử lý nested schema meaning
    if "meaning" in update_data and update_data["meaning"] is not None:
        update_data["meaning"] = update_data["meaning"]
    
    for key, value in update_data.items():
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

def search_kanji_by_meaning(db: Session, language: str, keyword: str):
    """Tìm kiếm kanji theo nghĩa trong ngôn ngữ cụ thể"""
    return db.query(Kanji).filter(
        Kanji.meaning[language].astext.contains(keyword)
    ).all()

def get_kanjis_by_edition(db: Session, edition: int, skip: int = 0, limit: int = 100):
    """Lấy danh sách kanji theo edition"""
    return db.query(Kanji).filter(
        Kanji.edition.contains([edition])
    ).offset(skip).limit(limit).all()

def search_kanjis(db: Session, search_term: str, skip: int = 0, limit: int = 100):
    """Tìm kiếm kanji theo kanji, kana hoặc romaji"""
    return db.query(Kanji).filter(
        or_(
            Kanji.kanji.contains(search_term),
            Kanji.kana.contains(search_term),
            Kanji.romaji.contains(search_term)
        )
    ).offset(skip).limit(limit).all()

def get_kanji_count_by_edition(db: Session, edition: int):
    """Đếm số kanji theo edition"""
    return db.query(Kanji).filter(
        Kanji.edition.contains([edition])
    ).count()