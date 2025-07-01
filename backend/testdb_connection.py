from sqlalchemy import text
from app.database import engine

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print(" Kết nối thành công! Kết quả:", result.scalar())
    except Exception as e:
        print(" Kết nối thất bại !!! ", e)

if __name__ == "__main__":
    test_connection()
