from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from backend.utils.logging import setup_logging
from backend.config.settings import settings
import uvicorn
import logging
from typing import Dict, Any


# Set up logging
setup_logging()

# Create FastAPI app instance
app = FastAPI(
    title="Agent-based RAG Backend API",
    description="API for question answering using OpenAI agent with Qdrant retrieval",
    version="1.0.0",
    debug=settings.debug,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    Handle request validation errors.
    """
    logger = logging.getLogger(__name__)
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "details": exc.errors(),
            "message": "Invalid request parameters"
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Handle general exceptions.
    """
    logger = logging.getLogger(__name__)
    logger.error(f"General error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )


@app.get("/")
def read_root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Agent-based RAG Backend API is running"}


@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "service": "agent-rag-backend"}


@app.get("/ready")
def readiness_check():
    """
    Readiness check endpoint.
    """
    # In a real implementation, you might check if external services are available
    return {"status": "ready", "service": "agent-rag-backend"}


# Include routes
from backend.api.routes import question_answer
app.include_router(question_answer.router, prefix="/api/v1", tags=["question-answer"])


if __name__ == "__main__":
    uvicorn.run(
        "backend.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.debug else False
    )