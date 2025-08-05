from sqlalchemy import Column, Integer, String, ARRAY
from sqlalchemy.ext.declarative import declarative_base

from app.database import Base

class ReadingItem(Base):
    __tablename__ = "reading_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    choices = Column(ARRAY(String))
    answer = Column(String)