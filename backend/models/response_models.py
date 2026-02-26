from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime


class SourceInfo(BaseModel):
    """
    Information about a source used in the response.
    """
    url: str = Field(..., description="URL of the source document")
    content: str = Field(..., description="The text content that was used", min_length=1)
    score: float = Field(
        ...,
        description="Relevance score from the retrieval",
        ge=0.0,
        le=1.0
    )
    chunk_id: str = Field(..., description="Identifier for the specific chunk")


class ToolCallInfo(BaseModel):
    """
    Information about a tool call made by the agent.
    """
    name: str = Field(..., description="Name of the tool called", min_length=1)
    arguments: dict = Field(..., description="Arguments passed to the tool")
    result: dict = Field(..., description="Result returned by the tool")


class AgentResponse(BaseModel):
    """
    Contains the agent's answer to the user's question.
    """
    answer: str = Field(..., description="The agent's response to the question", min_length=1)
    sources: List[SourceInfo] = Field(
        default_factory=list,
        description="List of sources used to generate the answer"
    )
    confidence: float = Field(
        ...,
        description="Overall confidence score for the response",
        ge=0.0,
        le=1.0
    )
    tool_calls: List[ToolCallInfo] = Field(
        default_factory=list,
        description="Information about tools called during processing"
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the response was generated")


class ErrorResponse(BaseModel):
    """
    Error response model for API errors.
    """
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the error occurred")