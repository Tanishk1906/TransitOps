from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Maintenance
from schemas.schemas import MaintenanceCreate, MaintenanceResponse, DataResponse
from services.services import start_maintenance, close_maintenance

router = APIRouter()

@router.get("", response_model=DataResponse)
def get_maintenance_logs(db: Session = Depends(get_db)):
    logs = db.query(Maintenance).all()
    return {"data": [MaintenanceResponse.model_validate(log).model_dump(by_alias=True) for log in logs]}

@router.post("", response_model=MaintenanceResponse)
def create_maintenance_log(log: MaintenanceCreate, db: Session = Depends(get_db)):
    return start_maintenance(db, log.vehicle_id, log.description, log.cost)

@router.patch("/{log_id}/close", response_model=MaintenanceResponse)
def close_log(log_id: int, db: Session = Depends(get_db)):
    return close_maintenance(db, log_id)
