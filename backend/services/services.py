from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.models import Trip, Vehicle, Driver, Maintenance, VehicleStatus, DriverStatus, TripStatus
import datetime

def dispatch_trip(db: Session, trip_id: int):
    # Retrieve Trip
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.status != TripStatus.draft:
        raise HTTPException(status_code=400, detail="Trip is not in draft status")

    vehicle = trip.vehicle
    driver = trip.driver

    # Validations
    if trip.weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=400, detail=f"Cargo weight ({trip.weight}kg) exceeds vehicle capacity ({vehicle.max_load_capacity}kg)")
    
    if vehicle.status != VehicleStatus.available:
        raise HTTPException(status_code=400, detail="Vehicle is not available")
        
    if driver.status != DriverStatus.available:
        raise HTTPException(status_code=400, detail="Driver is not available")
        
    if driver.license_expiry_date <= datetime.date.today():
        raise HTTPException(status_code=400, detail="Driver's license is expired")

    # Update statuses
    try:
        trip.status = TripStatus.dispatched
        vehicle.status = VehicleStatus.on_trip
        driver.status = DriverStatus.on_trip
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to dispatch trip due to a database error")

    return trip

def complete_trip(db: Session, trip_id: int):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    if trip.status != TripStatus.dispatched:
        raise HTTPException(status_code=400, detail="Only dispatched trips can be completed")

    vehicle = trip.vehicle
    driver = trip.driver

    try:
        trip.status = TripStatus.completed
        if vehicle.status == VehicleStatus.on_trip:
            vehicle.status = VehicleStatus.available
        if driver.status == DriverStatus.on_trip:
            driver.status = DriverStatus.available
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to complete trip due to a database error")

    return trip

def start_maintenance(db: Session, vehicle_id: int, description: str, cost: float):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    if vehicle.status != VehicleStatus.available:
        raise HTTPException(status_code=400, detail="Only available vehicles can be sent to maintenance")

    try:
        new_log = Maintenance(vehicle_id=vehicle_id, description=description, cost=cost)
        db.add(new_log)
        vehicle.status = VehicleStatus.in_shop
        db.commit()
        db.refresh(new_log)
        return new_log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to start maintenance")

def close_maintenance(db: Session, maintenance_id: int):
    log = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
        
    if log.is_closed:
        raise HTTPException(status_code=400, detail="Maintenance log is already closed")

    vehicle = log.vehicle

    try:
        log.is_closed = True
        if vehicle.status == VehicleStatus.in_shop:
            vehicle.status = VehicleStatus.available
        db.commit()
        db.refresh(log)
        return log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to close maintenance")
