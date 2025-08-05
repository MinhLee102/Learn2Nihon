from app.api import vocabulary as api_vocab
from app.schemas import vocabulary as schema_vocab
from app.database import get_db
from app.models import vocabulary as model_vocab
import json, os

def load_json(file_name: str):
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

def get_vocab_by_lesson(data: dict, lesson: int):
    s: str = 'lesson-'
    if lesson < 10: s += '0' 
    s += str(lesson)

    listVocab = []
    for info in data[s]:
        vocab = schema_vocab.VocabularyCreate(
            id=info['id'][1], word=info['kana'], 
            meaning=info['meaning']['vi'], lesson=info['id'][0]
        )
        listVocab.append(vocab)
    return listVocab

def add_vocab_to_db():
    data = load_json("minna_vietnamese.json")
    db_gen = get_db()
    db = next(db_gen)

    try:
        existing = db.query(model_vocab.Vocabulary).first()
        if existing: return

        for i in range(1, 51):
            listVocab = get_vocab_by_lesson(data, i)
            for vocab in listVocab:
                api_vocab.create_vocab(vocab, db)
            db.commit()
    finally:
        db_gen.close()