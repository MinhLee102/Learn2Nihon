from pydantic import BaseModel
from typing import List, Optional

class ReadingItemBase(BaseModel):
    title: str
    content: str
    choices: List[str]
    answer: str

class ReadingItemCreate(ReadingItemBase):
    pass

class ReadingItemUpdate(ReadingItemBase):
    pass

class ReadingItemOut(ReadingItemBase):
    id: int

    model_config = {
        "from_attributes": True     # Pydantic v2
    }
