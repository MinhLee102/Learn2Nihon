from sqlalchemy.orm import Session
from app.models.chat_history import ChatSession, ChatMessage
from typing import List

#* tạo 1 phiên chat mới
def create_chat_session(db: Session) -> ChatSession:
    db_session = ChatSession()
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

#* lấy phiên chat theo id
def get_chat_session(db: Session, session_id: str) -> ChatSession | None:
    return db.query(ChatSession).filter(ChatSession.id == session_id).first()

#*Thêm tin nhắn mới vào phiên chat
def add_message_to_session(db: Session, *, session_id: str, prompt: str, response: str) -> ChatMessage:
    db_message = ChatMessage(
        session_id=session_id,
        prompt=prompt,
        response=response
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

#*Lấy tất cả tin nhắn của một phiên chat
def get_messages_by_session(db: Session, session_id: str) -> List[ChatMessage]:
    return db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at).all()