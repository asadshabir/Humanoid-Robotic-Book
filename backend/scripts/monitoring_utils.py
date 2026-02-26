"""
Monitoring utilities for the RAG backend validation system.
"""

import time
import logging
from typing import Callable, Any, Dict
from datetime import datetime
from functools import wraps


class ValidationMonitor:
    """
    Provides monitoring and metrics collection for the validation system.
    """
    def __init__(self, logger: logging.Logger):
        self.logger = logger
        self.metrics = {
            'start_time': None,
            'end_time': None,
            'validation_times': {},
            'error_count': 0,
            'success_count': 0
        }

    def start_monitoring(self):
        """Start the monitoring process."""
        self.metrics['start_time'] = datetime.now()
        self.logger.info("Validation monitoring started")

    def stop_monitoring(self):
        """Stop the monitoring process and log summary."""
        self.metrics['end_time'] = datetime.now()
        duration = (self.metrics['end_time'] - self.metrics['start_time']).total_seconds()

        summary = {
            'total_duration_seconds': duration,
            'validation_times': self.metrics['validation_times'],
            'error_count': self.metrics['error_count'],
            'success_count': self.metrics['success_count']
        }

        self.logger.info(f"Validation monitoring stopped. Summary: {summary}")
        return summary

    def log_validation_step_time(self, step_name: str, duration: float):
        """Log the time taken for a validation step."""
        self.metrics['validation_times'][step_name] = duration
        self.logger.info(f"Validation step '{step_name}' took {duration:.2f} seconds")

    def increment_error_count(self):
        """Increment the error counter."""
        self.metrics['error_count'] += 1

    def increment_success_count(self):
        """Increment the success counter."""
        self.metrics['success_count'] += 1


def time_it(monitor: ValidationMonitor, step_name: str):
    """
    Decorator to time a function and log the duration.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                monitor.log_validation_step_time(step_name, duration)
                monitor.increment_success_count()
                return result
            except Exception as e:
                duration = time.time() - start_time
                monitor.log_validation_step_time(step_name, duration)
                monitor.increment_error_count()
                raise e
        return wrapper
    return decorator


def log_function_calls(logger: logging.Logger):
    """
    Decorator to log function calls with parameters and results.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            logger.debug(f"Calling function: {func.__name__}")
            if args:
                logger.debug(f"  Args: {args}")
            if kwargs:
                logger.debug(f"  Kwargs: {kwargs}")

            start_time = time.time()
            result = func(*args, **kwargs)
            duration = time.time() - start_time

            logger.debug(f"Function {func.__name__} completed in {duration:.2f}s")
            logger.debug(f"  Result: {result}")

            return result
        return wrapper
    return decorator


class ResourceMonitor:
    """
    Monitors system resources during validation.
    """
    def __init__(self):
        self.has_psutil = False
        try:
            import psutil
            self.psutil = psutil
            self.has_psutil = True
        except ImportError:
            pass

    def get_system_stats(self) -> Dict[str, Any]:
        """Get current system statistics."""
        stats = {
            'timestamp': datetime.now(),
            'cpu_percent': None,
            'memory_percent': None,
            'disk_usage': None
        }

        if self.has_psutil:
            try:
                stats['cpu_percent'] = self.psutil.cpu_percent(interval=1)
                stats['memory_percent'] = self.psutil.virtual_memory().percent
                stats['disk_usage'] = self.psutil.disk_usage('/').percent
            except Exception:
                # If we can't get system stats, return empty values
                pass

        return stats

    def log_system_stats(self, logger: logging.Logger):
        """Log current system statistics."""
        stats = self.get_system_stats()
        logger.info(f"System stats: CPU={stats['cpu_percent']}%, Memory={stats['memory_percent']}%, Disk={stats['disk_usage']}%")