"""
Logging and error handling utilities for the RAG backend startup validation.
"""

import logging
import sys
import os
from typing import Optional, List
from datetime import datetime

# Add backend directory to path to allow imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
from api.models.validation_result import ValidationError


def setup_logging(level: str = "INFO") -> logging.Logger:
    """
    Set up logging configuration for the validation process.

    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

    Returns:
        Configured logger instance
    """
    # Create logger
    logger = logging.getLogger("rag_backend_validator")
    logger.setLevel(getattr(logging, level.upper()))

    # Prevent adding multiple handlers if logger already configured
    if logger.handlers:
        return logger

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, level.upper()))

    # Create file handler
    file_handler = logging.FileHandler("validation.log")
    file_handler.setLevel(getattr(logging, level.upper()))

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger


def log_validation_step(
    logger: logging.Logger,
    step_name: str,
    status: str,
    details: Optional[str] = None
) -> None:
    """
    Log a validation step with its status and details.

    Args:
        logger: Logger instance to use
        step_name: Name of the validation step
        status: Status of the step (start, success, failed, skipped)
        details: Additional details about the step
    """
    if status == "start":
        logger.info(f"Starting validation step: {step_name}")
    elif status == "success":
        logger.info(f"Validation step '{step_name}' completed successfully")
        if details:
            logger.info(f"  Details: {details}")
    elif status == "failed":
        logger.error(f"Validation step '{step_name}' failed")
        if details:
            logger.error(f"  Error: {details}")
    elif status == "skipped":
        logger.warning(f"Validation step '{step_name}' was skipped")
        if details:
            logger.warning(f"  Reason: {details}")
    else:
        logger.info(f"Validation step '{step_name}': {status}")
        if details:
            logger.info(f"  Details: {details}")


def log_error(
    logger: logging.Logger,
    error_type: str,
    message: str,
    step: str,
    suggested_fix: Optional[str] = None
) -> ValidationError:
    """
    Log an error and return a ValidationError object.

    Args:
        logger: Logger instance to use
        error_type: Type of error (dependency_missing, config_invalid, server_error, etc.)
        message: Human-readable error message
        step: Which validation step the error occurred in
        suggested_fix: Suggested fix for the error (optional)

    Returns:
        ValidationError object with the error details
    """
    logger.error(f"ERROR [{error_type}] in step '{step}': {message}")

    if suggested_fix:
        logger.error(f"Suggested fix: {suggested_fix}")

    error = ValidationError(
        error_type=error_type,
        message=message,
        timestamp=datetime.now(),
        step=step,
        suggested_fix=suggested_fix
    )

    return error


def log_dependency_check(
    logger: logging.Logger,
    package_name: str,
    is_installed: bool,
    version: Optional[str] = None
) -> None:
    """
    Log the result of a dependency check.

    Args:
        logger: Logger instance to use
        package_name: Name of the package being checked
        is_installed: Whether the package is installed
        version: Version of the package if installed
    """
    if is_installed:
        if version:
            logger.info(f"Dependency '{package_name}' is installed (version: {version})")
        else:
            logger.info(f"Dependency '{package_name}' is installed")
    else:
        logger.warning(f"Dependency '{package_name}' is not installed")


def log_server_status(
    logger: logging.Logger,
    status: str,
    details: Optional[str] = None
) -> None:
    """
    Log server startup or health check status.

    Args:
        logger: Logger instance to use
        status: Status message
        details: Additional details about the server status
    """
    logger.info(f"Server status: {status}")
    if details:
        logger.info(f"  Details: {details}")


def format_validation_result(logger: logging.Logger, is_valid: bool, message: str) -> None:
    """
    Format and log a validation result.

    Args:
        logger: Logger instance to use
        is_valid: Whether the validation passed
        message: Message describing the validation result
    """
    status = "PASSED" if is_valid else "FAILED"
    logger.info(f"Validation {status}: {message}")


def log_dependency_validation_start(logger: logging.Logger, packages: List[str]) -> None:
    """
    Log the start of dependency validation process.

    Args:
        logger: Logger instance to use
        packages: List of packages to be validated
    """
    logger.info(f"Starting dependency validation for {len(packages)} packages: {', '.join(packages)}")


def log_dependency_validation_result(
    logger: logging.Logger,
    package: str,
    is_installed: bool,
    version: Optional[str] = None,
    required: bool = True
) -> None:
    """
    Log the result of a dependency validation.

    Args:
        logger: Logger instance to use
        package: Name of the package
        is_installed: Whether the package is installed
        version: Version of the package if installed
        required: Whether this package is required
    """
    status = "INSTALLED" if is_installed else "MISSING"
    if is_installed and version:
        logger.info(f"Package '{package}' {status} (version: {version})")
    else:
        logger.info(f"Package '{package}' {status}")

    if not is_installed and required:
        logger.warning(f"Required package '{package}' is missing and will need to be installed")


def log_dependency_installation_start(logger: logging.Logger, packages: List[str]) -> None:
    """
    Log the start of dependency installation process.

    Args:
        logger: Logger instance to use
        packages: List of packages to be installed
    """
    logger.info(f"Starting installation of {len(packages)} missing packages: {', '.join(packages)}")


def log_dependency_installation_result(
    logger: logging.Logger,
    package: str,
    success: bool,
    error_message: Optional[str] = None
) -> None:
    """
    Log the result of a dependency installation.

    Args:
        logger: Logger instance to use
        package: Name of the package
        success: Whether the installation was successful
        error_message: Error message if installation failed
    """
    if success:
        logger.info(f"Successfully installed package '{package}'")
    else:
        logger.error(f"Failed to install package '{package}'")
        if error_message:
            logger.error(f"  Error: {error_message}")


def log_fastapi_validation_start(logger: logging.Logger, file_path: str, expected_name: str) -> None:
    """
    Log the start of FastAPI validation process.

    Args:
        logger: Logger instance to use
        file_path: Path of the file being validated
        expected_name: Expected name of the FastAPI instance
    """
    logger.info(f"Starting FastAPI validation for file: {file_path}, expecting instance named: '{expected_name}'")


def log_fastapi_validation_result(
    logger: logging.Logger,
    is_valid: bool,
    file_path: str,
    expected_name: str,
    line_numbers: Optional[List[int]] = None,
    error_message: Optional[str] = None
) -> None:
    """
    Log the result of FastAPI validation.

    Args:
        logger: Logger instance to use
        is_valid: Whether the validation passed
        file_path: Path of the file being validated
        expected_name: Expected name of the FastAPI instance
        line_numbers: Line numbers where FastAPI instances were found
        error_message: Error message if validation failed
    """
    if is_valid:
        if line_numbers:
            logger.info(f"FastAPI validation PASSED: Found '{expected_name}' instance in {file_path} at line(s): {line_numbers}")
        else:
            logger.info(f"FastAPI validation PASSED: Found '{expected_name}' instance in {file_path}")
    else:
        logger.error(f"FastAPI validation FAILED for {file_path}: {error_message}")


def log_exception(
    logger: logging.Logger,
    exception: Exception,
    context: str = "General"
) -> None:
    """
    Log an exception with full traceback information.

    Args:
        logger: Logger instance to use
        exception: Exception object to log
        context: Context where the exception occurred
    """
    logger.error(f"Exception in {context}: {str(exception)}", exc_info=True)