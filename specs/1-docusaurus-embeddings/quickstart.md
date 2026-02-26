# Quickstart: Docusaurus Embedding Pipeline

## Prerequisites

- Python 3.11+
- Cohere API key
- Qdrant Cloud account or local instance
- UV package manager

## Setup

1. **Clone the repository** (if applicable) or create a new directory:
   ```bash
   mkdir docusaurus-embedding-pipeline
   cd docusaurus-embedding-pipeline
   ```

2. **Create virtual environment and install dependencies**:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install requests beautifulsoup4 cohere qdrant-client python-dotenv
   ```

3. **Create environment file**:
   ```bash
   touch .env
   ```

4. **Add environment variables to `.env`**:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=your_qdrant_url_here
   QDRANT_API_KEY=your_qdrant_api_key_here
   TARGET_URL=https://physical-ai-humanoid-robotics-book01.vercel.app/
   ```

## Usage

1. **Run the complete pipeline**:
   ```bash
   python main.py
   ```

2. **The pipeline will execute in this order**:
   - Fetch all URLs from the target Docusaurus site
   - Extract and clean text from each URL
   - Chunk the text into manageable pieces
   - Generate embeddings using Cohere
   - Create the 'rag_embedding' collection in Qdrant
   - Save each chunk with its embedding to Qdrant

## Configuration

The main.py file contains these key functions that can be configured:

- `get_all_urls(base_url)`: Crawls the site to find all valid documentation URLs
- `extract_text_from_url(url)`: Extracts clean text content from a single URL
- `chunk_text(text, chunk_size=1000)`: Splits text into chunks with overlap
- `embed_text(text_list)`: Generates embeddings for text chunks using Cohere
- `create_collection(collection_name='rag_embedding')`: Sets up Qdrant collection
- `save_chunk_to_qdrant(chunk, embedding, metadata)`: Stores embeddings in Qdrant

## Verification

After running the pipeline:
1. Check that the 'rag_embedding' collection exists in your Qdrant instance
2. Verify that points have been added with proper metadata (URL, content, etc.)
3. Test a similarity search to ensure embeddings are working correctly

## Troubleshooting

- **Rate limiting**: If you get 429 errors, reduce the crawling speed in the scraping configuration
- **API limits**: If hitting Cohere limits, implement batching for embedding requests
- **Content extraction**: If content isn't being extracted properly, adjust the CSS selectors in the text extraction function