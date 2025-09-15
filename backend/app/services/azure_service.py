
import azure.cognitiveservices.speech as speechsdk
from app.config import settings
import io
from pydub import AudioSegment

def convert_audio_with_pydub(input_data: bytes) -> bytes | None:
    """
    Sử dụng pydub để chuyển đổi audio thành WAV PCM 16-bit, 16kHz, mono.
    Đây là định dạng chuẩn mà Azure Speech Service hoạt động tốt nhất.
    """
    try:
        print(f"Pydub: Received {len(input_data)} bytes. Attempting to convert.")
        # Đọc dữ liệu audio từ bytes. pydub sẽ tự phát hiện định dạng.
        audio_segment = AudioSegment.from_file(io.BytesIO(input_data))

        # Chuẩn hóa audio
        standardized_audio = audio_segment.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        
        # Xuất ra định dạng WAV trong bộ nhớ
        buffer = io.BytesIO()
        standardized_audio.export(buffer, format="wav")
        
        wav_data = buffer.getvalue()
        print(f"Pydub: Conversion successful. Output size: {len(wav_data)} bytes.")
        return wav_data

    except Exception as e:
        print(f"Pydub Error: Could not process audio. Is ffmpeg installed in the container? Error: {e}")
        return None

def transcribe_audio_from_bytes(audio_bytes: bytes) -> str:
    """
    Chuyển đổi audio bằng pydub, sau đó gửi đến Azure để nhận dạng.
    """
    if not audio_bytes or len(audio_bytes) < 1000:
        print("Audio data is too small or empty. Aborting.")
        return ""

    # Bước 1: Chuẩn hóa audio bằng pydub
    standardized_wav_data = convert_audio_with_pydub(audio_bytes)
    
    if not standardized_wav_data:
        print("Audio conversion failed. Cannot perform speech recognition.")
        return ""

    # Bước 2: Gửi audio đã chuẩn hóa đến Azure
    try:
        speech_config = speechsdk.SpeechConfig(
            subscription=settings.AZURE_SPEECH_KEY,
            region=settings.AZURE_SPEECH_REGION
        )
        speech_config.speech_recognition_language = "ja-JP"
        
        # Tạo stream từ dữ liệu WAV đã được chuẩn hóa
        stream = speechsdk.audio.PushAudioInputStream()
        stream.write(standardized_wav_data)
        stream.close()

        audio_config = speechsdk.audio.AudioConfig(stream=stream)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

        print("Azure: Starting recognition...")
        result = speech_recognizer.recognize_once()

        # Bước 3: Xử lý kết quả từ Azure
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print(f"Azure SUCCESS: Recognized: '{result.text}'")
            return result.text
        elif result.reason == speechsdk.ResultReason.NoMatch:
            print("Azure NO MATCH: No speech could be recognized.")
            return ""
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            print(f"Azure CANCELED: Reason: {cancellation_details.reason}")
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print(f"Azure Error Details: {cancellation_details.error_details}")
            return ""
    except Exception as e:
        print(f"Azure SDK Exception: {e}")
        return ""
    return ""