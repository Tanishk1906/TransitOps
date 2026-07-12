from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from models.models import Driver, DriverStatus
from schemas.schemas import DriverCreate, DriverResponse, DataResponse
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.get("", response_model=DataResponse)
def get_drivers(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Driver)
    if status:
        query = query.filter(Driver.status == status)
    drivers = query.all()
    return {"data": [DriverResponse.model_validate(d).model_dump(by_alias=True) for d in drivers]}

@router.post("", response_model=DriverResponse)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    db_driver = Driver(**driver.model_dump(by_alias=False))
    try:
        db.add(db_driver)
        db.commit()
        db.refresh(db_driver)
        return db_driver
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="License number already exists")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
