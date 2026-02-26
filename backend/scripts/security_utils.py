"""
Security utilities for subprocess execution in the RAG backend validation system.
"""

import subprocess
import sys
import re
from typing import List, Optional, Union
from pathlib import Path


def validate_package_name(package_name: str) -> bool:
    """
    Validate that a package name is safe to use in subprocess commands.

    Args:
        package_name: Name of the package to validate

    Returns:
        True if the package name is valid, False otherwise
    """
    # Package names should only contain alphanumeric characters, hyphens, and underscores
    # They should be 1-50 characters long
    pattern = r'^[a-zA-Z0-9][a-zA-Z0-9_-]{0,49}$'
    return bool(re.match(pattern, package_name))


def validate_command_parts(command_parts: List[str]) -> bool:
    """
    Validate that command parts are safe to execute.

    Args:
        command_parts: List of command parts to validate

    Returns:
        True if all command parts are valid, False otherwise
    """
    if not command_parts:
        return False

    # Check that no command part contains dangerous characters
    dangerous_patterns = [
        r'[;&|]',  # Shell operators
        r'\$\(',    # Command substitution
        r'`.*`',    # Backtick command substitution
        r'>&',      # Output redirection to file descriptor
        r'<&',      # Input redirection from file descriptor
    ]

    for part in command_parts:
        if not isinstance(part, str):
            return False
        # Check for dangerous patterns
        for pattern in dangerous_patterns:
            if re.search(pattern, part):
                return False
        # Check for path traversal attempts
        if '../' in part or '..\\' in part:
            return False

    return True


def secure_pip_install(package_name: str) -> subprocess.CompletedProcess:
    """
    Securely install a package using pip with input validation.

    Args:
        package_name: Name of the package to install

    Returns:
        CompletedProcess result from subprocess.run

    Raises:
        ValueError: If the package name is invalid
    """
    if not validate_package_name(package_name):
        raise ValueError(f"Invalid package name: {package_name}")

    # Use a safe command construction
    cmd = [sys.executable, "-m", "pip", "install", package_name]

    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=False
    )


def secure_subprocess_run(
    cmd: List[str],
    timeout: int = 300,
    allowed_commands: Optional[List[str]] = None
) -> subprocess.CompletedProcess:
    """
    Securely run a subprocess command with validation.

    Args:
        cmd: Command to run as a list of strings
        timeout: Timeout in seconds (default 300)
        allowed_commands: List of allowed base commands (optional)

    Returns:
        CompletedProcess result from subprocess.run

    Raises:
        ValueError: If the command is invalid or not allowed
    """
    if not validate_command_parts(cmd):
        raise ValueError(f"Invalid command parts: {cmd}")

    if allowed_commands:
        if cmd[0] not in allowed_commands:
            raise ValueError(f"Command not allowed: {cmd[0]}, allowed: {allowed_commands}")

    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=False,
        timeout=timeout
    )


def secure_popen(
    cmd: List[str],
    allowed_commands: Optional[List[str]] = None,
    **kwargs
) -> subprocess.Popen:
    """
    Securely create a subprocess.Popen with validation.

    Args:
        cmd: Command to run as a list of strings
        allowed_commands: List of allowed base commands (optional)
        **kwargs: Additional arguments to pass to Popen

    Returns:
        Popen process object

    Raises:
        ValueError: If the command is invalid or not allowed
    """
    if not validate_command_parts(cmd):
        raise ValueError(f"Invalid command parts: {cmd}")

    if allowed_commands:
        if cmd[0] not in allowed_commands:
            raise ValueError(f"Command not allowed: {cmd[0]}, allowed: {allowed_commands}")

    # Remove any shell=True or stdin that might be in kwargs for security
    kwargs.pop('shell', None)

    return subprocess.Popen(
        cmd,
        **kwargs
    )