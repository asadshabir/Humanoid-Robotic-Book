"""
Server configuration model for the RAG backend startup validation.
"""

from typing import Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ServerConfig:
    """
    Represents the configuration for starting the backend server
    """
    command: str  # The command to start the server (e.g., "uvicorn main:app --reload")
    host: str = "127.0.0.1"  # Host address for the server (default: "127.0.0.1")
    port: int = 8000  # Port number for the server (default: 8000)
    reload: bool = True  # Whether to enable auto-reload (default: true)
    startup_timeout: int = 300  # Timeout in seconds for server startup (default: 300 for 5 minutes)

    def __post_init__(self):
        """Validate port and timeout values"""
        if not 1 <= self.port <= 65535:
            raise ValueError(f"port must be between 1 and 65535, got {self.port}")

        if self.startup_timeout <= 0:
            raise ValueError(f"startup_timeout must be a positive number, got {self.startup_timeout}")