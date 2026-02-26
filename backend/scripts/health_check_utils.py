"""
Health check utilities for the RAG backend startup validation.
"""

import requests
import time
import sys
import os
from typing import Optional, Union
from datetime import datetime

# Add backend directory to path to allow imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
from api.models.validation_result import HealthCheckResult


def perform_health_check(
    host: str = "127.0.0.1",
    port: int = 8000,
    timeout: int = 10
) -> HealthCheckResult:
    """
    Perform a health check on the backend server.

    Args:
        host: Host address of the server (default: "127.0.0.1")
        port: Port number of the server (default: 8000)
        timeout: Request timeout in seconds (default: 10)

    Returns:
        HealthCheckResult containing the result of the health check
    """
    start_time = time.time()
    url = f"http://{host}:{port}/health"

    try:
        response = requests.get(url, timeout=timeout)
        response_time = (time.time() - start_time) * 1000  # Convert to milliseconds

        health_result = HealthCheckResult(
            is_healthy=response.status_code == 200,
            status_code=response.status_code,
            response_body=response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
            response_time=response_time,
            error_message=None
        )

        return health_result

    except requests.exceptions.ConnectionError:
        response_time = (time.time() - start_time) * 1000
        return HealthCheckResult(
            is_healthy=False,
            status_code=None,
            response_body=None,
            response_time=response_time,
            error_message=f"Could not connect to server at {url}. Server may not be running."
        )

    except requests.exceptions.Timeout:
        response_time = (time.time() - start_time) * 1000
        return HealthCheckResult(
            is_healthy=False,
            status_code=None,
            response_body=None,
            response_time=response_time,
            error_message=f"Health check request timed out after {timeout} seconds"
        )

    except Exception as e:
        response_time = (time.time() - start_time) * 1000
        return HealthCheckResult(
            is_healthy=False,
            status_code=None,
            response_body=None,
            response_time=response_time,
            error_message=f"Health check failed with error: {str(e)}"
        )


def wait_for_server_health(
    host: str = "127.0.0.1",
    port: int = 8000,
    max_wait_time: int = 60,
    check_interval: int = 2,
    initial_delay: float = 1.0
) -> HealthCheckResult:
    """
    Wait for the server to become healthy by repeatedly checking the health endpoint.

    Args:
        host: Host address of the server (default: "127.0.0.1")
        port: Port number of the server (default: 8000)
        max_wait_time: Maximum time to wait in seconds (default: 60)
        check_interval: Interval between health checks in seconds (default: 2)
        initial_delay: Initial delay before first health check (default: 1.0)

    Returns:
        HealthCheckResult containing the result of the final health check
    """
    # Initial delay to allow server to start before first check
    time.sleep(initial_delay)

    start_time = time.time()
    elapsed_time = 0

    # Start with a shorter check interval for faster initial response
    short_interval = min(check_interval, 1.0)  # Check more frequently initially
    short_check_duration = min(max_wait_time * 0.2, 10)  # Do short interval checks for first 20% or 10s

    # Short interval checks for faster initial response
    while elapsed_time < short_check_duration and elapsed_time < max_wait_time:
        result = perform_health_check(host, port, timeout=min(5, max_wait_time - elapsed_time))

        if result.is_healthy:
            return result

        time.sleep(short_interval)
        elapsed_time = time.time() - start_time

    # Longer interval checks for remainder of time
    while elapsed_time < max_wait_time:
        result = perform_health_check(host, port, timeout=min(10, max_wait_time - elapsed_time))

        if result.is_healthy:
            return result

        time.sleep(check_interval)
        elapsed_time = time.time() - start_time

    # Final check after timeout
    return perform_health_check(host, port, timeout=3)


def validate_health_response(response_body: Union[str, dict]) -> bool:
    """
    Validate that the health response has the expected format.

    Args:
        response_body: Response body from the health endpoint

    Returns:
        True if the response has the expected format, False otherwise
    """
    if isinstance(response_body, dict):
        # Check if it contains the expected 'status' field with value 'ok'
        return response_body.get('status') == 'ok'

    return False