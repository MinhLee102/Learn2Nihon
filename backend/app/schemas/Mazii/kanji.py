# from pydantic import BaseModel
# from typing import List, Optional, Field

# class MeaningSchema(BaseModel):
#     vi: str = Field(..., description="Nghĩa tiếng Việt")
#     en: str = Field(..., description="Nghĩa tiếng Anh")
#     fr: str = Field(..., description="Nghĩa tiếng Pháp")

# class KanjiBase(BaseModel):
#     edition: List[int] = Field(..., description="Danh sách edition")
#     kanji: str = Field(..., description="Ký tự Kanji")
#     kana: str = Field(..., description="Cách đọc Kana")
#     romaji: str = Field(..., description="Cách đọc Romaji")
#     meaning: MeaningSchema = Field(..., description="Nghĩa đa ngôn ngữ")

# class KanjiCreate(KanjiBase):
#     pass

# class KanjiUpdate(BaseModel):
#     edition: Optional[List[int]] = None
#     kanji: Optional[str] = None
#     kana: Optional[str] = None
#     romaji: Optional[str] = None
#     meaning: Optional[MeaningSchema] = None

# class KanjiResponse(KanjiBase):
#     id: int
    
#     class Config:
#         from_attributes = True