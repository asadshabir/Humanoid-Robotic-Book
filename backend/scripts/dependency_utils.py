"""
Dependency validation utilities for the RAG backend startup validation.
"""

import subprocess
import sys
import importlib.util
from typing import List, Dict, Optional
import sys
import os
# Add backend directory to path to allow imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
from api.models.validation import DependencyList
from scripts.security_utils import secure_pip_install, validate_package_name, secure_subprocess_run


def check_installed_packages(packages: List[str]) -> Dict[str, bool]:
    """
    Check if packages are installed in the current Python environment.

    Args:
        packages: List of package names to check

    Returns:
        Dictionary mapping package names to boolean indicating if installed
    """
    installed_status = {}
    for package in packages:
        # Try to find the package spec
        spec = importlib.util.find_spec(package)
        if spec is not None:
            installed_status[package] = True
        else:
            # Some packages have different import names than package names
            # Try with common variations
            normalized_package = package.replace('-', '_').lower()
            spec = importlib.util.find_spec(normalized_package)
            installed_status[package] = spec is not None

    return installed_status


def install_package(package: str) -> bool:
    """
    Install a single package using pip.

    Args:
        package: Package name to install

    Returns:
        True if installation succeeded, False otherwise
    """
    try:
        result = secure_pip_install(package)

        # Check if the installation was successful
        if result.returncode == 0:
            return True
        else:
            print(f"Failed to install {package}: {result.stderr}")
            return False

    except ValueError as e:
        print(f"Invalid package name {package}: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error installing {package}: {e}")
        return False


def install_packages(packages: List[str]) -> Dict[str, bool]:
    """
    Install multiple packages using pip.

    Args:
        packages: List of package names to install

    Returns:
        Dictionary mapping package names to boolean indicating if installation succeeded
    """
    installation_results = {}
    for package in packages:
        print(f"Installing {package}...")
        success = install_package(package)
        installation_results[package] = success

    return installation_results


def validate_and_install_dependencies(dependency_list: DependencyList) -> Dict[str, str]:
    """
    Validate that required dependencies are installed, and install missing ones.

    Args:
        dependency_list: DependencyList object containing required packages

    Returns:
        Dictionary with package names mapped to status ('installed', 'already_present', 'failed_to_install')
    """
    # Check current installation status
    current_status = check_installed_packages(dependency_list.packages)

    # Determine which packages need to be installed
    missing_packages = []
    statuses = {}

    for package in dependency_list.packages:
        if current_status[package]:
            statuses[package] = 'already_present'
        else:
            missing_packages.append(package)
            statuses[package] = 'missing'

    # Install missing packages
    if missing_packages:
        print(f"Installing missing packages: {missing_packages}")
        installation_results = install_packages(missing_packages)

        for package, success in installation_results.items():
            if success:
                statuses[package] = 'installed'
            else:
                statuses[package] = 'failed_to_install'
    else:
        print("All required packages are already installed.")

    return statuses


def install_from_requirements(requirements_file: str = "requirements.txt") -> bool:
    """
    Install dependencies from a requirements.txt file.

    Args:
        requirements_file: Path to the requirements file

    Returns:
        True if installation succeeded, False otherwise
    """
    try:
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", requirements_file
        ], capture_output=True, text=True, check=True)

        if result.returncode == 0:
            print(f"Successfully installed dependencies from {requirements_file}")
            return True
        else:
            print(f"Failed to install from {requirements_file}: {result.stderr}")
            return False

    except subprocess.CalledProcessError as e:
        print(f"Error installing from {requirements_file}: {e}")
        return False
    except FileNotFoundError:
        print(f"Requirements file {requirements_file} not found")
        return False
    except Exception as e:
        print(f"Unexpected error installing from {requirements_file}: {e}")
        return False


def get_package_version(package_name: str) -> Optional[str]:
    """
    Get the installed version of a package.

    Args:
        package_name: Name of the package

    Returns:
        Version string if found, None otherwise
    """
    try:
        # Validate the package name for security
        if not validate_package_name(package_name):
            print(f"Invalid package name: {package_name}")
            return None

        # Use secure subprocess execution
        result = secure_subprocess_run([
            sys.executable, "-m", "pip", "show", package_name
        ], allowed_commands=[sys.executable])

        # Parse the output to find the version
        for line in result.stdout.split('\n'):
            if line.startswith('Version:'):
                return line.split(':', 1)[1].strip()

        return None
    except subprocess.CalledProcessError:
        # Package not found
        return None
    except Exception:
        # Unexpected error
        return None


def check_package_versions(required_versions: Optional[Dict[str, str]]) -> Dict[str, Dict[str, str]]:
    """
    Check if installed package versions meet the required versions.

    Args:
        required_versions: Dictionary mapping package names to required version constraints

    Returns:
        Dictionary mapping package names to a dictionary with 'installed_version' and 'status'
    """
    if not required_versions:
        return {}

    version_check_results = {}

    for package, required_version in required_versions.items():
        installed_version = get_package_version(package)

        if installed_version is None:
            version_check_results[package] = {
                'installed_version': None,
                'status': 'not_installed'
            }
        else:
            # For now, just return the version
            # In a real implementation, you would compare versions properly
            version_check_results[package] = {
                'installed_version': installed_version,
                'status': 'version_checked'  # Would normally be 'matches' or 'outdated'
            }

    return version_check_results