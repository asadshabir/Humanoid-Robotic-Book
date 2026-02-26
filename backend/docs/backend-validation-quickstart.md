# Backend Validation Quickstart Guide

## Prerequisites

- Python 3.14 or higher installed
- Access to command line/terminal
- Internet connection for dependency installation

## Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Validation

### Basic Usage

Run the complete validation process:
```bash
python scripts/startup_validator.py
```

### Expected Output

When successful, you'll see output similar to:
```
2025-12-28 22:15:54,526 - rag_backend_validator - INFO - Overall status: success
```

## Validation Steps

The system performs the following validation steps:

### 1. Dependency Validation
- Checks for required packages: fastapi, uvicorn, requests, cohere, qdrant-client, dotenv
- Automatically installs missing packages
- Validates package versions

### 2. FastAPI Configuration Validation
- Verifies that `api_main.py` contains a FastAPI instance named `app`
- Checks proper FastAPI configuration

### 3. Server Startup
- Starts the backend server using uvicorn
- Waits for server to become available
- Monitors server process status

### 4. Health Check
- Performs health check requests to `/health` endpoint
- Verifies server responds with HTTP 200
- Confirms response body contains `{"status": "ok"}`

## Configuration

### Default Settings
- **Host**: 127.0.0.1
- **Port**: 8000
- **Application File**: api_main.py
- **Server Command**: `uvicorn api_main:app --reload --host 127.0.0.1 --port 8000`

### Custom Application File
If your FastAPI application is in a different file, update the validation function accordingly.

## Troubleshooting

### Common Issues

#### Dependency Installation Fails
- **Symptoms**: Error during dependency validation
- **Solution**:
  - Check internet connection
  - Ensure pip is up-to-date: `pip install --upgrade pip`
  - Verify system permissions for package installation

#### FastAPI Instance Not Found
- **Symptoms**: FastAPI validation fails
- **Solution**:
  - Verify your application file contains: `app = FastAPI(...)`
  - Ensure the variable name is exactly `app`
  - Check that FastAPI is properly imported: `from fastapi import FastAPI`

#### Server Fails to Start
- **Symptoms**: Server startup validation fails
- **Solution**:
  - Verify all dependencies are installed
  - Check that the specified port (8000) is available
  - Ensure the application file exists and is accessible

#### Health Check Fails
- **Symptoms**: Health check validation fails
- **Solution**:
  - Verify your application has a `/health` endpoint
  - Ensure the endpoint returns `{"status": "ok"}` with HTTP 200
  - Check that the server is running and accessible

## Example Application File

Your FastAPI application file (api_main.py) should look like:

```python
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="RAG Backend API")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

## Advanced Usage

### Running Individual Validation Steps

You can run individual validation steps by modifying the main function in `startup_validator.py`, though this is not recommended for typical usage.

### Logging

All validation steps are logged to both console and `validation.log` file in the backend directory.

## Integration with CI/CD

The validation system can be integrated into CI/CD pipelines to ensure the backend is properly configured before deployment.

## Support

For issues or questions:
- Check the logs in `validation.log`
- Verify all prerequisites are met
- Ensure the application file contains the expected FastAPI instance