import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import shoes, dashboard, categories, brands, suppliers, locations, colors, materials, sizes, seasons, genders, sales

app = FastAPI(
    title="Inventario Zapatos API",
    description="API para gestionar inventario de tienda de zapatos",
    version="1.0.0"
)

# CORS configuration - allow Vercel frontend and localhost
cors_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://zapatos-pink.vercel.app",
]
# Add any additional frontend URLs from environment variable
if os.getenv("FRONTEND_URLS"):
    cors_origins.extend(os.getenv("FRONTEND_URLS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(shoes.router)
app.include_router(dashboard.router)
app.include_router(categories.router)
app.include_router(brands.router)
app.include_router(suppliers.router)
app.include_router(locations.router)
app.include_router(colors.router)
app.include_router(materials.router)
app.include_router(sizes.router)
app.include_router(seasons.router)
app.include_router(genders.router)
app.include_router(sales.router)

@app.get("/")
def root():
    return {"message": "Inventario Zapatos API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
