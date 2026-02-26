"""
Check if there is any data stored in the Qdrant collection
"""
import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Qdrant configuration from environment
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
COLLECTION_NAME = "humanoid_ai_book"

# Initialize Qdrant client with proper configuration
qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    https=True,
    timeout=60,
    check_compatibility=False
)

try:
    # Check if collection exists
    if qdrant.collection_exists(COLLECTION_NAME):
        print(f"[INFO] Collection '{COLLECTION_NAME}' exists")

        # Get collection info
        collection_info = qdrant.get_collection(COLLECTION_NAME)
        print(f"[INFO] Collection points count: {collection_info.points_count}")

        if collection_info.points_count > 0:
            print(f"[SUCCESS] Data is successfully stored in Qdrant!")
            print(f"  - Total points stored: {collection_info.points_count}")
        else:
            print(f"[INFO] Collection exists but has no points stored yet")
    else:
        print(f"[INFO] Collection '{COLLECTION_NAME}' does not exist")
        print("This may be because the pipeline is still running or encountered errors.")

except Exception as e:
    print(f"[ERROR] Error checking Qdrant collection: {e}")
    import traceback
    traceback.print_exc()