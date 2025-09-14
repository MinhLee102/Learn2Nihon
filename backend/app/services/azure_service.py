import azure.cognitiveservices.speech as speechsdk
from app.config import settings

def transcribe_audio_from_bytes(audio_bytes: bytes) -> str:
    """
    Gửi một file âm thanh (dạng bytes) đến Azure Speech Service
    và trả về văn bản đã được nhận dạng.
    """
    try:
        speech_config = speechsdk.SpeechConfig(
            subscription=settings.AZURE_SPEECH_KEY,
            region=settings.AZURE_SPEECH_REGION
        )
        # Cấu hình để nhận dạng tiếng Nhật
        speech_config.speech_recognition_language = "ja-JP"

        # Tạo recognizer từ audio stream trong bộ nhớ
        audio_config = speechsdk.audio.AudioConfig(stream=audio_bytes)
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )

        # Bắt đầu nhận dạng một lần
        result = speech_recognizer.recognize_once()

        # Xử lý kết quả
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text
        elif result.reason == speechsdk.ResultReason.NoMatch:
            return "" # Trả về chuỗi rỗng nếu không nhận dạng được
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            print(f"Speech Recognition canceled: {cancellation_details.reason}")
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print(f"Error details: {cancellation_details.error_details}")
            return ""

    except Exception as e:
        print(f"Error calling Azure STT service: {e}")
        return ""
    
    return ""
