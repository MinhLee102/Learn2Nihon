from fastapi import FastAPI
from app.api import vocabulary
from app.api import user
from app.routers import auth
from app.database import Base, engine
from app.data_vocab import add_vocab_to_db
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

add_vocab_to_db()

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