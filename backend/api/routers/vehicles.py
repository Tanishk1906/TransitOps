from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from models.models import Vehicle, VehicleStatus
from schemas.schemas import VehicleCreate, VehicleResponse, DataResponse
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.get("", response_model=DataResponse)
def get_vehicles(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    vehicles = query.all()

    return {"data": [VehicleResponse.model_validate(v).model_dump(by_alias=True) for v in vehicles]}

@router.post("", response_model=VehicleResponse)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle.model_dump(by_alias=False))
    try:
        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Registration number already exists")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
