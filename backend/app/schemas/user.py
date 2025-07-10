from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str | None = None
       

class UserCreate(UserBase):
    pass
    
class UserOut(UserBase): #* dinh nghia format cho response khi lay thong tin user
    id: int

    class Config:
        orm_mode = True
         #* cho phep chuyen doi tu model ORM sang Pydantic model, giup hien thi du lieu tu database trong response