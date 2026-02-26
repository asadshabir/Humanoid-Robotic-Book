# Data Model: RAG Backend Startup & Validation Automation

## Overview
This document defines the data models for the backend validation and startup automation system. It captures the entities identified in the feature specification and defines their structure and relationships.

## Entity: DependencyList

**Description**: Represents the required Python packages that must be installed for the RAG backend to function

**Fields**:
- `packages` (array of strings, required): List of required package names
- `required_versions` (object, optional): Mapping of package names to required version constraints
- `installation_status` (object, optional): Mapping of package names to installation status (installed, missing, outdated)

**Validation Rules**:
- `packages` must contain at least one package name
- Package names must follow Python package naming conventions
- Version constraints must follow PEP 440 standards

## Entity: FastAPIValidator

**Description**: Represents the validation logic that checks for FastAPI instance named `app` in main.py

**Fields**:
- `file_path` (string, required): Path to the file being validated (typically main.py)
- `expected_instance_name` (string, required): Name of the FastAPI instance (default: "app")
- `validation_result` (object, optional): Result of the validation process
  - `is_valid` (boolean, required): Whether the validation passed
  - `error_message` (string, optional): Error message if validation failed
  - `line_numbers` (array of numbers, optional): Line numbers where FastAPI instance was found

**Validation Rules**:
- `file_path` must be a valid file path
- `expected_instance_name` must be a valid Python variable name
- `validation_result.is_valid` must be a boolean

## Entity: ServerConfig

**Description**: Represents the configuration for starting the backend server

**Fields**:
- `command` (string, required): The command to start the server (e.g., "uvicorn main:app --reload")
- `host` (string, optional): Host address for the server (default: "127.0.0.1")
- `port` (number, optional): Port number for the server (default: 8000)
- `reload` (boolean, optional): Whether to enable auto-reload (default: true)
- `startup_timeout` (number, optional): Timeout in seconds for server startup (default: 300 for 5 minutes)

**Validation Rules**:
- `port` must be between 1 and 65535
- `host` must be a valid IP address or hostname
- `startup_timeout` must be a positive number

## Entity: HealthCheckResult

**Description**: Represents the result of the health check performed on the `/health` endpoint

**Fields**:
- `is_healthy` (boolean, required): Whether the health check passed
- `status_code` (number, optional): HTTP status code received
- `response_body` (string or object, optional): Response body from the health endpoint
- `response_time` (number, optional): Time in milliseconds to receive the response
- `error_message` (string, optional): Error message if health check failed
- `timestamp` (Date, required): When the health check was performed

**Validation Rules**:
- `status_code` must be between 100 and 599
- `response_time` must be a positive number
- `is_healthy` must be true when `status_code` is 200 and response matches expected format

## Entity: ValidationResult

**Description**: Represents the overall result of the validation and startup process

**Fields**:
- `step_results` (object, required): Results for each validation step
  - `dependencies_validated` (boolean, required): Whether dependency validation passed
  - `fastapi_config_validated` (boolean, required): Whether FastAPI configuration validation passed
  - `server_started` (boolean, required): Whether server started successfully
  - `health_check_passed` (boolean, required): Whether health check passed
- `overall_status` (enum, required): Overall status ("success", "partial", "failed")
- `execution_time` (number, required): Total time in seconds for the entire process
- `error_details` (array of objects, optional): Detailed error information for each failure
- `actionable_steps` (array of strings, optional): Steps to resolve any issues found

**Validation Rules**:
- `overall_status` must be one of the allowed values
- `execution_time` must be a positive number
- `step_results` must contain all required boolean fields

## Entity: ValidationError

**Description**: Represents an error that occurred during the validation process

**Fields**:
- `error_type` (enum, required): Type of error ("dependency_missing", "config_invalid", "server_error", "network_error", "timeout")
- `message` (string, required): Human-readable error message
- `suggested_fix` (string, optional): Suggested fix for the error
- `timestamp` (Date, required): When the error occurred
- `step` (string, required): Which validation step the error occurred in

**Validation Rules**:
- `error_type` must be one of the allowed values
- `message` must not be empty
- `step` must be one of the defined validation steps

## State Transitions

### ValidationResult State Transitions
1. `initial` → `validating_dependencies` (when dependency validation starts)
2. `validating_dependencies` → `validating_config` (when dependency validation completes)
3. `validating_config` → `starting_server` (when config validation completes)
4. `starting_server` → `checking_health` (when server starts successfully)
5. `checking_health` → `success` (when health check passes)
6. Any state → `failed` (when any validation step fails)
7. `checking_health` → `partial` (when server starts but health check fails)

### ServerConfig State Transitions
1. `configured` → `starting` (when server startup begins)
2. `starting` → `running` (when server is confirmed to be running)
3. `starting` → `failed` (when server fails to start)
4. `running` → `stopped` (when server is shut down)