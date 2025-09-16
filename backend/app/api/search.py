# backend/app/api/search.py
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
import httpx

from app.database import get_db
from app.models.Mazii.vocab import Mazii_vocab, Meaning_detail, Example  # Import model của bạn

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

JISHO_API_URL = "https://jisho.org/api/v1/search/words"

def format_db_result_like_jisho(db_vocab: Mazii_vocab):
    senses = []
    # Lặp qua từng nghĩa của từ vựng
    for meaning_detail in db_vocab.meanings:
        examples_list = []
        # Lặp qua từng ví dụ của nghĩa đó
        for ex in meaning_detail.examples:
            examples_list.append({"jp": ex.jp, "vi": ex.vi})
        
        # Tạo một "sense" (khối nghĩa) theo cấu trúc của Jisho
        sense_object = {
            "vietnamese_definitions": [meaning_detail.meaning], 
            "parts_of_speech": [db_vocab.type_word.replace('☆ ', '') if db_vocab.type_word else ""],
            # Thêm một trường tùy chỉnh để chứa các ví dụ
            "source_examples": examples_list,
            "links": [], "tags": [], "restrictions": [], "see_also": [], "antonyms": [], "source": [], "info": []
        }
        senses.append(sense_object)

    return {
        "meta": {"status": 200, "source": "database"},
        "data": [
            {
                "slug": db_vocab.word,
                "is_common": True,
                "japanese": [
                    {
                        "word": db_vocab.word,
                        "reading": db_vocab.phonetic
                    }
                ],
                "senses": senses # Danh sách các khối nghĩa đã được xử lý
            }
        ]
    }

@router.get("/jisho")
async def search_jisho(
    q: str = Query(..., min_length=1, description="Từ khóa cần tìm kiếm"),
    db: Session = Depends(get_db)
):
    """
    Tìm kiếm từ vựng. Ưu tiên tìm trong database trước.
    Nếu không thấy, sẽ gọi API của Jisho.org.
    """
    # === BƯỚC 1: TÌM KIẾM TRONG DATABASE TRƯỚC ===
    # Tối ưu hóa câu truy vấn để lấy cả meaning và example trong 1 lần gọi
    # bằng joinedload để tránh vấn đề N+1 query.
    db_result = db.query(Mazii_vocab).options(
        joinedload(Mazii_vocab.meanings).joinedload(Meaning_detail.examples)
    ).filter(
        or_(
            Mazii_vocab.word == q,
            Mazii_vocab.phonetic == q
        )
    ).first()

    if db_result:
        print(f"Found '{q}' in database.")
        return format_db_result_like_jisho(db_result)

    # === BƯỚC 2: NẾU KHÔNG CÓ TRONG DB, GỌI Jisho API ===
    print(f"'{q}' not in database. Calling Jisho API...")
    # ... (phần code gọi Jisho giữ nguyên như cũ)
    params = {"keyword": q}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(JISHO_API_URL, params=params)
            response.raise_for_status() 
            result = response.json()
            if not result or not result.get("data"):
                raise HTTPException(status_code=404, detail="Không tìm thấy kết quả nào cả trong DB và Jisho.")
            result["meta"]["source"] = "jisho_api"
            return result
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Lỗi từ Jisho API: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Không thể kết nối đến Jisho API: {str(e)}")