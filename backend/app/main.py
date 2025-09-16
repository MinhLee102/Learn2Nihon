from fastapi import FastAPI
from app.api import vocabulary, user, reading, question, answer, chatbot, azure, search
from app.api.Mazii import vocab, kanji
from app.routers import auth, email_verification
from app.database import Base, engine
from app.csv_data.import_csv import import_data
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

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
app.include_router(chatbot.router)
app.include_router(azure.router)
app.include_router(search.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Gemini Voice Chat API"}