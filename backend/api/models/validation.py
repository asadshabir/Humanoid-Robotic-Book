"""
Data models for validation entities based on the specification.
"""

from typing import List, Dict, Optional, Union
from dataclasses import dataclass
from datetime import datetime


@dataclass
class DependencyList:
    """
    Represents the required Python packages that must be installed for the RAG backend to function
    """
    packages: List[str]  # List of required package names
    required_versions: Optional[Dict[str, str]] = None  # Mapping of package names to required version constraints
    installation_status: Optional[Dict[str, str]] = None  # Mapping of package names to installation status (installed, missing, outdated)

    def __post_init__(self):
        """Validate that packages list is not empty"""
        if not self.packages or len(self.packages) == 0:
            raise ValueError("packages must contain at least one package name")


@dataclass
class FastAPIValidator:
    """
    Represents the validation logic that checks for FastAPI instance named `app` in main.py
    """
    file_path: str  # Path to the file being validated (typically main.py)
    expected_instance_name: str = "app"  # Name of the FastAPI instance (default: "app")
    validation_result: Optional['ValidationResult'] = None  # Result of the validation process


@dataclass
class ValidationResult:
    """
    Represents the result of the validation process
    """
    is_valid: bool  # Whether the validation passed
    error_message: Optional[str] = None  # Error message if validation failed
    line_numbers: Optional[List[int]] = None  # Line numbers where FastAPI instance was found

