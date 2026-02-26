"""
FastAPI validation utilities for the RAG backend startup validation.
"""

import ast
import os
import sys
from typing import List, Optional

# Add backend directory to path to allow imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
from api.models.validation import FastAPIValidator, ValidationResult


def validate_fastapi_instance(fastapi_validator: FastAPIValidator) -> ValidationResult:
    """
    Validate that the specified file contains a FastAPI instance with the expected name.

    Args:
        fastapi_validator: FastAPIValidator object containing validation parameters

    Returns:
        ValidationResult indicating whether the validation passed
    """
    file_path = fastapi_validator.file_path
    expected_name = fastapi_validator.expected_instance_name

    if not os.path.exists(file_path):
        return ValidationResult(
            is_valid=False,
            error_message=f"File {file_path} does not exist",
            line_numbers=[]
        )

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            tree = ast.parse(content)

        fastapi_instances = find_fastapi_instances(tree, expected_name)

        if fastapi_instances:
            return ValidationResult(
                is_valid=True,
                error_message=None,
                line_numbers=fastapi_instances
            )
        else:
            return ValidationResult(
                is_valid=False,
                error_message=f"No FastAPI instance named '{expected_name}' found in {file_path}",
                line_numbers=[]
            )

    except SyntaxError as e:
        return ValidationResult(
            is_valid=False,
            error_message=f"Syntax error in {file_path}: {str(e)}",
            line_numbers=[e.lineno] if e.lineno else []
        )
    except Exception as e:
        return ValidationResult(
            is_valid=False,
            error_message=f"Error reading or parsing {file_path}: {str(e)}",
            line_numbers=[]
        )


def find_fastapi_instances(tree: ast.AST, expected_name: str) -> List[int]:
    """
    Find all FastAPI instance assignments in the AST with the expected name.

    Args:
        tree: Parsed AST of the Python file
        expected_name: Expected name of the FastAPI instance

    Returns:
        List of line numbers where FastAPI instances with the expected name were found
    """
    fastapi_lines = []

    for node in ast.walk(tree):
        # Look for assignments like 'app = FastAPI(...)'
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if (isinstance(target, ast.Name) and
                    target.id == expected_name and
                    isinstance(node.value, ast.Call) and
                    isinstance(node.value.func, ast.Name) and
                    node.value.func.id == 'FastAPI'):
                    fastapi_lines.append(node.lineno)

        # Also look for annotated assignments like 'app: FastAPI = FastAPI()'
        elif isinstance(node, ast.AnnAssign):
            if (isinstance(node.target, ast.Name) and
                node.target.id == expected_name and
                isinstance(node.value, ast.Call) and
                isinstance(node.value.func, ast.Name) and
                node.value.func.id == 'FastAPI'):
                fastapi_lines.append(node.lineno)

        # Look for imports of FastAPI to make sure it's available
        elif (isinstance(node, ast.Assign) and
              isinstance(node.value, ast.Call) and
              isinstance(node.value.func, ast.Attribute) and
              isinstance(node.value.func.value, ast.Name) and
              node.value.func.value.id in ['fastapi', 'FastAPI'] and
              node.value.func.attr == 'FastAPI'):
            # This handles cases like 'app = fastapi.FastAPI()'
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == expected_name:
                    fastapi_lines.append(node.lineno)

    return fastapi_lines


def validate_fastapi_file(file_path: str, expected_instance_name: str = "app") -> ValidationResult:
    """
    Convenience function to validate a FastAPI instance in a file.

    Args:
        file_path: Path to the file to validate
        expected_instance_name: Expected name of the FastAPI instance (default: "app")

    Returns:
        ValidationResult indicating whether the validation passed
    """
    validator = FastAPIValidator(
        file_path=file_path,
        expected_instance_name=expected_instance_name
    )

    return validate_fastapi_instance(validator)