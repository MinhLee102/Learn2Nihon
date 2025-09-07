from pydantic import BaseModel, Field
from typing import List, Optional

# ------------------ Example ---------------
class ExampleBase(BaseModel):
    jp: Optional[str] = None
    vi: Optional[str] = None

class ExampleCreate(ExampleBase):
    meaning_detail_id: int
    pass

class ExampleUpdate(ExampleBase):
    pass

class ExampleOut(ExampleBase):
    id: int
    meaning_detail_id: int

    model_config = {
        "from_attributes": True     # Pydantic v2
    }

# -------------- Meaning detail -------------
class MeaningBase(BaseModel):
    meaning: str

class MeaningCreate(MeaningBase):
    vocabulary_id: int
    pass

class MeaningUpdate(MeaningBase):
    pass

class MeaningOut(MeaningBase):
    id: int
    vocabulary_id: int
    examples: List[ExampleOut] = Field(default_factory=list)

    model_config = {
        "from_attributes": True     # Pydantic v2
    }

# ---------------- Vocabulary -----------------
class VocabBase(BaseModel):
    word: str
    phonetic: Optional[str] = None
    han_viet: Optional[str] = None
    pronunciation: Optional[str] = None
    type_word: Optional[str] = None

class VocabCreate(VocabBase):
    pass

class VocabUpdate(VocabBase):
    pass

class VocabOut(VocabBase):
    id: int
    meanings: List[MeaningOut] = Field(default_factory=list)

    model_config = {
        "from_attributes": True     # Pydantic v2
    }