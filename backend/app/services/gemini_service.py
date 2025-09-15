import google.generativeai as genai
from app.config import settings

# Cấu hình API key ngay khi module được import
genai.configure(api_key=settings.GEMINI_API_KEY)

# Khởi tạo model
model = genai.GenerativeModel('gemini-1.5-flash-latest')

def generate_response(prompt: str) -> str:
    """
    Gửi yêu cầu đến Gemini API và nhận phản hồi.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        # Xử lý lỗi ở đây, ví dụ: log lỗi, trả về thông báo mặc định
        print(f"Error calling Gemini API: {e}")
        return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau."