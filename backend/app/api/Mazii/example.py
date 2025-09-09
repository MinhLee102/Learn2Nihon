from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.Mazii.vocab import ExampleCreate, ExampleUpdate, ExampleOut
from app.crud.Mazii import example as crud_example
from app.database import get_db

router = APIRouter(prefix="/examples", tags=["examples"])

@router.post("/", response_model=ExampleOut)
def create_example(
    example: ExampleCreate,
    db: Session = Depends(get_db)
):
    return crud_example.create_example(db=db, example=example)

@router.get("/{example_id}", response_model=ExampleOut)
def get_example(
    example_id: int,
    db: Session = Depends(get_db)
):
    db_example = crud_example.get_example(db=db, example_id=example_id)
    if not db_example:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example

@router.get("/", response_model=list[ExampleOut])
def get_all_examples(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_example.get_examples(db=db, skip=skip, limit=limit)

@router.put("/{example_id}", response_model=ExampleOut)
def update_example(
    example_id: int,
    example: ExampleUpdate,
    db: Session = Depends(get_db)
):
    db_example = crud_example.update_example(db=db, example_id=example_id, example=example)
    if not db_example:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example

@router.delete("/{example_id}", response_model=ExampleOut)
def delete_example(
    example_id: int,
    db: Session = Depends(get_db)
):
    db_example = crud_example.delete_example(db=db, example_id=example_id)
    if not db_example:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example