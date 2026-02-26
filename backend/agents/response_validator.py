from typing import List, Dict, Any, Optional
from backend.utils.logging import get_logger
import re


class ResponseValidator:
    """
    Validates that agent responses are grounded in retrieved content.
    """

    def __init__(self):
        self.logger = get_logger(__name__)

    def validate_response(
        self,
        response: str,
        retrieved_content: List[Dict[str, Any]],
        threshold: float = 0.3
    ) -> Dict[str, Any]:
        """
        Validate that the response is grounded in the retrieved content.

        Args:
            response: The agent's response to validate
            retrieved_content: List of content chunks retrieved from Qdrant
            threshold: Minimum similarity threshold (0.0 to 1.0)

        Returns:
            Dictionary with validation results
        """
        validation_result = {
            "is_valid": True,
            "confidence": 1.0,
            "message": "Response is properly grounded in retrieved content",
            "issues": []
        }

        if not retrieved_content:
            validation_result["is_valid"] = False
            validation_result["confidence"] = 0.0
            validation_result["message"] = "No content was retrieved to ground the response"
            validation_result["issues"].append("No retrieved content to validate against")
            return validation_result

        # Check if the response contains information from the retrieved content
        response_lower = response.lower()
        content_text = " ".join([item.get("content", "") for item in retrieved_content]).lower()

        # Simple keyword overlap check
        response_words = set(re.findall(r'\b\w+\b', response_lower))
        content_words = set(re.findall(r'\b\w+\b', content_text))

        if not content_words:
            validation_result["is_valid"] = False
            validation_result["confidence"] = 0.0
            validation_result["message"] = "Retrieved content is empty"
            validation_result["issues"].append("Retrieved content is empty")
            return validation_result

        # Calculate overlap
        common_words = response_words.intersection(content_words)
        if content_words:
            overlap_ratio = len(common_words) / len(content_words)
        else:
            overlap_ratio = 0.0

        if overlap_ratio < threshold:
            validation_result["is_valid"] = False
            validation_result["confidence"] = overlap_ratio
            validation_result["message"] = f"Response may not be sufficiently grounded in retrieved content (overlap: {overlap_ratio:.2f})"
            validation_result["issues"].append(f"Low content overlap: {overlap_ratio:.2f} (threshold: {threshold})")

        # Check for citation patterns in the response
        has_citations = self._check_citations(response, retrieved_content)
        if not has_citations and validation_result["is_valid"]:
            validation_result["message"] += " (Note: No citations found in response)"
            validation_result["issues"].append("No citations found in response")

        self.logger.info(f"Response validation completed: {validation_result['message']}")
        return validation_result

    def _check_citations(self, response: str, retrieved_content: List[Dict[str, Any]]) -> bool:
        """
        Check if the response contains citations to the retrieved content.

        Args:
            response: The agent's response
            retrieved_content: List of content chunks retrieved from Qdrant

        Returns:
            True if citations are found, False otherwise
        """
        # Look for URL citations
        for item in retrieved_content:
            url = item.get("url", "")
            if url and url in response:
                return True

        # Look for content snippets or references
        for item in retrieved_content:
            content = item.get("content", "")
            if len(content) > 50:  # Only check substantial content
                # Check for partial matches of content snippets
                snippet = content[:100].strip()  # First 100 chars as a snippet
                if len(snippet) > 20 and snippet.lower() in response.lower():
                    return True

        # Check for general citation patterns
        citation_patterns = [
            r'\[source\]', r'\(source:', r'\[citation\]', r'according to',
            r'source:', r'as mentioned in', r'cited from'
        ]

        response_lower = response.lower()
        for pattern in citation_patterns:
            if re.search(pattern, response_lower):
                return True

        return False

    def validate_sources_mentioned(
        self,
        response: str,
        retrieved_content: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Validate that sources from retrieved content are mentioned in the response.

        Args:
            response: The agent's response
            retrieved_content: List of content chunks retrieved from Qdrant

        Returns:
            Dictionary with source validation results
        """
        result = {
            "sources_mentioned": [],
            "sources_not_mentioned": [],
            "total_sources": len(retrieved_content)
        }

        for item in retrieved_content:
            url = item.get("url", "")
            content_snippet = item.get("content", "")[:50]  # First 50 chars as identifier

            # Check if URL is mentioned in response
            if url and url in response:
                result["sources_mentioned"].append(item)
            # Check if content snippet appears in response
            elif content_snippet and len(content_snippet) > 10 and content_snippet.lower() in response.lower():
                result["sources_mentioned"].append(item)
            else:
                result["sources_not_mentioned"].append(item)

        return result