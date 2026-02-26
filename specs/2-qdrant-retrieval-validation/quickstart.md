# Quickstart: Qdrant Retrieval Validation

## Prerequisites
- Python 3.8+
- UV package manager
- Cohere API key
- Qdrant Cloud account and API key
- Access to existing Qdrant collection from Spec-1

## Setup

1. **Install dependencies:**
```bash
cd backend
uv sync
```

2. **Configure environment:**
Create a `.env` file in the backend directory:
```env
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

3. **Verify Qdrant connection:**
```bash
cd backend
uv run check_qdrant_data.py
```

## Running Validation Tests

### Single Query Validation
```bash
cd backend
uv run qdrant_retrieval_validation.py
```

### Custom Test Queries
To run with custom queries, modify the test_queries list in the script or create a custom test script.

## Expected Output
The validation will generate a `qdrant_retrieval_validation_report.json` file with detailed results including:
- Test summary with success rates
- Individual query results
- Metadata validation details
- Text accuracy validation
- Semantic relevance scores

## Troubleshooting

### Cohere API Rate Limits
If you encounter rate limit errors:
- The system will use mock embeddings as fallback
- Validation will continue but semantic relevance may be affected
- Consider using a production Cohere API key for full validation

### Qdrant Connection Issues
- Verify QDRANT_URL and QDRANT_API_KEY are correct
- Check that the collection "humanoid_ai_book" exists
- Ensure network connectivity to Qdrant Cloud

## Validation Results
- **Metadata integrity**: Should show 100% pass rate
- **Text accuracy**: Should show 100% pass rate
- **Semantic relevance**: May vary based on Cohere API availability
- **Overall success**: Depends on semantic relevance when using mock embeddings