"""
RAG Backend API with OpenAI Agents SDK Integration

This FastAPI server provides a chat endpoint that:
1. Takes user queries
2. Retrieves relevant context from Qdrant vector database
3. Generates responses using OpenAI Agents SDK
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Qdrant and Cohere imports
from qdrant_client import QdrantClient
import cohere

# OpenAI imports
from openai import OpenAI

load_dotenv()

# -------------------------------------
# CONFIG
# -------------------------------------
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Qdrant Cloud credentials
QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")

COLLECTION_NAME = "humanoid_ai_book"
EMBED_MODEL = "embed-english-v3.0"

# Initialize clients
cohere_client = cohere.Client(COHERE_API_KEY)

# Use Qdrant Cloud
qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    https=True,
    timeout=60,
    check_compatibility=False
)

# Initialize LLM clients
openai_client = None
gemini_model = None
llm_provider = "None"

if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    llm_provider = "OpenAI"
    print("[INFO] Using OpenAI API")
elif GEMINI_API_KEY:
    # Use native Google AI SDK
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')
        llm_provider = "Gemini"
        print("[INFO] Using Gemini via native SDK")
    except Exception as e:
        print(f"[WARNING] Could not initialize Gemini: {e}")

# System prompt for the RAG agent
SYSTEM_PROMPT = """You are an expert AI assistant for the "Physical AI & Humanoid Robotics" book.
Your role is to help readers understand concepts related to:
- Physical AI and embodied intelligence
- Humanoid robotics and bipedal locomotion
- Control systems and feedback mechanisms
- Sensors, actuators, and motor control
- Machine learning for robotics
- ROS (Robot Operating System)
- Computer vision and perception
- Motion planning and navigation

Use the provided context from the book to answer questions accurately.
If the context doesn't contain enough information, say so and provide general knowledge.
Be friendly, educational, and encourage further exploration of the book content.
Keep responses concise but informative."""

# -------------------------------------
# FastAPI App
# -------------------------------------
app = FastAPI(
    title="Physical AI & Humanoid Robotics Book - RAG Chatbot API",
    description="RAG-powered chatbot using OpenAI Agents SDK for the Physical AI & Humanoid Robotics Book",
    version="1.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------
# Pydantic Models
# -------------------------------------
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    sources: List[dict] = []

class HealthResponse(BaseModel):
    status: str
    qdrant_connected: bool
    llm_configured: bool
    llm_provider: str

# -------------------------------------
# Helper Functions
# -------------------------------------
def embed_query(query: str) -> List[float]:
    """Generate embedding for the search query using Cohere."""
    try:
        response = cohere_client.embed(
            model=EMBED_MODEL,
            input_type="search_query",
            texts=[query]
        )
        return response.embeddings[0]
    except Exception as e:
        print(f"[ERROR] Embedding failed: {e}")
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

def search_qdrant(query_vector: List[float], top_k: int = 5) -> List[dict]:
    """Search Qdrant for relevant documents."""
    try:
        # Use query_points for newer qdrant-client versions
        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=top_k
        )

        sources = []
        for result in results.points:
            sources.append({
                "text": result.payload.get("text", ""),
                "url": result.payload.get("url", ""),
                "score": result.score
            })
        return sources
    except Exception as e:
        print(f"[ERROR] Qdrant search failed: {e}")
        return []

def generate_response_with_openai(query: str, context: str, history: List[ChatMessage]) -> str:
    """Generate a response using OpenAI Agents SDK with the retrieved context."""
    try:
        # Build messages array for OpenAI
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

        # Add conversation history
        if history:
            for msg in history[-5:]:  # Only use last 5 messages for context
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })

        # Add context and current query
        user_message = f"""Context from the book:
{context}

User question: {query}"""

        messages.append({"role": "user", "content": user_message})

        # Generate response using OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # Using GPT-4o-mini for cost efficiency
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"[ERROR] OpenAI generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Response generation failed: {str(e)}")

def generate_response_with_gemini(query: str, context: str, history: List[ChatMessage]) -> str:
    """Generate a response using Gemini native SDK."""
    try:
        # Build conversation prompt
        conversation = f"{SYSTEM_PROMPT}\n\n"

        if history:
            for msg in history[-5:]:
                if msg.role == "user":
                    conversation += f"User: {msg.content}\n"
                else:
                    conversation += f"Assistant: {msg.content}\n"

        conversation += f"\n--- Relevant Book Content ---\n{context}\n--- End of Book Content ---\n\n"
        conversation += f"User: {query}\nAssistant:"

        response = gemini_model.generate_content(conversation)
        return response.text

    except Exception as e:
        print(f"[ERROR] Gemini generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Response generation failed: {str(e)}")

def generate_response(query: str, context: str, history: List[ChatMessage]) -> str:
    """Generate a response using the configured LLM provider."""
    if openai_client:
        return generate_response_with_openai(query, context, history)
    elif gemini_model:
        return generate_response_with_gemini(query, context, history)
    else:
        raise HTTPException(status_code=500, detail="No LLM provider configured. Please set OPENAI_API_KEY or GEMINI_API_KEY.")

# -------------------------------------
# API Endpoints
# -------------------------------------
@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Physical AI & Humanoid Robotics Book - RAG Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "llm_provider": llm_provider
    }

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint."""
    qdrant_ok = False
    llm_ok = False
    current_provider = "None"

    try:
        # Check Qdrant connection
        collections = qdrant.get_collections()
        qdrant_ok = True
    except Exception as e:
        print(f"[WARNING] Qdrant health check failed: {e}")

    try:
        # Check LLM configuration
        if openai_client:
            # Test OpenAI connection
            test_response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            llm_ok = True
            current_provider = "OpenAI"
        elif gemini_model:
            # Test Gemini via native SDK
            test_response = gemini_model.generate_content("Hi")
            llm_ok = True
            current_provider = "Gemini"
    except Exception as e:
        print(f"[WARNING] LLM health check failed: {e}")
        current_provider = llm_provider  # Use the configured provider name

    return HealthResponse(
        status="ok" if (qdrant_ok and llm_ok) else "degraded",
        qdrant_connected=qdrant_ok,
        llm_configured=llm_ok,
        llm_provider=current_provider
    )

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint.

    Takes a user message and optional conversation history,
    retrieves relevant context from the book, and generates a response.
    """
    try:
        # Step 1: Generate embedding for the query
        print(f"[INFO] Processing query: {request.message[:50]}...")
        query_vector = embed_query(request.message)

        # Step 2: Search Qdrant for relevant context
        sources = search_qdrant(query_vector, top_k=5)

        # Step 3: Build context from retrieved documents
        context = "\n\n".join([
            f"Source ({s['url']}):\n{s['text']}"
            for s in sources if s['text']
        ])

        if not context:
            context = "No specific book content found for this query. Providing general knowledge."

        # Step 4: Generate response with configured LLM
        response_text = generate_response(
            query=request.message,
            context=context,
            history=request.history
        )

        # Step 5: Return response with sources
        return ChatResponse(
            response=response_text,
            sources=[{"url": s["url"], "score": s["score"]} for s in sources if s["url"]]
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Chat endpoint failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collections")
def list_collections():
    """List all Qdrant collections."""
    try:
        collections = qdrant.get_collections()
        return {"collections": [c.name for c in collections.collections]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collection/{name}/count")
def get_collection_count(name: str):
    """Get the number of points in a collection."""
    try:
        info = qdrant.get_collection(name)
        return {"collection": name, "points_count": info.points_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------
# Main Entry Point
# -------------------------------------
if __name__ == "__main__":
    print("[INFO] Starting RAG Backend API...")
    print(f"[INFO] Qdrant URL: {QDRANT_URL}")
    print(f"[INFO] Collection: {COLLECTION_NAME}")
    print(f"[INFO] LLM Provider: {llm_provider}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
