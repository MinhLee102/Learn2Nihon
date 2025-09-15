from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services import gemini_service, azure_service
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

# @router.post("/send-audio", response_model=ChatResponse)
# async def handle_audio_chat_request(
#     db: Session = Depends(get_db),
#     session_id: str | None = Form(None),
#     audio_file: UploadFile = File(...)
# ):
#     """
#     Endpoint chính: Nhận file audio, chuyển thành văn bản,
#     gửi đến Gemini, và trả về phản hồi.
#     """
#     # Bước 1: Kiểm tra file audio
#     if not audio_file.content_type.startswith('audio/'):
#         raise HTTPException(status_code=400, detail="File không hợp lệ, cần phải là audio.")

#     # Bước 2: Đọc nội dung file audio và chuyển thành văn bản
#     audio_bytes = await audio_file.read()
#     prompt_text = azure_service.transcribe_audio_from_bytes(audio_bytes)

#     if not prompt_text:
#         # Nếu Azure không nhận dạng được giọng nói, trả về thông báo
#         return ChatResponse(response="Xin lỗi, tôi không nghe rõ bạn nói gì. Bạn có thể thử lại không?", session_id=session_id or "")

#     # Bước 3: Quản lý phiên chat (tạo mới nếu chưa có)
#     # Logic này được tái sử dụng từ endpoint /send của bạn
#     if not session_id or not crud_chat_history.get_chat_session(db, session_id=session_id):
#         new_session = crud_chat_history.create_chat_session(db)
#         session_id = new_session.id

#     # Bước 4: Gửi văn bản đã nhận dạng đến Gemini
#     gemini_response_text = gemini_service.generate_response(prompt=prompt_text)

#     # Bước 5: Lưu lại cả câu hỏi (prompt) và câu trả lời (response)
#     crud_chat_history.add_message_to_session(
#         db=db,
#         session_id=session_id,
#         prompt=prompt_text,
#         response=gemini_response_text
#     )

#     # Bước 6: Trả về phản hồi của Gemini và session_id
#     return ChatResponse(response=gemini_response_text, session_id=session_id)