from app.crud import reading as crud_reading
from app.crud import question as crud_question
from app.crud import answer as crud_answer
from app.schemas import reading as schema_reading
from app.database import get_db
from app.models import reading as model_reading
import json, os


def load_json(file_name: str):
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

def add_reading_to_db():
    data = load_json("reading.json")
    db_gen = get_db()
    db = next(db_gen)

    try:
        existing_reading_db = db.query(model_reading.Reading).first()
        if existing_reading_db: 
            return

        for _, info in data.items():
            print(info)
            # ------- reading --------
            reading = schema_reading.ReadingCreate(
                title=info['title'],
                content=info['content']
            )
            created_reading = crud_reading.create_reading(db, reading)

            # -------- question ---------
            questions = info['questions']
            for question_data in questions:
                question = schema_reading.QuestionCreate(
                    reading_id=created_reading.id, # type: ignore
                    question_text=question_data['question_text'],
                    explanation=question_data.get('explanation', ''),
                )
                created_question = crud_question.create_question(db=db, question=question)

                # --------- answer ----------
                answers = question_data['answers']
                for answer_data in answers:
                    answer = schema_reading.AnswerCreate(
                        question_id=created_question.id, # type: ignore
                        answer_text=answer_data['text'],
                        is_correct=answer_data.get('is_correct', False)
                    )
                    crud_answer.create_answer(db=db, answer=answer)                        

        db.commit()

    finally:
        db_gen.close()