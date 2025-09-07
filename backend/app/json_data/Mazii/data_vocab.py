from app.crud.Mazii import vocab as crud_vocab
from app.crud.Mazii import meaning as crud_meaning
from app.crud.Mazii import example as crud_example
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
        if existing_vocab_data:
            return
        
        for info in data:
            # --------------- Vocab ---------------
            vocab = schema_vocab.VocabCreate(
                word=info['data']['word'],
                phonetic=info['data']['phonetic'],
                han_viet=info['data']['han-viet'],
                pronunciation=info['data']['pronunciation'],
                type_word=info['data']['type']
            )
            create_vocab = crud_vocab.create_vocab(db=db, vocab=vocab)

            # ---------------- Meaning ------------------
            meaning_detail = info['data']['meaning_detail']
            for meaning_data in meaning_detail:
                meaning = schema_vocab.MeaningCreate(
                    meaning=meaning_data['meaning'],
                    vocab_id=create_vocab.id # type: ignore
                )
                create_meaning = crud_meaning.create_meaning(db=db, meaning=meaning)

                # ------------ Example ----------------
                examples = meaning_data['examples']
                for example_data in examples:
                    example = schema_vocab.ExampleCreate(
                        jp=example_data['jp'],
                        vi=example_data['vi'],
                        meaning_detail_id=create_meaning.id # type: ignore
                    )
                    crud_example.create_example(db=db, example=example)
        # db.commit()

    finally:
        db_gen.close()

