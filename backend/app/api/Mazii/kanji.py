# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from database import get_db
# from app.crud import kanji as KanjiCRUD
# from app.schemas.kanji import KanjiResponse, KanjiCreate, KanjiUpdate

# router = APIRouter(prefix="/api/kanji", tags=["kanji"])

# @router.post("/", response_model=KanjiResponse)
# def create_kanji(kanji: KanjiCreate, db: Session = Depends(get_db)):
#     """Tạo mới kanji"""
#     crud = KanjiCRUD(db)
#     return crud.create_kanji(kanji)

# @router.get("/", response_model=List[KanjiResponse])
# def get_kanji_list(
#     skip: int = Query(0, ge=0, description="Số bản ghi bỏ qua"),
#     limit: int = Query(100, ge=1, le=1000, description="Số bản ghi trả về"),
#     edition: Optional[int] = Query(None, description="Lọc theo edition"),
#     search: Optional[str] = Query(None, description="Tìm kiếm theo kanji/kana/romaji"),
#     db: Session = Depends(get_db)
# ):
#     """Lấy danh sách kanji với filter và pagination"""
#     crud = KanjiCRUD(db)
#     return crud.get_kanji_list(skip=skip, limit=limit, edition=edition, search=search)

# @router.get("/{kanji_id}", response_model=KanjiResponse)
# def get_kanji(kanji_id: int, db: Session = Depends(get_db)):
#     """Lấy chi tiết kanji theo ID"""
#     crud = KanjiCRUD(db)
#     kanji = crud.get_kanji(kanji_id)
#     if not kanji:
#         raise HTTPException(status_code=404, detail="Không tìm thấy kanji")
#     return kanji

# @router.put("/{kanji_id}", response_model=KanjiResponse)
# def update_kanji(kanji_id: int, kanji_update: KanjiUpdate, db: Session = Depends(get_db)):
#     """Cập nhật kanji"""
#     crud = KanjiCRUD(db)
#     kanji = crud.update_kanji(kanji_id, kanji_update)
#     if not kanji:
#         raise HTTPException(status_code=404, detail="Không tìm thấy kanji")
#     return kanji

# @router.delete("/{kanji_id}")
# def delete_kanji(kanji_id: int, db: Session = Depends(get_db)):
#     """Xóa kanji"""
#     crud = KanjiCRUD(db)
#     success = crud.delete_kanji(kanji_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Không tìm thấy kanji")
#     return {"message": "Xóa kanji thành công"}

# @router.get("/search/meaning", response_model=List[KanjiResponse])
# def search_by_meaning(
#     language: str = Query(..., description="Ngôn ngữ (vi/en/fr)"),
#     keyword: str = Query(..., description="Từ khóa tìm kiếm"),
#     db: Session = Depends(get_db)
# ):
#     """Tìm kiếm kanji theo nghĩa"""
#     if language not in ["vi", "en", "fr"]:
#         raise HTTPException(status_code=400, detail="Ngôn ngữ không hợp lệ")
    
#     crud = KanjiCRUD(db)
#     return crud.search_by_meaning(language, keyword)