from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str  # Thêm trường này

class TokenData(BaseModel):
    id: str | None = None