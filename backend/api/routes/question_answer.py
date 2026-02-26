from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from backend.models.request_models import QuestionRequest
from backend.models.response_models import AgentResponse, ErrorResponse
from backend.agents.agent_config import AgentConfiguration
from backend.agents.response_validator import ResponseValidator
from backend.utils.logging import get_logger
from datetime import datetime
import traceback


router = APIRouter()
logger = get_logger(__name__)

# Initialize the agent configuration and validator
agent_config = AgentConfiguration()
validator = ResponseValidator()


@router.post("/question-answer", response_model=AgentResponse)
async def question_answer_endpoint(request: QuestionRequest):
    """
    Answer a question using the RAG agent.

    Args:
        request: QuestionRequest containing the query and optional parameters

    Returns:
        AgentResponse with the answer and sources
    """
    try:
        logger.info(f"Processing question: {request.query}")

        # Run the query through the agent
        raw_response = agent_config.run_query(request.query)

        # Get the retrieved content for validation using the fallback method
        qdrant_tool = agent_config.qdrant_tool
        retrieved_content = qdrant_tool.retrieve_content_with_fallback(
            query=request.query,
            max_results=request.max_results,
            confidence_threshold=request.confidence_threshold
        )

        # Validate that the response is grounded in the retrieved content
        validation_result = validator.validate_response(
            response=raw_response,
            retrieved_content=retrieved_content,
            threshold=0.3
        )

        if not validation_result["is_valid"]:
            logger.warning(f"Response validation failed: {validation_result['message']}")
            # We can still return the response but with a warning
            # In a production system, you might want to handle this differently

        # Format the sources from retrieved content
        sources = []
        for item in retrieved_content:
            sources.append({
                "url": item.get("url", ""),
                "content": item.get("content", ""),
                "score": item.get("score", 0.0),
                "chunk_id": item.get("chunk_id", "")
            })

        # Calculate a confidence score based on validation and retrieval scores
        confidence = min(validation_result.get("confidence", 0.5), 1.0)
        if retrieved_content:
            avg_retrieval_score = sum(item.get("score", 0.0) for item in retrieved_content) / len(retrieved_content)
            confidence = (confidence + avg_retrieval_score) / 2

        # Create the response object
        response = AgentResponse(
            answer=raw_response,
            sources=sources,
            confidence=confidence,
            tool_calls=[],  # In a real implementation, capture actual tool calls
            timestamp=datetime.utcnow()
        )

        logger.info(f"Question answered successfully: {request.query[:50]}...")
        return response

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        logger.error(traceback.format_exc())

        error_response = ErrorResponse(
            error=f"Error processing question: {str(e)}",
            code="QUESTION_PROCESSING_ERROR",
            timestamp=datetime.utcnow()
        )

        # Raise an HTTP exception with the error details
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_response.dict()
        )


@router.get("/question-answer/health")
async def health_check():
    """
    Health check endpoint for the question answering service.
    """
    return {"status": "healthy", "service": "question-answer"}