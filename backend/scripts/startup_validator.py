"""
Main validation script for the RAG backend startup validation.
This script verifies, configures, and starts the FastAPI-based RAG backend.
"""

import sys
import os
from typing import Dict, List, Optional
from datetime import datetime

# Add the backend directory to the Python path to enable imports
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

# Import modules using direct paths
from scripts.dependency_utils import validate_and_install_dependencies, check_installed_packages, get_package_version
from scripts.logging_utils import setup_logging, log_validation_step, log_error, log_dependency_check, format_validation_result, log_dependency_validation_start, log_dependency_validation_result, log_dependency_installation_start, log_fastapi_validation_start, log_fastapi_validation_result
from scripts.fastapi_utils import validate_fastapi_instance, validate_fastapi_file
from scripts.health_check_utils import perform_health_check, wait_for_server_health, validate_health_response
from scripts.server_utils import start_backend_server, stop_backend_server, create_default_server_config, ServerManager
from scripts.monitoring_utils import ValidationMonitor, time_it, log_function_calls, ResourceMonitor
from api.models.validation import DependencyList, FastAPIValidator
from api.models.validation_result import ValidationError, ValidationStepResult, ValidationResultOverall, DependencyValidationResult, FastAPIValidationResult
from api.models.server_config import ServerConfig


def validate_dependencies(dependency_list: DependencyList) -> ValidationStepResult:
    """
    Validate that required dependencies are installed.

    Args:
        dependency_list: List of required dependencies to check

    Returns:
        ValidationStepResult containing the result of the dependency validation
    """
    logger = setup_logging()
    log_validation_step(logger, "dependency_validation", "start")
    log_dependency_validation_start(logger, dependency_list.packages)

    try:
        # Check current installation status
        current_status = check_installed_packages(dependency_list.packages)

        # Log the status of each dependency and create validation results
        all_installed = True
        details = {}
        dependency_results = []

        for package in dependency_list.packages:
            is_installed = current_status[package]
            version = get_package_version(package) if is_installed else None
            log_dependency_validation_result(logger, package, is_installed, version)

            # Create a dependency validation result object
            dep_result = DependencyValidationResult(
                package_name=package,
                is_installed=is_installed,
                version=version
            )
            dependency_results.append(dep_result)

            details[package] = {"installed": is_installed, "version": version}

            if not is_installed:
                all_installed = False

        # Validate and install missing dependencies
        if not all_installed:
            logger.info("Some dependencies are missing. Installing required packages...")

            # Determine which packages are missing
            missing_packages = [pkg for pkg in dependency_list.packages if not current_status[pkg]]
            log_dependency_installation_start(logger, missing_packages)

            installation_results = validate_and_install_dependencies(dependency_list)

            # Update details and dependency results with installation results
            for package, status in installation_results.items():
                details[package]["installation_status"] = status
                # Find the corresponding dependency result and update it
                for dep_result in dependency_results:
                    if dep_result.package_name == package:
                        dep_result.installation_status = status
                        if status in ["installed", "already_present"]:
                            dep_result.is_installed = True
                        else:
                            all_installed = False  # If any package failed to install, overall validation fails
                        break

        result = ValidationStepResult(
            step_name="dependency_validation",
            is_valid=all_installed,
            details={
                "dependency_results": [result.__dict__ for result in dependency_results],
                "summary": details
            }
        )

        status = "success" if all_installed else "failed"
        log_validation_step(logger, "dependency_validation", status, f"All required dependencies installed: {all_installed}")
        format_validation_result(logger, all_installed, "Dependency validation completed")

        return result

    except Exception as e:
        logger.error(f"Error during dependency validation: {str(e)}")
        error = log_error(
            logger,
            "dependency_missing",
            f"Failed to validate dependencies: {str(e)}",
            "dependency_validation",
            "Check that pip is available and that you have internet connection for package installation"
        )

        result = ValidationStepResult(
            step_name="dependency_validation",
            is_valid=False,
            error=error
        )

        log_validation_step(logger, "dependency_validation", "failed", str(e))
        return result


def validate_fastapi_config(file_path: str = "api_main.py", expected_instance_name: str = "app") -> ValidationStepResult:
    """
    Validate that the specified file contains a FastAPI instance with the expected name.

    Args:
        file_path: Path to the file to validate (default: "main.py")
        expected_instance_name: Expected name of the FastAPI instance (default: "app")

    Returns:
        ValidationStepResult containing the result of the FastAPI validation
    """
    logger = setup_logging()
    log_validation_step(logger, "fastapi_validation", "start")
    log_fastapi_validation_start(logger, file_path, expected_instance_name)

    try:
        # Create FastAPIValidator instance
        fastapi_validator = FastAPIValidator(
            file_path=file_path,
            expected_instance_name=expected_instance_name
        )

        # Perform the validation
        result = validate_fastapi_instance(fastapi_validator)

        # Log the validation result
        log_fastapi_validation_result(
            logger,
            result.is_valid,
            file_path,
            expected_instance_name,
            result.line_numbers,
            result.error_message
        )

        if result.is_valid:
            log_validation_step(logger, "fastapi_validation", "success")
        else:
            log_validation_step(logger, "fastapi_validation", "failed", result.error_message)

        # Create a FastAPI validation result object
        fastapi_result = FastAPIValidationResult(
            file_path=file_path,
            expected_instance_name=expected_instance_name,
            is_valid=result.is_valid,
            found_instances=result.line_numbers,
            error_message=result.error_message
        )

        validation_step_result = ValidationStepResult(
            step_name="fastapi_validation",
            is_valid=result.is_valid,
            details={
                "fastapi_validation_result": fastapi_result.__dict__,
                "file_path": file_path,
                "expected_instance_name": expected_instance_name,
                "found_instances": result.line_numbers,
                "error_message": result.error_message
            }
        )

        format_validation_result(logger, result.is_valid, f"FastAPI validation completed for {file_path}")

        return validation_step_result

    except Exception as e:
        logger.error(f"Error during FastAPI validation: {str(e)}")
        error = log_error(
            logger,
            "config_invalid",
            f"Failed to validate FastAPI configuration: {str(e)}",
            "fastapi_validation",
            f"Check that {file_path} exists and contains a FastAPI instance named '{expected_instance_name}'"
        )

        result = ValidationStepResult(
            step_name="fastapi_validation",
            is_valid=False,
            error=error
        )

        log_validation_step(logger, "fastapi_validation", "failed", str(e))
        return result


def validate_server_startup() -> tuple[ValidationStepResult, Optional[ServerManager]]:
    """
    Start the backend server and validate that it starts successfully.

    Returns:
        Tuple containing (ValidationStepResult, Optional[ServerManager])
        The ServerManager is returned if server started successfully, None otherwise
    """
    logger = setup_logging()
    log_validation_step(logger, "server_startup", "start")

    try:
        # Create server configuration with the correct app module
        server_config = ServerConfig(
            command="uvicorn api_main:app --reload --host 127.0.0.1 --port 8000",
            host="127.0.0.1",
            port=8000,
            reload=True,
            startup_timeout=300
        )

        logger.info(f"Starting backend server with command: {server_config.command}")

        # Start the server
        server_manager = start_backend_server(server_config)

        if server_manager.is_running:
            logger.info(f"Server started successfully on {server_config.host}:{server_config.port}")
            log_validation_step(logger, "server_startup", "success")

            validation_result = ValidationStepResult(
                step_name="server_startup",
                is_valid=True,
                details={
                    "server_config": server_config.__dict__,
                    "pid": server_manager.process.pid if server_manager.process else None
                }
            )

            return validation_result, server_manager
        else:
            logger.error("Failed to start server")
            log_validation_step(logger, "server_startup", "failed", "Server failed to start")

            validation_result = ValidationStepResult(
                step_name="server_startup",
                is_valid=False,
                details={
                    "server_config": server_config.__dict__,
                    "error": "Server failed to start"
                }
            )

            return validation_result, None

    except Exception as e:
        logger.error(f"Error during server startup: {str(e)}")
        error = log_error(
            logger,
            "server_error",
            f"Failed to start backend server: {str(e)}",
            "server_startup",
            "Check that the server command is correct and that required dependencies are installed"
        )

        validation_result = ValidationStepResult(
            step_name="server_startup",
            is_valid=False,
            error=error
        )

        log_validation_step(logger, "server_startup", "failed", str(e))
        return validation_result, None


def validate_health_check(server_manager: Optional[ServerManager]) -> ValidationStepResult:
    """
    Perform a health check on the running backend server.

    Args:
        server_manager: ServerManager instance managing the server, or None if server didn't start

    Returns:
        ValidationStepResult containing the result of the health check
    """
    logger = setup_logging()
    log_validation_step(logger, "health_check", "start")

    try:
        if not server_manager or not server_manager.is_running:
            error_msg = "Server is not running, cannot perform health check"
            logger.error(error_msg)
            log_validation_step(logger, "health_check", "failed", error_msg)

            validation_result = ValidationStepResult(
                step_name="health_check",
                is_valid=False,
                details={
                    "error": error_msg,
                    "server_running": bool(server_manager and server_manager.is_running)
                }
            )

            return validation_result

        # Wait for server to become healthy
        logger.info("Waiting for server to become healthy...")
        health_result = wait_for_server_health(host="127.0.0.1", port=8000, max_wait_time=30, check_interval=2)

        if health_result.is_healthy:
            logger.info("Health check passed: Server is responding correctly")
            log_validation_step(logger, "health_check", "success")

            validation_result = ValidationStepResult(
                step_name="health_check",
                is_valid=True,
                details={
                    "health_result": health_result.__dict__,
                    "server_response": health_result.response_body
                }
            )
        else:
            error_msg = f"Health check failed: {health_result.error_message}"
            logger.error(error_msg)
            log_validation_step(logger, "health_check", "failed", error_msg)

            validation_result = ValidationStepResult(
                step_name="health_check",
                is_valid=False,
                details={
                    "health_result": health_result.__dict__,
                    "error": error_msg
                }
            )

        return validation_result

    except Exception as e:
        logger.error(f"Error during health check: {str(e)}")
        error = log_error(
            logger,
            "server_error",
            f"Failed to perform health check: {str(e)}",
            "health_check",
            "Check that the server is running and the health endpoint is accessible"
        )

        validation_result = ValidationStepResult(
            step_name="health_check",
            is_valid=False,
            error=error
        )

        log_validation_step(logger, "health_check", "failed", str(e))
        return validation_result


def main():
    """
    Main function to run the RAG backend startup validation.
    """
    logger = setup_logging()
    logger.info("Starting RAG Backend Startup Validation Process")

    # Initialize monitoring
    monitor = ValidationMonitor(logger)
    resource_monitor = ResourceMonitor()

    monitor.start_monitoring()
    resource_monitor.log_system_stats(logger)

    # Define the required dependencies for the RAG backend
    required_packages = [
        "fastapi",
        "uvicorn",
        "requests",
        "cohere",
        "qdrant_client",  # Note: package name is qdrant-client but import is qdrant_client
        "dotenv"  # Note: package name is python-dotenv but import is dotenv
    ]

    dependency_list = DependencyList(packages=required_packages)

    # Initialize the overall validation result
    start_time = datetime.now()
    step_results = {}

    # Run dependency validation
    dep_result = validate_dependencies(dependency_list)
    step_results["dependency_validation"] = dep_result

    # Log system stats after dependency validation
    resource_monitor.log_system_stats(logger)

    # Run FastAPI validation (only if dependencies are valid)
    if dep_result.is_valid:
        fastapi_result = validate_fastapi_config()
        step_results["fastapi_validation"] = fastapi_result
    else:
        logger.warning("Skipping FastAPI validation due to dependency validation failure")
        # Create a validation result indicating the step was skipped
        skipped_result = ValidationStepResult(
            step_name="fastapi_validation",
            is_valid=False,
            details={"skipped": True, "reason": "dependency validation failed"}
        )
        step_results["fastapi_validation"] = skipped_result

    # Log system stats after FastAPI validation
    resource_monitor.log_system_stats(logger)

    # Run server startup validation (only if previous validations passed)
    server_manager = None
    if all(result.is_valid for result in step_results.values() if not result.details.get("skipped", False)):
        server_result, server_manager = validate_server_startup()
        step_results["server_startup"] = server_result
    else:
        logger.warning("Skipping server startup due to previous validation failures")
        # Create a validation result indicating the step was skipped
        skipped_result = ValidationStepResult(
            step_name="server_startup",
            is_valid=False,
            details={"skipped": True, "reason": "previous validations failed"}
        )
        step_results["server_startup"] = skipped_result

    # Log system stats after server startup
    resource_monitor.log_system_stats(logger)

    # Run health check validation (only if server started successfully)
    if server_manager:
        health_result = validate_health_check(server_manager)
        step_results["health_check"] = health_result
    else:
        logger.warning("Skipping health check due to server startup failure")
        # Create a validation result indicating the step was skipped
        skipped_result = ValidationStepResult(
            step_name="health_check",
            is_valid=False,
            details={"skipped": True, "reason": "server startup failed"}
        )
        step_results["health_check"] = skipped_result

    # Log system stats after health check
    resource_monitor.log_system_stats(logger)

    # Stop the server if it was started (cleanup)
    if server_manager:
        logger.info("Stopping backend server...")
        stop_backend_server(server_manager)

    # Calculate execution time
    end_time = datetime.now()
    execution_time = (end_time - start_time).total_seconds()

    # Determine overall status
    all_valid = all(result.is_valid for result in step_results.values() if result.error is None and not result.details.get("skipped", False))
    any_errors = any(result.error for result in step_results.values())

    overall_status = "success" if all_valid and not any_errors else "failed"

    overall_result = ValidationResultOverall(
        step_results=step_results,
        overall_status=overall_status,
        execution_time=execution_time
    )

    logger.info(f"Validation process completed in {execution_time:.2f} seconds")
    logger.info(f"Overall status: {overall_status}")

    # Stop monitoring and log summary
    summary = monitor.stop_monitoring()
    resource_monitor.log_system_stats(logger)

    # Exit with appropriate code
    sys.exit(0 if overall_status == "success" else 1)


if __name__ == "__main__":
    main()