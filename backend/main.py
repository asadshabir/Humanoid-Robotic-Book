"""
Docusaurus Embedding Pipeline

This script extracts text from deployed Docusaurus URLs, generates embeddings using Cohere,
and stores them in Qdrant for RAG-based retrieval.
"""

import requests
import xml.etree.ElementTree as ET
import trafilatura
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere
import time

# -------------------------------------
# CONFIG
# -------------------------------------
# THE WORKING DOMAIN
CORRECT_DOMAIN = "https://physical-ai-humanoid-robotics-book01.vercel.app"
SITEMAP_URL = f"{CORRECT_DOMAIN}/sitemap.xml"
COLLECTION_NAME = "humanoid_ai_book"

cohere_client = cohere.Client(os.getenv("COHERE_API_KEY", ""))
EMBED_MODEL = "embed-english-v3.0"


qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL", ""),
    api_key=os.getenv("QDRANT_API_KEY", ""),
    https=True,
    timeout=60,
    check_compatibility=False
)

def get_all_urls(sitemap_url):
    print(f"[INFO] Fetching sitemap: {sitemap_url}")
    try:
        r = requests.get(sitemap_url, timeout=10)
        r.raise_for_status()
        root = ET.fromstring(r.text)
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for url_tag in root.findall('ns:url', namespace):
            loc = url_tag.find('ns:loc', namespace)
            if loc is not None:
                # FIX: Replace the broken domain from sitemap with the correct one
                raw_url = loc.text
                if "robotic-book.vercel.app" in raw_url:
                    fixed_url = raw_url.replace("https://physical-ai-humanoid-robotic-book.vercel.app", CORRECT_DOMAIN)
                    urls.append(fixed_url)
                else:
                    urls.append(raw_url)

        print(f"[SUCCESS] FOUND {len(urls)} URLS (and fixed domains)")
        return urls
    except Exception as e:
        print(f"[ERROR] Sitemap Error: {e}")
        return []

def extract_text_from_url(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return trafilatura.extract(response.text)
    except Exception as e:
        print(f"  [WARNING] Error fetching {url}: {e}")
        return None

def chunk_text(text, max_chars=1200):
    chunks = []
    text = text.replace('\n', ' ')
    while len(text) > max_chars:
        split_pos = text[:max_chars].rfind(". ")
        if split_pos == -1: split_pos = max_chars
        else: split_pos += 1
        chunks.append(text[:split_pos].strip())
        text = text[split_pos:].strip()
    if text: chunks.append(text)
    return chunks

def embed_text(text):
    response = cohere_client.embed(model=EMBED_MODEL, input_type="search_document", texts=[text])
    return response.embeddings[0]

def create_collection():
    print(f"[INFO] Preparing collection: {COLLECTION_NAME}")
    if qdrant.collection_exists(COLLECTION_NAME):
        qdrant.delete_collection(COLLECTION_NAME)
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
    )

def save_chunk_to_qdrant(chunk, chunk_id, url):
    vector = embed_text(chunk)
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[PointStruct(id=chunk_id, vector=vector, payload={"url": url, "text": chunk})]
    )

def ingest_book():
    urls = get_all_urls(SITEMAP_URL)
    if not urls: return

    create_collection()
    global_id = 1

    for url in urls:
        if url.endswith('/docs/') or url.endswith('/docs'): continue

        try:
            print(f"[INFO] Processing: {url}")
            text = extract_text_from_url(url)

            if not text or len(text.strip()) < 100:
                print(f"  [SKIP] Skipped: No content.")
                continue

            chunks = chunk_text(text)
            print(f"  [INFO] Uploading {len(chunks)} chunks...")
            for ch in chunks:
                save_chunk_to_qdrant(ch, global_id, url)
                global_id += 1

            time.sleep(0.2)  # Avoid rate limits
        except Exception as e:
            print(f"  [ERROR] Error processing {url}: {e}")
            continue

    print(f"\n[SUCCESS] Ingestion completed! Total points: {global_id - 1}")

if __name__ == "__main__":
    ingest_book()
