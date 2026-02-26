~"""
Validation result models for the RAG backend startup validation.
"""

from typing import List, Dict, Optional, Union
from dataclasses import dataclass
from datetime import datetime


@dataclass
class DependencyValidationResult:
    """
    Specific result structure for dependency validation
    """
    package_name: str
    is_installed: bool
    version: Optional[str] = None
    installation_status: Optional[str] = None  # installed, already_present, failed_to_install, missing
    error_message: Optional[str] = None


@dataclass
class FastAPIValidationResult:
    """
    Specific result structure for FastAPI validation
    """
    file_path: str
    expected_instance_name: str
    is_valid: bool
    found_instances: Optional[List[int]] = None  # Line numbers where instances were found
    error_message: Optional[str] = None


@dataclass
class HealthCheckResult:
    """
    Represents the result of the health check performed on the `/health` endpoint
    """
    is_healthy: bool  # Whether the health check passed
    status_code: Optional[int] = None  # HTTP status code received
    response_body: Optional[Union[str, dict]] = None  # Response body from the health endpoint
    response_time: Optional[float] = None  # Time in milliseconds to receive the response
    error_message: Optional[str] = None  # Error message if health check failed
    timestamp: datetime = None  # When the health check was performed

    def __post_init__(self):
        """Set timestamp if not provided"""
        if self.timestamp is None:
            self.timestamp = datetime.now()

        """Validate status code if provided"""
        if self.status_code is not None and not 100 <= self.status_code <= 599:
            raise ValueError(f"status_code must be between 100 and 599, got {self.status_code}")

        """Validate response_time if provided"""
        if self.response_time is not None and self.response_time < 0:
            raise ValueError(f"response_time must be a positive number, got {self.response_time}")


@dataclass
class ValidationError:
    """
    Represents an error that occurred during the validation process
    """
    error_type: str  # Type of error ("dependency_missing", "config_invalid", "server_error", "network_error", "timeout")
    message: str  # Human-readable error message
    timestamp: datetime  # When the error occurred
    step: str  # Which validation step the error occurred in
    suggested_fix: Optional[str] = None  # Suggested fix for the error

    def __post_init__(self):
        """Validate error_type and message"""
        valid_error_types = ["dependency_missing", "config_invalid", "server_error", "network_error", "timeout"]
        if self.error_type not in valid_error_types:
            raise ValueError(f"error_type must be one of {valid_error_types}, got {self.error_type}")

        if not self.message or self.message.strip() == "":
            raise ValueError("message must not be empty")

        if self.timestamp is None:
            self.timestamp = datetime.now()


@dataclass
class ValidationStepResult:
    """
    Represents the result of a single validation step
    """
    step_name: str  # Name of the validation step
    is_valid: bool  # Whether the step passed
    details: Optional[dict] = None  # Additional details about the validation
    error: Optional['ValidationError'] = None  # Error that occurred during this step


@dataclass
class ValidationResultOverall:
    """
    Represents the overall result of the validation and startup process
    """
    step_results: Dict[str, 'ValidationStepResult']  # Results for each validation step
    overall_status: str  # Overall status ("success", "partial", "failed")
    execution_time: float  # Total time in seconds for the entire process
    error_details: Optional[List['ValidationError']] = None  # Detailed error information for each failure
    actionable_steps: Optional[List[str]] = None  # Steps to resolve any issues found
    timestamp: datetime = None  # When the validation process was completed

    def __post_init__(self):
        """Validate overall_status and execution_time"""
        if self.timestamp is None:
            self.timestamp = datetime.now()

        valid_statuses = ["success", "partial", "failed"]
        if self.overall_status not in valid_statuses:
            raise ValueError(f"overall_status must be one of {valid_statuses}, got {self.overall_status}")

        if self.execution_time < 0:
            raise ValueError(f"execution_time must be a positive number, got {self.execution_time}")