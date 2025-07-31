from pydantic import BaseModel

class VocabularyBase(BaseModel):
    word: str
    description: str | None = None
    meaning: str
    pronunciation: str | None = None
    lesson: int         
    level: str | None = None
    example: str | None = None
    
class VocabularyCreate(VocabularyBase):
    id: int
    pass

class VocabularyUpdate(VocabularyBase):
    pass

class VocabularyOut(VocabularyBase):
    id: int

    class Config:
        orm_mode = True
        
#* khong gop VocabularyBase vao VocabularyOut vi chi can hien thi id trong response vi khong can thiet phai truyen vao id khi tao moi tu dien. Them vao co can VocabularyBase de cho cac class khac ke thua de su dung.