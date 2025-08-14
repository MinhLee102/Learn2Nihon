from pydantic import BaseModel, Field
from typing import List, Optional

# ------------ Answer ----------------------
class AnswerBase(BaseModel):
    answer_text: str
    is_correct: bool = False

class AnswerCreate(AnswerBase):
    question_id: int
    pass

class AnswerUpdate(AnswerBase):
    pass

class AnswerOut(AnswerBase):
    id: int
    question_id: int

    class Config:
        orm_mode = True

# --------------Question -------------------
class QuestionBase(BaseModel):
    question_text: str
    explanation: Optional[str] = None

class QuestionCreate(QuestionBase):
    reading_id: int
    pass

class QuestionUpdate(QuestionBase):
    pass

class QuestionOut(QuestionBase):
    id: int
    reading_id: int
    answers: List[AnswerOut] = Field(default_factory=list)

    class Config:
        orm_mode = True

# -------------- Reading -------------------
class ReadingBase(BaseModel):
    title: str
    content: str

class ReadingCreate(ReadingBase):
    pass

class ReadingUpdate(ReadingBase):
    pass

class ReadingOut(ReadingBase):
    id: int
    questions: List[QuestionOut] = Field(default_factory=list)
    
    class Config:
        orm_mode = True
