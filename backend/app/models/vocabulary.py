from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False)      
    description = Column(String, nullable=True)# Từ vựng (hiragana / kanji)
    meaning = Column(String, nullable=False)           # Nghĩa tiếng Việt 
    pronunciation = Column(String, nullable=True)      # Cách đọc (kana)
    lesson = Column(Integer, nullable=False)           # Số bài Minna no Nihongo (1–50)
    level = Column(String, nullable=True)              # N5 / N4
    example = Column(String, nullable=True)            # Câu ví dụ (nếu có)