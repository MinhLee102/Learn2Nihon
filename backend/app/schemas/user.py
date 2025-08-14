from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str | None = None
       

class UserCreate(UserBase):
    pass   #* moi field tu UserBase deu bat buoc
    password: str  

class UserUpdate(UserBase):
    password: str | None = None  #* Khong bat buoc phai cap nhat mat khau khi cap nhat thong tin user
    
class UserOut(UserBase): #* dinh nghia format cho response khi lay thong tin user
    id: int

    model_config = {
        "from_attributes": True     # Pydantic v2
    }
         #* cho phep chuyen doi tu model ORM sang Pydantic model, giup hien thi du lieu tu database trong response