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
    "https://zapatos-git-main-miguel-798s-projects.vercel.app",
]
# Allow all Vercel apps
import re
if os.getenv("VERCEL_URL"):
    cors_origins.append(f"https://{os.getenv('VERCEL_URL')}")

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
