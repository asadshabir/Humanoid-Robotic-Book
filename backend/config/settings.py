from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4"

    # Qdrant Configuration
    qdrant_api_key: str
    qdrant_url: str
    qdrant_collection_name: str = "book_content"

    # Application Configuration
    log_level: str = "INFO"
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


# Create a single instance of settings
settings = Settings()