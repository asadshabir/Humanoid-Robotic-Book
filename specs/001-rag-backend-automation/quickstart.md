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