from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Mazii_vocab(Base):
    __tablename__ = "mazii_vocabs"

    id = Column(Integer, primary_key=True)
    word = Column(String, index=True, nullable=False)
    phonetic = Column(String)
    han_viet = Column(String)
    pronunciation = Column(String)
    type_word = Column(String)

    # vocab 1-n meaning
    meanings = relationship(
        "Meaning_detail",
        back_populates="vocab",
        cascade="all, delete-orphan"
    )


class Meaning_detail(Base):
    __tablename__ = "meaning_detail"

    id = Column(Integer, primary_key=True, index=True)
    meaning = Column(String, nullable=False)

    vocab_id = Column(
        Integer,
        ForeignKey("mazii_vocabs.id", ondelete="CASCADE"),
        nullable=False
    )

    vocab = relationship("Mazii_vocab", back_populates="meanings")

    # Quan hệ 1-n với Example
    examples = relationship(
        "Example",
        back_populates="meaning_detail",
        cascade="all, delete-orphan"
    )


class Example(Base):
    __tablename__ = "examples"

    id = Column(Integer, primary_key=True, index=True)
    jp = Column(String)
    vi = Column(String)

    meaning_detail_id = Column(
        Integer,
        ForeignKey("meaning_detail.id", ondelete="CASCADE"),
        nullable=False
    )

    meaning_detail = relationship("Meaning_detail", back_populates="examples")
