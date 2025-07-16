from fastapi import FastAPI
from app.api import vocabulary
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(vocabulary.router)