"""
Unit tests for the startup validator.
"""
import unittest
import sys
import os
from unittest.mock import patch, MagicMock, mock_open

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from scripts.startup_validator import validate_dependencies, validate_fastapi_config
from api.models.validation import DependencyList, FastAPIValidator
from api.models.validation_result import ValidationStepResult


class TestStartupValidator(unittest.TestCase):
    """Test cases for the startup validator."""

    @patch('scripts.startup_validator.check_installed_packages')
    @patch('scripts.startup_validator.get_package_version')
    @patch('scripts.startup_validator.validate_and_install_dependencies')
    def test_validate_dependencies_all_installed(self, mock_install_deps, mock_get_version, mock_check_packages):
        """Test dependency validation when all packages are installed."""
        # Mock the check to return all packages as installed
        mock_check_packages.return_value = {
            'fastapi': True,
            'uvicorn': True,
            'requests': True
        }

        # Mock version checking
        mock_get_version.return_value = '1.0.0'

        # Mock installation to return success
        mock_install_deps.return_value = {
            'fastapi': 'already_present',
            'uvicorn': 'already_present',
            'requests': 'already_present'
        }

        dependency_list = DependencyList(packages=['fastapi', 'uvicorn', 'requests'])
        result = validate_dependencies(dependency_list)

        self.assertIsInstance(result, ValidationStepResult)
        self.assertTrue(result.is_valid)

    @patch('scripts.startup_validator.check_installed_packages')
    @patch('scripts.startup_validator.get_package_version')
    @patch('scripts.startup_validator.validate_and_install_dependencies')
    def test_validate_dependencies_missing_packages(self, mock_install_deps, mock_get_version, mock_check_packages):
        """Test dependency validation when some packages are missing."""
        # Mock the check to return some packages as not installed
        mock_check_packages.return_value = {
            'fastapi': True,
            'uvicorn': False,  # Missing
            'requests': True
        }

        # Mock version checking
        mock_get_version.return_value = '1.0.0'

        # Mock installation to return success for missing package
        mock_install_deps.return_value = {
            'uvicorn': 'installed'
        }

        dependency_list = DependencyList(packages=['fastapi', 'uvicorn', 'requests'])
        result = validate_dependencies(dependency_list)

        self.assertIsInstance(result, ValidationStepResult)
        # The result might be valid if installation succeeds
        # If installation fails, it would be invalid

    @patch('scripts.startup_validator.validate_fastapi_instance')
    def test_validate_fastapi_config_success(self, mock_validate_instance):
        """Test FastAPI configuration validation success."""
        # Mock validation to return success
        mock_result = MagicMock()
        mock_result.is_valid = True
        mock_result.error_message = None
        mock_result.line_numbers = [4]
        mock_validate_instance.return_value = mock_result

        result = validate_fastapi_config(file_path='test_main.py', expected_instance_name='app')

        self.assertIsInstance(result, ValidationStepResult)
        self.assertTrue(result.is_valid)

    @patch('scripts.startup_validator.validate_fastapi_instance')
    def test_validate_fastapi_config_failure(self, mock_validate_instance):
        """Test FastAPI configuration validation failure."""
        # Mock validation to return failure
        mock_result = MagicMock()
        mock_result.is_valid = False
        mock_result.error_message = "No FastAPI instance found"
        mock_result.line_numbers = []
        mock_validate_instance.return_value = mock_result

        result = validate_fastapi_config(file_path='test_main.py', expected_instance_name='app')

        self.assertIsInstance(result, ValidationStepResult)
        self.assertFalse(result.is_valid)
        self.assertIsNotNone(result.error)


if __name__ == '__main__':
    unittest.main()