# Data Model: Docusaurus Embedding Pipeline

## Entity: Documentation Content

**Description**: Represents the text content extracted from Docusaurus pages

**Attributes**:
- url: String (required) - The source URL of the content
- title: String (required) - The page title
- content: String (required) - The cleaned text content
- content_type: String (optional) - Type of content (e.g., "tutorial", "api", "concept")
- created_at: DateTime (required) - When the content was extracted
- updated_at: DateTime (optional) - When the content was last updated

**Validation**:
- URL must be a valid URL format
- Content must not be empty
- Title must not be empty

## Entity: Vector Embedding

**Description**: Represents the numerical vector representation of documentation content

**Attributes**:
- id: String (required) - Unique identifier for the embedding
- content_id: String (required) - Reference to the source content
- vector: Array<Float> (required) - The embedding vector values
- model: String (required) - The model used to generate the embedding
- created_at: DateTime (required) - When the embedding was generated

**Validation**:
- Vector must have consistent dimensions
- Model must be a valid Cohere model identifier
- Content_id must reference an existing Documentation Content

## Entity: Qdrant Record

**Description**: Represents the stored embeddings in Qdrant database with associated metadata for retrieval

**Attributes**:
- point_id: String (required) - The unique ID in Qdrant
- payload: Object (required) - Metadata including URL, title, and content
- vector: Array<Float> (required) - The embedding vector
- collection_name: String (required) - The Qdrant collection name ("rag_embedding")

**Validation**:
- Point ID must be unique within collection
- Vector dimensions must match collection schema
- Collection must exist in Qdrant

## Entity: Scraping Configuration

**Description**: Configuration parameters for the URL crawling and text extraction process

**Attributes**:
- base_url: String (required) - The root URL to crawl
- max_depth: Integer (optional) - Maximum depth for crawling (default: 2)
- rate_limit: Integer (optional) - Requests per second limit (default: 1)
- selectors: Object (optional) - CSS selectors for content extraction
- exclude_patterns: Array<String> (optional) - URL patterns to exclude

**Validation**:
- Base URL must be a valid URL
- Max depth must be between 0 and 5
- Rate limit must be positive