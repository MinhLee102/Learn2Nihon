from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL kết nối PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:182705@localhost:5432/learn2nihon"
# format = password@host:port/database_name

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