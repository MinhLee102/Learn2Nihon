from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

#* tạo phiên chat
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Mối quan hệ: Một session có nhiều message
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

#* tạo message trong phiên chat, liên kết message với session qua session_id
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    
    prompt = Column(String, nullable=False)
    response = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Mối quan hệ: Một message thuộc về một session
    session = relationship("ChatSession", back_populates="messages")