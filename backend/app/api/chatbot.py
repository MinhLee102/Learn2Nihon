from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services import gemini_service
from app.database import get_db 
from app.crud import chat_history as crud_chat_history

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/send", response_model=ChatResponse)
def handle_chat_request(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is empty")

    session_id = request.session_id
    if not session_id or not crud_chat_history.get_chat_session(db, session_id=session_id):
        new_session = crud_chat_history.create_chat_session(db)
        session_id = new_session.id

    # Gọi Gemini service, truyền request.message vào tham số prompt
    gemini_response_text = gemini_service.generate_response(prompt=request.message)

    # Lưu tin nhắn vào database, truyền request.message vào tham số prompt
    crud_chat_history.add_message_to_session(
        db=db,
        session_id=session_id,
        prompt=request.message,
        response=gemini_response_text
    )

    return ChatResponse(response=gemini_response_text, session_id=session_id)