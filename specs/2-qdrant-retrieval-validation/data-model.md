# Data Model: Qdrant Retrieval Validation

## Entities

### Query Request
Represents the input query for retrieval testing, including the search text and desired result count

**Fields:**
- query_text (string, required): The search query text
- top_k (integer, required, default: 5): Number of results to retrieve
- query_embedding (array<float>, optional): Vector representation of the query

**Validation:**
- query_text must be non-empty
- top_k must be between 1 and 100

### Retrieval Result
Represents a single retrieved chunk with its metadata and relevance score

**Fields:**
- id (integer, required): Unique identifier of the stored chunk
- score (float, required): Similarity score between query and result
- payload (object, required): Original stored data
  - url (string, required): Source URL of the content
  - text (string, required): Original text content
- retrieved_at (timestamp, required): Time of retrieval

**Validation:**
- id must be positive integer
- score must be between 0 and 1
- url must be valid URL format
- text must be non-empty

### Validation Report
Represents the structured output of the validation process with test results

**Fields:**
- test_summary (object, required): Overview of test execution
  - total_queries (integer, required): Total number of queries tested
  - successful_queries (integer, required): Number of successful queries
  - failed_queries (integer, required): Number of failed queries
  - success_rate (float, required): Success rate as decimal (0-1)
- test_results (array<ValidationResult>, required): Individual test results
- overall_validation (object, required): Aggregate validation status
  - all_tests_passed (boolean, required): Whether all tests passed
  - metadata_integrity_ok (boolean, required): Metadata validation status
  - text_accuracy_ok (boolean, required): Text content validation status
  - semantic_relevance_ok (boolean, required): Semantic relevance status
- generated_at (timestamp, required): Time report was generated

### ValidationResult
Represents validation results for a single query

**Fields:**
- query (string, required): Original query text
- top_k (integer, required): Number of results requested
- results_found (boolean, required): Whether results were returned
- num_results (integer, optional): Number of results returned
- results (array<RetrievalResult>, optional): Retrieved results
- metadata_validation (object, optional): Metadata validation details
- text_validation (object, optional): Text content validation details
- success (boolean, required): Whether this test was successful

## Relationships
- A Validation Report contains multiple Validation Results
- A Validation Result contains multiple Retrieval Results
- A Query Request generates a Validation Result