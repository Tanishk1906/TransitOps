from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from api.routers import auth, vehicles, drivers, trips, maintenance, expenses, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TransitOps API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(vehicles.router, prefix="/api/vehicles", tags=["vehicles"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["drivers"])
app.include_router(trips.router, prefix="/api/trips", tags=["trips"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["maintenance"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])

# Note: The frontend uses /dashboard/stats and /reports/financial directly
# We'll map analytics router to the root /api to cover those paths
app.include_router(analytics.router, prefix="/api", tags=["analytics"])

@app.get("/")
def root():
    return {"message": "TransitOps API is running"}
