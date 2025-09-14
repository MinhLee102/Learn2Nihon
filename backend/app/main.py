from fastapi import FastAPI
from app.api import vocabulary, user, reading, question, answer
from app.api.Mazii import vocab, kanji
from app.routers import auth, email_verification
from app.database import Base, engine
from app.json_data.data_minna_vocab import add_vocabulary_to_db
from app.json_data.data_reading import add_reading_to_db
from app.json_data.Mazii.import_csv import import_data
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

add_vocabulary_to_db()
add_reading_to_db()
import_data()

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vocabulary.router)
app.include_router(user.router)
app.include_router(email_verification.router)
app.include_router(reading.router)
app.include_router(question.router)
app.include_router(answer.router)
app.include_router(vocab.router)
app.include_router(kanji.router)