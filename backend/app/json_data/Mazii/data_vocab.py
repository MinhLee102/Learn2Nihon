from app.crud.Mazii import vocab as crud_vocab
from app.schemas.Mazii import vocab as schema_vocab
from app.models.Mazii import vocab as model_vocab
from app.database import get_db
import json, os


def load_json(file_name: str):
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

def add_vocab_to_db():
    data = load_json('vocab1.json')
    db_gen = get_db()
    db = next(db_gen)

    try:
        existing_vocab_data = db.query(model_vocab.Mazii_vocab).first()



    finally:
        db_gen.close()

