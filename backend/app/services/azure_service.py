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
        speech_config.speech_recognition_language = "ja-JP"

        # 1. Tạo một PushAudioInputStream. Đây là một luồng trong bộ nhớ
        #    mà SDK có thể đọc được.
        stream = speechsdk.audio.PushAudioInputStream()

        # 2. Khởi tạo AudioConfig từ luồng này.
        audio_config = speechsdk.audio.AudioConfig(stream=stream)

        # 3. Đẩy (write) toàn bộ dữ liệu audio_bytes vào luồng.
        stream.write(audio_bytes)

        # 4. Đóng luồng để báo hiệu rằng không còn dữ liệu nào nữa.
        #    Đây là bước quan trọng, nếu không recognizer sẽ chờ mãi.
        stream.close()

        # Tạo recognizer từ speech_config và audio_config đã được sửa
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )

        # Bắt đầu nhận dạng một lần
        result = speech_recognizer.recognize_once()

        # Xử lý kết quả
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print(f"Recognized: {result.text}") # Thêm log để debug
            return result.text
        elif result.reason == speechsdk.ResultReason.NoMatch:
            print("No speech could be recognized.") # Thêm log để debug
            return ""
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
