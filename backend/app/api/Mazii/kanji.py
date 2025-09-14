from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.crud.Mazii import kanji as crud_kanji
from app.schemas.Mazii.kanji import KanjiCreate, KanjiUpdate, KanjiOut
from app.database import get_db
from fastapi import Depends
from typing import List

router = APIRouter(prefix="/kanji", tags=["kanji"])

@router.post("/", response_model=KanjiOut)
def create_kanji(
    kanji: KanjiCreate,\
    db: Session = Depends(get_db)
):
    return crud_kanji.create_kanji(db=db, kanji=kanji)

@router.get("/{kanji_id}", response_model=KanjiOut)
def get_kanji(
    kanji_id: int,
    db: Session = Depends(get_db)
):
    db_kanji = crud_kanji.get_kanji(db=db, kanji_id=kanji_id)
    if not db_kanji:
        raise HTTPException(status_code=404, detail="Kanji not found")
    return db_kanji

@router.get("/", response_model=list[KanjiOut])
def get_all_kanjis(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_kanji.get_kanjis(db=db, skip=skip, limit=limit)

@router.put("/{kanji_id}", response_model=KanjiOut)
def update_kanji(
    kanji_id: int,
    kanji: KanjiUpdate,
    db: Session = Depends(get_db)
):
    db_kanji = crud_kanji.update_kanji(db=db, kanji_id=kanji_id, kanji=kanji)
    if not db_kanji:
        raise HTTPException(status_code=404, detail="Kanji not found")
    return db_kanji

@router.delete("/{kanji_id}")
def delete_kanji(
    kanji_id: int,
    db: Session = Depends(get_db)
):
    db_kanji = crud_kanji.delete_kanji(db=db, kanji_id=kanji_id)
    if not db_kanji:
        raise HTTPException(status_code=404, detail="Kanji not found")
    return db_kanji

@router.get("/search/meaning", response_model=list[KanjiOut])
def search_by_meaning(
    keyword: str = Query(..., description="Từ khóa tìm kiếm"),
    db: Session = Depends(get_db)
):
    return crud_kanji.search_kanji_by_meaning(db=db, keyword=keyword)

@router.get("/20random/{jlpt_level}", response_model=List[KanjiOut])
def get_20_random_kanjis_by_JLPT_level(
    jlpt_level: str,
    db: Session = Depends(get_db)  
):
    return crud_kanji.get_20_random_kanjis_by_JLPT_level(db=db, jlpt_level=jlpt_level)
