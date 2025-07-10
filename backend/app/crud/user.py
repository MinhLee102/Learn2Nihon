from sqlalchemy.orm import Session 
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut
from .. import utils

def create_user(db: Session, user: UserCreate):
    hashed_password = utils.hash(user.password)
    # Tạo một instance của model User (SQLAlchemy)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password=hashed_password  #* Lưu ý: Mật khẩu đã được băm trước khi lưu vào cơ sở dữ liệu
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()    

def get_user_by_username(db: Session, username: str):   
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    for key, value in user.model_dump().items():  #* Chuyen doi tuong Pandetic sang dictionary
        setattr(db_user, key, value)  #* Cho phép cập nhật động các thuộc tính mà không cần biết trước tên thuộc tính, rất hữu ích khi làm việc với dữ liệu từ dictionary hoặc JSON.
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    db.delete(db_user)
    db.commit()
    return db_user

