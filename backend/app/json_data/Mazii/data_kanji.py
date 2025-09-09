from app.crud.Mazii import kanji as crud_kanji
from app.schemas.Mazii import kanji as schema_kanji
from app.models.Mazii import kanji as model_kanji
from app.database import get_db
import json, os


def load_json(file_name: str):
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

def add_kanji_to_db():
    data = load_json('kanji.json')
    db_gen = get_db()
    db = next(db_gen)

    try:
        existing_kanji_data = db.query(model_kanji.Kanji).first()
        if existing_kanji_data:
            return
        
        for info in data:
            kanji = schema_kanji.KanjiCreate(
                word=info['data']['word'],
                kunyomi=info['data']['Kunyomi'],
                onyomi=info['data']['Onyomi'],
                strokes=info['data']['Strokes'],
                jlpt_level=info['data']['JLPT'],
                meaning=info['data']['Meaning'],
                explain=info['data']['Explain']
            )
            crud_kanji.create_kanji(db=db, kanji=kanji)


    finally:
        db_gen.close()

