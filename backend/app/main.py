import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from app.config import settings
from app.routers import rag,chat
from app.routers import air_quality
from app.routers import outbreak_alert
from app.routers import predict_disease

from app.routers import doctors







app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI Health Assistant with RAG-powered medical knowledge"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rag.router)
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(air_quality.router, prefix="/api", tags=["Air Quality"])
app.include_router(outbreak_alert.router, prefix="/api", tags=["Outbreak"])
app.include_router(predict_disease.router, prefix="/api", tags=["Prediction"])

app.include_router(doctors.router, prefix="/api", tags=["Doctors"])

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.version,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": settings.version
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.debug)
