from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name="agent-rag-backend",
    version="0.1.0",
    description="Agent-based RAG backend using OpenAI Agents SDK and FastAPI",
    packages=find_packages(),
    install_requires=requirements,
    python_requires=">=3.11",
    author="Humanoid Robotic Book Team",
    author_email="team@example.com",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.11",
    ],
)