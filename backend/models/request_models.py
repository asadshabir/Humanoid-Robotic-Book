from pydantic import BaseModel, Field
from typing import Optional


class QuestionRequest(BaseModel):
    """
    Represents a user's question submitted to the system.
    """
    query: str = Field(..., description="The user's question text", min_length=1)
    max_results: Optional[int] = Field(
        default=5,
        description="Maximum number of results to retrieve",
        ge=1,
        le=10
    )
    confidence_threshold: Optional[float] = Field(
        default=0.7,
        description="Minimum confidence score for retrieved results",
        ge=0.0,
        le=1.0
    )