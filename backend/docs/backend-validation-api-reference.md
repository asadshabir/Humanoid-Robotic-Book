# Backend Validation API Reference

## Data Models

### DependencyList
Represents the required Python packages for the RAG backend.

**Properties:**
- `packages`: List[str] - List of required package names
- `required_versions`: Optional[Dict[str, str]] - Package name to version constraints mapping
- `installation_status`: Optional[Dict[str, str]] - Package name to installation status mapping

### FastAPIValidator
Represents the validation logic for checking FastAPI instance in main.py.

**Properties:**
- `file_path`: str - Path to the file being validated (typically api_main.py)
- `expected_instance_name`: str - Name of the FastAPI instance (default: "app")
- `validation_result`: Optional[ValidationResult] - Result of the validation process

### ValidationResult
Represents the result of the validation process.

**Properties:**
- `is_valid`: bool - Whether the validation passed
- `error_message`: Optional[str] - Error message if validation failed
- `line_numbers`: Optional[List[int]] - Line numbers where FastAPI instance was found

### ServerConfig
Represents the configuration for starting the backend server.

**Properties:**
- `command`: str - The command to start the server (e.g., "uvicorn api_main:app --reload")
- `host`: str - Host address for the server (default: "127.0.0.1")
- `port`: int - Port number for the server (default: 8000)
- `reload`: bool - Whether to enable auto-reload (default: true)
- `startup_timeout`: int - Timeout in seconds for server startup (default: 300 for 5 minutes)

### HealthCheckResult
Represents the result of the health check performed on the `/health` endpoint.

**Properties:**
- `is_healthy`: bool - Whether the health check passed
- `status_code`: Optional[int] - HTTP status code received
- `response_body`: Optional[Union[str, dict]] - Response body from the health endpoint
- `response_time`: Optional[float] - Time in milliseconds to receive the response
- `error_message`: Optional[str] - Error message if health check failed
- `timestamp`: datetime - When the health check was performed

### ValidationError
Represents an error that occurred during the validation process.

**Properties:**
- `error_type`: str - Type of error ("dependency_missing", "config_invalid", "server_error", "network_error", "timeout")
- `message`: str - Human-readable error message
- `timestamp`: datetime - When the error occurred
- `step`: str - Which validation step the error occurred in
- `suggested_fix`: Optional[str] - Suggested fix for the error

### ValidationStepResult
Represents the result of a single validation step.

**Properties:**
- `step_name`: str - Name of the validation step
- `is_valid`: bool - Whether the step passed
- `details`: Optional[dict] - Additional details about the validation
- `error`: Optional[ValidationError] - Error that occurred during this step

### ValidationResultOverall
Represents the overall result of the validation and startup process.

**Properties:**
- `step_results`: Dict[str, ValidationStepResult] - Results for each validation step
- `overall_status`: str - Overall status ("success", "partial", "failed")
- `execution_time`: float - Total time in seconds for the entire process
- `error_details`: Optional[List[ValidationError]] - Detailed error information for each failure
- `actionable_steps`: Optional[List[str]] - Steps to resolve any issues found
- `timestamp`: datetime - When the validation process was completed

### DependencyValidationResult
Specific result structure for dependency validation.

**Properties:**
- `package_name`: str - Name of the package
- `is_installed`: bool - Whether the package is installed
- `version`: Optional[str] - Version of the package if installed
- `installation_status`: Optional[str] - Status (installed, already_present, failed_to_install, missing)
- `error_message`: Optional[str] - Error message if validation failed

### FastAPIValidationResult
Specific result structure for FastAPI validation.

**Properties:**
- `file_path`: str - Path of the file being validated
- `expected_instance_name`: str - Expected name of the FastAPI instance
- `is_valid`: bool - Whether the validation passed
- `found_instances`: Optional[List[int]] - Line numbers where instances were found
- `error_message`: Optional[str] - Error message if validation failed

## Utility Functions

### Dependency Utilities (`backend/scripts/dependency_utils.py`)

#### `check_installed_packages(packages: List[str]) -> Dict[str, bool]`
Check if packages are installed in the current Python environment.

#### `install_package(package: str) -> bool`
Install a single package using pip.

#### `install_packages(packages: List[str]) -> Dict[str, bool]`
Install multiple packages using pip.

#### `validate_and_install_dependencies(dependency_list: DependencyList) -> Dict[str, str]`
Validate that required dependencies are installed, and install missing ones.

#### `get_package_version(package_name: str) -> Optional[str]`
Get the installed version of a package.

### FastAPI Utilities (`backend/scripts/fastapi_utils.py`)

#### `validate_fastapi_instance(fastapi_validator: FastAPIValidator) -> ValidationResult`
Validate that the specified file contains a FastAPI instance with the expected name.

#### `find_fastapi_instances(tree: ast.AST, expected_name: str) -> List[int]`
Find all FastAPI instance assignments in the AST with the expected name.

#### `validate_fastapi_file(file_path: str, expected_instance_name: str = "app") -> ValidationResult`
Convenience function to validate a FastAPI instance in a file.

### Health Check Utilities (`backend/scripts/health_check_utils.py`)

#### `perform_health_check(host: str = "127.0.0.1", port: int = 8000, timeout: int = 10) -> HealthCheckResult`
Perform a health check on the backend server.

#### `wait_for_server_health(host: str = "127.0.0.1", port: int = 8000, max_wait_time: int = 60, check_interval: int = 2) -> HealthCheckResult`
Wait for the server to become healthy by repeatedly checking the health endpoint.

#### `validate_health_response(response_body: Union[str, dict]) -> bool`
Validate that the health response has the expected format.

### Server Utilities (`backend/scripts/server_utils.py`)

#### `start_backend_server(config: ServerConfig) -> ServerManager`
Start the backend server using the provided configuration.

#### `stop_backend_server(server_manager: ServerManager) -> bool`
Stop the backend server managed by the provided ServerManager.

#### `create_default_server_config() -> ServerConfig`
Create a default server configuration.

### Logging Utilities (`backend/scripts/logging_utils.py`)

#### `setup_logging(level: str = "INFO") -> logging.Logger`
Set up logging configuration for the validation process.

#### `log_validation_step(logger: logging.Logger, step_name: str, status: str, details: Optional[str] = None)`
Log a validation step with its status and details.

#### `log_error(logger: logging.Logger, error_type: str, message: str, step: str, suggested_fix: Optional[str] = None) -> ValidationError`
Log an error and return a ValidationError object.

#### `log_dependency_check(logger: logging.Logger, package_name: str, is_installed: bool, version: Optional[str] = None)`
Log the result of a dependency check.

#### `log_server_status(logger: logging.Logger, status: str, details: Optional[str] = None)`
Log server startup or health check status.

#### `format_validation_result(logger: logging.Logger, is_valid: bool, message: str)`
Format and log a validation result.

#### `log_dependency_validation_start(logger: logging.Logger, packages: List[str])`
Log the start of dependency validation process.

#### `log_dependency_validation_result(logger: logging.Logger, package: str, is_installed: bool, version: Optional[str] = None, required: bool = True)`
Log the result of a dependency validation.

#### `log_dependency_installation_start(logger: logging.Logger, packages: List[str])`
Log the start of dependency installation process.

#### `log_dependency_installation_result(logger: logging.Logger, package: str, success: bool, error_message: Optional[str] = None)`
Log the result of a dependency installation.

#### `log_fastapi_validation_start(logger: logging.Logger, file_path: str, expected_name: str)`
Log the start of FastAPI validation process.

#### `log_fastapi_validation_result(logger: logging.Logger, is_valid: bool, file_path: str, expected_name: str, line_numbers: Optional[List[int]] = None, error_message: Optional[str] = None)`
Log the result of FastAPI validation.

### Main Validator (`backend/scripts/startup_validator.py`)

#### `validate_dependencies(dependency_list: DependencyList) -> ValidationStepResult`
Validate that required dependencies are installed.

#### `validate_fastapi_config(file_path: str = "api_main.py", expected_instance_name: str = "app") -> ValidationStepResult`
Validate that the specified file contains a FastAPI instance with the expected name.

#### `validate_server_startup() -> tuple[ValidationStepResult, Optional[ServerManager]]`
Start the backend server and validate that it starts successfully.

#### `validate_health_check(server_manager: Optional[ServerManager]) -> ValidationStepResult`
Perform a health check on the running backend server.