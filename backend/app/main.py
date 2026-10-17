from fastapi import FastAPI

from app.api.v1.router import api_router

app = FastAPI(
    title="IkramFashionShop API",
    description="Backend API for the IkramFashionShop e-commerce platform.",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Welcome to IkramFashionShop API",
        "docs": "/docs",
    }