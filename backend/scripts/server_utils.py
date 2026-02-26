"""
Server utilities for the RAG backend startup validation.
"""

import subprocess
import time
import signal
import os
import sys
from typing import Optional, Dict, Any

# Add backend directory to path to allow imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
from api.models.server_config import ServerConfig
from scripts.security_utils import secure_popen


class ServerManager:
    """
    Manages the backend server lifecycle (start, stop, status)
    """
    def __init__(self, config: ServerConfig):
        self.config = config
        self.process: Optional[subprocess.Popen] = None
        self.is_running = False

    def start_server(self) -> bool:
        """
        Start the backend server using the configured command.

        Returns:
            True if server started successfully, False otherwise
        """
        try:
            # Build the command to start the server
            command_parts = self.config.command.split()

            # Validate the command before execution for security
            # Only allow commands that start with 'uvicorn'
            if not command_parts[0].lower().endswith('uvicorn'):
                print(f"Invalid server command: {command_parts[0]}. Only uvicorn is allowed.")
                return False

            # Start the server process using secure subprocess
            self.process = secure_popen(
                command_parts,
                allowed_commands=['uvicorn', 'python', 'python3'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=os.getcwd()  # Run in current working directory
            )

            # Check immediately if the process is running
            initial_check = self.process.poll()
            if initial_check is not None:
                # Process has already terminated, get the error
                _, stderr = self.process.communicate()
                print(f"Server failed to start: {stderr}")
                return False

            # Brief initial wait to allow process to initialize
            time.sleep(0.5)

            # Check again if process is still running
            if self.process.poll() is None:
                self.is_running = True
                return True
            else:
                # Process has terminated after short wait
                _, stderr = self.process.communicate()
                print(f"Server failed to start: {stderr}")
                return False

        except ValueError as e:
            print(f"Security validation error: {str(e)}")
            return False
        except Exception as e:
            print(f"Error starting server: {str(e)}")
            return False

    def stop_server(self) -> bool:
        """
        Stop the running backend server.

        Returns:
            True if server stopped successfully, False otherwise
        """
        if self.process and self.is_running:
            try:
                # Try to terminate the process gracefully first
                self.process.terminate()

                try:
                    # Wait for the process to terminate with a timeout
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # Force kill if it doesn't terminate gracefully
                    self.process.kill()
                    self.process.wait()  # Wait for the kill to complete

                self.is_running = False
                return True

            except Exception as e:
                print(f"Error stopping server: {str(e)}")
                return False
        else:
            print("Server is not running")
            return True  # Already stopped

    def check_server_status(self) -> Dict[str, Any]:
        """
        Check the status of the server process.

        Returns:
            Dictionary with server status information
        """
        if self.process:
            is_alive = self.process.poll() is None
            return {
                "is_running": is_alive,
                "pid": self.process.pid if is_alive else None,
                "return_code": self.process.returncode if not is_alive else None
            }
        else:
            return {
                "is_running": False,
                "pid": None,
                "return_code": None
            }


def start_backend_server(config: ServerConfig) -> ServerManager:
    """
    Start the backend server using the provided configuration.

    Args:
        config: ServerConfig object containing server configuration

    Returns:
        ServerManager instance for managing the server process
    """
    server_manager = ServerManager(config)

    success = server_manager.start_server()

    if success:
        print(f"Server started successfully on {config.host}:{config.port}")
    else:
        print(f"Failed to start server on {config.host}:{config.port}")

    return server_manager


def stop_backend_server(server_manager: ServerManager) -> bool:
    """
    Stop the backend server managed by the provided ServerManager.

    Args:
        server_manager: ServerManager instance managing the server

    Returns:
        True if server stopped successfully, False otherwise
    """
    return server_manager.stop_server()


def create_default_server_config() -> ServerConfig:
    """
    Create a default server configuration.

    Returns:
        ServerConfig with default values
    """
    return ServerConfig(
        command="uvicorn main:app --reload --host 127.0.0.1 --port 8000",
        host="127.0.0.1",
        port=8000,
        reload=True,
        startup_timeout=300
    )