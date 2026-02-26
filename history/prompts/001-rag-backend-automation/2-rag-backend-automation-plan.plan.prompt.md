---
id: 2
title: RAG Backend Automation Plan
stage: plan
date: 2025-12-28
surface: agent
model: Claude Sonnet 4.5
feature: 001-rag-backend-automation
branch: 001-rag-backend-automation
user: Asad Shabir
command: /sp.plan /sp.plan RAG Backend Startup & Validation

- Check Python version and print `python --version`
- Ensure `pip install -r requirements.txt` completes successfully
- Verify `main.py` has `app = FastAPI()`
- Fix or create `app` instance if missing
- Run `uvicorn main:app --reload` from backend directory
- Test `/health` endpoint; print response
- Log errors and suggest corrective actions
- Mark the backend ready for frontend integration if all tests pass
labels: ["plan", "backend", "automation", "validation", "startup"]
links:
  spec: specs/001-rag-backend-automation/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-backend-automation/plan.md
 - specs/001-rag-backend-automation/research.md
 - specs/001-rag-backend-automation/data-model.md
 - specs/001-rag-backend-automation/quickstart.md
 - .specify/memory/constitution.md
tests:
 - null
---

## Prompt

/sp.plan RAG Backend Startup & Validation

- Check Python version and print `python --version`
- Ensure `pip install -r requirements.txt` completes successfully
- Verify `main.py` has `app = FastAPI()`
- Fix or create `app` instance if missing
- Run `uvicorn main:app --reload` from backend directory
- Test `/health` endpoint; print response
- Log errors and suggest corrective actions
- Mark the backend ready for frontend integration if all tests pass

## Response snapshot

# Implementation Plan: RAG Backend Startup & Validation Automation

**Branch**: `001-rag-backend-automation` | **Date**: 2025-12-28 | **Spec**: [specs/001-rag-backend-automation/spec.md](specs/001-rag-backend-automation/spec.md)
**Input**: Feature specification from `/specs/001-rag-backend-automation/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement an automated validation and startup script for the FastAPI-based RAG backend that verifies dependencies, validates FastAPI configuration, starts the server, and performs health checks. The solution will ensure the backend is properly configured and accessible for frontend integration with minimal manual intervention. The implementation will include dependency validation and installation, FastAPI configuration validation, server startup automation, and health endpoint verification.

## Technical Context

**Language/Version**: Python 3.14, FastAPI 0.104.1, uvicorn 0.24.0
**Primary Dependencies**: FastAPI, uvicorn, cohere, qdrant-client, python-dotenv
**Storage**: N/A (configuration and validation only, no persistent storage needed)
**Testing**: pytest for validation script testing
**Target Platform**: Windows 10/11 (with potential for cross-platform compatibility)
**Project Type**: Web application backend (FastAPI service for RAG system)
**Performance Goals**: <5 minutes for complete validation and startup process, <10 seconds for dependency validation, <30 seconds for health check
**Constraints**: Must work on Windows 10/11 with Python 3.14, should not modify project source files except for main.py if necessary, must handle missing dependencies and ASGI errors automatically, all commands should run from backend/ directory
**Scale/Scope**: Single backend service with health endpoint, single validation script, 1-10 developers using the automation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Stability First
✅ **PASS**: Implementation will follow Python best practices with proper error handling and validation. The automation script will include comprehensive error checking and graceful failure modes to prevent system instability.

### Academic Integrity
✅ **PASS**: All technical claims will be verifiable. The implementation will include proper logging and documentation to ensure the validation steps are transparent and reproducible.

### Premium UX (Controlled)
✅ **PASS**: The automation script will provide clear, actionable feedback to developers. Error messages will be informative and suggest corrective actions, following professional standards.

### Spec Discipline
✅ **PASS**: All changes will originate from the spec. Implementation will follow the defined user stories and functional requirements. History and decisions will be preserved through PHRs and ADRs.

### Standards and Requirements
✅ **PASS**: The implementation will meet performance requirements with the 5-minute completion target. The solution will be reliable and provide consistent results across different environments.

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-backend-automation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# FastAPI backend with validation automation
backend/
├── api/
│   ├── __init__.py
│   ├── main.py          # FastAPI application entry point
│   ├── routes/
│   │   └── question_answer.py  # Question-answer endpoint
│   └── utils/
│       └── validation.py        # Validation utilities
├── scripts/
│   └── startup_validator.py     # Backend startup validation script
├── requirements.txt             # Python dependencies
├── .env                       # Environment variables
└── tests/
    └── test_startup_validator.py  # Tests for validation script

# Docusaurus frontend (for reference)
docs/
├── src/
│   └── components/
│       └── Chatbot/             # Frontend chatbot component
└── docusaurus.config.js

# Project root
├── requirements.txt             # Root dependencies
└── setup.py
```

**Structure Decision**: The implementation will add a validation script to the backend directory that automates the startup process. The script will validate dependencies, check FastAPI configuration, start the server, and perform health checks. The existing backend structure with FastAPI application in main.py will be preserved with minimal modifications.

# Research: RAG Backend Startup & Validation Automation

## Overview
This research document addresses technical questions and unknowns for the RAG backend startup and validation automation. It provides the necessary context to implement the feature according to the specification.

## Python Environment and Dependency Management

### Decision: Use pip and requirements.txt for dependency management
**Rationale**: The existing project already uses requirements.txt for Python dependencies. Using pip with requirements.txt is the standard approach for Python projects and ensures consistent dependency management.

**Implementation approach**:
- Use `pip install -r requirements.txt` to install dependencies
- Check for installed packages using `pip list` or `importlib.util.find_spec()`
- Handle missing dependencies by installing them automatically

**Alternatives considered**:
1. Poetry - Would add complexity without clear benefits for this use case
2. Conda - Not appropriate since project already uses pip/requirements.txt
3. Manual package installation - Would be error-prone and inconsistent

## FastAPI Application Validation

### Decision: Validate FastAPI instance by checking for 'app = FastAPI()' pattern
**Rationale**: The most common and standard way to create a FastAPI application is to instantiate it as `app = FastAPI()`. The validation script will look for this pattern in main.py.

**Implementation approach**:
- Read main.py file content
- Look for FastAPI import and app instantiation
- Validate that the app variable is a FastAPI instance
- If missing, provide option to create or fix the configuration

**Validation techniques**:
- Check for `from fastapi import FastAPI` or `import fastapi`
- Check for pattern like `app = FastAPI()` or similar instantiation
- Verify that the variable name matches what's expected by uvicorn (typically 'app')

## Server Startup and Management

### Decision: Use uvicorn with subprocess for server management
**Rationale**: Uvicorn is the standard ASGI server for FastAPI applications. Using subprocess to run uvicorn allows for programmatic control while maintaining the standard startup mechanism.

**Implementation approach**:
- Use Python subprocess module to run `uvicorn main:app --reload`
- Capture server logs to detect startup completion
- Monitor for the "Uvicorn running on..." message to confirm server is ready
- Handle server errors and provide actionable feedback

**Error handling strategies**:
- ASGI errors: Check for common ASGI configuration issues
- Port conflicts: Detect if port 8000 is already in use
- Import errors: Validate module imports and dependencies

## Health Check Implementation

### Decision: Implement HTTP health check using requests library
**Rationale**: A simple HTTP GET request to the `/health` endpoint is the standard way to verify server health. This approach is straightforward and follows common practices.

**Implementation approach**:
- Use Python's requests library to make HTTP request
- Check for HTTP 200 status code
- Verify response content matches expected format `{"status": "ok"}`
- Implement retry logic with timeout for reliability

**Timeout and retry strategy**:
- Initial delay: 5 seconds to allow server startup
- Retry attempts: 10 attempts with 2-second intervals
- Total timeout: 30 seconds for health check completion

## Error Logging and Feedback

### Decision: Provide detailed, actionable error messages
**Rationale**: The primary goal is to reduce manual troubleshooting. Clear, actionable error messages will help developers quickly resolve issues.

**Implementation approach**:
- Log all validation steps with timestamps
- Provide specific error messages for each failure type
- Include suggested solutions for common issues
- Create a summary of validation results

**Error categories to handle**:
- Missing dependencies: List specific packages that need installation
- ASGI configuration: Provide specific fixes for common ASGI errors
- File structure issues: Point to specific files that need correction
- Network/port issues: Suggest alternative ports or network fixes

## Cross-Platform Compatibility

### Decision: Use Python standard library for cross-platform compatibility
**Rationale**: The script needs to work on Windows 10/11 as specified, but should also be compatible with other platforms when possible.

**Implementation approach**:
- Use Python's os, subprocess, and pathlib modules for file operations
- Use platform-specific command execution where necessary
- Handle path separators correctly using pathlib
- Use universal newlines for file operations

## Script Execution Context

### Decision: Run validation from backend directory
**Rationale**: The specification requires all commands to run from the `backend/` directory. This ensures proper module resolution and configuration loading.

**Implementation approach**:
- Change working directory to backend/ before execution
- Use relative paths for file operations
- Preserve original working directory and restore after execution
- Validate backend directory exists before proceeding

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

# Quickstart: RAG Backend Startup & Validation Automation

## Overview
This guide provides a quick setup for the RAG backend validation and startup automation script. Follow these steps to get the backend running with automatic validation and configuration checking.

## Prerequisites

1. **Python 3.14** or higher installed
2. **Windows 10/11** operating system (as specified in requirements)
3. **Git** for version control
4. **Access to backend directory** with main.py file

## Installation and Setup

### 1. Clone and Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Required Dependencies
The validation script will automatically check and install missing dependencies:
```bash
pip install -r requirements.txt
```

### 3. Verify Environment Configuration
Ensure your `.env` file contains the required configuration:
```env
COHERE_API_KEY=your_cohere_api_key
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_URL=your_qdrant_url
```

## Running the Validation Script

### 1. Execute the Validation Script
```bash
cd backend
python scripts/startup_validator.py
```

### 2. Automated Validation Process
The script will automatically perform these steps:
1. **Dependency Check**: Verify all required packages are installed
2. **FastAPI Validation**: Check that main.py contains a valid FastAPI instance
3. **Server Startup**: Start the uvicorn server with proper configuration
4. **Health Check**: Verify the server responds correctly to health requests

### 3. Expected Output
When successful, the script will output:
```
✅ Dependencies validated successfully
✅ FastAPI configuration is valid
✅ Server started successfully on http://127.0.0.1:8000
✅ Health check passed: {"status": "ok"}
🚀 Backend is ready for frontend integration
```

## Manual Server Startup (Alternative)

If you prefer to start the server manually:
```bash
cd backend
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

Then verify with a health check:
```bash
curl http://127.0.0.1:8000/health
```

## Troubleshooting Common Issues

### Missing Dependencies
If dependencies are missing, the script will attempt to install them automatically. If automatic installation fails:
```bash
pip install fastapi uvicorn python-dotenv cohere qdrant-client
```

### Port Already in Use
If port 8000 is already in use, kill the existing process:
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### FastAPI Configuration Issues
If the script reports FastAPI configuration issues, ensure your main.py contains:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

### Network/Permission Issues
If you encounter permission issues:
- Run the command prompt as Administrator
- Ensure your firewall allows connections on port 8000
- Check that antivirus software isn't blocking the connection

## Verification Steps

### 1. Check Server Status
```bash
curl http://127.0.0.1:8000/health
```

### 2. Test API Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/v1/question-answer \
  -H "Content-Type: application/json" \
  -d '{"question": "test", "context": ""}'
```

### 3. View Server Logs
The server will output logs showing:
- Startup messages
- Request handling
- Error messages (if any)

## Integration with Frontend

Once the backend validation is complete and the server is running:

1. The frontend chatbot component can connect to `http://127.0.0.1:8000`
2. Verify the `/api/v1/question-answer` endpoint is accessible
3. Test the complete flow: Frontend → Backend → RAG → Response

## Environment Variables

Ensure these environment variables are set in your `.env` file:
- `COHERE_API_KEY`: For Cohere API access
- `QDRANT_API_KEY`: For Qdrant vector database access
- `QDRANT_URL`: URL for Qdrant instance
- `RAG_API_URL`: URL for the RAG backend (default: http://localhost:8000)

## Performance Expectations

- **Dependency validation**: <10 seconds
- **FastAPI configuration check**: <1 second
- **Server startup**: <30 seconds
- **Health check**: <5 seconds
- **Total process**: <5 minutes as specified

## Next Steps

1. Once the backend is running, proceed with frontend integration
2. Test the complete RAG flow with sample questions
3. Verify all API endpoints are accessible
4. Monitor server logs for any issues during operation

---

## Outcome

- ✅ Impact: Created comprehensive implementation plan for RAG backend startup validation with research, data models, and quickstart guide
- 🧪 Tests: No tests added yet, planning phase complete
- 📁 Files: Created plan.md, research.md, data-model.md, and quickstart.md in specs/001-rag-backend-automation/
- 🔁 Next prompts: Task generation phase will follow to create implementation tasks
- 🧠 Reflection: Planning phase completed successfully with all required artifacts created according to the template

## Evaluation notes (flywheel)

- Failure modes observed: None, planning completed successfully
- Graders run and results (PASS/FAIL): N/A for planning phase
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin task generation phase to implement the specification