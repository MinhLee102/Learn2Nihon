from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None 

class ChatResponse(BaseModel):
    response: str
    session_id: str