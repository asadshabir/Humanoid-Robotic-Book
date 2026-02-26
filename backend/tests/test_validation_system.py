"""
Unit tests for the RAG backend validation system.
"""
import unittest
import sys
import os
from unittest.mock import patch, MagicMock

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from scripts.dependency_utils import check_installed_packages, install_package, install_packages
from scripts.fastapi_utils import find_fastapi_instances
from api.models.validation import DependencyList, FastAPIValidator
from api.models.validation_result import ValidationError, ValidationStepResult, HealthCheckResult


class TestDependencyUtils(unittest.TestCase):
    """Test cases for dependency utilities."""

    def test_check_installed_packages(self):
        """Test checking if packages are installed."""
        # Test with a known installed package (like sys)
        result = check_installed_packages(['sys'])  # Using 'sys' as a built-in module
        # Since sys is a built-in module name, let's test with a different approach
        result = check_installed_packages(['os'])
        self.assertIsInstance(result, dict)
        self.assertIn('os', result)

    @patch('subprocess.run')
    def test_install_package_success(self, mock_subprocess):
        """Test successful package installation."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_subprocess.return_value = mock_result

        result = install_package('test-package')
        self.assertTrue(result)

    @patch('subprocess.run')
    def test_install_package_failure(self, mock_subprocess):
        """Test package installation failure."""
        mock_result = MagicMock()
        mock_result.returncode = 1
        mock_result.stderr = "Installation failed"
        mock_subprocess.return_value = mock_result

        result = install_package('test-package')
        self.assertFalse(result)


class TestFastAPIUtils(unittest.TestCase):
    """Test cases for FastAPI utilities."""

    def test_find_fastapi_instances_simple_assignment(self):
        """Test finding FastAPI instances with simple assignment."""
        import ast
        code = """
app = FastAPI()
"""
        tree = ast.parse(code)
        instances = find_fastapi_instances(tree, 'app')
        self.assertEqual(len(instances), 1)
        self.assertEqual(instances[0], 1)

    def test_find_fastapi_instances_with_import(self):
        """Test finding FastAPI instances with import."""
        import ast
        code = """
from fastapi import FastAPI

app = FastAPI()
"""
        tree = ast.parse(code)
        instances = find_fastapi_instances(tree, 'app')
        self.assertEqual(len(instances), 1)
        self.assertEqual(instances[0], 3)


class TestModels(unittest.TestCase):
    """Test cases for data models."""

    def test_dependency_list_creation(self):
        """Test creating a DependencyList."""
        dep_list = DependencyList(packages=['fastapi', 'uvicorn'])
        self.assertEqual(dep_list.packages, ['fastapi', 'uvicorn'])
        self.assertIsNone(dep_list.required_versions)
        self.assertIsNone(dep_list.installation_status)

    def test_dependency_list_validation(self):
        """Test DependencyList validation."""
        with self.assertRaises(ValueError):
            DependencyList(packages=[])

    def test_validation_error_creation(self):
        """Test creating a ValidationError."""
        from datetime import datetime
        error = ValidationError(
            error_type="dependency_missing",
            message="Test error message",
            timestamp=datetime.now(),
            step="test_step",
            suggested_fix="Test fix"
        )
        self.assertEqual(error.error_type, "dependency_missing")
        self.assertEqual(error.message, "Test error message")

    def test_validation_error_validation(self):
        """Test ValidationError validation."""
        from datetime import datetime
        with self.assertRaises(ValueError):
            ValidationError(
                error_type="invalid_type",
                message="Test error message",
                timestamp=datetime.now(),
                step="test_step"
            )

    def test_health_check_result_creation(self):
        """Test creating a HealthCheckResult."""
        from datetime import datetime
        result = HealthCheckResult(
            is_healthy=True,
            status_code=200,
            response_body={"status": "ok"},
            response_time=100.0,
            timestamp=datetime.now()
        )
        self.assertTrue(result.is_healthy)
        self.assertEqual(result.status_code, 200)


if __name__ == '__main__':
    unittest.main()