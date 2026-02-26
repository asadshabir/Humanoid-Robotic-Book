---
id: 1
title: Running Humanoid Robotic Book Application
stage: general
date: 2026-02-23
surface: agent
model: Claude Opus 4.6
feature: none
branch: 003-browser-safe-rag-chatbot
user: Asad Shabir
command: Run Humanoid Robotic Book application locally
labels:
- ["humanoid-robotics", "book", "docusaurus", "rag", "qdrant", "api"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
---

# Running Humanoid Robotic Book Application

## Files modified or created
- None (documenting process only)

## Tests run or added
- None (documenting process only)

## Prompt Text

How to run the Humanoid-Robotic Book application locally, including all the steps to start both the backend and frontend servers.

## Response Text

This document details how to run the Humanoid-Robotic Book application locally, which consists of both a frontend (Docusaurus site) and a backend (RAG API server).

## Application Overview
The Humanoid-Robotic Book is a Docusaurus-based documentation site that includes a chatbot powered by Retrieval-Augmented Generation (RAG). The system has two main components:
- Frontend: Docusaurus site where users read the book content
- Backend: API server that handles RAG queries to the book content

## Prerequisites

- Node.js (version specified in package.json engines)
- Python 3.11+ (for backend)
- API keys for Cohere, Qdrant, and either OpenAI or Gemini (for LLM responses)

## Frontend Setup and Running

### 1. Install Dependencies
```bash
cd "C:\Users\Asad Shabir\Desktop\GIAIC HACKATHON'S\Hackathon-I\Humanoid-Robotic-Book"
npm install
```

### 2. Start the Development Server
```bash
npm start
```
This will start the Docusaurus development server, typically available at http://localhost:3000

## Backend Setup and Running

### 1. Navigate to Backend Directory
```bash
cd "C:\Users\Asad Shabir\Desktop\GIAIC HACKATHON'S\Hackathon-I\Humanoid-Robotic-Book\backend"
```

### 2. Set up Python Environment
```bash
# Create virtual environment (optional but recommended)
python -m venv venv
# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies (requirements.txt is minimal, mostly using stdlib)
pip install -r requirements.txt
# Install additional required packages for the backend API
pip install fastapi uvicorn python-dotenv qdrant-client cohere openai google-generativeai
```

### 3. Configure Environment Variables
Create or edit the .env file in the backend directory with the following variables:

```bash
COHERE_API_KEY="your_cohere_api_key"
GEMINI_API_KEY="your_gemini_api_key_or_use_default"
OPENAI_API_KEY="your_openai_api_key_optional"
QDRANT_URL="https://4dcb548a-d13a-4ee9-8317-6f440ed1b255.us-east4-0.gcp.cloud.qdrant.io:6333"
QDRANT_API_KEY="your_qdrant_api_key"
```

### 4. Start the Backend API Server
To run the backend as a RAG API server (FastAPI):
```bash
cd "C:\Users\Asad Shabir\Desktop\GIAIC HACKATHON'S\Hackathon-I\Humanoid-Robotic-Book\backend"
python api_main.py
# OR using uvicorn directly
uvicorn api_main:app --host 0.0.0.0 --port 8000
```

The backend server will be available at http://localhost:8000, with Swagger documentation at http://localhost:8000/docs

## Alternative Backend (Vercel-style)
The backend also includes a Vercel-compatible API endpoint in `backend/api/index.py` which is designed to run in serverless environments. This can be started with:

```bash
python -m http.server 8000 -c backend/api/index.py
```

## Running Both Servers Together
For the complete application experience:

1. Start the backend server first:
```bash
cd "C:\Users\Asad Shabir\Desktop\GIAIC HACKATHON'S\Hackathon-I\Humanoid-Robotic-Book\backend"
python api_main.py
```

2. In a separate terminal, start the frontend:
```bash
cd "C:\Users\Asad Shabir\Desktop\GIAIC HACKATHON'S\Hackathon-I\Humanoid-Robotic-Book"
npm start
```

The frontend will be accessible at http://localhost:3000, and the chatbot functionality will connect to the backend API at http://localhost:8000.

## Health Check
You can verify the backend API is working by visiting:
- http://localhost:8000/health

This endpoint will show the status of Qdrant connection and LLM provider configuration.

## Known Issues
- The chatbot may not function if the required API keys are not configured in the backend
- CORS is configured to allow all origins for development, which should be restricted for production

## Troubleshooting
- If the backend fails to connect to Qdrant, verify the URL and API key in the .env file
- If the LLM provider isn't working, check that either OPENAI_API_KEY or GEMINI_API_KEY is set
- If the frontend fails to build, ensure Node.js version meets requirements in package.json

## Outcome
Successfully documented the process for running the Humanoid-Robotic Book application locally with both frontend and backend components.

## Evaluation
The steps provided should allow a user to successfully run both the frontend and backend components of the Humanoid-Robotic Book application. The documentation covers prerequisites, setup, running instructions, and common troubleshooting steps.