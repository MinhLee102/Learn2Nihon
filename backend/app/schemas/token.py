from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    current_streak: int | None = None

class TokenData(BaseModel):
    id: str | None = None