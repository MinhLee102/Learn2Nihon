from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship

from app.database import Base

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)  # Use index for speeding up queries
    content = Column(String, nullable=False)

    # reading 1 - n questions
    questions = relationship(
        "Question",
        back_populates="reading",
        cascade="all, delete-orphan"
    )

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    explanation = Column(String)

    reading_id = Column(Integer, ForeignKey("readings.id", ondelete="CASCADE"), nullable=False)

    reading = relationship("Reading", back_populates="questions")
    # question 1 - n answers
    answers = relationship(
        "Answer",
        back_populates="question",
        cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    answer_text = Column(String, nullable=False)
    is_correct = Column(Boolean, server_default=text('false'))

    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)

    question = relationship("Question", back_populates="answers")