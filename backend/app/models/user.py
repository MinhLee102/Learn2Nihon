from sqlalchemy import Column, Integer, String, text, TIMESTAMP, Boolean


from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    #* can nhac co nen de khac null cho full_name khong
    password = Column(String, nullable=False)
    is_verified = Column(Boolean, nullable=False, server_default=text('false'))
    created_at = Column(TIMESTAMP(timezone=True), 
                        nullable=False, server_default=text('NOW()'))