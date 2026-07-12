from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Vehicle, Trip, Driver, VehicleStatus, TripStatus, DriverStatus, Expense, Maintenance
from schemas.schemas import DataResponse
from sqlalchemy import func

router = APIRouter()

@router.get("/dashboard/stats", response_model=DataResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_vehicles = db.query(Vehicle).count()
    active_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.on_trip).count()
    available_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.available).count()
    in_shop_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.in_shop).count()

    active_trips = db.query(Trip).filter(Trip.status == TripStatus.dispatched).count()
    pending_trips = db.query(Trip).filter(Trip.status == TripStatus.draft).count()

    drivers_on_duty = db.query(Driver).filter(Driver.status == DriverStatus.on_trip).count()

    utilization = 0
    if total_vehicles > 0:
        utilization = round((active_vehicles / total_vehicles) * 100)

    stats = {
        "activeVehicles": active_vehicles,
        "availableVehicles": available_vehicles,
        "inShopVehicles": in_shop_vehicles,
        "activeTrips": active_trips,
        "pendingTrips": pending_trips,
        "driversOnDuty": drivers_on_duty,
        "utilization": utilization
    }
    return {"data": stats}

@router.get("/reports/financial", response_model=DataResponse)
def get_financial_reports(db: Session = Depends(get_db)):

    total_fuel = db.query(func.sum(Expense.amount)).filter(Expense.type == 'Fuel').scalar() or 0.0
    total_maint = db.query(func.sum(Maintenance.cost)).scalar() or 0.0

    total_revenue = 15000.00
    avg_roi = round(((total_revenue - (total_fuel + total_maint)) / (total_fuel + total_maint + 1)) * 100, 2)

    metrics = {
        "totalFuelCost": float(total_fuel),
        "totalMaintCost": float(total_maint),
        "avgEfficiency": 8.5,
        "avgROI": avg_roi
    }

    vehicles = db.query(Vehicle).all()
    vehicle_reports = []
    for v in vehicles:
        v_fuel = db.query(func.sum(Expense.amount)).filter(Expense.vehicle_id == v.id, Expense.type == 'Fuel').scalar() or 0.0
        v_maint = db.query(func.sum(Maintenance.cost)).filter(Maintenance.vehicle_id == v.id).scalar() or 0.0
        v_distance = db.query(func.sum(Trip.distance)).filter(Trip.vehicle_id == v.id, Trip.status == TripStatus.completed).scalar() or 0.0
        v_liters = db.query(func.sum(Expense.liters)).filter(Expense.vehicle_id == v.id, Expense.type == 'Fuel').scalar() or 0.0

        v_revenue = 5000.00
        v_efficiency = round(v_distance / v_liters, 2) if v_liters > 0 else 0
        v_roi = round(((v_revenue - (v_fuel + v_maint)) / (v_fuel + v_maint + 1)) * 100, 2)

        vehicle_reports.append({
            "_id": v.id,
            "registrationNumber": v.registration_number,
            "revenue": v_revenue,
            "fuelCost": float(v_fuel),
            "maintCost": float(v_maint),
            "distance": float(v_distance),
            "fuelUsed": float(v_liters),
            "efficiency": v_efficiency,
            "roi": v_roi
        })

    return {"data": {"metrics": metrics, "vehicles": vehicle_reports}}
