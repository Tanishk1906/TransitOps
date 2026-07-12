from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Expense
from schemas.schemas import ExpenseCreate, ExpenseResponse, DataResponse

router = APIRouter()

@router.get("", response_model=DataResponse)
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    return {"data": [ExpenseResponse.model_validate(e).model_dump(by_alias=True) for e in expenses]}

@router.post("", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.model_dump(by_alias=False))
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense
