from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from models.models import Trip
from schemas.schemas import TripCreate, TripResponse, DataResponse
from services.services import dispatch_trip, complete_trip

router = APIRouter()

@router.get("", response_model=DataResponse)
def get_trips(limit: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Trip).order_by(Trip.id.desc())
    if limit:
        query = query.limit(limit)
    trips = query.all()
    # Need to return populated objects for dashboard
    return {"data": [TripResponse.model_validate(t).model_dump(by_alias=True) for t in trips]}

@router.post("", response_model=TripResponse)
def create_trip(trip: TripCreate, db: Session = Depends(get_db)):
    db_trip = Trip(**trip.model_dump(by_alias=False))
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch(trip_id: int, db: Session = Depends(get_db)):
    return dispatch_trip(db, trip_id)

@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete(trip_id: int, db: Session = Depends(get_db)):
    return complete_trip(db, trip_id)
