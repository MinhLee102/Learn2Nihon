from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings
import os

# 2. Đọc chuỗi kết nối từ biến môi trường do Docker Compose cung cấp
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# For run local and not using docker
if not SQLALCHEMY_DATABASE_URL:
    try:
        SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'
    except AttributeError as e:
        raise ValueError("DATABASE_URL is not set and settings are incomplete.") from e

# (Tùy chọn nhưng nên có) Kiểm tra xem biến môi trường có tồn tại không
if SQLALCHEMY_DATABASE_URL is None:
    raise ValueError("Biến môi trường DATABASE_URL chưa được thiết lập!")

# Tạo engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Tạo session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base cho ORM
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()