from pydantic import BaseModel

class UserOut(BaseModel): #* dinh nghia format cho response khi lay thong tin user
    id: int
    username: str
    email: str
    full_name: str | None = None

    class Config:
        orm_mode = True
