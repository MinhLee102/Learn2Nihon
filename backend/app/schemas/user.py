from pydantic import BaseModel, EmailStr

class UserOut(BaseModel): #* dinh nghia format cho response khi lay thong tin user
    id: int
    username: str
    email: EmailStr
    full_name: str | None = None

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str