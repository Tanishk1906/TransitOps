from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from typing import List, Optional
from datetime import date, datetime
from models.models import RoleEnum, VehicleStatus, DriverStatus, TripStatus

class BaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel, from_attributes=True)

class UserCreate(BaseSchema):
    email: str
    password: str
    role: RoleEnum

class UserResponse(BaseSchema):
    id: int = Field(alias="_id")
    email: str
    role: RoleEnum

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class VehicleBase(BaseSchema):
    registration_number: str
    name_model: str
    type: str
    max_load_capacity: float
    odometer: float = 0.0
    acquisition_cost: float
    status: VehicleStatus = VehicleStatus.available

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int = Field(alias="_id")

class DriverBase(BaseSchema):
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: float = 100.0
    status: DriverStatus = DriverStatus.available

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: int = Field(alias="_id")

class TripBase(BaseSchema):
    source: str
    dest: str
    weight: float
    distance: float

class TripCreate(TripBase):
    vehicle: str
    driver: str

    vehicle_id: int
    driver_id: int

class TripResponse(TripBase):
    id: int = Field(alias="_id")
    vehicle_id: int
    driver_id: int
    status: TripStatus

    vehicle: Optional[VehicleResponse] = None
    driver: Optional[DriverResponse] = None

class MaintenanceBase(BaseSchema):
    description: str
    cost: float = 0.0

class MaintenanceCreate(MaintenanceBase):
    vehicle_id: int

class MaintenanceResponse(MaintenanceBase):
    id: int = Field(alias="_id")
    vehicle_id: int
    start_date: datetime
    is_closed: bool
    vehicle: Optional[VehicleResponse] = Field(None, alias="vehicleId")

class ExpenseBase(BaseSchema):
    type: str
    amount: float
    date: datetime
    liters: Optional[float] = None

class ExpenseCreate(ExpenseBase):
    vehicle_id: int

class ExpenseResponse(ExpenseBase):
    id: int = Field(alias="_id")
    vehicle_id: int
    vehicle: Optional[VehicleResponse] = Field(None, alias="vehicleId")

class DataResponse(BaseModel):
    data: list | dict | str | int | float
