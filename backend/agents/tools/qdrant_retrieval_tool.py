from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any, Optional
from backend.config.settings import settings
from backend.utils.logging import get_logger
import logging
import json


class QdrantRetrievalTool:
    """
    A retrieval tool that connects to Qdrant for semantic search of book content.
    Designed to be used with OpenAI's function calling.
    """

    def __init__(self):
        self.logger = get_logger(__name__)

        try:
            self.client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
                timeout=30
            )
            self.collection_name = settings.qdrant_collection_name
            self.logger.info(f"Qdrant client initialized for collection: {self.collection_name}")

            # Import OpenAI client for embedding
            from backend.agents.rag_agent import OpenAIClientWrapper
            self.openai_client = OpenAIClientWrapper()
        except Exception as e:
            self.logger.error(f"Failed to initialize Qdrant client: {str(e)}")
            raise

    def retrieve_content(self, query: str, max_results: int = 5, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Retrieve relevant content from Qdrant based on the query.

        Args:
            query: The search query text
            max_results: Maximum number of results to return
            confidence_threshold: Minimum confidence score for results

        Returns:
            List of retrieved content chunks with metadata
        """
        try:
            # Create embedding for the query
            query_vector = self.openai_client.create_embedding(query)

            # Perform semantic search in Qdrant using the embedding
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=max_results,
                score_threshold=confidence_threshold
            )

            # Convert results to the required format
            formatted_results = []
            for result in results:
                if result.score >= confidence_threshold:
                    formatted_result = {
                        "id": result.id,
                        "url": result.payload.get("url", ""),
                        "content": result.payload.get("text", ""),
                        "score": result.score,
                        "chunk_id": result.payload.get("chunk_id", "")
                    }
                    formatted_results.append(formatted_result)

            # Log if no results found
            if not formatted_results:
                self.logger.info(f"No relevant content found for query: {query} with threshold {confidence_threshold}")
            else:
                self.logger.info(f"Qdrant retrieval completed with {len(formatted_results)} results for query: {query}")

            return formatted_results

        except Exception as e:
            self.logger.error(f"Qdrant retrieval failed: {str(e)}")
            # Check if it's a connection error that suggests service unavailability
            error_msg = str(e).lower()
            if any(keyword in error_msg for keyword in ["connection", "timeout", "refused", "unavailable", "network"]):
                self.logger.error("Qdrant service appears to be unavailable")
                # Return empty results rather than raising the exception to allow graceful degradation
                return []
            else:
                # For other errors, still raise the exception
                raise

    def retrieve_content_with_fallback(self, query: str, max_results: int = 5, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Retrieve relevant content from Qdrant with fallback logic for low-confidence results.

        Args:
            query: The search query text
            max_results: Maximum number of results to return
            confidence_threshold: Minimum confidence score for results

        Returns:
            List of retrieved content chunks with metadata, potentially with relaxed threshold
        """
        try:
            # First, try with the specified confidence threshold
            results = self.retrieve_content(query, max_results, confidence_threshold)

            # If no results found and threshold is above 0.1, try with a lower threshold
            if not results and confidence_threshold > 0.1:
                fallback_threshold = max(0.1, confidence_threshold * 0.5)  # Reduce threshold by half
                self.logger.info(f"No results with threshold {confidence_threshold}, trying with {fallback_threshold}")

                results = self.retrieve_content(query, max_results, fallback_threshold)

                if results:
                    self.logger.info(f"Found {len(results)} results with fallback threshold {fallback_threshold}")

            return results

        except Exception as e:
            self.logger.error(f"Qdrant retrieval with fallback failed: {str(e)}")
            raise

    @staticmethod
    def get_tool_definition() -> Dict[str, Any]:
        """
        Get the tool definition for OpenAI function calling.

        Returns:
            Dictionary defining the tool for OpenAI
        """
        return {
            "type": "function",
            "function": {
                "name": "qdrant_retrieval",
                "description": "Retrieve relevant content from the book database using semantic search",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to find relevant content"
                        },
                        "max_results": {
                            "type": "integer",
                            "description": "Maximum number of results to return (default: 5)",
                            "default": 5,
                            "minimum": 1,
                            "maximum": 10
                        },
                        "confidence_threshold": {
                            "type": "number",
                            "description": "Minimum confidence score for results (default: 0.5)",
                            "default": 0.5,
                            "minimum": 0.0,
                            "maximum": 1.0
                        }
                    },
                    "required": ["query"]
                }
            }
        }

    def __call__(self, query: str, max_results: int = 5, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Make the tool callable directly.

        Args:
            query: The search query text
            max_results: Maximum number of results to return
            confidence_threshold: Minimum confidence score for results

        Returns:
            List of retrieved content chunks with metadata
        """
        return self.retrieve_content(query, max_results, confidence_threshold)


class QdrantClientWrapper:
    """
    Wrapper for Qdrant client with error handling and configuration for internal use.
    """

    def __init__(self):
        self.logger = get_logger(__name__)

        try:
            self.client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
                timeout=30
            )
            self.collection_name = settings.qdrant_collection_name
            self.logger.info(f"Qdrant client initialized for collection: {self.collection_name}")
        except Exception as e:
            self.logger.error(f"Failed to initialize Qdrant client: {str(e)}")
            raise

    def search(
        self,
        query_vector: List[float],
        limit: int = 5,
        query_filter: Optional[models.Filter] = None,
        with_payload: bool = True,
        with_vectors: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Perform a semantic search in Qdrant collection.

        Args:
            query_vector: The vector to search for
            limit: Maximum number of results to return
            query_filter: Optional filter to apply to the search
            with_payload: Whether to include payload in results
            with_vectors: Whether to include vectors in results

        Returns:
            List of search results with id, payload, and score
        """
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                query_filter=query_filter,
                with_payload=with_payload,
                with_vectors=with_vectors
            )

            # Convert results to a more convenient format
            formatted_results = []
            for result in results:
                formatted_result = {
                    "id": result.id,
                    "payload": result.payload,
                    "score": result.score
                }
                formatted_results.append(formatted_result)

            self.logger.info(f"Qdrant search completed with {len(formatted_results)} results")
            return formatted_results

        except Exception as e:
            self.logger.error(f"Qdrant search failed: {str(e)}")
            raise

    def retrieve_by_ids(
        self,
        ids: List[str],
        with_payload: bool = True,
        with_vectors: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Retrieve specific records by their IDs.

        Args:
            ids: List of IDs to retrieve
            with_payload: Whether to include payload in results
            with_vectors: Whether to include vectors in results

        Returns:
            List of retrieved records
        """
        try:
            records = self.client.retrieve(
                collection_name=self.collection_name,
                ids=ids,
                with_payload=with_payload,
                with_vectors=with_vectors
            )

            # Convert records to a more convenient format
            formatted_records = []
            for record in records:
                formatted_record = {
                    "id": record.id,
                    "payload": record.payload
                }
                formatted_records.append(formatted_record)

            self.logger.info(f"Qdrant retrieve_by_ids completed with {len(formatted_records)} records")
            return formatted_records

        except Exception as e:
            self.logger.error(f"Qdrant retrieve_by_ids failed: {str(e)}")
            raise

    def count(self, query_filter: Optional[models.Filter] = None) -> int:
        """
        Count the number of records in the collection.

        Args:
            query_filter: Optional filter to apply to the count

        Returns:
            Number of records matching the filter
        """
        try:
            count_result = self.client.count(
                collection_name=self.collection_name,
                count_filter=query_filter
            )
            return count_result.count
        except Exception as e:
            self.logger.error(f"Qdrant count failed: {str(e)}")
            raise