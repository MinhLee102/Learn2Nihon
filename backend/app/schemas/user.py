from pydantic import BaseModel, EmailStr, Field, field_validator
import re

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str | None = None
       

class UserCreate(UserBase):
    password: str = Field(
        min_length=8, 
        max_length=32, 
        description="Mật khẩu phải từ 8-32 ký tự, chứa ít nhất một chữ cái và một chữ số."
    )

    # Thêm hàm validator tùy chỉnh để kiểm tra mật khẩu
    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        # Kiểm tra phải có ít nhất một chữ cái
        if not re.search(r'[a-zA-Z]', value):
            raise ValueError('Mật khẩu phải chứa ít nhất một chữ cái')
        # Kiểm tra phải có ít nhất một chữ số
        if not re.search(r'\d', value):
            raise ValueError('Mật khẩu phải chứa ít nhất một chữ số')
        # Kiểm tra phải có ít nhất một ký tự đặc biệt
        if not re.search(r'[@$!%*?&]', value):
            raise ValueError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&)')
        return value

class UserUpdate(UserBase):
    password: str | None = None  #* Khong bat buoc phai cap nhat mat khau khi cap nhat thong tin user
    
class UserOut(UserBase): #* dinh nghia format cho response khi lay thong tin user
    id: int

    model_config = {
        "from_attributes": True     # Pydantic v2
    }
         #* cho phep chuyen doi tu model ORM sang Pydantic model, giup hien thi du lieu tu database trong response
