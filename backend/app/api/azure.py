from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services import azure_service

router = APIRouter(prefix="/azure", tags=["azure"])

@router.post("/stt")
async def speech_to_text_endpoint(audio: UploadFile = File(...)):
    """
    Nhận file audio, chuyển đổi thành text bằng Azure và trả về.
    """
    if not audio.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File không hợp lệ, cần phải là audio.")

    # Đọc nội dung file audio
    audio_bytes = await audio.read()

    # Gọi service để xử lý
    transcription = azure_service.transcribe_audio_from_bytes(audio_bytes)

    # Trả về kết quả cho frontend
    return {"transcription": transcription}