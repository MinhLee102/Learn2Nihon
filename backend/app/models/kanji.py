from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, ARRAY, JSON

class Kanji(Base):
    __tablename__ = "kanji"
    
    id = Column(Integer, primary_key=True, index=True)
    edition = Column(ARRAY(Integer))  # Lưu array [1,2]
    kanji = Column(String, index=True)
    kana = Column(String)
    romaji = Column(String)
    meaning = Column(JSON)  # Lưu object {"vi": "...", "en": "...", "fr": "..."}
    #* can nhac bo sung them level, nhung do trong json_data dang khong co
    def to_dict(self):
        return {
            "id": self.id,
            "edition": self.edition,
            "kanji": self.kanji,
            "kana": self.kana,
            "romaji": self.romaji,
            "meaning": self.meaning
        }

