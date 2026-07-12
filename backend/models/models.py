from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
import enum
import datetime
from db.database import Base

class RoleEnum(str, enum.Enum):
    fleet_manager = 'Fleet Manager'
    driver = 'Driver'
    safety_officer = 'Safety Officer'
    financial_analyst = 'Financial Analyst'
    dispatcher = 'Dispatcher' # Adding dispatcher as seen in UI

class VehicleStatus(str, enum.Enum):
    available = 'Available'
    on_trip = 'On Trip'
    in_shop = 'In Shop'
    retired = 'Retired'

class DriverStatus(str, enum.Enum):
    available = 'Available'
    on_trip = 'On Trip'
    off_duty = 'Off Duty'
    suspended = 'Suspended'

class TripStatus(str, enum.Enum):
    draft = 'Draft'
    dispatched = 'Dispatched'
    completed = 'Completed'
    cancelled = 'Cancelled'

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum))

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True)
    name_model = Column(String)
    type = Column(String)
    max_load_capacity = Column(Float)
    odometer = Column(Float, default=0.0)
    acquisition_cost = Column(Float)
    status = Column(Enum(VehicleStatus), default=VehicleStatus.available)

    trips = relationship("Trip", back_populates="vehicle")
    maintenances = relationship("Maintenance", back_populates="vehicle")
    expenses = relationship("Expense", back_populates="vehicle")

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    license_number = Column(String, unique=True, index=True)
    license_category = Column(String)
    license_expiry_date = Column(Date)
    contact_number = Column(String)
    safety_score = Column(Float, default=100.0)
    status = Column(Enum(DriverStatus), default=DriverStatus.available)

    trips = relationship("Trip", back_populates="driver")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    dest = Column(String)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    weight = Column(Float)
    distance = Column(Float)
    status = Column(Enum(TripStatus), default=TripStatus.draft)

    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver", back_populates="trips")

class Maintenance(Base):
    __tablename__ = "maintenances"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    description = Column(String)
    cost = Column(Float, default=0.0)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_closed = Column(Boolean, default=False)

    vehicle = relationship("Vehicle", back_populates="maintenances")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    type = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    liters = Column(Float, nullable=True)

    vehicle = relationship("Vehicle", back_populates="expenses")
