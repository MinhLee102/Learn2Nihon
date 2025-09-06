from sqlalchemy import Column, Integer, String, ARRAY, ForeignKey
from app.database import Base


class Kanji(Base):
    __tablename__ = "kanji"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, index=True, nullable=False)
    kunyomi = Column(ARRAY(String))
    onyomi = Column(ARRAY(String))
    strokes = Column(Integer, nullable=False) # no missing values in the current data
    jlpt_level = Column(String)
    meaning = Column(String, nullable=False) # no missing values in the current data
    explain = Column(ARRAY(String), nullable=False) # no missing values in the current data