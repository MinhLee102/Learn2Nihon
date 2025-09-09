from pydantic import BaseModel, Field
from typing import List, Optional

class KanjiBase(BaseModel):
    word: str
    kunyomi: Optional[List[str]] = None
    onyomi: Optional[List[str]] = None
    strokes: int
    jlpt_level: Optional[str] = None
    meaning: str
    explain: List[str]

class KanjiCreate(KanjiBase):
    pass

class KanjiUpdate(KanjiBase):
    pass

class KanjiOut(KanjiBase):
    id: int

    model_config = {
        "from_attributes": True     # Pydantic v2
    }