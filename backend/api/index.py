"""
Vercel Serverless Function for Physical AI & Humanoid Robotics Book Chatbot
"""
import json
import os
from http.server import BaseHTTPRequestHandler
import urllib.request
import urllib.error

# Config — load all secrets from environment variables only (never hardcode)
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
COLLECTION_NAME = "humanoid_ai_book"

SYSTEM_PROMPT = """You are an expert AI assistant for the "Physical AI & Humanoid Robotics" book.
Help readers understand Physical AI, humanoid robotics, control systems, sensors, actuators,
machine learning for robotics, and motion planning. Use the provided context to answer accurately.
Be friendly, educational, and concise."""

def make_request(url, data=None, headers=None, method='GET'):
    """Make HTTP request using urllib."""
    headers = headers or {}
    if data:
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}: {e.reason}"}
    except Exception as e:
        return {"error": str(e)}

def embed_query(query):
    """Generate embedding using Cohere API."""
    url = "https://api.cohere.ai/v1/embed"
    headers = {
        "Authorization": f"Bearer {COHERE_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "embed-english-v3.0",
        "input_type": "search_query",
        "texts": [query]
    }
    result = make_request(url, data, headers, 'POST')
    if "embeddings" in result:
        return result["embeddings"][0]
    return None

def search_qdrant(query_vector, top_k=5):
    """Search Qdrant for relevant documents."""
    if not query_vector:
        return []

    url = f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/query"
    headers = {
        "api-key": QDRANT_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "query": query_vector,
        "limit": top_k,
        "with_payload": True
    }

    result = make_request(url, data, headers, 'POST')

    sources = []
    if "result" in result and "points" in result["result"]:
        for point in result["result"]["points"]:
            payload = point.get("payload", {})
            sources.append({
                "text": payload.get("text", ""),
                "url": payload.get("url", ""),
                "score": point.get("score", 0)
            })
    return sources

def generate_with_gemini(query, context):
    """Generate response using Gemini API directly."""
    # Use gemini-2.5-flash which has higher rate limits
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

    prompt = f"{SYSTEM_PROMPT}\n\n--- Book Content ---\n{context}\n--- End ---\n\nUser: {query}"

    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1000
        }
    }

    result = make_request(url, data, {}, 'POST')

    if "candidates" in result:
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            pass

    # Try to get more specific error info
    error_msg = result.get('error', {})
    if isinstance(error_msg, dict):
        return f"Generation error: {error_msg.get('message', 'Unknown error')}"
    return f"Unable to generate response: {error_msg}"

def check_health():
    """Check if services are connected."""
    qdrant_ok = False
    gemini_ok = False

    # Check Qdrant
    try:
        url = f"{QDRANT_URL}/collections"
        headers = {"api-key": QDRANT_API_KEY}
        result = make_request(url, None, headers, 'GET')
        qdrant_ok = "result" in result
    except:
        pass

    # Check Gemini (simple test)
    gemini_ok = bool(GEMINI_API_KEY)

    return {
        "status": "ok" if (qdrant_ok and gemini_ok) else "degraded",
        "qdrant_connected": qdrant_ok,
        "llm_configured": gemini_ok,
        "llm_provider": "Gemini"
    }

class handler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        # Add more CORS headers as needed
        self.send_header('Access-Control-Max-Age', '86400')  # 24 hours

    def do_OPTIONS(self):
        """Handle preflight OPTIONS requests"""
        self.send_response(204)  # No content for OPTIONS
        self.send_cors_headers()
        self.end_headers()
        return

    def do_HEAD(self):
        """Handle HEAD requests for CORS compatibility"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
        return

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_cors_headers()
        self.end_headers()

        if '/health' in self.path:
            response = check_health()
        else:
            response = {
                "message": "Physical AI & Humanoid Robotics Book - RAG Chatbot API",
                "version": "1.0.0",
                "endpoints": ["/health", "/chat"],
                "llm_provider": "Gemini"
            }

        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        if '/chat' in self.path:
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode())
                message = data.get('message', '')

                # Generate embedding
                query_vector = embed_query(message)

                # Search for context
                sources = search_qdrant(query_vector, top_k=5)

                # Build context
                context = "\n\n".join([
                    f"Source ({s['url']}):\n{s['text']}"
                    for s in sources if s.get('text')
                ]) or "No specific book content found."

                # Generate response
                response_text = generate_with_gemini(message, context)

                response = {
                    "response": response_text,
                    "sources": [{"url": s["url"], "score": s["score"]} for s in sources if s.get("url")]
                }

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())